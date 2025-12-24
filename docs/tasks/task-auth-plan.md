# Task 1: 인증 시스템 구축 계획

**작업 번호**: Task 1  
**우선순위**: P0 (최우선)  
**예상 소요 시간**: 1일  
**담당 영역**: 사용자 인증 및 세션 관리

---

## 1. 작업 개요

Supabase Auth를 사용하여 Readtree 플랫폼의 사용자 인증 시스템을 구축합니다. 카카오/구글 소셜 로그인과 이메일/비밀번호 로그인을 지원하며, 보호된 라우트에 대한 미들웨어를 구현합니다.

### 1.1 목표

- ✅ 카카오/구글 OAuth 로그인 구현
- ✅ 이메일/비밀번호 로그인/회원가입 구현
- ✅ 비밀번호 재설정 기능
- ✅ 사용자 세션 관리
- ✅ Auth 미들웨어로 보호된 라우트 구현

### 1.2 의존성

- **선행 작업**: 없음 (독립적으로 시작 가능)
- **후속 작업**: Task 2, Task 3, Task 6, Task 7 (모두 인증 필요)

---

## 2. 프론트엔드 연동 페이지

### 2.1 연동 대상 페이지

| 페이지 경로 | 파일 위치 | 주요 기능 |
|------------|----------|----------|
| 로그인 | `/app/auth/login/page.tsx` | 소셜 로그인, 이메일 로그인 |
| 회원가입 | `/app/auth/signup/page.tsx` | 이메일 회원가입 |
| 비밀번호 재설정 | `/app/auth/reset-password/page.tsx` | 비밀번호 변경 |
| 프로필 | `/app/(main)/profile/page.tsx` | 사용자 정보 조회/수정 |

### 2.2 보호된 라우트

- `/app/(main)/*` - 로그인 필요한 모든 페이지
- 미들웨어를 통해 인증되지 않은 사용자는 `/auth/login`으로 리다이렉트

---

## 3. 구현 상세

### 3.1 Supabase 프로젝트 설정

**작업 내용:**
1. Supabase 프로젝트 생성 (https://supabase.com)
2. Database URL 및 anon key 확보
3. OAuth Providers 설정

**카카오 OAuth 설정:**
```
1. 카카오 개발자 콘솔 (https://developers.kakao.com) 접속
2. 앱 생성 및 REST API 키 확보
3. Redirect URI 설정: {SUPABASE_URL}/auth/v1/callback
4. Supabase Dashboard > Authentication > Providers > Kakao 활성화
5. Client ID/Secret 입력
```

**구글 OAuth 설정:**
```
1. Google Cloud Console (https://console.cloud.google.com) 접속
2. OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI: {SUPABASE_URL}/auth/v1/callback
4. Supabase Dashboard > Authentication > Providers > Google 활성화
5. Client ID/Secret 입력
```

### 3.2 환경 변수 설정

**`.env.local` 파일:**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OAuth (Supabase에서 처리하므로 직접 필요 없음, 문서화 목적)
# KAKAO_CLIENT_ID=  
# KAKAO_CLIENT_SECRET=
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
```

### 3.3 Supabase Client 설정

**파일**: `lib/supabase/client.ts`

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**파일**: `lib/supabase/server.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component에서는 쿠키 set 불가
          }
        },
      },
    }
  )
}
```

### 3.4 API Routes 구현

#### 3.4.1 소셜 로그인

**파일**: `app/api/auth/login/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { provider } = await request.json()
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider, // 'kakao' | 'google'
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ url: data.url })
}
```

#### 3.4.2 이메일 로그인

**파일**: `app/api/auth/login/email/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ user: data.user })
}
```

#### 3.4.3 회원가입

**파일**: `app/api/auth/signup/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password, name } = await request.json()
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ user: data.user })
}
```

#### 3.4.4 로그아웃

**파일**: `app/api/auth/logout/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
```

#### 3.4.5 비밀번호 재설정

**파일**: `app/api/auth/reset-password/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email } = await request.json()
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
```

### 3.5 Auth Callback 처리

**파일**: `app/auth/callback/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to home page
  return NextResponse.redirect(new URL('/', request.url))
}
```

### 3.6 Auth 미들웨어

**파일**: `middleware.ts`

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 보호된 라우트에서 인증되지 않은 사용자는 로그인 페이지로
  if (!user && request.nextUrl.pathname.startsWith('/(main)')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // 인증된 사용자가 auth 페이지 접근 시 홈으로
  if (user && request.nextUrl.pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### 3.7 TypeScript 타입 정의

**파일**: `types/auth.ts`

```typescript
export type User = {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export type AuthProvider = 'kakao' | 'google' | 'email'

export type LoginRequest = {
  provider?: AuthProvider
  email?: string
  password?: string
}

export type SignupRequest = {
  email: string
  password: string
  name?: string
}

export type ResetPasswordRequest = {
  email: string
}
```

---

## 4. Database 스키마

### 4.1 users 테이블

Supabase Auth가 자동으로 `auth.users` 테이블을 생성하므로, public 스키마에 추가 프로필 정보를 저장합니다.

**파일**: `supabase/migrations/001_create_users.sql`

```sql
-- users 테이블 (추가 프로필 정보)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 정책: 사용자는 자신의 프로필만 조회/수정 가능
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- 트리거: auth.users에 사용자 생성 시 public.users에도 추가
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 5. 테스트 계획

### 5.1 단위 테스트

- [ ] 카카오 로그인 API 테스트
- [ ] 구글 로그인 API 테스트
- [ ] 이메일 로그인 API 테스트
- [ ] 회원가입 API 테스트
- [ ] 비밀번호 재설정 API 테스트

### 5.2 통합 테스트

- [ ] 프론트엔드 로그인 페이지 연동
- [ ] OAuth 리다이렉트 플로우 확인
- [ ] 세션 유지 확인
- [ ] 미들웨어 보호 라우트 확인

### 5.3 보안 테스트

- [ ] RLS 정책 동작 확인
- [ ] 세션 탈취 방지 확인
- [ ] CSRF 토큰 확인

---

## 6. 완료 기준

- ✅ 카카오/구글 소셜 로그인 정상 동작
- ✅ 이메일/비밀번호 로그인 정상 동작
- ✅ 회원가입 및 이메일 인증 정상 동작
- ✅ 비밀번호 재설정 정상 동작
- ✅ 사용자 세션 관리 정상 동작
- ✅ 보호된 라우트 미들웨어 정상 동작
- ✅ RLS 정책 적용 완료
- ✅ TypeScript 타입 에러 없음
- ✅ 환경 변수 문서화 완료

---

## 7. 참고 문서

- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)
- [Next.js 14 App Router Auth](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [PRD: 사용자 인증 요구사항](../PRD-%20Readtree%20독서플랫폼.md#21-사용자-인증-및-계정-관리)
- [User Stories: US-001 ~ US-008](../user_stories.md#1-사용자-인증-및-계정-관리)

---

**작성일**: 2025년 12월  
**버전**: 1.0
