import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, ImageIcon, MessageSquare, BookOpen } from "lucide-react"
import Image from "next/image"

interface NoteCardProps {
  type: "quote" | "photo" | "memo"
  title: string
  author: string
  content?: string
  imageUrl?: string
  date: string
  page?: number
}

export function NoteCard({ type, title, author, content, imageUrl, date, page }: NoteCardProps) {
  const TypeIcon = type === "quote" ? FileText : type === "photo" ? ImageIcon : MessageSquare

  const typeLabel = type === "quote" ? "필사" : type === "photo" ? "사진" : "메모"

  return (
    <Link href="/notes/1">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <Badge variant="secondary" className="gap-1">
              <TypeIcon className="h-3 w-3" />
              {typeLabel}
            </Badge>
            {page && <span className="text-xs text-muted-foreground">p.{page}</span>}
          </div>

          {imageUrl && (
            <div className="relative w-full aspect-video bg-secondary rounded-md overflow-hidden">
              <Image src={imageUrl || "/placeholder.svg"} alt="Note image" fill className="object-cover" />
            </div>
          )}

          {content && (
            <p className="text-sm line-clamp-3 text-muted-foreground leading-relaxed">
              {type === "quote" && <span className="text-foreground">&ldquo;</span>}
              {content}
              {type === "quote" && <span className="text-foreground">&rdquo;</span>}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            <span className="truncate">
              {title} · {author}
            </span>
          </div>

          <div className="text-xs text-muted-foreground">{date}</div>
        </CardContent>
      </Card>
    </Link>
  )
}
