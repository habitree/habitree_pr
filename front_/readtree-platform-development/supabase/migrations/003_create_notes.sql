-- notes 테이블
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('quote', 'photo', 'memo')) NOT NULL,
  content TEXT,
  image_url TEXT,
  page_number INTEGER,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_notes_user_book ON notes(user_id, book_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING gin(tags);

-- Full-Text Search를 위한 인덱스 (한국어)
CREATE INDEX IF NOT EXISTS idx_notes_content_search ON notes 
  USING gin(to_tsvector('korean', COALESCE(content, '')));

-- RLS 정책
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 노트만 조회/수정/삭제
CREATE POLICY "Users can view own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);

-- 공개 노트는 모든 사용자가 조회 가능
CREATE POLICY "Public notes are viewable by everyone"
  ON notes FOR SELECT
  USING (is_public = true);
