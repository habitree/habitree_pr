import { Book } from './book'
import { NoteType } from './note'

export type ActivityType = 'book_added' | 'note_created' | 'book_completed'

export type Activity = {
    type: ActivityType
    timestamp: string
    details: {
        id: string
        book?: Book
        note_type?: NoteType
    }
}

export type TimelineView = 'day' | 'week' | 'month'

export type TimelineData = Record<string, Activity[]>

export type TimelineStats = {
    books: {
        total: number
        by_status: {
            want_to_read: number
            reading: number
            completed: number
        }
    }
    notes: {
        total: number
        by_type: {
            quote: number
            photo: number
            memo: number
        }
    }
}
