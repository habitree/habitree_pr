# Task 5: 타임라인 API 개발 계획

**작업 번호**: Task 5  
**우선순위**: P1  
**예상 소요 시간**: 1일  
**담당 영역**: 독서 활동 타임라인 조회

---

## 1. 작업 개요

사용자의 독서 활동(책 추가, 노트 작성, 책 완료 등)을 시간순으로 보여주는 타임라인 API를 구현합니다. 일/주/월 뷰를 지원하며, 통계 정보를 제공합니다.

### 1.1 목표

- ✅ 시간순 활동 조회
- ✅ 일/주/월 뷰 지원
- ✅ 활동 타입별 집계
- ✅ 통계 정보 제공

### 1.2 의존성

- **선행 작업**: Task 2 (책 관리), Task 3 (노트 관리)
- **후속 작업**: 없음 (독립적)

---

## 2. 프론트엔드 연동 페이지

| 페이지 경로 | 파일 위치 | 주요 기능 |
|------------|----------|----------|
| 타임라인 | `/app/(main)/timeline/page.tsx` | 타임라인 뷰, 통계 |

---

## 3. 구현 상세

### 3.1 API Routes 구현

**파일**: `app/api/timeline/route.ts`

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
  const start_date = searchParams.get('start_date')
  const end_date = searchParams.get('end_date')
  const view = searchParams.get('view') || 'day' // 'day' | 'week' | 'month'

  try {
    // 책 추가 활동
    const booksQuery = supabase
      .from('user_books')
      .select(`
        id,
        created_at,
        book:books(id, title, author, cover_image_url)
      `)
      .eq('user_id', user.id)

    if (start_date) {
      booksQuery.gte('created_at', start_date)
    }
    if (end_date) {
      booksQuery.lte('created_at', end_date)
    }

    const { data: books } = await booksQuery
    
    // 노트 작성 활동
    const notesQuery = supabase
      .from('notes')
      .select(`
        id,
        type,
        created_at,
        book:books(id, title, author, cover_image_url)
      `)
      .eq('user_id', user.id)

    if (start_date) {
      notesQuery.gte('created_at', start_date)
    }
    if (end_date) {
      notesQuery.lte('created_at', end_date)
    }

    const { data: notes } = await notesQuery

    // 활동 통합 및 변환
    const activities = [
      ...(books?.map(book => ({
        type: 'book_added' as const,
        timestamp: book.created_at,
        details: {
          id: book.id,
          book: book.book,
        },
      })) || []),
      ...(notes?.map(note => ({
        type: 'note_created' as const,
        timestamp: note.created_at,
        details: {
          id: note.id,
          note_type: note.type,
          book: note.book,
        },
      })) || []),
    ]

    // 시간순 정렬
    activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    // 뷰별 그룹화
    const grouped = groupByView(activities, view)

    return NextResponse.json({
      success: true,
      data: grouped,
      total: activities.length,
    })
  } catch (error) {
    console.error('Timeline error:', error)
    return NextResponse.json(
      { error: 'Failed to get timeline' },
      { status: 500 }
    )
  }
}

function groupByView(
  activities: any[],
  view: string
): Record<string, any[]> {
  const grouped: Record<string, any[]> = {}

  activities.forEach(activity => {
    const date = new Date(activity.timestamp)
    let key: string

    if (view === 'day') {
      key = date.toISOString().split('T')[0] // YYYY-MM-DD
    } else if (view === 'week') {
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      key = weekStart.toISOString().split('T')[0]
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    }

    if (!grouped[key]) {
      grouped[key] = []
    }
    grouped[key].push(activity)
  })

  return grouped
}
```

**파일**: `app/api/timeline/stats/route.ts`

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
  const start_date = searchParams.get('start_date')
  const end_date = searchParams.get('end_date')

  try {
    // 책 통계
    let booksQuery = supabase
      .from('user_books')
      .select('status, created_at', { count: 'exact' })
      .eq('user_id', user.id)

    if (start_date) booksQuery.gte('created_at', start_date)
    if (end_date) booksQuery.lte('created_at', end_date)

    const { data: userBooks, count: totalBooks } = await booksQuery

    const booksByStatus = {
      want_to_read: 0,
      reading: 0,
      completed: 0,
    }

    userBooks?.forEach(book => {
      booksByStatus[book.status as keyof typeof booksByStatus]++
    })

    // 노트 통계
    let notesQuery = supabase
      .from('notes')
      .select('type', { count: 'exact' })
      .eq('user_id', user.id)

    if (start_date) notesQuery.gte('created_at', start_date)
    if (end_date) notesQuery.lte('created_at', end_date)

    const { data: notes, count: totalNotes } = await notesQuery

    const notesByType = {
      quote: 0,
      photo: 0,
      memo: 0,
    }

    notes?.forEach(note => {
      notesByType[note.type as keyof typeof notesByType]++
    })

    return NextResponse.json({
      success: true,
      data: {
        books: {
          total: totalBooks || 0,
          by_status: booksByStatus,
        },
        notes: {
          total: totalNotes || 0,
          by_type: notesByType,
        },
      },
    })
  } catch (error) {
    console.error('Timeline stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get timeline stats' },
      { status: 500 }
    )
  }
}
```

### 3.2 TypeScript 타입 정의

**파일**: `types/timeline.ts`

```typescript
import { Book } from './book'
import { NoteType } from './note'

export type ActivityType = 'book_added' | 'note_created' | 'book_completed'

export type Activity = {
  type: ActivityType
  timestamp: string
  details: {
    id: string
    book?: Book
    note_type?: NoteType
  }
}

export type TimelineView = 'day' | 'week' | 'month'

export type TimelineData = Record<string, Activity[]>

export type TimelineStats = {
  books: {
    total: number
    by_status: {
      want_to_read: number
      reading: number
      completed: number
    }
  }
  notes: {
    total: number
    by_type: {
      quote: number
      photo: number
      memo: number
    }
  }
}
```

---

## 4. 테스트 계획

### 4.1 단위 테스트

- [ ] 타임라인 조회 (일/주/월)
- [ ] 날짜 범위 필터링
- [ ] 통계 조회

### 4.2 성능 테스트

- [ ] 대량 활동 데이터 조회 성능

---

## 5. 완료 기준

- ✅ 시간순 활동 조회
- ✅ 일/주/월 뷰 지원
- ✅ 활동 집계 정상 동작
- ✅ 통계 정보 제공
- ✅ TypeScript 타입 에러 없음

---

**작성일**: 2025년 12월  
**버전**: 1.0
