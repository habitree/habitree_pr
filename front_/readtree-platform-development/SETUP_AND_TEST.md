# Readtree 백엔드 설정 및 테스트 가이드

## 1단계: Supabase 마이그레이션 적용

### 마이그레이션 순서 (필수)

다음 순서대로 Supabase SQL Editor에서 실행하세요:

1. **001_create_users.sql** ✅ (이미 적용됨)
2. **002_create_books.sql** - 책 테이블
3. **003_create_notes.sql** - 노트 테이블
4. **004_create_search_function.sql** - 검색 함수
5. **005_create_groups.sql** - 독서모임 테이블

### 적용 방법

```
1. https://supabase.com/dashboard/project/zlxawujdhtlnzadvquqc/sql/new
2. 각 마이그레이션 파일 복사
3. SQL Editor에 붙여넣기
4. Run 버튼 클릭
5. 성공 메시지 확인
```

---

## 2단계: Supabase Storage 설정

### notes-images 버킷 생성

```
1. Supabase Dashboard > Storage 메뉴
2. "New bucket" 클릭
3. 설정:
   - Name: notes-images
   - Public bucket: OFF (비공개)
   - File size limit: 10MB
   - Allowed MIME types: image/jpeg, image/png, image/webp
4. Create bucket
```

### RLS 정책 확인

Storage > notes-images > Policies에서 다음 정책이 자동 생성되었는지 확인:
- Users can upload to own folder
- Users can view own images

---

## 3단계: API 테스트

### Thunder Client 또는 Postman 사용

#### 1. 회원가입 테스트

```http
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123",
  "name": "테스트 사용자"
}
```

#### 2. 로그인 테스트

```http
POST http://localhost:3000/api/auth/login/email
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**⚠️ 중요**: 응답의 세션 쿠키를 저장하여 다음 요청에 사용

#### 3. 책 검색 테스트

```http
GET http://localhost:3000/api/books/search?q=데미안
Cookie: [로그인 세션 쿠키]
```

#### 4. 책 등록 테스트

```http
POST http://localhost:3000/api/books
Content-Type: application/json
Cookie: [로그인 세션 쿠키]

{
  "isbn": "9788932473901",
  "title": "데미안",
  "author": "헤르만 헤세",
  "publisher": "민음사",
  "status": "reading"
}
```

#### 5. 노트 생성 테스트

```http
POST http://localhost:3000/api/notes
Content-Type: application/json
Cookie: [로그인 세션 쿠키]

{
  "book_id": "[책 ID]",
  "type": "quote",
  "content": "새는 알에서 나오려고 투쟁한다",
  "page_number": 120,
  "tags": ["명언", "성장"]
}
```

#### 6. 검색 테스트

```http
GET http://localhost:3000/api/search?q=투쟁
Cookie: [로그인 세션 쿠키]
```

#### 7. 타임라인 테스트

```http
GET http://localhost:3000/api/timeline?view=day
Cookie: [로그인 세션 쿠키]
```

---

## 4단계: 브라우저 테스트

### 개발 서버 실행

```bash
npm run dev
```

### 테스트 시나리오

1. **http://localhost:3000** 접속
2. "무료로 시작하기" 버튼 클릭
3. 회원가입 페이지에서 계정 생성
4. 로그인 후 대시보드 확인
5. 책 검색 및 등록
6. 노트 작성
7. 검색 기능 테스트
8. 타임라인 확인

---

## 5단계: 환경 변수 확인

### .env.local 파일

```env
# 필수
NEXT_PUBLIC_SUPABASE_URL=https://zlxawujdhtlnzadvquqc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 선택 (없어도 목 데이터로 동작)
ALADIN_API_KEY=ttb키값
GOOGLE_CLOUD_VISION_API_KEY=구글API키
```

---

## 6단계: 에러 확인 및 디버깅

### 일반적인 에러

#### 1. "Unauthorized" 에러
- 원인: 로그인되지 않음
- 해결: 로그인 후 세션 쿠키 확인

#### 2. "Book not found"
- 원인: book_id가 잘못되었거나 사용자의 책이 아님
- 해결: GET /api/books로 내 책 목록 확인

#### 3. "RLS policy violation"
- 원인: Row Level Security 정책 문제
- 해결: Supabase Dashboard > Authentication > Users에서 사용자 확인

#### 4. Storage 업로드 실패
- 원인: notes-images 버킷이 없거나 RLS 정책 미설정
- 해결: 2단계 Storage 설정 재확인

### 로그 확인

```bash
# 개발 서버 콘솔에서 에러 확인
npm run dev

# Supabase 로그
Supabase Dashboard > Logs > API
```

---

## 다음 단계

1. ✅ 백엔드 API 완성
2. ⬜ 마이그레이션 적용 (002-005)
3. ⬜ Storage 버킷 생성
4. ⬜ API 테스트
5. ⬜ 프론트엔드-백엔드 연동
6. ⬜ OAuth 설정 (카카오/구글)
7. ⬜ 배포 (Vercel)

---

**작성일**: 2025년 12월 22일
