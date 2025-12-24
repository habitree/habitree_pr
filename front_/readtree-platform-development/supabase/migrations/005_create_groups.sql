-- reading_groups 테이블
CREATE TABLE IF NOT EXISTS public.reading_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reading_groups_leader_id ON public.reading_groups(leader_id);

-- group_members 테이블
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.reading_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON public.group_members(user_id);

-- group_books 테이블
CREATE TABLE IF NOT EXISTS public.group_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.reading_groups(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(group_id, book_id)
);

CREATE INDEX IF NOT EXISTS idx_group_books_group_id ON public.group_books(group_id);

-- group_activities 테이블
CREATE TABLE IF NOT EXISTS public.group_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.reading_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  note_id UUID REFERENCES public.notes(id) ON DELETE SET NULL,
  progress INTEGER CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_group_activities_group_id ON public.group_activities(group_id);
CREATE INDEX IF NOT EXISTS idx_group_activities_created_at ON public.group_activities(created_at DESC);

-- RLS 정책
ALTER TABLE public.reading_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_activities ENABLE ROW LEVEL SECURITY;

-- 모임 정책
DROP POLICY IF EXISTS "Group members can view groups" ON public.reading_groups;
DROP POLICY IF EXISTS "Group leaders can update groups" ON public.reading_groups;
DROP POLICY IF EXISTS "Group leaders can delete groups" ON public.reading_groups;
DROP POLICY IF EXISTS "Users can create groups" ON public.reading_groups;

CREATE POLICY "Group members can view groups"
  ON public.reading_groups FOR SELECT
  USING (
    auth.uid() = leader_id OR
    EXISTS (SELECT 1 FROM public.group_members WHERE group_id = reading_groups.id AND user_id = auth.uid())
  );

CREATE POLICY "Group leaders can update groups"
  ON public.reading_groups FOR UPDATE
  USING (auth.uid() = leader_id)
  WITH CHECK (auth.uid() = leader_id);

CREATE POLICY "Group leaders can delete groups"
  ON public.reading_groups FOR DELETE
  USING (auth.uid() = leader_id);

CREATE POLICY "Users can create groups"
  ON public.reading_groups FOR INSERT
  WITH CHECK (auth.uid() = leader_id);

-- 멤버 정책
DROP POLICY IF EXISTS "Group members can view members" ON public.group_members;
DROP POLICY IF EXISTS "Group leaders can manage members" ON public.group_members;

CREATE POLICY "Group members can view members"
  ON public.group_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.reading_groups
      WHERE id = group_members.group_id
      AND (leader_id = auth.uid() OR EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = id AND gm.user_id = auth.uid()))
    )
  );

CREATE POLICY "Group leaders can manage members"
  ON public.group_members FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.reading_groups WHERE id = group_members.group_id AND leader_id = auth.uid())
  );
