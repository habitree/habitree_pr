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

    if (!query || query.trim().length < 2) {
        return NextResponse.json({ success: true, data: [] })
    }

    try {
        // pg_trgm을 활용한 유사도 기반 자동완성
        const { data, error } = await supabase
            .from('notes')
            .select('content')
            .eq('user_id', user.id)
            .not('content', 'is', null)
            .ilike('content', `%${query}%`)
            .limit(10)

        if (error) throw error

        // 간단한 키워드 추출
        const suggestions = data
            ?.map(note => note.content)
            .filter(Boolean)
            .flatMap(content =>
                content!
                    .split(/[\s,.:;!?]+/)
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
