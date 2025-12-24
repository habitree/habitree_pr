# Task 4: 검색 API 개발 계획

**작업 번호**: Task 4  
**우선순위**: P1  
**예상 소요 시간**: 1.5일  
**담당 영역**: PostgreSQL Full-Text Search

---

## 1. 작업 개요

PostgreSQL의 Full-Text Search 기능을 사용하여 노트 내용을 검색하는 API를 구현합니다. 한국어 검색을 지원하며, 책/날짜/태그별 필터링과 검색 결과 하이라이트 기능을 제공합니다.

### 1.1 목표

- ✅ PostgreSQL Full-Text Search 설정
- ✅ 문장 단위 검색
- ✅ 필터링 (책, 날짜, 태그, 타입)
- ✅ 검색 결과 하이라이트
- ✅ 검색 응답 시간 1초 이내

### 1.2 의존성

- **선행 작업**: Task 3 (노트 관리)
- **후속 작업**: 없음 (독립적)

---

## 2. 프론트엔드 연동 페이지

| 페이지 경로 | 파일 위치 | 주요 기능 |
|------------|----------|----------|
| 검색 | `/app/(main)/search/page.tsx` | 검색, 필터, 결과 표시 |

---

## 3. 구현 상세

### 3.1 Database 설정

**파일**: `supabase/migrations/004_setup_search.sql`

```sql
-- 한국어 Full-Text Search 설정 (이미 003에서 생성했지만 확인)
CREATE INDEX IF NOT EXISTS idx_notes_content_search 
  ON notes USING gin(to_tsvector('korean', content));

-- 검색 함수 (하이라이트 포함)
CREATE OR REPLACE FUNCTION search_notes(
  p_user_id UUID,
  p_query TEXT,
  p_book_id UUID DEFAULT NULL,
  p_type TEXT DEFAULT NULL,
  p_tags TEXT[] DEFAULT NULL,
  p_date_from TIMESTAMPTZ DEFAULT NULL,
  p_date_to TIMESTAMPTZ DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  book_id UUID,
  book_title TEXT,
  book_author TEXT,
  book_cover_image_url TEXT,
  type TEXT,
  content TEXT,
  image_url TEXT,
  page_number INTEGER,
  tags TEXT[],
  is_public BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  highlight TEXT,
  relevance_score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.user_id,
    n.book_id,
    b.title AS book_title,
    b.author AS book_author,
    b.cover_image_url AS book_cover_image_url,
    n.type,
    n.content,
    n.image_url,
    n.page_number,
    n.tags,
    n.is_public,
    n.created_at,
    n.updated_at,
    ts_headline(
      'korean',
      COALESCE(n.content, ''),
      to_tsquery('korean', p_query),
      'StartSel=<mark>, StopSel=</mark>, MaxWords=35, MinWords=15'
    ) AS highlight,
    ts_rank(
      to_tsvector('korean', COALESCE(n.content, '')),
      to_tsquery('korean', p_query)
    ) AS relevance_score
  FROM notes n
  JOIN books b ON n.book_id = b.id
  WHERE 
    n.user_id = p_user_id
    AND to_tsvector('korean', COALESCE(n.content, '')) @@ to_tsquery('korean', p_query)
    AND (p_book_id IS NULL OR n.book_id = p_book_id)
    AND (p_type IS NULL OR n.type = p_type)
    AND (p_tags IS NULL OR n.tags && p_tags)
    AND (p_date_from IS NULL OR n.created_at >= p_date_from)
    AND (p_date_to IS NULL OR n.created_at <= p_date_to)
  ORDER BY relevance_score DESC, n.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;
```

### 3.2 API Routes 구현

**파일**: `app/api/search/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  
  if (!query || query.trim().length === 0) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 })
  }

  // 검색어 전처리 (PostgreSQL Full-Text Search 형식으로 변환)
  const processedQuery = query
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0)
    .join(' & ') // AND 연산자

  const book_id = searchParams.get('book_id') || null
  const type = searchParams.get('type') || null
  const tags = searchParams.get('tags')?.split(',') || null
  const date_from = searchParams.get('date_from') || null
  const date_to = searchParams.get('date_to') || null
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    const { data, error } = await supabase.rpc('search_notes', {
      p_user_id: user.id,
      p_query: processedQuery,
      p_book_id: book_id,
      p_type: type,
      p_tags: tags,
      p_date_from: date_from,
      p_date_to: date_to,
      p_limit: limit,
      p_offset: offset,
    })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
      query: processedQuery,
      total: data?.length || 0,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    )
  }
}
```

**파일**: `app/api/search/suggestions/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// 자동완성 제안
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  
  if (!query || query.trim().length < 2) {
    return NextResponse.json({ success: true, data: [] })
  }

  try {
    // 최근 검색어와 유사한 노트의 키워드 추출
    const { data, error } = await supabase
      .from('notes')
      .select('content')
      .eq('user_id', user.id)
      .ilike('content', `%${query}%`)
      .limit(10)

    if (error) throw error

    // 간단한 키워드 추출 (실제로는 더 정교한 로직 필요)
    const suggestions = data
      ?.map(note => note.content)
      .filter(Boolean)
      .flatMap(content => 
        content.split(/[\s,.:;!?]+/)
          .filter(word => word.toLowerCase().includes(query.toLowerCase()))
      )
      .filter((word, index, self) => self.indexOf(word) === index) // 중복 제거
      .slice(0, 5)

    return NextResponse.json({ success: true, data: suggestions })
  } catch (error) {
    console.error('Suggestions error:', error)
    return NextResponse.json(
      { error: 'Failed to get suggestions' },
      { status: 500 }
    )
  }
}
```

### 3.3 TypeScript 타입 정의

**파일**: `types/search.ts`

```typescript
import { Note } from './note'

export type SearchRequest = {
  q: string
  book_id?: string
  type?: 'quote' | 'photo' | 'memo'
  tags?: string[]
  date_from?: string
  date_to?: string
  limit?: number
  offset?: number
}

export type SearchResult = Note & {
  highlight: string
  relevance_score: number
  book_title: string
  book_author: string
  book_cover_image_url: string
}

export type SearchResponse = {
  success: boolean
  data: SearchResult[]
  query: string
  total: number
}
```

---

## 4. 검색 최적화 전략

### 4.1 인덱스 활용

- GIN 인덱스로 Full-Text Search 성능 향상
- `ts_rank`로 관련도 점수 계산
- 결과는 관련도 순으로 정렬

### 4.2 쿼리 최적화

```sql
-- EXPLAIN ANALYZE로 쿼리 성능 분석
EXPLAIN ANALYZE
SELECT * FROM notes
WHERE to_tsvector('korean', content) @@ to_tsquery('korean', '검색어');

-- 결과: Index Scan using idx_notes_content_search
```

### 4.3 캐싱 전략 (선택적)

- React Query를 프론트엔드에서 사용하여 검색 결과 캐싱
- 동일한 검색어는 5분간 캐시

---

## 5. 테스트 계획

### 5.1 단위 테스트

- [ ] 기본 검색 테스트
- [ ] 필터링 (책, 타입, 태그, 날짜)
- [ ] 하이라이트 생성
- [ ] 빈 쿼리 처리

### 5.2 성능 테스트

- [ ] 1000개 노트에서 검색 응답 시간 측정 (목표: 1초 이내)
- [ ] 동시 검색 요청 처리

---

## 6. 완료 기준

- ✅ 문장 단위 검색 정상 동작
- ✅ 책/날짜/태그별 필터링
- ✅ 검색 결과 하이라이트 표시
- ✅ 검색 응답 시간 1초 이내
- ✅ 한국어 Full-Text Search 지원
- ✅ TypeScript 타입 에러 없음

---

**작성일**: 2025년 12월  
**버전**: 1.0
