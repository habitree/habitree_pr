import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, FileText, ImageIcon, MessageSquare, Filter } from "lucide-react"
import { NoteCard } from "@/components/note-card"

export default function NotesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">내 노트</h1>
        <Button asChild>
          <Link href="/notes/new">
            <Plus className="mr-2 h-4 w-4" />
            노트 추가
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="quote">필사</TabsTrigger>
            <TabsTrigger value="photo">사진</TabsTrigger>
            <TabsTrigger value="memo">메모</TabsTrigger>
          </TabsList>

          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            필터
          </Button>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <NoteCard
              type="quote"
              title="달러구트 꿈 백화점"
              author="이미예"
              content="우리는 모두 꿈을 꾸며 살아간다. 때로는 작은 꿈이, 때로는 큰 꿈이 우리의 삶을 이끌어간다."
              date="2025년 1월 10일"
              page={42}
            />
            <NoteCard
              type="photo"
              title="달러구트 꿈 백화점"
              author="이미예"
              imageUrl="/open-book-library.png"
              date="2025년 1월 9일"
              page={38}
            />
            <NoteCard
              type="memo"
              title="달러구트 꿈 백화점"
              author="이미예"
              content="이 장면에서 페니가 느낀 감정이 정말 공감됐다. 나도 비슷한 경험이 있었는데..."
              date="2025년 1월 8일"
            />
          </div>
        </TabsContent>

        <TabsContent value="quote" className="space-y-4">
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">필사 노트가 없습니다</p>
          </div>
        </TabsContent>

        <TabsContent value="photo" className="space-y-4">
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">사진 노트가 없습니다</p>
          </div>
        </TabsContent>

        <TabsContent value="memo" className="space-y-4">
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">메모 노트가 없습니다</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
