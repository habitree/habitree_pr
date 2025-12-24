# Supabase 데이터베이스 마이그레이션 가이드

## 마이그레이션 적용 방법

### 방법 1: Supabase Dashboard (추천)

1. Supabase Dashboard 접속: https://supabase.com/dashboard/project/zlxawujdhtlnzadvquqc
2. 좌측 메뉴에서 **SQL Editor** 선택
3. `supabase/migrations/001_create_users.sql` 파일 내용을 복사
4. SQL Editor에 붙여넣기
5. **Run** 버튼 클릭

### 방법 2: Supabase CLI (선택적)

```bash
# Supabase CLI 설치
npm install -g supabase

# 프로젝트 연결
supabase link --project-ref zlxawujdhtlnzadvquqc

# 마이그레이션 적용
supabase db push
```

## 마이그레이션 확인

SQL Editor에서 다음 쿼리로 확인:

```sql
-- users 테이블 확인
SELECT * FROM public.users LIMIT 1;

-- RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'users';
```

## 다음 단계

마이그레이션 완료 후:
1. 프론트엔드에서 회원가입 테스트
2. 로그인 테스트
3. 사용자 프로필 조회 테스트
