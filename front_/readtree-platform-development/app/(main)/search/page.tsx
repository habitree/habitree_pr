"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, FileText, BookOpen, Calendar } from "lucide-react"
import { SearchFilters } from "@/components/search-filters"
import Link from "next/link"

export default function SearchPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const mockResults = [
    {
      id: "1",
      type: "quote" as const,
      content: "우리는 모두 꿈을 꾸며 살아간다. 때로는 작은 꿈이, 때로는 큰 꿈이 우리의 삶을 이끌어간다.",
      bookTitle: "달러구트 꿈 백화점",
      author: "이미예",
      page: 42,
      date: "2025년 1월 10일",
      tags: ["인생", "깨달음"],
    },
    {
      id: "2",
      type: "memo" as const,
      content: "이 장면에서 페니가 느낀 감정이 정말 공감됐다. 나도 비슷한 경험이 있었는데...",
      bookTitle: "달러구트 꿈 백화점",
      author: "이미예",
      page: 38,
      date: "2025년 1월 9일",
      tags: ["감상"],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">검색</h1>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="책 제목, 저자, 필사 내용으로 검색..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>검색</Button>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            필터
          </Button>
        </div>

        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <SearchFilters />
            </CardContent>
          </Card>
        )}

        {searchQuery ? (
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">전체 ({mockResults.length})</TabsTrigger>
              <TabsTrigger value="quote">필사 (1)</TabsTrigger>
              <TabsTrigger value="memo">메모 (1)</TabsTrigger>
              <TabsTrigger value="photo">사진 (0)</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {mockResults.map((result) => (
                <Link key={result.id} href={`/notes/${result.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary">
                          {result.type === "quote" ? "필사" : result.type === "photo" ? "사진" : "메모"}
                        </Badge>
                        {result.page && <span className="text-xs text-muted-foreground">p.{result.page}</span>}
                      </div>

                      <p className="text-sm leading-relaxed">
                        {result.type === "quote" && <span className="text-foreground">&ldquo;</span>}
                        {result.content}
                        {result.type === "quote" && <span className="text-foreground">&rdquo;</span>}
                      </p>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          <span>
                            {result.bookTitle} · {result.author}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{result.date}</span>
                        </div>
                      </div>

                      {result.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {result.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </TabsContent>

            <TabsContent value="quote">
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">필사 검색 결과가 없습니다</p>
              </div>
            </TabsContent>

            <TabsContent value="memo">
              <div className="text-center py-12">
                <p className="text-muted-foreground">메모 검색 결과가 없습니다</p>
              </div>
            </TabsContent>

            <TabsContent value="photo">
              <div className="text-center py-12">
                <p className="text-muted-foreground">사진 검색 결과가 없습니다</p>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-20">
            <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-2">검색어를 입력해주세요</p>
            <p className="text-sm text-muted-foreground">책 제목, 저자, 필사 내용으로 노트를 찾을 수 있습니다</p>
          </div>
        )}
      </div>
    </div>
  )
}
