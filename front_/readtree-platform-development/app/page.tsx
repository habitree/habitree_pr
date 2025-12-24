import Link from "next/link"
import { BookOpen, Search, Share2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            독서 기록이 사라지지 않는 시대
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
            책을 읽으며 남긴
            <br />
            모든 순간을 간직하세요
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground text-pretty">
            필사, 사진, 메모를 자동으로 정리하고, 언제든 다시 찾고,
            <br />
            쉽게 공유할 수 있는 책 전용 기록 플랫폼
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/auth/signup">무료로 시작하기</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent">
              <Link href="/auth/login">로그인</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Readtree만의 특별한 기능</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">자동 정리</h3>
              <p className="text-muted-foreground">
                필사, 사진, 메모가 책별로 자동 분류되고 페이지 순서대로 정렬됩니다
              </p>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">문장 재발견</h3>
              <p className="text-muted-foreground">문장 단위 저장으로 책 제목, 날짜, 주제로 즉시 검색 가능합니다</p>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">독서 타임라인</h3>
              <p className="text-muted-foreground">시간순으로 정리된 독서 기록을 한눈에 확인할 수 있습니다</p>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">즉시 공유</h3>
              <p className="text-muted-foreground">카드뉴스 형태로 자동 변환하여 SNS에 바로 공유할 수 있습니다</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8 p-8 rounded-2xl bg-primary/5 border border-border">
          <h2 className="text-3xl md:text-4xl font-bold">지금 바로 시작하세요</h2>
          <p className="text-lg text-muted-foreground">더 이상 흩어진 기록을 찾느라 시간을 낭비하지 마세요</p>
          <Button size="lg" asChild>
            <Link href="/auth/signup">무료로 시작하기</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-semibold">Readtree</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Readtree by Habitree. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
