import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Plus, FileText, ImageIcon, MessageSquare } from "lucide-react"
import Image from "next/image"

export default function BookDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/books">
          <ArrowLeft className="mr-2 h-4 w-4" />책 목록으로
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="relative w-full aspect-[3/4] bg-secondary rounded-lg overflow-hidden">
                <Image src="/open-book-library.png" alt="Book cover" fill className="object-cover" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">달러구트 꿈 백화점</h2>
                <p className="text-muted-foreground">이미예</p>
                <Badge>읽는 중</Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">출판사</span>
                  <span>팩토리나인</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ISBN</span>
                  <span>9788934942467</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">시작일</span>
                  <span>2025년 1월 1일</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Edit className="mr-2 h-4 w-4" />
                  수정
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-destructive hover:text-destructive bg-transparent"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="notes" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="notes">노트</TabsTrigger>
                <TabsTrigger value="info">책 정보</TabsTrigger>
              </TabsList>

              <Button asChild>
                <Link href={`/notes/new?bookId=1`}>
                  <Plus className="mr-2 h-4 w-4" />
                  노트 추가
                </Link>
              </Button>
            </div>

            <TabsContent value="notes" className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-3">
                <Button variant="outline" asChild className="justify-start bg-transparent">
                  <Link href={`/notes/new?bookId=1&type=quote`}>
                    <FileText className="mr-2 h-4 w-4" />
                    필사 추가
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start bg-transparent">
                  <Link href={`/notes/new?bookId=1&type=photo`}>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    사진 추가
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start bg-transparent">
                  <Link href={`/notes/new?bookId=1&type=memo`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    메모 추가
                  </Link>
                </Button>
              </div>

              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">아직 노트가 없습니다</p>
                <Button asChild>
                  <Link href={`/notes/new?bookId=1`}>첫 노트 작성하기</Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <CardTitle>책 소개</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    모두가 잠든 사이, 꿈속에 펼쳐지는 신비로운 백화점 이야기. 달러구트 꿈 백화점에서는 온갖 꿈들이
                    판매되고 있습니다. 이곳에서 일하게 된 페니의 특별한 경험을 그린 이야기입니다.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
