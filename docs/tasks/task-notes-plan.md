# Task 3: 노트 관리 API 개발 계획

**작업 번호**: Task 3  
**우선순위**: P0  
**예상 소요 시간**: 2일  
**담당 영역**: 필사, 사진, 메모 CRUD

---

## 1. 작업 개요

책을 읽으며 남긴 필사, 사진, 메모를 관리하는 API를 구현합니다. 각 노트는 책과 자동으로 연결되며, 페이지 번호, 태그, 공개/비공개 설정을 지원합니다.

### 1.1 목표

- ✅ 필사/사진/메모 타입별 CRUD 구현
- ✅ 책과 자동 연결
- ✅ 페이지 번호 및 태그 관리
- ✅ 공개/비공개 설정
- ✅ 이미지 URL 저장 (Task 7과 연동)

### 1.2 의존성

- **선행 작업**: Task 1 (인증), Task 2 (책 관리)
- **후속 작업**: Task 4 (검색), Task 5 (타임라인), Task 6 (독서모임), Task 8 (공유)

---

## 2. 프론트엔드 연동 페이지

| 페이지 경로 | 파일 위치 | 주요 기능 |
|------------|----------|----------|
| 노트 목록 | `/app/(main)/notes/page.tsx` | 전체 노트 목록, 필터링 |
| 노트 작성 | `/app/(main)/notes/new/page.tsx` | 필사/사진/메모 작성 |
| 노트 상세 | `/app/(main)/notes/[id]/page.tsx` | 노트 상세, 수정, 삭제, 공유 |

---

## 3. 구현 상세

### 3.1 API Routes 구현

#### 3.1.1 노트 생성

**파일**: `app/api/notes/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const {
    book_id,
    type, // 'quote' | 'photo' | 'memo'
    content,
    image_url,
    page_number,
    tags = [],
    is_public = false,
  } = body

  // 필수 필드 검증
  if (!book_id || !type) {
    return NextResponse.json(
      { error: 'book_id and type are required' },
      { status: 400 }
    )
  }

  // 타입별 검증
  if (type === 'quote' || type === 'memo') {
    if (!content) {
      return NextResponse.json(
        { error: 'content is required for quote/memo' },
        { status: 400 }
      )
    }
  } else if (type === 'photo') {
    if (!image_url) {
      return NextResponse.json(
        { error: 'image_url is required for photo' },
        { status: 400 }
      )
    }
  }

  try {
    // 책이 사용자의 책인지 확인
    const { data: userBook } = await supabase
      .from('user_books')
      .select('id')
      .eq('book_id', book_id)
      .eq('user_id', user.id)
      .single()

    if (!userBook) {
      return NextResponse.json(
        { error: 'Book not found or not owned by user' },
        { status: 404 }
      )
    }

    // 노트 생성
    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        book_id,
        type,
        content,
        image_url,
        page_number,
        tags,
        is_public,
      })
      .select(`
        *,
        book:books(*)
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Create note error:', error)
    return NextResponse.json(
      { error: 'Failed to create note' },
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
  const book_id = searchParams.get('book_id')
  const type = searchParams.get('type')
  const tags = searchParams.get('tags')?.split(',')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')
  const sort = searchParams.get('sort') || 'created_at'
  const order = searchParams.get('order') || 'desc'

  try {
    let query = supabase
      .from('notes')
      .select(`
        *,
        book:books(*)
      `, { count: 'exact' })
      .eq('user_id', user.id)

    if (book_id) {
      query = query.eq('book_id', book_id)
    }

    if (type) {
      query = query.eq('type', type)
    }

    if (tags && tags.length > 0) {
      query = query.contains('tags', tags)
    }

    const { data, error, count } = await query
      .order(sort, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({ success: true, data, total: count })
  } catch (error) {
    console.error('Get notes error:', error)
    return NextResponse.json(
      { error: 'Failed to get notes' },
      { status: 500 }
    )
  }
}
```

#### 3.1.2 노트 상세 조회/수정/삭제

**파일**: `app/api/notes/[id]/route.ts`

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
      .from('notes')
      .select(`
        *,
        book:books(*)
      `)
      .eq('id', params.id)
      .or(`user_id.eq.${user.id},is_public.eq.true`)
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Get note error:', error)
    return NextResponse.json(
      { error: 'Note not found' },
      { status: 404 }
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
  const { content, image_url, page_number, tags, is_public } = body

  try {
    const { data, error } = await supabase
      .from('notes')
      .update({
        content,
        image_url,
        page_number,
        tags,
        is_public,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Update note error:', error)
    return NextResponse.json(
      { error: 'Failed to update note' },
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
      .from('notes')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete note error:', error)
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    )
  }
}
```

### 3.2 Database 스키마

**파일**: `supabase/migrations/003_create_notes.sql`

```sql
-- notes 테이블
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('quote', 'photo', 'memo')) NOT NULL,
  content TEXT,
  image_url TEXT,
  page_number INTEGER,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_notes_user_book ON notes(user_id, book_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_notes_tags ON notes USING gin(tags);

-- Full-Text Search를 위한 인덱스 (한국어)
CREATE INDEX idx_notes_content_search ON notes 
  USING gin(to_tsvector('korean', content));

-- RLS 정책
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 노트만 조회/수정/삭제
CREATE POLICY "Users can view own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);

-- 공개 노트는 모든 사용자가 조회 가능
CREATE POLICY "Public notes are viewable by everyone"
  ON notes FOR SELECT
  USING (is_public = true);
```

### 3.3 TypeScript 타입 정의

**파일**: `types/note.ts`

```typescript
import { Book } from './book'

export type NoteType = 'quote' | 'photo' | 'memo'

export type Note = {
  id: string
  user_id: string
  book_id: string
  book?: Book
  type: NoteType
  content?: string
  image_url?: string
  page_number?: number
  tags: string[]
  is_public: boolean
  created_at: string
  updated_at: string
}

export type CreateNoteRequest = {
  book_id: string
  type: NoteType
  content?: string
  image_url?: string
  page_number?: number
  tags?: string[]
  is_public?: boolean
}

export type UpdateNoteRequest = Partial<Omit<CreateNoteRequest, 'book_id' | 'type'>>
```

---

## 4. 테스트 계획

### 4.1 단위 테스트

- [ ] 필사 생성 API 테스트
- [ ] 사진 생성 API 테스트
- [ ] 메모 생성 API 테스트
- [ ] 노트 목록 조회 (필터링)
- [ ] 노트 수정/삭제

### 4.2 통합 테스트

- [ ] 프론트엔드 노트 작성 연동
- [ ] 책과 자동 연결 확인
- [ ] 공개/비공개 노트 접근 권한

---

## 5. 완료 기준

- ✅ 필사/사진/메모 생성 정상 동작
- ✅ 책과 자동 연결
- ✅ 페이지 번호 및 태그 관리
- ✅ 공개/비공개 설정
- ✅ RLS 정책 적용
- ✅ Full-Text Search 인덱스 설정
- ✅ TypeScript 타입 에러 없음

---

**작성일**: 2025년 12월  
**버전**: 1.0
