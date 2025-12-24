"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import { QuoteNoteForm } from "@/components/note-forms/quote-note-form"
import { PhotoNoteForm } from "@/components/note-forms/photo-note-form"
import { MemoNoteForm } from "@/components/note-forms/memo-note-form"

export default function NewNotePage() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("type") || "quote"

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/notes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          노트 목록으로
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-6">노트 추가</h1>

      <Card>
        <CardHeader>
          <CardTitle>새 노트</CardTitle>
          <CardDescription>책에서 인상 깊은 내용을 기록하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={defaultTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="quote">필사</TabsTrigger>
              <TabsTrigger value="photo">사진</TabsTrigger>
              <TabsTrigger value="memo">메모</TabsTrigger>
            </TabsList>

            <TabsContent value="quote">
              <QuoteNoteForm />
            </TabsContent>

            <TabsContent value="photo">
              <PhotoNoteForm />
            </TabsContent>

            <TabsContent value="memo">
              <MemoNoteForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
