# Readtree API 문서

자동 생성된 API 엔드포인트 목록입니다.

## 기본 정보

- **Base URL**: `http://localhost:3000/api`
- **인증 방식**: Supabase Auth (쿠키 기반 세션)
- **Content-Type**: `application/json`

---

## 인증 API

### 회원가입
```http
POST /api/auth/signup
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "사용자명"
}
```

### 이메일 로그인
```http
POST /api/auth/login/email
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 소셜 로그인
```http
POST /api/auth/login
```
**Request Body:**
```json
{
  "provider": "kakao" | "google"
}
```
**Response:**
```json
{
  "url": "https://..."
}
```

### 로그아웃
```http
POST /api/auth/logout
```

---

## 책 관리 API

### 책 검색
```http
GET /api/books/search?q=검색어&type=title
```
**Query Parameters:**
- `q`: 검색어 (필수)
- `type`: isbn | title | author (기본: title)

### 책 목록 조회
```http
GET /api/books?status=reading
```
**Query Parameters:**
- `status`: want_to_read | reading | completed

### 책 등록
```http
POST /api/books
```
**Request Body:**
```json
{
  "isbn": "9788932473901",
  "title": "데미안",
  "author": "헤르만 헤세",
  "publisher": "민음사",
  "status": "reading"
}
```

### 책 상세 조회
```http
GET /api/books/[id]
```

### 책 수정
```http
PUT /api/books/[id]
```
**Request Body:**
```json
{
  "status": "completed",
  "completed_at": "2025-12-22"
}
```

### 책 삭제
```http
DELETE /api/books/[id]
```

---

## 노트 관리 API

### 노트 생성
```http
POST /api/notes
```
**Request Body:**
```json
{
  "book_id": "uuid",
  "type": "quote" | "photo" | "memo",
  "content": "노트 내용",
  "page_number": 120,
  "tags": ["태그1", "태그2"],
  "is_public": false
}
```

### 노트 목록 조회
```http
GET /api/notes?book_id=uuid&type=quote
```
**Query Parameters:**
- `book_id`: 책 ID
- `type`: quote | photo | memo
- `tags`: 태그 (쉼표로 구분)
- `limit`: 개수 (기본: 50)

### 노트 상세 조회
```http
GET /api/notes/[id]
```

### 노트 수정
```http
PUT /api/notes/[id]
```

### 노트 삭제
```http
DELETE /api/notes/[id]
```

---

## 검색 API

### 노트 검색
```http
GET /api/search?q=검색어
```
**Query Parameters:**
- `q`: 검색어 (필수)
- `book_id`: 책 ID
- `type`: quote | photo | memo
- `tags`: 태그 (쉼표로 구분)
- `date_from`: 시작 날짜
- `date_to`: 종료 날짜
- `limit`: 개수 (기본: 50)

### 자동완성
```http
GET /api/search/suggestions?q=검
```

---

## 타임라인 API

### 타임라인 조회
```http
GET /api/timeline?view=day
```
**Query Parameters:**
- `view`: day | week | month
- `start_date`: 시작 날짜
- `end_date`: 종료 날짜

### 통계 조회
```http
GET /api/timeline/stats
```

---

## 독서모임 API

### 모임 생성
```http
POST /api/groups
```
**Request Body:**
```json
{
  "name": "모임명",
  "description": "모임 설명"
}
```

### 내 모임 목록
```http
GET /api/groups
```

### 모임 활동 조회
```http
GET /api/groups/[id]/activities
```

---

## 파일 업로드 API

### 이미지 업로드
```http
POST /api/upload
Content-Type: multipart/form-data
```
**Form Data:**
- `file`: 이미지 파일 (최대 10MB)

**Response:**
```json
{
  "success": true,
  "data": {
    "path": "user_id/timestamp.ext",
    "url": "https://..."
  }
}
```

### OCR 텍스트 추출
```http
POST /api/ocr
```
**Request Body:**
```json
{
  "image_url": "https://..."
}
```

---

## 공유 API

### 카드뉴스 생성
```http
POST /api/share
```
**Request Body:**
```json
{
  "note_id": "uuid",
  "template": "default" | "minimal"
}
```

---

## 에러 응답

모든 API는 에러 시 다음 형식으로 응답합니다:

```json
{
  "error": "에러 메시지"
}
```

**HTTP 상태 코드:**
- `200`: 성공
- `400`: 잘못된 요청
- `401`: 인증 필요
- `403`: 권한 없음
- `404`: 리소스 없음
- `500`: 서버 에러

---

**생성일**: 2025년 12월 22일  
**버전**: 1.0 (MVP)
