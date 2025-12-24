-- 검색 함수 (하이라이트 포함)
-- pg_trgm 활용한 한국어 검색 개선 버전
CREATE OR REPLACE FUNCTION search_notes(
  p_user_id UUID,
  p_query TEXT,
  p_book_id UUID DEFAULT NULL,
  p_type TEXT DEFAULT NULL,
  p_tags TEXT[] DEFAULT NULL,
  p_date_from TIMESTAMPTZ DEFAULT NULL,
  p_date_to TIMESTAMPTZ DEFAULT NULL,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  book_id UUID,
  book_title TEXT,
  book_author TEXT,
  book_cover_image_url TEXT,
  type TEXT,
  content TEXT,
  image_url TEXT,
  page_number INTEGER,
  tags TEXT[],
  is_public BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  highlight TEXT,
  relevance_score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.user_id,
    n.book_id,
    b.title AS book_title,
    b.author AS book_author,
    b.cover_image_url AS book_cover_image_url,
    n.type,
    n.content,
    n.image_url,
    n.page_number,
    n.tags,
    n.is_public,
    n.created_at,
    n.updated_at,
    -- ts_headline for highlighting (simple config)
    ts_headline(
      'simple',
      COALESCE(n.content, ''),
      to_tsquery('simple', p_query),
      'StartSel=<mark>, StopSel=</mark>, MaxWords=35, MinWords=15'
    ) AS highlight,
    -- ts_rank for relevance scoring
    ts_rank(
      to_tsvector('simple', COALESCE(n.content, '')),
      to_tsquery('simple', p_query)
    ) AS relevance_score
  FROM public.notes n
  JOIN public.books b ON n.book_id = b.id
  WHERE 
    n.user_id = p_user_id
    AND (
      -- Full-Text Search
      to_tsvector('simple', COALESCE(n.content, '')) @@ to_tsquery('simple', p_query)
      OR
      -- ILIKE for partial match (pg_trgm helps with Korean)
      n.content ILIKE '%' || p_query || '%'
    )
    AND (p_book_id IS NULL OR n.book_id = p_book_id)
    AND (p_type IS NULL OR n.type = p_type)
    AND (p_tags IS NULL OR n.tags && p_tags)
    AND (p_date_from IS NULL OR n.created_at >= p_date_from)
    AND (p_date_to IS NULL OR n.created_at <= p_date_to)
  ORDER BY relevance_score DESC, n.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;
