import { BookSearchForm } from "@/components/book-search-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewBookPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">책 추가</h1>

      <Card>
        <CardHeader>
          <CardTitle>책 검색</CardTitle>
          <CardDescription>ISBN, 제목, 저자로 책을 검색하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <BookSearchForm />
        </CardContent>
      </Card>
    </div>
  )
}
