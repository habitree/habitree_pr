import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, LogOut } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">프로필</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>프로필 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback>
                  <BookOpen className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                사진 변경
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input id="name" placeholder="홍길동" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" placeholder="your@email.com" disabled />
            </div>

            <Button>저장</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>독서 통계</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">읽은 책</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">노트</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">모임</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>계정 관리</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              비밀번호 변경
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive bg-transparent"
            >
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
