# Readtree Platform - Backend Development

Next.js 기반의 Readtree 독서 플랫폼 백엔드 API

## 📚 프로젝트 개요

독서 기록(필사, 사진, 메모)을 자동으로 정리하고, 검색하며, SNS에 공유할 수 있는 플랫폼

## 🚀 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Deployment**: Vercel

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local에 Supabase 정보 입력

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 🗄️ 데이터베이스 설정

1. Supabase 프로젝트 생성
2. SQL Editor에서 마이그레이션 실행:
   - `supabase/migrations/001_create_users.sql`
   - `supabase/migrations/002_create_books.sql`
   - `supabase/migrations/003_create_notes.sql`
   - `supabase/migrations/004_create_search_function.sql`
   - `supabase/migrations/005_create_groups.sql`

3. Storage 버킷 생성: `notes-images`

## 📖 API 문서

전체 API 문서는 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) 참고

### 주요 엔드포인트

- **인증**: `/api/auth/*`
- **책 관리**: `/api/books/*`
- **노트 관리**: `/api/notes/*`
- **검색**: `/api/search`
- **타임라인**: `/api/timeline`
- **독서모임**: `/api/groups/*`
- **파일 업로드**: `/api/upload`
- **OCR**: `/api/ocr`
- **공유**: `/api/share`

## 🔒 보안

- Row Level Security (RLS) 적용
- JWT 기반 인증
- 파일 업로드 검증 (타입, 크기)

## 📝 문서

- [백엔드 완료 요약](./BACKEND_COMPLETE.md)
- [설정 및 테스트 가이드](./SETUP_AND_TEST.md)
- [API 문서](./API_DOCUMENTATION.md)
- [작업 통합 가이드](./docs/tasks/task-integration-guide.md)

## 🧪 테스트

```bash
# API 테스트 (Thunder Client 또는 Postman 사용)
# 자세한 내용은 SETUP_AND_TEST.md 참고
```

## 🚧 개발 로드맵

- [x] Task 1: 인증 시스템
- [x] Task 2: 책 관리 API
- [x] Task 3: 노트 관리 API
- [x] Task 4: 검색 API
- [x] Task 5: 타임라인 API
- [x] Task 6: 독서모임 API
- [x] Task 7: 파일 업로드/OCR
- [x] Task 8: 공유 기능
- [ ] OAuth 설정 (카카오/구글)
- [ ] 프론트엔드 연동
- [ ] 배포 (Vercel)

## 📄 라이선스

MIT

## 👥 팀

Readtree by Habitree

---

**프로젝트 시작일**: 2025년 12월  
**현재 버전**: 1.0 (MVP)
