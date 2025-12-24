# Task 8: 공유 기능 API 개발 계획

**작업 번호**: Task 8  
**우선순위**: P2  
**예상 소요 시간**: 1일  
**담당 영역**: 카드뉴스 생성 및 SNS 공유

---

## 1. 작업 개요

노트를 카드뉴스 형태로 변환하여 SNS에 공유할 수 있는 기능을 구현합니다. 다양한 템플릿을 제공하며, Canvas를 사용하여 이미지를 생성합니다.

### 1.1 목표

- ✅ 카드뉴스 이미지 생성
- ✅ 다양한 템플릿 지원 (최소 5개)
- ✅ SNS 공유 링크 생성
- ✅ 이미지 생성 시간 3초 이내

### 1.2 의존성

- **선행 작업**: Task 3 (노트 관리), Task 7 (파일 업로드)
- **후속 작업**: 없음

---

## 2. 구현 상세

### 2.1 API Routes 구현

**파일**: `app/api/share/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { createCanvas, loadImage, registerFont } from 'canvas'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { note_id, template = 'default' } = await request.json()

    // 노트 조회
    const { data: note, error } = await supabase
      .from('notes')
      .select(`
        *,
        book:books(*)
      `)
      .eq('id', note_id)
      .eq('user_id', user.id)
      .single()

    if (error) throw error

    // 카드뉴스 이미지 생성
    const imageBuffer = await generateCardNews(note, template)

    // Supabase Storage에 저장
    const fileName = `${user.id}/share/${note_id}-${Date.now()}.png`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('notes-images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('notes-images')
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        path: uploadData.path,
      },
    })
  } catch (error) {
    console.error('Share error:', error)
    return NextResponse.json(
      { error: 'Failed to create share image' },
      { status: 500 }
    )
  }
}

async function generateCardNews(note: any, template: string): Promise<Buffer> {
  const width = 1080
  const height = 1080
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // 배경색
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  if (template === 'minimal') {
    // 미니멀 템플릿
    ctx.fillStyle = '#1a1a1a'
    ctx.font = 'bold 48px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    const maxWidth = width - 200
    wrapText(ctx, note.content || '', width / 2, height / 2, maxWidth, 60)

    // 책 정보
    ctx.font = '28px Arial'
    ctx.fillStyle = '#666666'
    ctx.fillText(`- ${note.book.title}`, width / 2, height - 150)
    ctx.fillText(`${note.book.author}`, width / 2, height - 100)
  } else {
    // 기본 템플릿
    // Gradient 배경
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#10b981')
    gradient.addColorStop(1, '#047857')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 52px Arial'
    ctx.textAlign = 'center'

    const maxWidth = width - 200
    wrapText(ctx, note.content || '', width / 2, height / 2, maxWidth, 70)

    // 책 정보
    ctx.font = '32px Arial'
    ctx.fillText(`"${note.book.title}"`, width / 2, height - 200)
    ctx.font = '28px Arial'
    ctx.fillText(note.book.author, width / 2, height - 140)

    // 로고
    ctx.font = 'bold 24px Arial'
    ctx.fillText('Readtree', width / 2, height - 50)
  }

  return canvas.toBuffer('image/png')
}

function wrapText(
  ctx: any,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ')
  let line = ''
  const lines = []

  for (const word of words) {
    const testLine = line + word + ' '
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && line !== '') {
      lines.push(line)
      line = word + ' '
    } else {
      line = testLine
    }
  }
  lines.push(line)

  const startY = y - (lines.length * lineHeight) / 2
  lines.forEach((line, i) => {
    ctx.fillText(line, x, startY + i * lineHeight)
  })
}
```

**파일**: `app/api/share/templates/route.ts`

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  const templates = [
    {
      id: 'default',
      name: '기본',
      description: 'Readtree 그린 그라데이션',
      preview: '/templates/default.png',
    },
    {
      id: 'minimal',
      name: '미니멀',
      description: '심플한 흑백 텍스트',
      preview: '/templates/minimal.png',
    },
    {
      id: 'elegant',
      name: '우아함',
      description: '세리프 폰트와 부드러운 색상',
      preview: '/templates/elegant.png',
    },
    {
      id: 'modern',
      name: '모던',
      description: '네온 컬러와 대담한 타이포그래피',
      preview: '/templates/modern.png',
    },
    {
      id: 'vintage',
      name: '빈티지',
      description: '레트로 스타일',
      preview: '/templates/vintage.png',
    },
  ]

  return NextResponse.json({ success: true, data: templates })
}
```

### 2.2 필요한 패키지

```bash
npm install canvas
```

### 2.3 TypeScript 타입 정의

**파일**: `types/share.ts`

```typescript
export type ShareTemplate = {
  id: string
  name: string
  description: string
  preview: string
}

export type ShareRequest = {
  note_id: string
  template?: string
}

export type ShareResponse = {
  success: boolean
  data: {
    url: string
    path: string
  }
}
```

---

## 3. 완료 기준

- ✅ 카드뉴스 이미지 생성
- ✅ 최소 5개 템플릿 제공
- ✅ SNS 공유 링크 생성
- ✅ 이미지 생성 시간 3초 이내
- ✅ TypeScript 타입 에러 없음

---

**작성일**: 2025년 12월  
**버전**: 1.0
