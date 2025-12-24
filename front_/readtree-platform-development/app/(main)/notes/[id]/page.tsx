import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Share2, FileText, BookOpen, Calendar, Tag } from "lucide-react"

export default function NoteDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/notes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          노트 목록으로
        </Link>
      </Button>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <Badge variant="secondary" className="gap-1">
              <FileText className="h-3 w-3" />
              필사
            </Badge>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                수정
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive bg-transparent">
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <blockquote className="border-l-4 border-primary pl-4 py-2 text-lg leading-relaxed italic">
              "우리는 모두 꿈을 꾸며 살아간다. 때로는 작은 꿈이, 때로는 큰 꿈이 우리의 삶을 이끌어간다."
            </blockquote>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>달러구트 꿈 백화점 · 이미예</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>p.42</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>2025년 1월 10일</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">인생</Badge>
                <Badge variant="outline">깨달음</Badge>
                <Badge variant="outline">동기부여</Badge>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <Button className="w-full sm:w-auto">
              <Share2 className="mr-2 h-4 w-4" />
              공유하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
