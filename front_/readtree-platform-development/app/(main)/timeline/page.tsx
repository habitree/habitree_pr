import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Calendar, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function TimelinePage() {
  const timelineData = [
    {
      date: "2025년 1월 10일",
      activities: [
        {
          id: "1",
          type: "note" as const,
          noteType: "quote",
          content: "우리는 모두 꿈을 꾸며 살아간다. 때로는 작은 꿈이, 때로는 큰 꿈이 우리의 삶을 이끌어간다.",
          bookTitle: "달러구트 꿈 백화점",
          bookCover: "/open-book-library.png",
          time: "오후 3:24",
        },
      ],
    },
    {
      date: "2025년 1월 9일",
      activities: [
        {
          id: "2",
          type: "note" as const,
          noteType: "photo",
          bookTitle: "달러구트 꿈 백화점",
          bookCover: "/open-book-library.png",
          time: "오전 10:15",
        },
        {
          id: "3",
          type: "book" as const,
          action: "started",
          bookTitle: "달러구트 꿈 백화점",
          bookCover: "/open-book-library.png",
          time: "오전 9:00",
        },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">독서 타임라인</h1>
          <Select defaultValue="all">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="week">이번 주</SelectItem>
              <SelectItem value="month">이번 달</SelectItem>
              <SelectItem value="year">올해</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center space-y-1">
              <div className="text-2xl font-bold">2</div>
              <div className="text-sm text-muted-foreground">읽는 중</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center space-y-1">
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm text-muted-foreground">완독</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center space-y-1">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">노트</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center space-y-1">
              <div className="text-2xl font-bold flex items-center justify-center gap-1">
                <TrendingUp className="h-5 w-5 text-green-500" />
                8%
              </div>
              <div className="text-sm text-muted-foreground">전주 대비</div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {timelineData.map((day, dayIndex) => (
            <div key={dayIndex} className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{day.date}</h3>
              </div>

              <div className="space-y-3 ml-8 border-l-2 border-border pl-6">
                {day.activities.map((activity) => (
                  <div key={activity.id} className="relative">
                    <div className="absolute -left-[29px] top-3 h-3 w-3 rounded-full bg-primary border-2 border-background" />

                    {activity.type === "note" ? (
                      <Link href={`/notes/${activity.id}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">
                                  {activity.noteType === "quote"
                                    ? "필사"
                                    : activity.noteType === "photo"
                                      ? "사진"
                                      : "메모"}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{activity.time}</span>
                              </div>
                            </div>

                            {activity.content && (
                              <p className="text-sm leading-relaxed line-clamp-2">
                                <span className="text-foreground">&ldquo;</span>
                                {activity.content}
                                <span className="text-foreground">&rdquo;</span>
                              </p>
                            )}

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="relative h-8 w-6 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={activity.bookCover || "/placeholder.svg"}
                                  alt={activity.bookTitle}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="truncate">{activity.bookTitle}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ) : (
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-9 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={activity.bookCover || "/placeholder.svg"}
                                alt={activity.bookTitle}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <BookOpen className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium">
                                  {activity.action === "started" ? "읽기 시작" : "완독"}
                                </span>
                                <span className="text-xs text-muted-foreground">{activity.time}</span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{activity.bookTitle}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center py-8">
          <Button variant="outline">더 보기</Button>
        </div>
      </div>
    </div>
  )
}
