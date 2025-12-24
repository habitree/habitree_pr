export type Book = {
    id: string
    isbn?: string
    title: string
    author?: string
    publisher?: string
    cover_image_url?: string
    description?: string
    published_date?: string
    category?: string
    created_at: string
}

export type ReadingStatus = 'want_to_read' | 'reading' | 'completed'

export type UserBook = {
    id: string
    user_id: string
    book_id: string
    book?: Book
    status: ReadingStatus
    started_at?: string
    completed_at?: string
    created_at: string
    updated_at: string
}

export type BookSearchRequest = {
    q: string
    type?: 'isbn' | 'title' | 'author'
}

export type AddBookRequest = Partial<Book> & {
    status?: ReadingStatus
    started_at?: string
    completed_at?: string
}
