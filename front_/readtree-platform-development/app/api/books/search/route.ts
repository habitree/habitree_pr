import { NextRequest, NextResponse } from 'next/server'

const ALADIN_API_URL = 'http://www.aladin.co.kr/ttb/api/ItemSearch.aspx'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const type = searchParams.get('type') || 'title'

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 })
  }

  try {
    // 알라딘 API 키가 없으면 목 데이터 반환
    if (!process.env.ALADIN_API_KEY) {
      return NextResponse.json({
        success: true,
        data: [
          {
            isbn: '9788932473901',
            title: '데미안',
            author: '헤르만 헤세',
            publisher: '민음사',
            cover_image_url: 'https://image.aladin.co.kr/product/1/61/cover/8932473900_1.jpg',
            description: '헤르만 헤세의 대표작',
            published_date: '2009-01-10',
            category: '소설',
          },
        ],
      })
    }

    const queryType = type === 'isbn' ? 'ItemId' : 'Keyword'
    const url = new URL(ALADIN_API_URL)
    url.searchParams.set('ttbkey', process.env.ALADIN_API_KEY)
    url.searchParams.set('Query', query)
    url.searchParams.set('QueryType', queryType)
    url.searchParams.set('MaxResults', '20')
    url.searchParams.set('SearchTarget', 'Book')
    url.searchParams.set('output', 'js')
    url.searchParams.set('Version', '20131101')

    const response = await fetch(url.toString())
    const data = await response.json()

    const books = data.item?.map((item: any) => ({
      isbn: item.isbn13 || item.isbn,
      title: item.title,
      author: item.author,
      publisher: item.publisher,
      cover_image_url: item.cover,
      description: item.description,
      published_date: item.pubDate,
      category: item.categoryName,
    })) || []

    return NextResponse.json({ success: true, data: books })
  } catch (error) {
    console.error('Book search error:', error)
    return NextResponse.json({ error: 'Failed to search books' }, { status: 500 })
  }
}
