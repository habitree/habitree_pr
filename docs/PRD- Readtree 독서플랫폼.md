# PRD: Readtree 독서플랫폼

**문서 버전**: 2.2  
**작성일**: 2025년 12월  
**최종 수정일**: 2025년 12월  
**제품명**: Readtree 독서플랫폼 (Readtree by Habitree)

---

## 1. 제품 개요

### 1.1 제품 비전

**"독서 기록이 사라지지 않는 시대: 책을 읽으며 남긴 필사, 사진, 메모, 인상 깊은 문장을 자동으로 정리하고, 언제든 다시 찾고, 쉽게 공유할 수 있는 책 전용 기록·공유 플랫폼"**

### 1.2 Value Proposition

**우리 제품은 독서를 좋아하는 사람들이 인상 깊었던 문장을 카톡·사진·노션에 흩어 저장하다가 나중에 찾지 못하는 문제를 해결한다. 기존 앱들의 단순한 기록 기능보다, 필사·사진·메모가 책별로 자동 정리되고, 문장 단위로 검색 가능하며, 한 번의 클릭으로 SNS에 공유할 수 있는 통합 경험을 제공하여 "기록을 다시 찾고, 정리하고, 공유할 수 있는 경험"을 제공한다.**

### 1.3 핵심 차별화 포인트

1. **기록 자동 정리 (Zero-Effort Logging)**: 필사, 사진, 메모가 해당 책의 노트로 자동 연결
2. **문장 재발견 (Search & Recall)**: 문장 단위 저장으로 책 제목·날짜·주제로 즉시 검색 가능
3. **독서 타임라인 시각화**: 시간순으로 정리된 독서 기록을 한눈에 확인
4. **즉시 공유 (One-Tap Sharing)**: 카드뉴스 형태로 자동 변환하여 SNS에 바로 공유
5. **독서모임 및 커뮤니티**: 독서모임 운영자와 크리에이터를 위한 특별 기능

---

## 2. 목표 및 성공 지표

### 2.1 비즈니스 목표

- **3개월 목표**: MVP 출시 (2026년 1월), 베타 사용자 1,000명 확보
- **6개월 목표**: 월간 활성 사용자(MAU) 5,000명, 기록 재사용률 30% 이상
- **12개월 목표**: 월간 활성 사용자(MAU) 20,000명, 독서모임 100개 이상

### 2.2 제품 성공 지표 (KPI)

#### 핵심 지표
- **활성 사용자 수 (WAU)**: 주간 활성 사용자
- **기록 재사용률 (검색)**: 저장한 기록을 다시 찾는 비율 (목표: 30% 이상)
- **필사·메모 작성수**: 사용자당 평균 기록 수 (목표: 월 10개 이상)
- **타임라인 조회 빈도**: 사용자가 자신의 기록을 확인하는 빈도
- **공유 횟수**: 기록을 공유하는 횟수 (목표: 사용자당 월 5회 이상)
- **독서모임 참여율**: 독서모임 기능 사용률 (목표: 사용자의 20% 이상)

#### 부가 지표
- **7일 리텐션**: 40% 이상
- **30일 리텐션**: 25% 이상
- **평균 세션 시간**: 5분 이상
- **DAU/MAU 비율**: 30% 이상

---

## 3. 타겟 사용자

### 3.1 주요 타겟 (우선순위 1위)

**꾸준히 책을 읽고 기록하려는 개인 독자**

- **인구통계**: 20-40대, 직장인/프리랜서, 월 2-3권 독서
- **라이프스타일**: 출퇴근 시간 독서, 주말 독서, 필사·메모 습관
- **Pain Points**:
  - 기록이 여러 앱(카톡/사진/노션/메모)에 흩어져 있음
  - 저장한 문장을 다시 찾는 데 평균 10분 이상 소요
  - 기록이 책 단위로 정리되지 않음
  - 공유하려면 여러 곳에서 자료를 모아야 함
- **핵심 니즈**:
  - 인상 깊은 문장을 다시 찾고 싶음
  - 기록을 남기고 공유하고 싶은 욕구
  - 자신의 독서 히스토리와 성장을 눈으로 확인하고 싶음

### 3.2 보조 타겟

1. **독서모임 운영자** (우선순위 2위)
   - 구성원들의 읽기 진행 상황·필사·인증 데이터를 한 곳에서 관리
   - 운영 부담 감소, 모임의 질 향상
   - Pain Point: 카톡방, 구글 시트, 노션 등 여러 도구에 분산

2. **북튜버·지식 콘텐츠 크리에이터** (우선순위 3위)
   - 구독자와 함께 읽기 활동 운영
   - 여러 플랫폼에 분산된 소통·기록 통합
   - 커뮤니티 흐름 관리 및 팬덤 형성

---

## 4. 기능 요구사항

### 4.1 기능 우선순위 매트릭스

| 우선순위 | 기능 | 타겟 | MVP 포함 | 설명 |
|---------|------|------|---------|------|
| **P0 (필수)** | 필사/사진/메모 기록 | 전 타겟 | ✅ | 필사 입력, 사진 업로드, OCR, 메모 작성 |
| **P0 (필수)** | 기록 자동 정리 | 전 타겟 | ✅ | 책별 자동 분류, 페이지 순서 정렬 |
| **P0 (필수)** | 문장 단위 검색 | 전 타겟 | ✅ | 책 제목, 날짜, 주제, 필사 유형으로 검색 |
| **P0 (필수)** | 공유 기능 | 전 타겟 | ✅ | 카드뉴스 형태로 SNS 공유 |
| **P0 (필수)** | 독서 타임라인 | 전 타겟 | ✅ | 시간순 기록 시각화 |
| **P1 (높음)** | 독서모임 기능 | 독서모임 운영자 | ✅ | 읽는 책 리스트 공유, 진행 현황, 필사/메모 공유 |
| **P1 (높음)** | 크리에이터 커뮤니티 | 크리에이터 | ⚠️ | 구독자와 함께 읽기 활동, 커뮤니티 형성 |
| **P2 (중간)** | 독서 리포트 | 전 타겟 | ❌ | 주간/월간 독서 리포트, 회고·성장 분석 |
| **P2 (중간)** | 고급 검색 | 전 타겟 | ❌ | AI 기반 의미 검색, 유사 문장 찾기 |
| **P3 (낮음)** | Book Circulation | 전 타겟 | ❌ | 사용자 간 책 대여, 중고책 판매, 책 선물 |

### 4.2 MVP 기능 상세

#### 4.2.1 필사/사진/메모 기록 (P0)

**사용자 스토리**:  
"나는 책을 읽으며 인상 깊은 문장을 필사하거나 사진으로 저장하고, 메모를 남기고 싶다"

**기능 요구사항**:
- 필사 입력 (직접 입력 또는 필사 이미지 OCR 인식)
- 사진 업로드 (책 페이지 사진)
- 텍스트 캡처 (OCR 기능으로 사진에서 텍스트 추출)
- 메모 작성 (책에 대한 생각이나 감상)
- ISBN 검색 또는 책 표지 촬영으로 책 추가
- 모든 기록이 해당 책의 노트로 자동 연결

**수용 기준**:
- 기록 저장 시간 5초 이내
- OCR 정확도 90% 이상
- 책 정보 자동 입력 (ISBN 검색 시)
- 모바일 반응형 지원

#### 4.2.2 기록 자동 정리 (P0)

**사용자 스토리**:  
"나는 여러 곳에 흩어진 기록이 자동으로 책별로 정리되길 원한다"

**기능 요구사항**:
- 필사, 사진, 메모가 해당 책의 노트로 자동 연결
- 페이지 순서대로 자동 정렬
- 책별로 기록 그룹화
- 기존 사진 불러오기 및 자동 분류

**수용 기준**:
- 자동 정리 완료 시간 10초 이내
- 정확도 95% 이상
- 사용자 수동 수정 가능

#### 4.2.3 문장 단위 검색 (P0)

**사용자 스토리**:  
"나는 몇 달 전에 읽은 책의 특정 문장을 검색으로 즉시 찾고 싶다"

**기능 요구사항**:
- 문장 단위로 저장
- 책 제목으로 검색
- 날짜로 검색
- 주제/태그로 검색
- 필사 유형으로 검색
- 전체 텍스트 검색

**수용 기준**:
- 검색 응답 시간 1초 이내
- 검색 정확도 90% 이상
- 검색 결과 관련도 순 정렬

#### 4.2.4 공유 기능 (P0)

**사용자 스토리**:  
"나는 인상 깊은 문장을 한 번의 클릭으로 SNS에 공유하고 싶다"

**기능 요구사항**:
- 인상 깊은 문장 선택
- 카드뉴스 형태로 자동 변환
- 인스타그램, 카카오톡, 블로그 등에 바로 공유
- 다양한 공유 템플릿 제공

**수용 기준**:
- 공유 생성 시간 3초 이내
- 다양한 템플릿 제공 (최소 5개)
- 모바일 최적화

#### 4.2.5 독서 타임라인 (P0)

**사용자 스토리**:  
"나는 내 독서 기록을 시간순으로 한눈에 보고 싶다"

**기능 요구사항**:
- 시간순으로 정리된 독서 기록
- 읽은 책 목록
- 저장한 문장/필사/메모 리스트
- 타임라인 형태 시각화
- PDF/이미지로 내보내기

**수용 기준**:
- 타임라인 로딩 시간 3초 이내
- 모바일 반응형 지원
- 스크롤 최적화

#### 4.2.6 독서모임 기능 (P1)

**사용자 스토리**:  
"나는 독서모임 운영자로서 구성원들의 진행 상황과 필사를 한 곳에서 관리하고 싶다"

**기능 요구사항**:
- 독서모임 생성 및 관리
- 읽는 책 리스트 공유
- 구성원 필사/메모 공유
- 진행 현황 표시 (누가 어디까지 읽었는지)
- 모임 활동 요약 제공
- 모임 대시보드

**수용 기준**:
- 모임 생성 시간 1분 이내
- 실시간 진행 현황 업데이트 (Supabase Realtime 활용)
- 모임 운영자 권한 관리

---

## 5. 사용자 스토리 및 사용자 플로우

### 5.1 주요 사용자 스토리

#### 스토리 1: 첫 기록 작성 및 자동 정리
```
1. 사용자가 앱에 가입한다 (카카오/구글 소셜 로그인)
2. 사용자가 ISBN 검색 또는 책 표지 촬영으로 책을 추가한다
3. 사용자가 필사를 입력하거나 사진을 업로드한다
4. 기록이 해당 책의 노트로 자동 연결되는 것을 확인한다
5. 사용자가 "와, 이렇게 자동으로 정리되다니!"라고 느낀다
```

#### 스토리 2: 문장 검색 및 재발견
```
1. 사용자가 몇 달 전에 읽은 책의 특정 문장을 떠올린다
2. 사용자가 검색 기능으로 문장의 일부를 입력한다
3. 정확히 그 문장을 찾을 수 있다
4. 사용자가 "이 문장이 여기 있었구나! 드디어 찾았다"라고 느낀다
5. 사용자가 찾은 문장을 블로그나 SNS에 활용한다
```

#### 스토리 3: 공유 경험
```
1. 사용자가 인상 깊은 문장을 선택한다
2. 사용자가 공유 버튼을 클릭한다
3. 문장이 카드뉴스 형태로 자동 변환된다
4. 사용자가 인스타그램에 바로 공유한다
5. 많은 좋아요와 댓글을 받으며 만족감을 느낀다
```

#### 스토리 4: 독서모임 운영
```
1. 독서모임 운영자가 모임을 생성한다
2. 구성원들을 초대한다
3. 구성원들이 읽는 책과 필사를 공유한다
4. 운영자가 대시보드에서 진행 상황을 한눈에 파악한다
5. 운영 부담이 줄어들고 모임의 질이 향상된다
```

### 5.2 사용자 플로우 다이어그램

```
[랜딩 페이지]
    ↓
[회원가입/로그인] (카카오/구글)
    ↓
[온보딩: 첫 책 추가] (ISBN 검색 또는 표지 촬영)
    ↓
[메인 대시보드]
    ├─→ [책 추가 및 기록 작성]
    │   ├─→ 필사 입력
    │   ├─→ 사진 업로드
    │   └─→ 메모 작성
    ├─→ [기록 검색] (문장 단위)
    ├─→ [독서 타임라인]
    ├─→ [공유] (카드뉴스 생성)
    └─→ [독서모임]
        ├─→ 모임 생성/참여
        ├─→ 진행 현황 확인
        └─→ 구성원 기록 공유
```

---

## 6. 기술 스택 및 아키텍처

### 6.1 기술 스택

#### Frontend & Backend
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API 또는 Zustand
- **API Routes**: Next.js API Routes (서버 사이드 로직)

#### Database & Storage
- **Authentication**: Supabase Authentication (카카오/구글 소셜 로그인 지원)
- **Database**: Supabase PostgreSQL (관계형 데이터베이스)
- **Storage**: Supabase Storage (이미지 저장)
- **Real-time**: Supabase Realtime (실시간 업데이트)

#### External Services
- **이미지 처리**: OCR (Optical Character Recognition) API
- **책 정보**: 책 정보 API (예: 알라딘, 교보문고, 네이버 도서)
- **AI/LLM**: Google Gemini API (고급 검색, 의미 분석 등)
- **인프라**: Vercel (서버리스 배포 및 호스팅)

### 6.2 시스템 아키텍처

```
┌─────────────────────────────────────────────────┐
│         Next.js Application (Vercel)              │
│  ┌──────────────────────────────────────────┐  │
│  │         Frontend (App Router)            │  │
│  │  ┌──────────┐  ┌──────────┐             │  │
│  │  │  Pages   │  │Components│             │  │
│  │  └──────────┘  └──────────┘             │  │
│  │  ┌──────────┐  ┌──────────┐             │  │
│  │  │   Hooks  │  │  Utils    │             │  │
│  │  └──────────┘  └──────────┘             │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │      Backend (API Routes)                │  │
│  │  /api/books, /api/notes, /api/groups     │  │
│  └──────────────────────────────────────────┘  │
└─────────┬──────────────────┬───────────────────┘
          │                  │
          ▼                  ▼
┌─────────────────┐  ┌──────────────────────┐
│   Supabase      │  │   External Services  │
│  - Auth         │  │  - OCR API           │
│  - PostgreSQL   │  │  - Book API          │
│  - Storage      │  │  - Gemini API (AI)   │
│  - Realtime     │  │                      │
└─────────────────┘  └──────────────────────┘
```

### 6.3 배포 및 인프라

#### 배포 플랫폼
- **호스팅**: Vercel
- **배포 방식**: Git 연동 자동 배포
- **환경 변수 관리**: Vercel 환경 변수 설정
- **도메인**: Vercel 제공 도메인 또는 커스텀 도메인

#### 배포 프로세스
1. GitHub/GitLab 저장소에 코드 푸시
2. Vercel이 자동으로 빌드 및 배포
3. 프리뷰 배포 (Pull Request별)
4. 프로덕션 배포 (메인 브랜치)

### 6.4 데이터베이스 스키마 (Supabase PostgreSQL)

#### users 테이블
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### books 테이블
```sql
CREATE TABLE books (
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
```

#### user_books 테이블 (독서 기록)
```sql
CREATE TABLE user_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('want_to_read', 'reading', 'completed')) DEFAULT 'want_to_read',
  started_at DATE,
  completed_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);
```

#### notes 테이블 (필사/메모/사진)
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
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

-- Full-text search를 위한 인덱스
CREATE INDEX idx_notes_content_search ON notes USING gin(to_tsvector('korean', content));
CREATE INDEX idx_notes_user_book ON notes(user_id, book_id);
```

#### reading_groups 테이블 (독서모임)
```sql
CREATE TABLE reading_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### group_members 테이블 (모임 멤버)
```sql
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES reading_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);
```

#### group_books 테이블 (모임에서 읽는 책)
```sql
CREATE TABLE group_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES reading_groups(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, book_id)
);
```

#### group_activities 테이블 (모임 활동)
```sql
CREATE TABLE group_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES reading_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  note_id UUID REFERENCES notes(id) ON DELETE SET NULL,
  progress INTEGER, -- 읽은 페이지/퍼센트
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Row Level Security (RLS) 정책
```sql
-- 사용자는 자신의 데이터만 조회/수정 가능
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON notes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON notes
  FOR DELETE USING (auth.uid() = user_id);

-- 공개된 노트는 모든 사용자가 조회 가능
CREATE POLICY "Public notes are viewable by everyone" ON notes
  FOR SELECT USING (is_public = true);
```

### 6.5 API 설계

#### Next.js API Routes

**`/api/books/search`** (GET)
- 책 검색
- Query: `q` (검색어), `isbn` (선택)
- Response: 책 목록

**`/api/books`** (POST)
- 책 등록
- Body: `{ isbn, title, author, ... }`
- Response: 등록된 책 정보

**`/api/notes`** (GET, POST, PUT, DELETE)
- 필사/메모/사진 CRUD
- GET: 사용자의 기록 목록 조회 (필터링 지원)
- POST: 기록 생성
- PUT: 기록 수정
- DELETE: 기록 삭제

**`/api/notes/search`** (GET)
- 문장 단위 검색
- Query: `q` (검색어), `bookId`, `date`, `tags`
- Response: 검색 결과
- 참고: Phase 2에서 Gemini API를 활용한 의미 기반 검색 추가 예정

**`/api/notes/share`** (POST)
- 공유 카드뉴스 생성
- Body: `{ noteId, template }`
- Response: 공유 이미지 URL

**`/api/groups`** (GET, POST, PUT, DELETE)
- 독서모임 CRUD
- GET: 사용자의 모임 목록
- POST: 모임 생성
- PUT: 모임 수정
- DELETE: 모임 삭제

**`/api/groups/[groupId]/activities`** (GET)
- 모임 활동 조회
- Response: 구성원들의 진행 상황 및 기록

**`/api/timeline`** (GET)
- 독서 타임라인 조회
- Query: `userId`, `startDate`, `endDate`
- Response: 시간순 기록 목록

**`/api/ai/search`** (POST) - Phase 2
- Gemini API를 활용한 AI 기반 의미 검색
- Body: `{ query, context }`
- Response: 의미 기반 검색 결과

---

## 7. 핵심 기능 상세 설계

### 7.1 기록 자동 정리

**처리 흐름**:
1. 사용자가 필사/사진/메모를 업로드
2. OCR로 텍스트 추출 (사진인 경우)
3. 책 정보와 자동 매칭
4. 페이지 번호 추정 (이미지 분석 또는 사용자 입력)
5. 책별 노트로 자동 분류
6. 페이지 순서대로 정렬

**기술 요구사항**:
- OCR API 연동 (Google Cloud Vision API 또는 Tesseract)
- 이미지 처리 및 최적화
- 책 정보 API 연동

### 7.2 문장 단위 검색

**검색 인덱싱**:
- PostgreSQL Full-Text Search (to_tsvector, to_tsquery 활용)
- 문장 단위로 인덱싱
- 메타데이터 태깅 (책 제목, 날짜, 주제, 필사 유형)
- 필요시 Algolia 또는 Typesense 연동 고려

**검색 기능 (MVP)**:
- 전체 텍스트 검색
- 필터링 (책 제목, 날짜, 주제, 필사 유형)
- 관련도 순 정렬

**고급 검색 (Phase 2)**:
- Gemini API를 활용한 의미 기반 검색
- 유사 문장 찾기 (의미적으로 유사한 문장 검색)
- 자연어 질의 처리 (예: "인생에 대한 깨달음이 담긴 문장")

### 7.3 공유 기능

**카드뉴스 생성**:
- 선택한 문장을 템플릿에 적용
- 다양한 디자인 템플릿 제공
- 이미지 생성 (Canvas API 또는 서버 사이드)
- SNS 공유 링크 생성

**지원 플랫폼**:
- 인스타그램
- 카카오톡
- 블로그 (이미지 다운로드)

---

## 8. UI/UX 요구사항

### 8.1 디자인 원칙

1. **단순성**: 핵심 기능에 집중, 복잡한 UI 지양
2. **명확성**: 정보 구조가 명확하고 직관적
3. **시각화**: 타임라인과 기록을 시각적으로 표현
4. **반응형**: 모바일 우선, 데스크톱 지원

### 8.2 주요 페이지 구조

#### 랜딩 페이지
- 제품 소개
- 주요 기능 하이라이트
- 회원가입/로그인 CTA

#### 메인 대시보드
- 독서 타임라인 요약
- 최근 기록 목록
- 빠른 액션 (책 추가, 기록 작성, 검색)

#### 책 상세 페이지
- 책 정보
- 기록 목록 (필사/사진/메모)
- 페이지별 정렬
- 기록 추가 버튼

#### 검색 페이지
- 검색 바
- 필터 옵션 (책, 날짜, 주제, 유형)
- 검색 결과 목록
- 문장 단위 표시

#### 공유 페이지
- 문장 선택
- 템플릿 선택
- 미리보기
- 공유 버튼

#### 독서모임 페이지
- 모임 목록
- 모임 상세 (진행 현황, 구성원 기록)
- 모임 생성/관리

---

## 9. MVP 범위 및 릴리스 계획

### 9.1 MVP 범위 (Phase 1)

**목표**: 핵심 가치 검증 - "기록을 다시 찾고, 정리하고, 공유할 수 있는 경험"

**포함 기능**:
- ✅ 사용자 인증 (Supabase Auth - 카카오/구글 소셜 로그인)
- ✅ 책 검색 및 등록 (ISBN 검색, 표지 촬영)
- ✅ 필사/사진/메모 기록 작성
- ✅ 기록 자동 정리 (책별 분류)
- ✅ 문장 단위 검색 (PostgreSQL Full-Text Search)
- ✅ 공유 기능 (카드뉴스 생성)
- ✅ 독서 타임라인
- ✅ 독서모임 기본 기능 (생성, 참여, 진행 현황)
- ✅ Vercel 배포 및 호스팅

**제외 기능**:
- ❌ 크리에이터 커뮤니티 고급 기능
- ❌ 독서 리포트 (주간/월간)
- ❌ 고급 검색 (AI 기반 의미 검색)
- ❌ Book Circulation (대여/판매/선물)

**기간**: 10-12주

### 9.2 Phase 2 (MVP 이후)

**목표**: 사용자 참여도 향상 및 커뮤니티 강화

**추가 기능**:
- 독서 리포트 (주간/월간) - Gemini API를 활용한 인사이트 생성
- 크리에이터 커뮤니티 고급 기능
- 고급 검색 기능 (Gemini API 기반 의미 검색, 유사 문장 찾기)
- 공유 템플릿 확장
- AI 기반 독서 추천 (Gemini API 활용)

**기간**: 8-10주

### 9.3 Phase 3 (장기)

**목표**: 고급 기능 및 수익화

**추가 기능**:
- Book Circulation (사용자 간 책 대여, 중고책 판매, 책 선물)
- AI 기반 독서 분석 및 인사이트 (Gemini API 활용한 심화 분석)
- 프리미엄 기능 (고급 템플릿, 무제한 저장, 우선 지원 등)
- 유료 구독 모델
- AI 기반 독서 코치 (Gemini API를 활용한 개인화된 독서 가이드)

---

## 10. 성공 지표 및 측정 방법

### 10.1 핵심 지표

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| 활성 사용자 수 (WAU) | 주간 활성 사용자 | Supabase 사용자 로그 분석 |
| 기록 재사용률 (검색) | 30% 이상 | 검색 이벤트 / 총 기록 수 |
| 필사·메모 작성수 | 월 10개 이상 | notes 테이블 집계 |
| 타임라인 조회 빈도 | 주 2회 이상 | 타임라인 페이지 조회 이벤트 |
| 공유 횟수 | 월 5회 이상 | 공유 이벤트 추적 |
| 독서모임 참여율 | 20% 이상 | group_members 참여 사용자 / 전체 사용자 |

### 10.2 분석 도구

- **Vercel Analytics**: 기본 사용자 행동 분석 (페이지뷰, 성능 지표)
- **Supabase Analytics**: 데이터베이스 쿼리 성능 모니터링
- **Custom Event Tracking**: 주요 기능 사용 추적 (Next.js API Routes 활용)
- **User Feedback**: 인앱 피드백 수집

---

## 11. 리스크 및 대응 방안

### 11.1 기술적 리스크

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|----------|
| OCR 정확도 낮음 | 높음 | 여러 OCR API 비교, 사용자 수정 기능 제공 |
| PostgreSQL 성능 이슈 | 중간 | 인덱싱 최적화, 쿼리 최적화, 연결 풀링, 캐싱 |
| 이미지 저장 비용 증가 | 중간 | 이미지 압축, CDN 활용, 사용량 모니터링 |
| Supabase 연결 제한 | 중간 | 연결 풀 최적화, 필요시 플랜 업그레이드 |
| Vercel 배포 제한사항 | 중간 | Vercel 플랜 모니터링, 필요시 업그레이드, 함수 실행 시간 최적화 |
| Next.js 빌드 시간 증가 | 낮음 | 코드 스플리팅, 동적 임포트 활용, 빌드 캐싱 |
| Gemini API 비용 증가 | 중간 | API 호출 최적화, 캐싱 전략, 사용량 모니터링 |

### 11.2 제품 리스크

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|----------|
| 자동화 품질 낮음 | 높음 | 사용자 피드백 수집, 지속적 개선 |
| 재방문 동기 부족 | 높음 | 타임라인 강화, 독서 리포트 제공, 알림 기능 |
| 공유 기능의 매력 부족 | 중간 | 공유 템플릿 지속 개선, 사용자 피드백 반영 |
| UI/UX 복잡성 | 중간 | 사용성 테스트, 단순화, 온보딩 강화 |

---

## 12. 부록

### 12.1 용어 정의

- **필사**: 책에서 인상 깊은 문장을 직접 입력하거나 이미지로 저장한 기록
- **문장 단위 검색**: 저장된 문장을 키워드로 검색하여 찾는 기능
- **독서 타임라인**: 시간순으로 정리된 독서 기록 시각화
- **독서모임**: 여러 사용자가 함께 책을 읽고 기록을 공유하는 그룹

### 12.2 참고 자료

- Working Backwards 문서: `01-Customer-Definition.md`, `02-Press-Release.md`, `03-FAQ.md`
- Customer Experience: `04-Customer-Experience.md`
- Problem Statement: `05-Problem-Statement.md`

---

**문서 승인**

| 역할 | 이름 | 날짜 | 서명 |
|------|------|------|------|
| 제품 관리자 | | | |
| 기술 리더 | | | |
| 디자인 리더 | | | |

---

© 2025 Readtree by Habitree. 모든 권리 보유

