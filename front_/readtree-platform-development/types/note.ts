import { Book } from './book'

export type NoteType = 'quote' | 'photo' | 'memo'

export type Note = {
    id: string
    user_id: string
    book_id: string
    book?: Book
    type: NoteType
    content?: string
    image_url?: string
    page_number?: number
    tags: string[]
    is_public: boolean
    created_at: string
    updated_at: string
}

export type CreateNoteRequest = {
    book_id: string
    type: NoteType
    content?: string
    image_url?: string
    page_number?: number
    tags?: string[]
    is_public?: boolean
}

export type UpdateNoteRequest = Partial<Omit<CreateNoteRequest, 'book_id' | 'type'>>
