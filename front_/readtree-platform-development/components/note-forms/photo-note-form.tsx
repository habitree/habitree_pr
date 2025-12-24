"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Camera } from "lucide-react"
import Image from "next/image"

export function PhotoNoteForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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
        <Label>사진 업로드 *</Label>
        {imagePreview ? (
          <div className="relative w-full aspect-video bg-secondary rounded-lg overflow-hidden">
            <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => setImagePreview(null)}
            >
              변경
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
            <div className="flex justify-center gap-4">
              <Button type="button" variant="outline" className="bg-transparent">
                <Upload className="mr-2 h-4 w-4" />
                갤러리에서 선택
              </Button>
              <Button type="button" variant="outline" className="bg-transparent">
                <Camera className="mr-2 h-4 w-4" />
                카메라로 촬영
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">JPG, PNG 파일 (최대 10MB)</p>
          </div>
        )}
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
