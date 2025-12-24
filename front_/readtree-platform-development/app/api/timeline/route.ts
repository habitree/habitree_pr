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
    const view = searchParams.get('view') || 'day'

    try {
        // 책 추가 활동
        let booksQuery = supabase
            .from('user_books')
            .select('id, created_at, book:books(id, title, author, cover_image_url)')
            .eq('user_id', user.id)

        if (start_date) booksQuery = booksQuery.gte('created_at', start_date)
        if (end_date) booksQuery = booksQuery.lte('created_at', end_date)

        const { data: books } = await booksQuery

        // 노트 작성 활동
        let notesQuery = supabase
            .from('notes')
            .select('id, type, created_at, book:books(id, title, author, cover_image_url)')
            .eq('user_id', user.id)

        if (start_date) notesQuery = notesQuery.gte('created_at', start_date)
        if (end_date) notesQuery = notesQuery.lte('created_at', end_date)

        const { data: notes } = await notesQuery

        // 활동 통합
        const activities = [
            ...(books?.map(book => ({
                type: 'book_added' as const,
                timestamp: book.created_at,
                details: { id: book.id, book: book.book },
            })) || []),
            ...(notes?.map(note => ({
                type: 'note_created' as const,
                timestamp: note.created_at,
                details: { id: note.id, note_type: note.type, book: note.book },
            })) || []),
        ]

        activities.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )

        // 뷰별 그룹화
        const grouped = groupByView(activities, view)

        return NextResponse.json({ success: true, data: grouped, total: activities.length })
    } catch (error) {
        console.error('Timeline error:', error)
        return NextResponse.json({ error: 'Failed to get timeline' }, { status: 500 })
    }
}

function groupByView(activities: any[], view: string): Record<string, any[]> {
    const grouped: Record<string, any[]> = {}

    activities.forEach(activity => {
        const date = new Date(activity.timestamp)
        let key: string

        if (view === 'day') {
            key = date.toISOString().split('T')[0]
        } else if (view === 'week') {
            const weekStart = new Date(date)
            weekStart.setDate(date.getDate() - date.getDay())
            key = weekStart.toISOString().split('T')[0]
        } else {
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        }

        if (!grouped[key]) grouped[key] = []
        grouped[key].push(activity)
    })

    return grouped
}
