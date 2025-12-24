import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { note_id, template = 'default' } = await request.json()

        // 노트 조회
        const { data: note, error } = await supabase
            .from('notes')
            .select('*, book:books(*)')
            .eq('id', note_id)
            .eq('user_id', user.id)
            .single()

        if (error) throw error

        // 간단한 카드뉴스 URL 생성 (Canvas 없이)
        // 실제로는 Canvas나 이미지 생성 라이브러리 필요
        const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/notes/${note_id}`

        // 목 데이터 반환 (실제로는 이미지 생성 후 Storage 업로드)
        return NextResponse.json({
            success: true,
            data: {
                url: shareUrl,
                message: 'Canvas 기반 카드뉴스 생성은 추가 라이브러리 설치 후 구현 가능합니다.',
            },
        })
    } catch (error) {
        console.error('Share error:', error)
        return NextResponse.json({ error: 'Failed to create share' }, { status: 500 })
    }
}
