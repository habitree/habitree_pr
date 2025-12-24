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

        if (start_date) booksQuery = booksQuery.gte('created_at', start_date)
        if (end_date) booksQuery = booksQuery.lte('created_at', end_date)

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

        if (start_date) notesQuery = notesQuery.gte('created_at', start_date)
        if (end_date) notesQuery = notesQuery.lte('created_at', end_date)

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
        return NextResponse.json({ error: 'Failed to get timeline stats' }, { status: 500 })
    }
}
