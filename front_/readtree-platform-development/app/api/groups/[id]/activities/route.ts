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
            .from('group_activities')
            .select('*, user:users(id, name, avatar_url), book:books(*), note:notes(*)')
            .eq('group_id', params.id)
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) throw error
        return NextResponse.json({ success: true, data })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to get activities' }, { status: 500 })
    }
}
