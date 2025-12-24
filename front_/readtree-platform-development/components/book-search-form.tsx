"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Search, Barcode } from "lucide-react"
import { BookSearchResults } from "./book-search-results"

export function BookSearchForm() {
  const [searchType, setSearchType] = useState<"isbn" | "title">("title")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    // API call would happen here
    setTimeout(() => setIsSearching(false), 1000)
  }

  return (
    <div className="space-y-6">
      <RadioGroup value={searchType} onValueChange={(value) => setSearchType(value as "isbn" | "title")}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="title" id="title" />
          <Label htmlFor="title" className="cursor-pointer">
            제목 또는 저자로 검색
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="isbn" id="isbn" />
          <Label htmlFor="isbn" className="cursor-pointer">
            ISBN으로 검색
          </Label>
        </div>
      </RadioGroup>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            {searchType === "isbn" ? (
              <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            ) : (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            )}
            <Input
              placeholder={searchType === "isbn" ? "ISBN 번호 입력" : "책 제목 또는 저자 입력"}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isSearching}>
            {isSearching ? "검색 중..." : "검색"}
          </Button>
        </div>
      </form>

      {searchQuery && <BookSearchResults query={searchQuery} searchType={searchType} />}
    </div>
  )
}
