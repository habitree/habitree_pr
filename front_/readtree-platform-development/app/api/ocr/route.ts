import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { image_url } = await request.json()

        if (!image_url) {
            return NextResponse.json({ error: 'image_url is required' }, { status: 400 })
        }

        // Google Cloud Vision API 없으면 목 데이터 반환
        if (!process.env.GOOGLE_CLOUD_VISION_API_KEY) {
            return NextResponse.json({
                success: true,
                data: {
                    text: '샘플 OCR 텍스트입니다. Google Cloud Vision API 키를 설정하면 실제 OCR이 작동합니다.',
                    confidence: 0.95,
                },
            })
        }

        const visionApiUrl = 'https://vision.googleapis.com/v1/images:annotate'
        const response = await fetch(`${visionApiUrl}?key=${process.env.GOOGLE_CLOUD_VISION_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                requests: [{
                    image: { source: { imageUri: image_url } },
                    features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
                    imageContext: { languageHints: ['ko', 'en'] },
                }],
            }),
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error?.message || 'OCR failed')

        const textAnnotations = data.responses[0]?.textAnnotations
        const extractedText = textAnnotations?.[0]?.description || ''

        return NextResponse.json({
            success: true,
            data: { text: extractedText, confidence: textAnnotations?.[0]?.confidence || 0 },
        })
    } catch (error) {
        console.error('OCR error:', error)
        return NextResponse.json({ error: 'Failed to extract text' }, { status: 500 })
    }
}
