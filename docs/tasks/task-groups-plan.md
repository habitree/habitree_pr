# Task 6: 독서모임 API 개발 계획

**작업 번호**: Task 6  
**우선순위**: P1  
**예상 소요 시간**: 2일  
**담당 영역**: 독서모임 생성, 관리, 실시간 활동 공유

---

## 1. 작업 개요

독서모임을 생성하고, 멤버를 초대하며, 모임 내에서 책과 기록을 공유하는 기능을 구현합니다. Supabase Realtime을 사용하여 실시간 업데이트를 지원합니다.

### 1.1 목표

- ✅ 모임 CRUD
- ✅ 멤버 초대 및 관리
- ✅ 모임 내 책 공유
- ✅ 실시간 활동 업데이트
- ✅ 진행 현황 조회

### 1.2 의존성

- **선행 작업**: Task 1 (인증), Task 2 (책 관리), Task 3 (노트 관리)
- **후속 작업**: 없음

---

## 2. 프론트엔드 연동 페이지

| 페이지 경로 | 파일 위치 | 주요 기능 |
|------------|----------|----------|
| 모임 목록 | `/app/(main)/groups/page.tsx` | 내 모임 목록 |
| 모임 상세 | `/app/(main)/groups/[id]/page.tsx` | 모임 상세, 활동, 멤버 |

---

## 3. 구현 상세

### 3.1 Database 스키마

**파일**: `supabase/migrations/005_create_groups.sql`

```sql
-- reading_groups 테이블
CREATE TABLE reading_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reading_groups_leader_id ON reading_groups(leader_id);

-- group_members 테이블
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES reading_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);

-- group_books 테이블
CREATE TABLE group_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES reading_groups(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, book_id)
);

CREATE INDEX idx_group_books_group_id ON group_books(group_id);

-- group_activities 테이블
CREATE TABLE group_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES reading_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  note_id UUID REFERENCES notes(id) ON DELETE SET NULL,
  progress INTEGER CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_group_activities_group_id ON group_activities(group_id);
CREATE INDEX idx_group_activities_created_at ON group_activities(created_at DESC);

-- RLS 정책
ALTER TABLE reading_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_activities ENABLE ROW LEVEL SECURITY;

-- 모임 리더와 멤버는 모임 조회 가능
CREATE POLICY "Group members can view groups"
  ON reading_groups FOR SELECT
  USING (
    auth.uid() = leader_id OR
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = reading_groups.id
      AND group_members.user_id = auth.uid()
    )
  );

-- 리더만 모임 수정/삭제 가능
CREATE POLICY "Group leaders can update groups"
  ON reading_groups FOR UPDATE
  USING (auth.uid() = leader_id);

CREATE POLICY "Group leaders can delete groups"
  ON reading_groups FOR DELETE
  USING (auth.uid() = leader_id);

-- 모임 생성
CREATE POLICY "Users can create groups"
  ON reading_groups FOR INSERT
  WITH CHECK (auth.uid() = leader_id);

-- 멤버 정책
CREATE POLICY "Group members can view members"
  ON group_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reading_groups
      WHERE reading_groups.id = group_members.group_id
      AND (reading_groups.leader_id = auth.uid() OR
           EXISTS (SELECT 1 FROM group_members gm
                   WHERE gm.group_id = reading_groups.id
                   AND gm.user_id = auth.uid()))
    )
  );

-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE group_activities;
```

### 3.2 API Routes 구현

**파일**: `app/api/groups/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, description } = body

  try {
    const { data, error } = await supabase
      .from('reading_groups')
      .insert({
        name,
        description,
        leader_id: user.id,
      })
      .select()
      .single()

    if (error) throw error

    // 리더를 멤버로 자동 추가
    await supabase
      .from('group_members')
      .insert({
        group_id: data.id,
        user_id: user.id,
      })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Create group error:', error)
    return NextResponse.json(
      { error: 'Failed to create group' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        id,
        joined_at,
        group:reading_groups(*)
      `)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Get groups error:', error)
    return NextResponse.json(
      { error: 'Failed to get groups' },
      { status: 500 }
    )
  }
}
```

**파일**: `app/api/groups/[id]/activities/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 멤버 여부 확인
    const { data: member } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!member) {
      return NextResponse.json(
        { error: 'Not a group member' },
        { status: 403 }
      )
    }

    // 활동 조회
    const { data, error } = await supabase
      .from('group_activities')
      .select(`
        *,
        user:users(id, name, avatar_url),
        book:books(*),
        note:notes(*)
      `)
      .eq('group_id', params.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Get group activities error:', error)
    return NextResponse.json(
      { error: 'Failed to get group activities' },
      { status: 500 }
    )
  }
}
```

### 3.3 Realtime 설정 (클라이언트 측)

**파일**: `hooks/useGroupActivities.ts`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useGroupActivities(groupId: string) {
  const [activities, setActivities] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    let channel: RealtimeChannel

    const fetchInitialActivities = async () => {
      const { data } = await supabase
        .from('group_activities')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false })

      if (data) {
        setActivities(data)
      }
    }

    const setupRealtimeSubscription = () => {
      channel = supabase
        .channel(`group_${groupId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'group_activities',
            filter: `group_id=eq.${groupId}`,
          },
          (payload) => {
            setActivities((prev) => [payload.new, ...prev])
          }
        )
        .subscribe()
    }

    fetchInitialActivities()
    setupRealtimeSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [groupId])

  return activities
}
```

---

## 4. 완료 기준

- ✅ 모임 생성/수정/삭제
- ✅ 멤버 초대 및 관리
- ✅ 실시간 활동 업데이트 (Realtime)
- ✅ 진행 현황 조회
- ✅ RLS 정책 적용
- ✅ TypeScript 타입 에러 없음

---

**작성일**: 2025년 12월  
**버전**: 1.0
