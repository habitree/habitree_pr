import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Users, BookOpen } from "lucide-react"

export default function GroupsPage() {
  const mockGroups = [
    {
      id: "1",
      name: "2025 독서 모임",
      description: "함께 성장하는 독서 모임",
      memberCount: 12,
      bookCount: 3,
      recentActivity: "2시간 전",
      members: [
        { id: "1", name: "홍길동", avatar: null },
        { id: "2", name: "김철수", avatar: null },
        { id: "3", name: "이영희", avatar: null },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">독서모임</h1>
        <Button asChild>
          <Link href="/groups/new">
            <Plus className="mr-2 h-4 w-4" />
            모임 만들기
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">내 모임</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockGroups.map((group) => (
              <Link key={group.id} href={`/groups/${group.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1 min-w-0">
                        <CardTitle className="truncate">{group.name}</CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{group.memberCount}명</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{group.bookCount}권</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {group.members.slice(0, 3).map((member) => (
                          <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={member.avatar || undefined} />
                            <AvatarFallback className="text-xs">{member.name[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      {group.memberCount > 3 && (
                        <span className="text-xs text-muted-foreground">+{group.memberCount - 3}</span>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground">{group.recentActivity} 활동</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">추천 모임</h2>
          <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">추천 독서모임을 준비 중입니다</p>
          </div>
        </div>
      </div>
    </div>
  )
}
