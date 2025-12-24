"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface BookSearchResultsProps {
  query: string
  searchType: "isbn" | "title"
}

export function BookSearchResults({ query, searchType }: BookSearchResultsProps) {
  // Mock data - will be replaced with actual API call
  const mockBooks = [
    {
      isbn: "9788934942467",
      title: "달러구트 꿈 백화점",
      author: "이미예",
      publisher: "팩토리나인",
      coverImage: "/open-book-library.png",
      description: "모두가 잠든 사이, 꿈속에 펼쳐지는 신비로운 백화점 이야기",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">검색 결과</h3>
        <p className="text-sm text-muted-foreground">{mockBooks.length}개의 결과</p>
      </div>

      <div className="space-y-4">
        {mockBooks.map((book) => (
          <Card key={book.isbn}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative w-24 h-32 flex-shrink-0 bg-secondary rounded-md overflow-hidden">
                  <Image src={book.coverImage || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                </div>

                <div className="flex-1 space-y-2">
                  <div>
                    <h4 className="font-semibold text-lg">{book.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {book.author} · {book.publisher}
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>

                  <div className="flex gap-2">
                    <Button size="sm">추가하기</Button>
                    <Button size="sm" variant="outline">
                      상세보기
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center py-8">
        <Button variant="outline">수동으로 책 추가</Button>
      </div>
    </div>
  )
}
