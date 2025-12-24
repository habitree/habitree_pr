# Task 7: 파일 업로드 및 OCR 개발 계획

**작업 번호**: Task 7  
**우선순위**: P0  
**예상 소요 시간**: 1.5일  
**담당 영역**: 이미지 업로드 및 OCR 텍스트 추출

---

## 1. 작업 개요

Supabase Storage를 사용한 이미지 업로드와 OCR API를 연동하여 이미지에서 텍스트를 추출하는 기능을 구현합니다.

### 1.1 목표

- ✅ Supabase Storage 버킷 설정
- ✅ 이미지 업로드 (최대 10MB)
- ✅ OCR 텍스트 추출
- ✅ 이미지 최적화 및 압축
- ✅ OCR 정확도 90% 이상

### 1.2 의존성

- **선행 작업**: Task 1 (인증)
- **후속 작업**: Task 3 (노트 관리), Task 8 (공유 기능)

---

## 2. 구현 상세

### 2.1 Supabase Storage 설정

```sql
-- storage bucket 생성 (Supabase Dashboard에서 수행)
-- Bucket name: notes-images
-- Public: false
-- Allowed MIME types: image/jpeg, image/png, image/webp
-- Max file size: 10MB

-- RLS 정책
CREATE POLICY "Users can upload own images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'notes-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'notes-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 2.2 API Routes 구현

**파일**: `app/api/upload/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB' },
        { status: 400 }
      )
    }

    // 파일 타입 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, WEBP allowed' },
        { status: 400 }
      )
    }

    // 이미지 최적화
    const buffer = Buffer.from(await file.arrayBuffer())
    const optimizedBuffer = await sharp(buffer)
      .resize(1920, 1920, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer()

    // 파일명 생성
    const timestamp = Date.now()
    const fileName = `${user.id}/${timestamp}.webp`

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('notes-images')
      .upload(fileName, optimizedBuffer, {
        contentType: 'image/webp',
        cacheControl: '3600',
      })

    if (error) throw error

    // Public URL 생성
    const { data: { publicUrl } } = supabase.storage
      .from('notes-images')
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      data: {
        path: data.path,
        url: publicUrl,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
```

**파일**: `app/api/ocr/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Google Cloud Vision API 사용
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { image_url } = await request.json()

    if (!image_url) {
      return NextResponse.json(
        { error: 'image_url is required' },
        { status: 400 }
      )
    }

    // Google Cloud Vision API 호출
    const visionApiUrl = 'https://vision.googleapis.com/v1/images:annotate'
    const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY

    const response = await fetch(`${visionApiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              source: {
                imageUri: image_url,
              },
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 1,
              },
            ],
            imageContext: {
              languageHints: ['ko', 'en'],
            },
          },
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'OCR failed')
    }

    const textAnnotations = data.responses[0]?.textAnnotations
    const extractedText = textAnnotations?.[0]?.description || ''

    return NextResponse.json({
      success: true,
      data: {
        text: extractedText,
        confidence: textAnnotations?.[0]?.confidence || 0,
      },
    })
  } catch (error) {
    console.error('OCR error:', error)
    return NextResponse.json(
      { error: 'Failed to extract text from image' },
      { status: 500 }
    )
  }
}
```

### 2.3 환경 변수

```env
# Google Cloud Vision API
GOOGLE_CLOUD_VISION_API_KEY=your_api_key_here
```

---

## 3. 완료 기준

- ✅ 이미지 업로드 (최대 10MB)
- ✅ Supabase Storage 저장
- ✅ 이미지 최적화 (WebP, 압축)
- ✅ OCR 텍스트 추출
- ✅ OCR 정확도 90% 이상
- ✅ RLS 정책 적용

---

**작성일**: 2025년 12월  
**버전**: 1.0
