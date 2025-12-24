"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { useState } from "react"

export function SearchFilters() {
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>책</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="전체 책" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 책</SelectItem>
              <SelectItem value="1">달러구트 꿈 백화점</SelectItem>
              <SelectItem value="2">미드나잇 라이브러리</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>정렬</Label>
          <Select defaultValue="recent">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">최신순</SelectItem>
              <SelectItem value="relevance">관련도순</SelectItem>
              <SelectItem value="page">페이지순</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>노트 유형</Label>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="type-quote" defaultChecked />
            <label htmlFor="type-quote" className="text-sm cursor-pointer">
              필사
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="type-photo" defaultChecked />
            <label htmlFor="type-photo" className="text-sm cursor-pointer">
              사진
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="type-memo" defaultChecked />
            <label htmlFor="type-memo" className="text-sm cursor-pointer">
              메모
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>기간</Label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 justify-start text-left font-normal bg-transparent",
                  !dateFrom && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "PPP", { locale: ko }) : "시작일"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
            </PopoverContent>
          </Popover>

          <span className="self-center text-muted-foreground">~</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 justify-start text-left font-normal bg-transparent",
                  !dateTo && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "PPP", { locale: ko }) : "종료일"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1 bg-transparent">
          초기화
        </Button>
        <Button className="flex-1">적용</Button>
      </div>
    </div>
  )
}
