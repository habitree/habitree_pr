import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Plus, Search } from "lucide-react"

export default function BooksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">내 책</h1>
        <Button asChild>
          <Link href="/books/new">
            <Plus className="mr-2 h-4 w-4" />책 추가
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="책 제목이나 저자로 검색..." className="pl-9" />
        </div>
      </div>

      <Tabs defaultValue="reading" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reading">읽는 중</TabsTrigger>
          <TabsTrigger value="completed">완독</TabsTrigger>
          <TabsTrigger value="want_to_read">읽고 싶은</TabsTrigger>
        </TabsList>

        <TabsContent value="reading" className="space-y-4">
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">아직 읽는 중인 책이 없습니다</p>
            <Button asChild variant="outline">
              <Link href="/books/new">첫 책 추가하기</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">완독한 책이 없습니다</p>
          </div>
        </TabsContent>

        <TabsContent value="want_to_read" className="space-y-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">읽고 싶은 책이 없습니다</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
