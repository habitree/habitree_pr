# Task 2: 책 관리 API 개발 계획

**작업 번호**: Task 2  
**우선순위**: P0  
**예상 소요 시간**: 2일  
**담당 영역**: 책 검색, 등록, 수정, 삭제

---

## 1. 작업 개요

외부 책 정보 API를 연동하여 ISBN 또는 제목/저자로 책을 검색하고, 사용자의 독서 목록에 추가/관리하는 기능을 구현합니다.

### 1.1 목표

- ✅ 외부 책 정보 API 연동 (알라딘 또는 네이버)
- ✅ ISBN/제목/저자로 책 검색
- ✅ 책 등록/수정/삭제 CRUD
- ✅ 독서 상태 관리 (읽고 싶은, 읽는 중, 완료)
- ✅ Notion 스타일 테이블 뷰 데이터 제공

### 1.2 의존성

- **선행 작업**: Task 1 (인증 시스템)
- **후속 작업**: Task 3 (노트 관리), Task 5 (타임라인), Task 6 (독서모임)

---

## 2. 프론트엔드 연동 페이지

| 페이지 경로 | 파일 위치 | 주요 기능 |
|------------|----------|----------|
| 책 목록 | `/app/(main)/books/page.tsx` | Notion 스타일 테이블, 필터/정렬 |
| 책 추가 | `/app/(main)/books/new/page.tsx` | ISBN/제목 검색, 책 등록 |
| 책 상세 | `/app/(main)/books/[id]/page.tsx` | 책 정보, 노트 목록 |

---

## 3. 구현 상세

### 3.1 외부 책 정보 API 연동

#### 옵션 1: 알라딘 API (추천)

**장점**:
- 무료
- ISBN 검색 지원
- 한국 도서 데이터 풍부

**API 키 발급**:
1. http://www.aladin.co.kr/ttb/wblog_manage.aspx 접속
2. TTB Key 발급
3. 환경 변수에 저장

**환경 변수**:
```env
ALADIN_API_KEY=ttb키값
```

#### 옵션 2: 네이버 도서 API

**환경 변수**:
```env
NAVER_CLIENT_ID=클라이언트ID
NAVER_CLIENT_SECRET=클라이언트Secret
```

### 3.2 API Routes 구현

#### 3.2.1 책 검색

**파일**: `app/api/books/search/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'

const ALADIN_API_URL = 'http://www.aladin.co.kr/ttb/api/ItemSearch.aspx'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const type = searchParams.get('type') || 'title' // 'isbn' | 'title' | 'author'
  
  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 })
  }

  try {
    const queryType = type === 'isbn' ? 'ItemId' : 'Keyword'
    const url = new URL(ALADIN_API_URL)
    url.searchParams.set('ttbkey', process.env.ALADIN_API_KEY!)
    url.searchParams.set('Query', query)
    url.searchParams.set('QueryType', queryType)
    url.searchParams.set('MaxResults', '20')
    url.searchParams.set('start', '1')
    url.searchParams.set('SearchTarget', 'Book')
    url.searchParams.set('output', 'js')
    url.searchParams.set('Version', '20131101')

    const response = await fetch(url.toString())
    const data = await response.json()

    const books = data.item?.map((item: any) => ({
      isbn: item.isbn13 || item.isbn,
      title: item.title,
      author: item.author,
      publisher: item.publisher,
      cover_image_url: item.cover,
      description: item.description,
      published_date: item.pubDate,
      category: item.categoryName,
    })) || []

    return NextResponse.json({ success: true, data: books })
  } catch (error) {
    console.error('Book search error:', error)
    return NextResponse.json(
      { error: 'Failed to search books' },
      { status: 500 }
    )
  }
}
```

#### 3.2.2 책 등록

**파일**: `app/api/books/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  // 인증 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const {
    isbn,
    title,
    author,
    publisher,
    cover_image_url,
    description,
    published_date,
    category,
    status = 'want_to_read',
    started_at,
    completed_at,
  } = body

  try {
    // 1. books 테이블에 책 정보 저장 (중복 체크)  
    let book
    if (isbn) {
      const { data: existingBook } = await supabase
        .from('books')
        .select('*')
        .eq('isbn', isbn)
        .single()

      if (existingBook) {
        book = existingBook
      }
    }

    if (!book) {
      const { data, error } = await supabase
        .from('books')
        .insert({
          isbn,
          title,
          author,
          publisher,
          cover_image_url,
          description,
          published_date,
          category,
        })
        .select()
        .single()

      if (error) throw error
      book = data
    }

    // 2. user_books 테이블에 사용자-책 관계 저장
    const { data: userBook, error: userBookError } = await supabase
      .from('user_books')
      .insert({
        user_id: user.id,
        book_id: book.id,
        status,
        started_at,
        completed_at,
      })
      .select()
      .single()

    if (userBookError) {
      // 이미 등록된 책인 경우
      if (userBookError.code === '23505') {
        return NextResponse.json(
          { error: 'Book already added' },
          { status: 400 }
        )
      }
      throw userBookError
    }

    return NextResponse.json({
      success: true,
      data: {
        book_id: book.id,
        user_book_id: userBook.id,
      },
    })
  } catch (error) {
    console.error('Add book error:', error)
    return NextResponse.json(
      { error: 'Failed to add book' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const sort = searchParams.get('sort') || 'created_at'
  const order = searchParams.get('order') || 'desc'

  try {
    let query = supabase
      .from('user_books')
      .select(`
        *,
        book:books(*)
      `)
      .eq('user_id', user.id)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order(sort, { ascending: order === 'asc' })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Get books error:', error)
    return NextResponse.json(
      { error: 'Failed to get books' },
      { status: 500 }
    )
  }
}
```

#### 3.2.3 책 상세 조회

**파일**: `app/api/books/[id]/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from('user_books')
      .select(`
        *,
        book:books(*)
      `)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Get book error:', error)
    return NextResponse.json(
      { error: 'Failed to get book' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { status, started_at, completed_at } = body

  try {
    const { data, error } = await supabase
      .from('user_books')
      .update({ status, started_at, completed_at, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Update book error:', error)
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { error } = await supabase
      .from('user_books')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete book error:', error)
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    )
  }
}
```

### 3.3 Database 스키마

**파일**: `supabase/migrations/002_create_books.sql`

```sql
-- books 테이블
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  isbn TEXT UNIQUE,
  title TEXT NOT NULL,
  author TEXT,
  publisher TEXT,
  cover_image_url TEXT,
  description TEXT,
  published_date DATE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_books_title ON books(title);

-- user_books 테이블 (사용자-책 관계)
CREATE TABLE user_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('want_to_read', 'reading', 'completed')) DEFAULT 'want_to_read',
  started_at DATE,
  completed_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

CREATE INDEX idx_user_books_user_id ON user_books(user_id);
CREATE INDEX idx_user_books_status ON user_books(status);
CREATE INDEX idx_user_books_created_at ON user_books(created_at DESC);

-- RLS 정책
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own user_books"
  ON user_books FOR ALL
  USING (auth.uid() = user_id);
```

### 3.4 TypeScript 타입 정의

**파일**: `types/book.ts`

```typescript
export type Book = {
  id: string
  isbn?: string
  title: string
  author?: string
  publisher?: string
  cover_image_url?: string
  description?: string
  published_date?: string
  category?: string
  created_at: string
}

export type ReadingStatus = 'want_to_read' | 'reading' | 'completed'

export type UserBook = {
  id: string
  user_id: string
  book_id: string
  book?: Book
  status: ReadingStatus
  started_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export type BookSearchRequest = {
  q: string
  type?: 'isbn' | 'title' | 'author'
}

export type AddBookRequest = Partial<Book> & {
  status?: ReadingStatus
  started_at?: string
  completed_at?: string
}
```

---

## 4. 테스트 계획

### 4.1 단위 테스트

- [ ] 책 검색 API 테스트 (ISBN)
- [ ] 책 검색 API 테스트 (제목/저자)
- [ ] 책 등록 API 테스트
- [ ] 책 수정 API 테스트
- [ ] 책 삭제 API 테스트

### 4.2 통합 테스트

- [ ] 프론트엔드 책 목록 페이지 연동
- [ ] 책 추가 플로우 전체 테스트
- [ ] 독서 상태 변경 테스트

---

## 5. 완료 기준

- ✅ ISBN/제목/저자로 책 검색 가능
- ✅ 책 등록/수정/삭제 정상 동작
- ✅ 중복 책 등록 방지
- ✅ 독서 상태 관리 (읽고 싶은, 읽는 중, 완료)
- ✅ RLS 정책 적용
- ✅ Notion 스타일 테이블 데이터 제공
- ✅ TypeScript 타입 에러 없음

---

## 6. 참고 문서

- [알라딘 API 문서](http://blog.aladin.co.kr/openapi/category/2)
- [PRD: 책 검색 및 등록](../PRD-%20Readtree%20독서플랫폼.md#42-책-검색-및-등록)
- [User Stories: US-009 ~ US-014](../user_stories.md#2-책-검색-및-등록)

---

**작성일**: 2025년 12월  
**버전**: 1.0
