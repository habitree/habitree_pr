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
    isbn, title, author, publisher, cover_image_url,
    description, published_date, category,
    status = 'want_to_read', started_at, completed_at,
  } = body

  try {
    let book
    if (isbn) {
      const { data: existingBook } = await supabase
        .from('books')
        .select('*')
        .eq('isbn', isbn)
        .single()

      if (existingBook) book = existingBook
    }

    if (!book) {
      const { data, error } = await supabase
        .from('books')
        .insert({ isbn, title, author, publisher, cover_image_url, description, published_date, category })
        .select()
        .single()

      if (error) throw error
      book = data
    }

    const { data: userBook, error: userBookError } = await supabase
      .from('user_books')
      .insert({ user_id: user.id, book_id: book.id, status, started_at, completed_at })
      .select()
      .single()

    if (userBookError) {
      if (userBookError.code === '23505') {
        return NextResponse.json({ error: 'Book already added' }, { status: 400 })
      }
      throw userBookError
    }

    return NextResponse.json({ success: true, data: { book_id: book.id, user_book_id: userBook.id } })
  } catch (error) {
    console.error('Add book error:', error)
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')

  try {
    let query = supabase
      .from('user_books')
      .select('*, book:books(*)')
      .eq('user_id', user.id)

    if (status) query = query.eq('status', status)

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Get books error:', error)
    return NextResponse.json({ error: 'Failed to get books' }, { status: 500 })
  }
}
