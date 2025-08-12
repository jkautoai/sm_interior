-- ================================================================
-- 🏠 인테리어 견적 관리 시스템 - Estimates 스키마
-- ================================================================
-- 작성일: 2024년
-- 설명: 견적, 견적-공간, 견적-자재 관계 테이블들

-- 1. 견적 메인 테이블
CREATE TABLE estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  total_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  budget NUMERIC(12,2),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 견적별 선택된 공간 테이블
CREATE TABLE estimate_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
  space_type TEXT NOT NULL CHECK (space_type IN (
    'livingRoom', 'kitchen', 'masterBedroom', 'bedroom', 
    'bathroom', 'study', 'dressRoom', 'entrance', 'balcony'
  )),
  space_name TEXT NOT NULL,
  selected BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 견적별 선택된 자재 테이블
CREATE TABLE estimate_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  total_price NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 인덱스 생성 (성능 최적화)
CREATE INDEX idx_estimates_client_id ON estimates(client_id);
CREATE INDEX idx_estimates_created_at ON estimates(created_at DESC);
CREATE INDEX idx_estimate_spaces_estimate_id ON estimate_spaces(estimate_id);
CREATE INDEX idx_estimate_materials_estimate_id ON estimate_materials(estimate_id);
CREATE INDEX idx_estimate_materials_material_id ON estimate_materials(material_id);

-- 5. RLS (Row Level Security) 설정
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_materials ENABLE ROW LEVEL SECURITY;

-- RLS 정책 - 모든 사용자가 읽기/쓰기 가능 (향후 인증 추가시 수정)
CREATE POLICY "Allow public read access" ON estimates FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON estimates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON estimates FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON estimates FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON estimate_spaces FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON estimate_spaces FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON estimate_spaces FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON estimate_spaces FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON estimate_materials FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON estimate_materials FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON estimate_materials FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON estimate_materials FOR DELETE USING (true);

-- 6. Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE public.estimates;
ALTER PUBLICATION supabase_realtime ADD TABLE public.estimate_spaces;
ALTER PUBLICATION supabase_realtime ADD TABLE public.estimate_materials;

-- 7. 샘플 데이터 삽입
-- 먼저 고객과 자재 데이터가 있는지 확인
DO $$
DECLARE
  client1_id UUID;
  client2_id UUID;
  material1_id UUID;
  material2_id UUID;
  material3_id UUID;
  material4_id UUID;
  material5_id UUID;
  estimate1_id UUID := '550e8400-e29b-41d4-a716-446655440001';
  estimate2_id UUID := '550e8400-e29b-41d4-a716-446655440002';
BEGIN
  -- 고객 ID 찾기 (없으면 임시 생성)
  SELECT id INTO client1_id FROM clients WHERE name ILIKE '%김%' OR name ILIKE '%철수%' LIMIT 1;
  IF client1_id IS NULL THEN
    INSERT INTO clients (name, phone, address, notes) 
    VALUES ('김철수', '010-1234-5678', '서울시 강남구', '견적 샘플 고객')
    RETURNING id INTO client1_id;
  END IF;
  
  SELECT id INTO client2_id FROM clients WHERE name ILIKE '%이%' OR name ILIKE '%영희%' LIMIT 1;
  IF client2_id IS NULL THEN
    INSERT INTO clients (name, phone, address, notes) 
    VALUES ('이영희', '010-9876-5432', '서울시 서초구', '견적 샘플 고객')
    RETURNING id INTO client2_id;
  END IF;
  
  -- 자재 ID 찾기
  SELECT id INTO material1_id FROM materials WHERE name ILIKE '%원목%' OR name ILIKE '%마루%' LIMIT 1;
  SELECT id INTO material2_id FROM materials WHERE name ILIKE '%대리석%' OR name ILIKE '%타일%' LIMIT 1;
  SELECT id INTO material3_id FROM materials WHERE name ILIKE '%강화%' OR name ILIKE '%마루%' LIMIT 1;
  SELECT id INTO material4_id FROM materials WHERE name ILIKE '%포셀린%' OR name ILIKE '%타일%' LIMIT 1;
  SELECT id INTO material5_id FROM materials WHERE category = 'flooring' LIMIT 1;
  
  -- 자재가 없으면 기본값 사용
  IF material1_id IS NULL THEN
    SELECT id INTO material1_id FROM materials LIMIT 1;
  END IF;
  IF material2_id IS NULL THEN
    SELECT id INTO material2_id FROM materials OFFSET 1 LIMIT 1;
  END IF;
  IF material3_id IS NULL THEN
    SELECT id INTO material3_id FROM materials OFFSET 2 LIMIT 1;
  END IF;
  IF material4_id IS NULL THEN
    SELECT id INTO material4_id FROM materials OFFSET 3 LIMIT 1;
  END IF;
  IF material5_id IS NULL THEN
    SELECT id INTO material5_id FROM materials OFFSET 4 LIMIT 1;
  END IF;

  -- 첫 번째 견적 생성
  INSERT INTO estimates (
    id, client_id, client_name, total_price, budget, status
  ) VALUES (
    estimate1_id,
    client1_id,
    (SELECT name FROM clients WHERE id = client1_id),
    2850000,
    3000000,
    'draft'
  );

  -- 첫 번째 견적의 공간 선택
  INSERT INTO estimate_spaces (estimate_id, space_type, space_name) VALUES
  (estimate1_id, 'livingRoom', '거실'),
  (estimate1_id, 'kitchen', '주방'),
  (estimate1_id, 'masterBedroom', '안방');

  -- 첫 번째 견적의 자재 선택
  IF material1_id IS NOT NULL THEN
    INSERT INTO estimate_materials (estimate_id, material_id, quantity, unit_price, total_price)
    VALUES (estimate1_id, material1_id, 15.0, 85000, 1275000);
  END IF;
  
  IF material2_id IS NOT NULL THEN
    INSERT INTO estimate_materials (estimate_id, material_id, quantity, unit_price, total_price)
    VALUES (estimate1_id, material2_id, 8.0, 120000, 960000);
  END IF;

  -- 두 번째 견적 생성
  INSERT INTO estimates (
    id, client_id, client_name, total_price, budget, status
  ) VALUES (
    estimate2_id,
    client2_id,
    (SELECT name FROM clients WHERE id = client2_id),
    1890000,
    2000000,
    'sent'
  );

  -- 두 번째 견적의 공간 선택
  INSERT INTO estimate_spaces (estimate_id, space_type, space_name) VALUES
  (estimate2_id, 'livingRoom', '거실'),
  (estimate2_id, 'bedroom', '침실'),
  (estimate2_id, 'bathroom', '화장실');

  -- 두 번째 견적의 자재 선택
  IF material3_id IS NOT NULL THEN
    INSERT INTO estimate_materials (estimate_id, material_id, quantity, unit_price, total_price)
    VALUES (estimate2_id, material3_id, 20.0, 45000, 900000);
  END IF;
  
  IF material4_id IS NOT NULL THEN
    INSERT INTO estimate_materials (estimate_id, material_id, quantity, unit_price, total_price)
    VALUES (estimate2_id, material4_id, 12.0, 65000, 780000);
  END IF;
  
  IF material5_id IS NOT NULL THEN
    INSERT INTO estimate_materials (estimate_id, material_id, quantity, unit_price, total_price)
    VALUES (estimate2_id, material5_id, 5.0, 42000, 210000);
  END IF;

END $$;

-- 8. 트리거 함수 생성 (total_price 자동 계산)
CREATE OR REPLACE FUNCTION update_estimate_total_price()
RETURNS TRIGGER AS $$
BEGIN
  -- estimate_materials 테이블 변경시 estimates의 total_price 업데이트
  UPDATE estimates 
  SET 
    total_price = (
      SELECT COALESCE(SUM(total_price), 0) 
      FROM estimate_materials 
      WHERE estimate_id = COALESCE(NEW.estimate_id, OLD.estimate_id)
    ),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.estimate_id, OLD.estimate_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER trigger_update_estimate_total_price
  AFTER INSERT OR UPDATE OR DELETE ON estimate_materials
  FOR EACH ROW
  EXECUTE FUNCTION update_estimate_total_price();

-- 9. 뷰 생성 (견적 상세 정보 조회용)
CREATE VIEW estimates_with_details AS
SELECT 
  e.id,
  e.client_id,
  e.client_name,
  e.total_price,
  e.budget,
  e.status,
  e.created_at,
  e.updated_at,
  COALESCE(
    json_agg(
      json_build_object(
        'id', es.id,
        'space_type', es.space_type,
        'space_name', es.space_name,
        'selected', es.selected
      ) ORDER BY es.space_type
    ) FILTER (WHERE es.id IS NOT NULL), 
    '[]'::json
  ) AS spaces,
  COALESCE(
    json_agg(
      json_build_object(
        'id', em.id,
        'material_id', em.material_id,
        'material_name', m.name,
        'material_brand', m.brand,
        'material_category', m.category,
        'material_image_url', m.image_url,
        'material_description', m.description,
        'quantity', em.quantity,
        'unit_price', em.unit_price,
        'total_price', em.total_price,
        'unit', m.unit
      ) ORDER BY em.created_at
    ) FILTER (WHERE em.id IS NOT NULL), 
    '[]'::json
  ) AS materials
FROM estimates e
LEFT JOIN estimate_spaces es ON e.id = es.estimate_id
LEFT JOIN estimate_materials em ON e.id = em.estimate_id
LEFT JOIN materials m ON em.material_id = m.id
GROUP BY e.id
ORDER BY e.created_at DESC;

-- ================================================================
-- 🎉 견적 스키마 생성 완료!
-- ================================================================
-- 다음 단계: Supabase SQL Editor에서 이 스크립트를 실행하세요
-- 1. Supabase Dashboard 접속
-- 2. SQL Editor 메뉴 선택  
-- 3. 위 스크립트 복사 후 실행
-- 4. 테이블 생성 및 샘플 데이터 확인
-- ================================================================
