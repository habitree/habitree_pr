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
