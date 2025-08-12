-- ============================================
-- 인테리어 견적 시스템 데이터베이스 스키마
-- ============================================

-- 1. 고객 테이블
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 자재 카테고리 ENUM
CREATE TYPE material_category AS ENUM (
    'flooring',
    'tile', 
    'wallpaper',
    'paint',
    'lighting',
    'fixture',
    'furniture',
    'appliance',
    'countertop',
    'cabinet',
    'other'
);

-- 3. 공간 타입 ENUM  
CREATE TYPE space_type AS ENUM (
    'bathroom',
    'kitchen',
    'livingRoom',
    'bedroom',
    'diningRoom',
    'office',
    'hallway',
    'other'
);

-- 4. 자재 테이블
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category material_category NOT NULL,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    material VARCHAR(50),
    color VARCHAR(50),
    price_per_unit DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 견적 테이블
-- estimates 테이블은 새로운 정규화된 구조로 대체됨 (supabase_estimates_schema.sql 참조)

-- ============================================
-- 인덱스 생성 (성능 최적화)
-- ============================================

-- 고객 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_clients_name ON public.clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON public.clients(phone);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients(created_at DESC);

-- 자재 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_materials_category ON public.materials(category);
CREATE INDEX IF NOT EXISTS idx_materials_brand ON public.materials(brand);
CREATE INDEX IF NOT EXISTS idx_materials_name ON public.materials(name);

-- 견적 관련 인덱스는 새로운 스키마에서 정의됨

-- ============================================
-- 샘플 데이터 삽입
-- ============================================

-- 샘플 고객 데이터
INSERT INTO public.clients (name, phone, address, notes) VALUES
('김지민', '010-1234-5678', '서울시 강남구 테헤란로 152', '욕실 및 주방 리모델링 요청'),
('이서연', '010-5678-1234', '서울시 마포구 와우산로 94', '전체 인테리어 공사, 9월 중순 완공 희망'),
('박준호', '010-9876-5432', '경기도 성남시 분당구 판교역로 235', '거실 및 침실 바닥재 교체 문의')
ON CONFLICT DO NOTHING;

-- 샘플 자재 데이터
INSERT INTO public.materials (category, name, brand, material, color, price_per_unit, unit, image_url, description) VALUES
-- 바닥재
('flooring', '프리미엄 원목 마루', '한솔 홈데코', '천연 원목', '내추럴 오크', 85000, '평', 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg', '고급 원목 소재의 프리미엄 마루, 내구성과 디자인 우수'),
('flooring', '강화 마루', '동화 자연마루', '합판', '월넛', 45000, '평', 'https://images.pexels.com/photos/953240/pexels-photo-953240.jpeg', '가성비 좋은 강화 마루, 내수성 우수'),
('flooring', 'PVC 마루', 'LG 하우시스', 'PVC', '그레이 애쉬', 32000, '평', 'https://images.pexels.com/photos/921294/pexels-photo-921294.jpeg', '수분에 강한 PVC 마루, 관리 용이'),

-- 타일
('tile', '이태리 수입 대리석 타일', 'Marazzi', '대리석', '카라라 화이트', 120000, '평', 'https://images.pexels.com/photos/7319334/pexels-photo-7319334.jpeg', '고급 대리석 수입 타일, 고급스러운 공간 연출'),
('tile', '포셀린 타일', '삼현타일', '포셀린', '콘크리트 그레이', 65000, '평', 'https://images.pexels.com/photos/5490380/pexels-photo-5490380.jpeg', '내구성 강한 포셀린 타일, 다양한 공간에 활용 가능'),
('tile', '도기질 타일', '대동타일', '도기질', '화이트 매트', 38000, '평', 'https://images.pexels.com/photos/6444266/pexels-photo-6444266.jpeg', '가성비 좋은 도기질 타일, 욕실/주방에 적합'),

-- 벽지
('wallpaper', '프리미엄 실크 벽지', '신한벽지', '실크', '소프트 베이지', 58000, '평', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg', '고급스러운 질감의 실크 벽지, 내구성 우수'),
('wallpaper', '친환경 벽지', 'LG 하우시스', '비닐', '라이트 그레이', 35000, '평', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', '친환경 인증을 받은 벽지, 유해물질 방출 최소화'),
('wallpaper', '합지 벽지', '코스모스벽지', '합지', '화이트', 22000, '평', 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg', '가성비 좋은 합지 벽지, 다양한 컬러 선택 가능'),

-- 조명
('lighting', '크리스탈 샹들리에', 'FLOS', '크리스탈, 스테인리스', '실버/크리스탈', 950000, '개', 'https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg', '럭셔리한 크리스탈 디자인, 거실/다이닝룸에 최적'),
('lighting', '모던 펜던트 조명', 'IKEA', '알루미늄, 유리', '블랙', 350000, '개', 'https://images.pexels.com/photos/1166642/pexels-photo-1166642.jpeg', '심플한 디자인의 모던 조명, 다양한 공간에 어울림'),
('lighting', 'LED 다운라이트', '필립스', '플라스틱, LED', '화이트', 45000, '개', 'https://images.pexels.com/photos/1042152/pexels-photo-1042152.jpeg', '에너지 효율적인 LED 다운라이트, 설치 간편')
ON CONFLICT DO NOTHING;

-- ============================================
-- Row Level Security (RLS) 설정
-- ============================================

-- RLS 활성화
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
-- estimates RLS는 새로운 스키마에서 설정됨

-- 모든 사용자가 읽기 가능 (현재는 단일 테넌트)
CREATE POLICY "모든 사용자 읽기 가능" ON public.clients FOR SELECT USING (true);
CREATE POLICY "모든 사용자 쓰기 가능" ON public.clients FOR ALL USING (true);

CREATE POLICY "모든 사용자 자재 읽기 가능" ON public.materials FOR SELECT USING (true);
CREATE POLICY "모든 사용자 자재 쓰기 가능" ON public.materials FOR ALL USING (true);

-- estimates 정책은 새로운 스키마에서 설정됨

-- ============================================
-- 자동 업데이트 트리거 함수
-- ============================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON public.materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- estimates 트리거는 새로운 스키마에서 설정됨
