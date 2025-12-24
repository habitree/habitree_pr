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
    type,
    content,
    image_url,
    page_number,
    tags = [],
    is_public = false,
  } = body

  if (!book_id || !type) {
    return NextResponse.json({ error: 'book_id and type are required' }, { status: 400 })
  }

  if ((type === 'quote' || type === 'memo') && !content) {
    return NextResponse.json({ error: 'content is required for quote/memo' }, { status: 400 })
  }

  if (type === 'photo' && !image_url) {
    return NextResponse.json({ error: 'image_url is required for photo' }, { status: 400 })
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
      return NextResponse.json({ error: 'Book not found or not owned by user' }, { status: 404 })
    }

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
      .select('*, book:books(*)')
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Create note error:', error)
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
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

  try {
    let query = supabase
      .from('notes')
      .select('*, book:books(*)', { count: 'exact' })
      .eq('user_id', user.id)

    if (book_id) query = query.eq('book_id', book_id)
    if (type) query = query.eq('type', type)
    if (tags && tags.length > 0) query = query.contains('tags', tags)

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return NextResponse.json({ success: true, data, total: count })
  } catch (error) {
    console.error('Get notes error:', error)
    return NextResponse.json({ error: 'Failed to get notes' }, { status: 500 })
  }
}
