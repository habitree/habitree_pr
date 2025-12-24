"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function QuoteNoteForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="book">책 선택 *</Label>
        <Select>
          <SelectTrigger id="book">
            <SelectValue placeholder="책을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">달러구트 꿈 백화점</SelectItem>
            <SelectItem value="2">미드나잇 라이브러리</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">필사 내용 *</Label>
        <Textarea id="content" placeholder="인상 깊은 문장을 입력하세요..." className="min-h-32 resize-none" rows={6} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="page">페이지</Label>
          <Input id="page" type="number" placeholder="예: 42" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">태그</Label>
          <Input id="tags" placeholder="예: 인생, 깨달음" />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button className="flex-1">저장</Button>
        <Button type="button" variant="outline" className="flex-1 bg-transparent">
          취소
        </Button>
      </div>
    </form>
  )
}
