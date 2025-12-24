import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description } = await request.json()

    try {
        const { data, error } = await supabase
            .from('reading_groups')
            .insert({ name, description, leader_id: user.id })
            .select()
            .single()

        if (error) throw error

        // 리더를 멤버로 자동 추가
        await supabase.from('group_members').insert({ group_id: data.id, user_id: user.id })

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('Create group error:', error)
        return NextResponse.json({ error: 'Failed to create group' }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { data, error } = await supabase
            .from('group_members')
            .select('id, joined_at, group:reading_groups(*)')
            .eq('user_id', user.id)

        if (error) throw error
        return NextResponse.json({ success: true, data })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to get groups' }, { status: 500 })
    }
}
