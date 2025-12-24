import { Note } from './note'

export type SearchRequest = {
    q: string
    book_id?: string
    type?: 'quote' | 'photo' | 'memo'
    tags?: string[]
    date_from?: string
    date_to?: string
    limit?: number
    offset?: number
}

export type SearchResult = Note & {
    highlight: string
    relevance_score: number
    book_title: string
    book_author: string
    book_cover_image_url: string
}

export type SearchResponse = {
    success: boolean
    data: SearchResult[]
    query: string
    total: number
}
