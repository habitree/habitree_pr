import Link from "next/link"
import { BookOpen, Search, Plus, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold text-foreground">Readtree</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/timeline"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            타임라인
          </Link>
          <Link
            href="/books"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            내 책
          </Link>
          <Link
            href="/notes"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            노트
          </Link>
          <Link
            href="/groups"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            독서모임
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/books/new">
              <Plus className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
