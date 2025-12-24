import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

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

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'File size exceeds 10MB' }, { status: 400 })
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
        }

        // 파일명 생성
        const timestamp = Date.now()
        const ext = file.name.split('.').pop()
        const fileName = `${user.id}/${timestamp}.${ext}`

        // Supabase Storage에 업로드
        const fileBuffer = await file.arrayBuffer()
        const { data, error } = await supabase.storage
            .from('notes-images')
            .upload(fileName, fileBuffer, {
                contentType: file.type,
                cacheControl: '3600',
            })

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
            .from('notes-images')
            .getPublicUrl(fileName)

        return NextResponse.json({ success: true, data: { path: data.path, url: publicUrl } })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }
}
