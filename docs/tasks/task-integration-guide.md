# Readtree 백엔드 개발 통합 가이드

**문서 버전**: 1.0  
**작성일**: 2025년 12월  
**프로젝트**: Readtree 독서플랫폼

---

## 1. 개요

이 문서는 Readtree 플랫폼의 백엔드 개발을 병렬로 수행하기 위한 작업 분리 및 통합 가이드입니다. 각 작업은 독립적으로 수행 가능하며, 완료 후 매끄럽게 통합할 수 있도록 설계되었습니다.

### 1.1 전제 조건

- **프론트엔드**: Next.js 16 기반으로 이미 구현 완료
- **데이터베이스**: Supabase PostgreSQL 사용
- **인증**: Supabase Auth 사용
- **배포**: Vercel

### 1.2 백엔드 기술 스택

- **Runtime**: Node.js 20+
- **Framework**: Next.js API Routes
- **Language**: TypeScript
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **External APIs**: OCR API, 책 정보 API, Gemini API

---

## 2. 작업 단위 분류

백엔드 개발은 **8개의 독립적인 작업 단위**로 분리되었습니다:

| 작업 번호 | 작업명 | 우선순위 | 예상 소요 | 의존성 |
|---------|--------|----------|-----------|--------|
| Task 1 | 인증 시스템 구축 | P0 (최우선) | 1일 | 없음 |
| Task 2 | 책 관리 API 개발 | P0 | 2일 | Task 1 |
| Task 3 | 노트 관리 API 개발 | P0 | 2일 | Task 1, Task 2 |
| Task 4 | 검색 API 개발 | P1 | 1.5일 | Task 3 |
| Task 5 | 타임라인 API 개발 | P1 | 1일 | Task 2, Task 3 |
| Task 6 | 독서모임 API 개발 | P1 | 2일 | Task 1, Task 2, Task 3 |
| Task 7 | 파일 업로드 및 OCR | P0 | 1.5일 | Task 1 |
| Task 8 | 공유 기능 API 개발 | P2 | 1일 | Task 3, Task 7 |

### 2.1 병렬 수행 가능한 작업 그룹

**Phase 1 (병렬 가능):**
- Task 1: 인증 시스템 구축 ✅

**Phase 2 (Task 1 완료 후 병렬 가능):**
- Task 2: 책 관리 API 개발
- Task 7: 파일 업로드 및 OCR

**Phase 3 (Task 2 완료 후 병렬 가능):**
- Task 3: 노트 관리 API 개발
- Task 5: 타임라인 API 개발 (일부)

**Phase 4 (Task 3 완료 후 병렬 가능):**
- Task 4: 검색 API 개발
- Task 5: 타임라인 API 개발 (완료)
- Task 6: 독서모임 API 개발
- Task 8: 공유 기능 API 개발

---

## 3. 작업별 상세 정보

### Task 1: 인증 시스템 구축

**문서**: [task-auth-plan.md](./task-auth-plan.md)

**목적**: Supabase Auth를 사용한 사용자 인증 시스템 구축

**주요 작업**:
- Supabase 프로젝트 설정
- 환경 변수 구성
- Auth 미들웨어 구현
- 로그인/회원가입 API Routes 구현

**프론트엔드 연동**:
- `/app/auth/login/page.tsx`
- `/app/auth/signup/page.tsx`
- `/app/auth/reset-password/page.tsx`

**완료 기준**:
- ✅ 카카오/구글 소셜 로그인 가능
- ✅ 이메일/비밀번호 로그인 가능
- ✅ 사용자 세션 관리 정상 동작
- ✅ 보호된 라우트 미들웨어 동작

---

### Task 2: 책 관리 API 개발

**문서**: [task-books-plan.md](./task-books-plan.md)

**목적**: 책 검색, 등록, 수정, 삭제 기능 구현

**주요 작업**:
- 외부 책 정보 API 연동 (알라딘, 네이버)
- 책 CRUD API Routes 구현
- Database 스키마 생성 (books, user_books)

**프론트엔드 연동**:
- `/app/(main)/books/page.tsx`
- `/app/(main)/books/new/page.tsx`
- `/app/(main)/books/[id]/page.tsx`

**API 엔드포인트**:
- `GET /api/books/search` - 책 검색
- `POST /api/books` - 책 등록
- `GET /api/books` - 내 책 목록
- `GET /api/books/[id]` - 책 상세
- `PUT /api/books/[id]` - 책 수정
- `DELETE /api/books/[id]` - 책 삭제

**완료 기준**:
- ✅ ISBN/제목/저자로 책 검색 가능
- ✅ 책 등록/수정/삭제 정상 동작
- ✅ 독서 상태 관리 (읽고 싶은, 읽는 중, 완료)
- ✅ RLS 정책 적용

---

### Task 3: 노트 관리 API 개발

**문서**: [task-notes-plan.md](./task-notes-plan.md)

**목적**: 필사, 사진, 메모 CRUD 기능 구현

**주요 작업**:
- 노트 CRUD API Routes 구현
- Database 스키마 생성 (notes)
- 태그 및 공개/비공개 기능

**프론트엔드 연동**:
- `/app/(main)/notes/page.tsx`
- `/app/(main)/notes/new/page.tsx`
- `/app/(main)/notes/[id]/page.tsx`

**API 엔드포인트**:
- `POST /api/notes` - 노트 생성
- `GET /api/notes` - 노트 목록
- `GET /api/notes/[id]` - 노트 상세
- `PUT /api/notes/[id]` - 노트 수정
- `DELETE /api/notes/[id]` - 노트 삭제

**완료 기준**:
- ✅ 필사/사진/메모 타입별 저장 가능
- ✅ 책과 자동 연결
- ✅ 페이지 번호 및 태그 관리
- ✅ RLS 정책 적용

---

### Task 4: 검색 API 개발

**문서**: [task-search-plan.md](./task-search-plan.md)

**목적**: PostgreSQL Full-Text Search를 사용한 노트 검색 기능

**주요 작업**:
- Full-Text Search 인덱스 설정
- 검색 API Routes 구현
- 필터링 및 정렬 기능

**프론트엔드 연동**:
- `/app/(main)/search/page.tsx`

**API 엔드포인트**:
- `GET /api/search` - 노트 검색
- `GET /api/search/suggestions` - 자동완성

**완료 기준**:
- ✅ 문장 단위 검색 가능
- ✅ 책/날짜/태그별 필터링
- ✅ 하이라이트 표시
- ✅ 검색 응답 시간 1초 이내

---

### Task 5: 타임라인 API 개발

**문서**: [task-timeline-plan.md](./task-timeline-plan.md)

**목적**: 독서 활동 타임라인 조회 기능

**주요 작업**:
- 타임라인 API Routes 구현
- 날짜별/월별 집계 기능

**프론트엔드 연동**:
- `/app/(main)/timeline/page.tsx`

**API 엔드포인트**:
- `GET /api/timeline` - 타임라인 조회
- `GET /api/timeline/stats` - 통계

**완료 기준**:
- ✅ 시간순 활동 조회
- ✅ 일/주/월 뷰 지원
- ✅ 활동 집계 (책 추가, 노트 작성 등)

---

### Task 6: 독서모임 API 개발

**문서**: [task-groups-plan.md](./task-groups-plan.md)

**목적**: 독서모임 생성, 관리, 활동 공유 기능

**주요 작업**:
- 모임 CRUD API Routes 구현
- Supabase Realtime 설정
- Database 스키마 생성 (reading_groups, group_members, group_activities)

**프론트엔드 연동**:
- `/app/(main)/groups/page.tsx`
- `/app/(main)/groups/[id]/page.tsx`

**API 엔드포인트**:
- `POST /api/groups` - 모임 생성
- `GET /api/groups` - 내 모임 목록
- `GET /api/groups/[id]` - 모임 상세
- `POST /api/groups/[id]/members` - 멤버 초대
- `GET /api/groups/[id]/activities` - 모임 활동

**완료 기준**:
- ✅ 모임 생성/수정/삭제
- ✅ 멤버 초대 및 관리
- ✅ 실시간 활동 업데이트 (Realtime)
- ✅ 진행 현황 조회

---

### Task 7: 파일 업로드 및 OCR

**문서**: [task-upload-ocr-plan.md](./task-upload-ocr-plan.md)

**목적**: 이미지 업로드 및 OCR 텍스트 추출 기능

**주요 작업**:
- Supabase Storage 버킷 설정
- 이미지 업로드 API Routes 구현
- OCR API 연동 (Google Cloud Vision)

**프론트엔드 연동**:
- `/app/(main)/notes/new/page.tsx` (이미지 업로드)

**API 엔드포인트**:
- `POST /api/upload` - 이미지 업로드
- `POST /api/ocr` - OCR 처리

**완료 기준**:
- ✅ 이미지 업로드 (최대 10MB)
- ✅ Supabase Storage 저장
- ✅ OCR 텍스트 추출 (정확도 90% 이상)
- ✅ 사용자 편집 가능한 결과 반환

---

### Task 8: 공유 기능 API 개발

**문서**: [task-share-plan.md](./task-share-plan.md)

**목적**: 노트를 카드뉴스 형태로 변환하여 공유하는 기능

**주요 작업**:
- 카드뉴스 생성 API Routes 구현
- Canvas를 사용한 이미지 생성
- SNS 공유 링크 생성

**프론트엔드 연동**:
- `/app/(main)/notes/[id]/page.tsx` (공유 버튼)

**API 엔드포인트**:
- `POST /api/share` - 카드뉴스 생성
- `GET /api/share/templates` - 템플릿 목록

**완료 기준**:
- ✅ 다양한 템플릿 지원
- ✅ 이미지 생성 (3초 이내)
- ✅ SNS 공유 링크 생성
- ✅ 미리보기 기능

---

## 4. 통합 프로세스

### 4.1 코드 병합 전 체크리스트

각 작업 완료 후 다음을 확인합니다:

- [ ] TypeScript 타입 에러 없음
- [ ] ESLint 경고/에러 없음
- [ ] API 엔드포인트 테스트 완료
- [ ] RLS 정책 적용 확인
- [ ] 환경 변수 문서화
- [ ] README 업데이트

### 4.2 통합 순서

1. **Task 1 (인증)** → main 브랜치에 병합
2. **Task 2, Task 7** → 병렬 개발 후 순차 병합
3. **Task 3, Task 5** → 병렬 개발 후 순차 병합
4. **Task 4, Task 6, Task 8** → 병렬 개발 후 순차 병합

### 4.3 충돌 방지 규칙

1. **API Routes 경로 분리**: 각 작업은 독립된 API 경로 사용
2. **Database 마이그레이션**: 각 작업별로 독립된 마이그레이션 파일 생성
3. **Type 정의**: `types/` 디렉토리에 각 도메인별로 분리된 타입 파일 사용
4. **환경 변수**: 각 작업에서 필요한 환경 변수를 문서화하고 `.env.example` 업데이트

---

## 5. 각 작업별 개발 프롬프트

### Task 1: 인증 시스템 구축

```
@[docs/PRD- Readtree 독서플랫폼.md]
@[docs/user_stories.md]
@[docs/software_design.md]
@[docs/tasks/task-auth-plan.md]

Readtree 플랫폼의 인증 시스템을 구축해주세요.

**필수 참고 문서:**
- PRD: 인증 요구사항 및 소셜 로그인 명세
- User Stories: US-001 ~ US-008 (인증 관련)
- Software Design: 1.3 Database & Storage, 2.3 인증 흐름도
- Task Plan: task-auth-plan.md

**구현 범위:**
1. Supabase 프로젝트 생성 및 설정
2. 카카오/구글 OAuth 설정
3. `/api/auth/*` API Routes 구현
4. Auth 미들웨어 구현
5. 프론트엔드 연동 테스트

**중요사항:**
- 환경 변수를 .env.example에 문서화
- RLS 정책 적용
- 타입 정의를 types/auth.ts에 작성
```

### Task 2: 책 관리 API 개발

```
@[docs/PRD- Readtree 독서플랫폼.md]
@[docs/user_stories.md]
@[docs/software_design.md]
@[docs/tasks/task-books-plan.md]

Readtree 플랫폼의 책 관리 API를 개발해주세요.

**필수 참고 문서:**
- PRD: 4.2.1 ~ 4.2.6 (책 검색 및 등록 기능)
- User Stories: US-009 ~ US-014 (책 관련)
- Software Design: 3.2.2, 3.2.3 (books, user_books 테이블)
- Task Plan: task-books-plan.md

**구현 범위:**
1. 외부 책 정보 API 연동 (알라딘 또는 네이버)
2. `/api/books/*` API Routes 구현
3. Database 스키마 생성 및 마이그레이션
4. RLS 정책 설정
5. 프론트엔드 연동 (/app/(main)/books/*)

**중요사항:**
- Task 1 (인증) 완료 후 시작
- 타입 정의를 types/book.ts에 작성
- ISBN 검색 및 제목/저자 검색 모두 지원
```

### Task 3: 노트 관리 API 개발

```
@[docs/PRD- Readtree 독서플랫폼.md]
@[docs/user_stories.md]
@[docs/software_design.md]
@[docs/tasks/task-notes-plan.md]

Readtree 플랫폼의 노트 관리 API를 개발해주세요.

**필수 참고 문서:**
- PRD: 4.2.1 ~ 4.2.6 (필사/사진/메모 기능)
- User Stories: US-015 ~ US-023 (노트 관련)
- Software Design: 3.2.4 (notes 테이블)
- Task Plan: task-notes-plan.md

**구현 범위:**
1. `/api/notes/*` API Routes 구현
2. Database 스키마 생성 (notes 테이블)
3. 필사/사진/메모 타입별 처리
4. 태그 및 공개/비공개 기능
5. 프론트엔드 연동 (/app/(main)/notes/*)

**중요사항:**
- Task 1, Task 2 완료 후 시작
- 타입 정의를 types/note.ts에 작성
- 책과 자동 연결 로직 구현
```

### Task 4: 검색 API 개발

```
@[docs/PRD- Readtree 독서플랫폼.md]
@[docs/user_stories.md]
@[docs/software_design.md]
@[docs/tasks/task-search-plan.md]

Readtree 플랫폼의 검색 API를 개발해주세요.

**필수 참고 문서:**
- PRD: 4.2.3 (문장 단위 검색)
- Software Design: 7.2 (문장 단위 검색), 3.2.4 (Full-Text Search 인덱스)
- Task Plan: task-search-plan.md

**구현 범위:**
1. PostgreSQL Full-Text Search 설정
2. `/api/search` API Routes 구현
3. 필터링 및 정렬 기능
4. 검색 결과 하이라이트
5. 프론트엔드 연동 (/app/(main)/search/*)

**중요사항:**
- Task 3 완료 후 시작
- 한국어 Full-Text Search 설정
- 검색 응답 시간 1초 이내 최적화
```

### Task 5: 타임라인 API 개발

```
@[docs/PRD- Readtree 독서플랫폼.md]
@[docs/user_stories.md]
@[docs/software_design.md]
@[docs/tasks/task-timeline-plan.md]

Readtree 플랫폼의 타임라인 API를 개발해주세요.

**필수 참고 문서:**
- PRD: 4.2.5 (독서 타임라인)
- Software Design: 7.5 (타임라인 API)
- Task Plan: task-timeline-plan.md

**구현 범위:**
1. `/api/timeline` API Routes 구현
2. 날짜별/월별 집계 로직
3. 일/주/월 뷰 지원
4. 프론트엔드 연동 (/app/(main)/timeline/*)

**중요사항:**
- Task 2, Task 3 완료 후 시작
- 효율적인 쿼리 최적화 (인덱스 활용)
```

### Task 6: 독서모임 API 개발

```
@[docs/PRD- Readtree 독서플랫폼.md]
@[docs/user_stories.md]
@[docs/software_design.md]
@[docs/tasks/task-groups-plan.md]

Readtree 플랫폼의 독서모임 API를 개발해주세요.

**필수 참고 문서:**
- PRD: 4.2.6 (독서모임 기능)
- Software Design: 3.2.7 ~ 3.2.10 (독서모임 테이블)
- Task Plan: task-groups-plan.md

**구현 범위:**
1. `/api/groups/*` API Routes 구현
2. Database 스키마 생성 (reading_groups 등)
3. Supabase Realtime 설정
4. 멤버 관리 및 권한 제어
5. 프론트엔드 연동 (/app/(main)/groups/*)

**중요사항:**
- Task 1, Task 2, Task 3 완료 후 시작
- Realtime 기능으로 실시간 업데이트 지원
```

### Task 7: 파일 업로드 및 OCR

```
@[docs/PRD- Readtree 독서플랫폼.md]
@[docs/user_stories.md]
@[docs/software_design.md]
@[docs/tasks/task-upload-ocr-plan.md]

Readtree 플랫폼의 파일 업로드 및 OCR 기능을 개발해주세요.

**필수 참고 문서:**
- PRD: 4.2.1 (이미지 업로드 및 OCR)
- User Stories: US-016 (이미지 업로드 및 OCR)
- Software Design: 7.1 (기록 자동 정리)
- Task Plan: task-upload-ocr-plan.md

**구현 범위:**
1. Supabase Storage 버킷 설정
2. `/api/upload` API Routes 구현
3. OCR API 연동 (Google Cloud Vision)
4. 이미지 최적화 및 압축
5. 프론트엔드 연동 (노트 작성 페이지)

**중요사항:**
- Task 1 완료 후 시작 (독립적으로 개발 가능)
- 이미지 최대 10MB 제한
- OCR 정확도 90% 이상 목표
```

### Task 8: 공유 기능 API 개발

```
@[docs/PRD- Readtree 독서플랫폼.md]
@[docs/user_stories.md]
@[docs/software_design.md]
@[docs/tasks/task-share-plan.md]

Readtree 플랫폼의 공유 기능 API를 개발해주세요.

**필수 참고 문서:**
- PRD: 4.2.4 (공유 기능)
- Software Design: 7.3 (공유 기능)
- Task Plan: task-share-plan.md

**구현 범위:**
1. `/api/share` API Routes 구현
2. Canvas를 사용한 카드뉴스 생성
3. 다양한 템플릿 지원
4. SNS 공유 링크 생성
5. 프론트엔드 연동 (노트 상세 페이지)

**중요사항:**
- Task 3, Task 7 완료 후 시작
- 이미지 생성 시간 3초 이내
- 최소 5개 이상의 템플릿 제공
```

---

## 6. 환경 설정

### 6.1 공통 환경 변수

모든 작업에서 필요한 환경 변수:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 6.2 작업별 추가 환경 변수

**Task 2 (책 관리):**
```env
ALADIN_API_KEY=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
```

**Task 7 (OCR):**
```env
GOOGLE_CLOUD_VISION_API_KEY=
```

**Task 8 (공유 - Phase 2):**
```env
GEMINI_API_KEY=
```

---

## 7. 테스트 전략

각 작업 완료 시 다음 테스트를 수행합니다:

1. **단위 테스트**: API Routes 개별 기능 테스트
2. **통합 테스트**: 프론트엔드와의 연동 테스트
3. **성능 테스트**: 응답 시간 측정
4. **보안 테스트**: RLS 정책 및 권한 확인

---

## 8. 문의 및 지원

작업 중 문제 발생 시:
1. 해당 task-plan 문서 재확인
2. PRD 및 User Stories 재검토
3. Software Design 아키텍처 다이어그램 참고

---

**문서 작성일**: 2025년 12월  
**최종 업데이트**: 2025년 12월  
**버전**: 1.0
