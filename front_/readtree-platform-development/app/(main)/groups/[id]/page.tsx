import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Settings, UserPlus, BookOpen, FileText } from "lucide-react"
import Image from "next/image"

export default function GroupDetailPage() {
  const mockMembers = [
    { id: "1", name: "홍길동", avatar: null, progress: 45, noteCount: 8 },
    { id: "2", name: "김철수", avatar: null, progress: 30, noteCount: 5 },
    { id: "3", name: "이영희", avatar: null, progress: 78, noteCount: 12 },
  ]

  const mockBooks = [
    {
      id: "1",
      title: "달러구트 꿈 백화점",
      author: "이미예",
      cover: "/open-book-library.png",
      status: "reading",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/groups">
          <ArrowLeft className="mr-2 h-4 w-4" />
          모임 목록으로
        </Link>
      </Button>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <CardTitle className="text-2xl">2025 독서 모임</CardTitle>
                <p className="text-muted-foreground">함께 성장하는 독서 모임</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  초대
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  설정
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList>
            <TabsTrigger value="activity">활동</TabsTrigger>
            <TabsTrigger value="books">읽는 책</TabsTrigger>
            <TabsTrigger value="members">멤버</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">최근 활동</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>홍</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">홍길동</span>
                      <Badge variant="secondary" className="text-xs">
                        필사
                      </Badge>
                      <span className="text-xs text-muted-foreground">2시간 전</span>
                    </div>
                    <p className="text-sm text-muted-foreground">달러구트 꿈 백화점에 새로운 필사를 추가했습니다</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="books" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockBooks.map((book) => (
                <Card key={book.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-28 flex-shrink-0 bg-secondary rounded-md overflow-hidden">
                        <Image src={book.cover || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <h4 className="font-semibold line-clamp-2">{book.title}</h4>
                          <p className="text-sm text-muted-foreground">{book.author}</p>
                        </div>
                        <Badge variant="secondary">읽는 중</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <div className="grid gap-4">
              {mockMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar || undefined} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="font-medium">{member.name}</p>
                          <div className="flex gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              <span>{member.progress}% 읽음</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>노트 {member.noteCount}개</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        보기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
