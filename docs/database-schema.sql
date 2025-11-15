-- MoneyPick 데이터베이스 스키마
-- Supabase SQL 에디터에서 실행하세요
-- 전체 스크립트를 복사하여 한 번에 실행할 수 있습니다.

BEGIN;

-- ============================================
-- 1. 카테고리 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 카테고리 인덱스
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

-- ============================================
-- 2. 태그 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 태그 인덱스
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- ============================================
-- 3. 기회 정보 테이블 (정부 지원금, 부업, 투자, 자기계발, 할인 등)
-- ============================================
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id VARCHAR(100), -- 정부24 등 외부 시스템의 ID
  title VARCHAR(200) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  amount VARCHAR(100), -- 지원 금액 또는 수익 범위
  deadline VARCHAR(50), -- 마감일 (예: "D-7", "상시")
  difficulty VARCHAR(20), -- 난이도 (쉬움, 보통, 어려움)
  match_rate INTEGER, -- 매칭률 (0-100)
  source_url TEXT, -- 출처 URL
  application_url TEXT, -- 신청 URL
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE, -- 하이라이트 표시 여부
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 기회 정보 인덱스
CREATE INDEX IF NOT EXISTS idx_opportunities_category_id ON opportunities(category_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_external_id ON opportunities(external_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_is_active ON opportunities(is_active);
CREATE INDEX IF NOT EXISTS idx_opportunities_is_featured ON opportunities(is_featured);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON opportunities(created_at DESC);
-- 한국어 텍스트 검색 인덱스 (선택사항 - 한국어 설정이 필요한 경우)
-- CREATE INDEX IF NOT EXISTS idx_opportunities_title ON opportunities USING gin(to_tsvector('korean', title));

-- ============================================
-- 4. 기회-태그 연결 테이블 (다대다 관계)
-- ============================================
CREATE TABLE IF NOT EXISTS opportunity_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(opportunity_id, tag_id)
);

-- 기회-태그 인덱스
CREATE INDEX IF NOT EXISTS idx_opportunity_tags_opportunity_id ON opportunity_tags(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_tags_tag_id ON opportunity_tags(tag_id);

-- ============================================
-- 5. 사용자 프로필 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  name VARCHAR(100),
  avatar_url TEXT,
  birth_date DATE,
  gender VARCHAR(10), -- 'male', 'female', 'other'
  region VARCHAR(50), -- 지역
  occupation VARCHAR(100), -- 직업
  income_range VARCHAR(50), -- 소득 범위
  marital_status VARCHAR(20), -- 결혼 여부 ('single', 'married', 'divorced')
  has_children BOOLEAN DEFAULT FALSE,
  interests TEXT[], -- 관심사 배열
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 사용자 프로필 인덱스
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- ============================================
-- 6. 사용자 즐겨찾기 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  notes TEXT, -- 사용자 메모
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

-- 즐겨찾기 인덱스
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_opportunity_id ON user_favorites(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_created_at ON user_favorites(created_at DESC);

-- ============================================
-- 7. 자격 진단 결과 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS eligibility_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  is_eligible BOOLEAN NOT NULL,
  match_score INTEGER, -- 매칭 점수 (0-100)
  reasons TEXT[], -- 자격 여부 이유 배열
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

-- 자격 진단 인덱스
CREATE INDEX IF NOT EXISTS idx_eligibility_checks_user_id ON eligibility_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_checks_opportunity_id ON eligibility_checks(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_checks_is_eligible ON eligibility_checks(is_eligible);
CREATE INDEX IF NOT EXISTS idx_eligibility_checks_checked_at ON eligibility_checks(checked_at DESC);

-- ============================================
-- 8. 데이터 수집 로그 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS data_collection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(50) NOT NULL, -- 데이터 소스 (예: 'gov24', 'public_data')
  records_count INTEGER DEFAULT 0,
  status VARCHAR(20) NOT NULL, -- 'success', 'error', 'partial'
  error_message TEXT,
  collected_at TIMESTAMPTZ DEFAULT NOW()
);

-- 데이터 수집 로그 인덱스
CREATE INDEX IF NOT EXISTS idx_data_collection_logs_collected_at ON data_collection_logs(collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_data_collection_logs_status ON data_collection_logs(status);

-- ============================================
-- 9. 업데이트 시간 자동 갱신 함수
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 자동 갱신 트리거
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 10. Row Level Security (RLS) 정책 설정
-- ============================================

-- 카테고리: 모든 사용자가 읽기 가능
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "카테고리는 모든 사용자가 읽기 가능"
  ON categories FOR SELECT
  USING (true);

-- 기회 정보: 모든 사용자가 읽기 가능, 관리자만 수정 가능
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "기회 정보는 모든 사용자가 읽기 가능"
  ON opportunities FOR SELECT
  USING (true);

-- 태그: 모든 사용자가 읽기 가능
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "태그는 모든 사용자가 읽기 가능"
  ON tags FOR SELECT
  USING (true);

-- 기회-태그: 모든 사용자가 읽기 가능
ALTER TABLE opportunity_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "기회-태그는 모든 사용자가 읽기 가능"
  ON opportunity_tags FOR SELECT
  USING (true);

-- 사용자 프로필: 본인만 읽기/수정 가능
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "사용자는 본인 프로필만 읽기 가능"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);
CREATE POLICY "사용자는 본인 프로필만 수정 가능"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);
CREATE POLICY "사용자는 본인 프로필만 생성 가능"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 즐겨찾기: 본인만 읽기/수정 가능
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "사용자는 본인 즐겨찾기만 읽기 가능"
  ON user_favorites FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "사용자는 본인 즐겨찾기만 생성/수정/삭제 가능"
  ON user_favorites FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 자격 진단: 본인만 읽기 가능
ALTER TABLE eligibility_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "사용자는 본인 자격 진단 결과만 읽기 가능"
  ON eligibility_checks FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "사용자는 본인 자격 진단 결과만 생성 가능"
  ON eligibility_checks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 데이터 수집 로그: 관리자만 읽기 가능 (현재는 모든 사용자 읽기 가능으로 설정)
ALTER TABLE data_collection_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "데이터 수집 로그는 모든 사용자가 읽기 가능"
  ON data_collection_logs FOR SELECT
  USING (true);

-- ============================================
-- 11. 초기 데이터 삽입
-- ============================================

-- 카테고리 초기 데이터
INSERT INTO categories (slug, name, description, icon, display_order) VALUES
  ('government-support', '정부·공공 지원금', '정부 및 공공기관에서 제공하는 지원금, 보조금, 대출 정보', 'government', 1),
  ('side-job', '부업 / 재택근무', '부업, 재택근무, 프리랜스 수익 기회', 'briefcase', 2),
  ('investment', '투자·자산', '투자, 자산 증식, 리셀 관련 정보', 'trending-up', 3),
  ('self-development', '자기계발', '자격증, 교육, 자기계발 기반 수익', 'book', 4),
  ('discount', '할인·리워드', '할인, 리워드, 절약 정보', 'tag', 5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 12. 유용한 뷰 생성
-- ============================================

-- 기회 정보와 카테고리, 태그를 함께 조회하는 뷰
CREATE OR REPLACE VIEW opportunities_with_details AS
SELECT 
  o.*,
  c.slug as category_slug,
  c.name as category_name,
  COALESCE(
    json_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name)) 
    FILTER (WHERE t.id IS NOT NULL),
    '[]'::json
  ) as tags
FROM opportunities o
LEFT JOIN categories c ON o.category_id = c.id
LEFT JOIN opportunity_tags ot ON o.id = ot.opportunity_id
LEFT JOIN tags t ON ot.tag_id = t.id
WHERE o.is_active = true
GROUP BY o.id, c.slug, c.name;

-- 사용자 즐겨찾기와 기회 정보를 함께 조회하는 뷰
CREATE OR REPLACE VIEW user_favorites_with_opportunities AS
SELECT 
  uf.*,
  o.title,
  o.description,
  o.amount,
  o.deadline,
  o.difficulty,
  o.match_rate,
  o.application_url,
  c.name as category_name,
  c.slug as category_slug
FROM user_favorites uf
JOIN opportunities o ON uf.opportunity_id = o.id
LEFT JOIN categories c ON o.category_id = c.id
WHERE o.is_active = true;

-- ============================================
-- 13. 유용한 함수 생성
-- ============================================

-- 기회 정보 검색 함수 (제목, 설명, 태그 검색)
CREATE OR REPLACE FUNCTION search_opportunities(
  p_search_query TEXT DEFAULT NULL,
  p_category_slug TEXT DEFAULT NULL,
  p_tag_names TEXT[] DEFAULT NULL,
  p_limit_count INTEGER DEFAULT 20,
  p_offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  description TEXT,
  category_name VARCHAR,
  category_slug VARCHAR,
  amount VARCHAR,
  deadline VARCHAR,
  difficulty VARCHAR,
  match_rate INTEGER,
  tags JSON,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.title,
    o.description,
    c.name as category_name,
    c.slug as category_slug,
    o.amount,
    o.deadline,
    o.difficulty,
    o.match_rate,
    COALESCE(
      json_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name)) 
      FILTER (WHERE t.id IS NOT NULL),
      '[]'::json
    ) as tags,
    o.created_at
  FROM opportunities o
  LEFT JOIN categories c ON o.category_id = c.id
  LEFT JOIN opportunity_tags ot ON o.id = ot.opportunity_id
  LEFT JOIN tags t ON ot.tag_id = t.id
  WHERE 
    o.is_active = true
    AND (p_search_query IS NULL OR 
         o.title ILIKE '%' || p_search_query || '%' OR 
         o.description ILIKE '%' || p_search_query || '%')
    AND (p_category_slug IS NULL OR c.slug = p_category_slug)
    AND (p_tag_names IS NULL OR t.name = ANY(p_tag_names))
  GROUP BY o.id, c.name, c.slug
  ORDER BY o.created_at DESC
  LIMIT p_limit_count
  OFFSET p_offset_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 완료 메시지
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '데이터베이스 스키마가 성공적으로 생성되었습니다!';
  RAISE NOTICE '초기 카테고리 데이터가 삽입되었습니다.';
  RAISE NOTICE 'RLS 정책이 설정되었습니다.';
END $$;

COMMIT;

-- ============================================
-- 실행 완료!
-- ============================================
-- 모든 테이블, 인덱스, RLS 정책이 생성되었습니다.
-- 이제 애플리케이션에서 Supabase 클라이언트를 사용하여 데이터를 저장하고 조회할 수 있습니다.

