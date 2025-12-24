-- books 테이블
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  isbn TEXT UNIQUE,
  title TEXT NOT NULL,
  author TEXT,
  publisher TEXT,
  cover_image_url TEXT,
  description TEXT,
  published_date DATE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);

-- user_books 테이블 (사용자-책 관계)
CREATE TABLE IF NOT EXISTS user_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('want_to_read', 'reading', 'completed')) DEFAULT 'want_to_read',
  started_at DATE,
  completed_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

CREATE INDEX IF NOT EXISTS idx_user_books_user_id ON user_books(user_id);
CREATE INDEX IF NOT EXISTS idx_user_books_status ON user_books(status);
CREATE INDEX IF NOT EXISTS idx_user_books_created_at ON user_books(created_at DESC);

-- RLS 정책
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own user_books"
  ON user_books FOR ALL
  USING (auth.uid() = user_id);
