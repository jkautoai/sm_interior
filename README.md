# 🏠 인테리어 견적마스터

> **현대적인 인테리어 견적 관리 시스템**  
> React + TypeScript + Supabase로 구축된 실시간 견적 관리 웹 애플리케이션

[![Render](https://img.shields.io/badge/Deploy-Render-46E3B7.svg)](https://render.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000.svg)](https://vercel.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E.svg)](https://supabase.com)
[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6.svg)](https://www.typescriptlang.org)

## ✨ 주요 기능

### 📊 **고객 관리**
- ✅ 고객 정보 등록/수정/삭제
- ✅ 고객별 견적 내역 추적
- ✅ 검색 및 필터링
- ✅ 실시간 데이터 동기화

### 📋 **견적 관리**
- ✅ 단계별 견적 작성 (고객 선택 → 공간 선택 → 자재 선택)
- ✅ 자재별 수량/가격 계산
- ✅ 예산 시뮬레이션 (프리미엄/스탠다드/이코노미)
- ✅ 견적서 미리보기 및 PDF 출력
- ✅ 견적 상태 관리 (임시저장/발송/승인/거절)

### 🛠️ **자재 관리**
- ✅ 카테고리별 자재 분류 (바닥재/타일/벽지/조명/가구 등)
- ✅ 자재 정보 관리 (가격/브랜드/색상/이미지)
- ✅ 실시간 재고 연동 준비
- ✅ 대안 자재 추천 시스템

### 📱 **반응형 UI/UX**
- ✅ 데스크톱/태블릿/모바일 완벽 지원
- ✅ 모던한 UI 디자인 (Tailwind CSS)
- ✅ 직관적인 네비게이션
- ✅ 다크모드 준비

### 🔄 **실시간 기능**
- ✅ Supabase Realtime으로 실시간 데이터 동기화
- ✅ 다중 사용자 동시 작업 지원
- ✅ 자동 백업 및 복구

## 🏗️ 기술 스택

### **Frontend**
- **React 18** - 컴포넌트 기반 UI 라이브러리
- **TypeScript** - 타입 안전성 보장
- **Vite** - 빠른 빌드 도구
- **Tailwind CSS** - 유틸리티 CSS 프레임워크
- **React Router** - 클라이언트 사이드 라우팅
- **Lucide React** - 아이콘 라이브러리

### **Backend & Database**
- **Supabase** - PostgreSQL 기반 BaaS
- **PostgreSQL** - 관계형 데이터베이스
- **Row Level Security (RLS)** - 데이터 보안
- **Realtime** - 실시간 데이터 동기화

### **Deployment**
- **Render** - 정적 사이트 호스팅 (추천)
- **Vercel** - 프론트엔드 배포 플랫폼
- **GitHub Actions** - CI/CD 파이프라인

## 🚀 빠른 시작

### 1. 프로젝트 클론

```bash
git clone https://github.com/YOUR_USERNAME/interior-estimator.git
cd interior-estimator
```

### 2. 의존성 설치

```bash
npm install
```

### 3. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. **SQL Editor**에서 스키마 실행:
   ```sql
   -- supabase_schema.sql 파일 내용 실행
   -- supabase_estimates_schema.sql 파일 내용 실행
   ```

### 4. 환경변수 설정

`.env` 파일 생성:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 5. 개발 서버 실행

```bash
npm run dev
```

**🎉 완료!** `http://localhost:5173`에서 확인하세요.

## 📦 배포 가이드

### 🌟 **Render 배포 (추천)**

#### 장점
- ✅ **무료 정적 호스팅**
- ✅ **자동 SSL 인증서**
- ✅ **GitHub 연동**
- ✅ **커스텀 도메인 지원**
- ✅ **간단한 설정**

#### 배포 단계

1. **GitHub 리포지토리 생성**
   ```bash
   git init
   git add .
   git commit -m "feat: 인테리어 견적마스터 완성"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Render 배포**
   - [Render](https://render.com) 접속 및 로그인
   - **"New +" → "Static Site"** 선택
   - **GitHub 리포지토리 연결**
   - **배포 설정**:
     ```yaml
     Build Command: npm install && npm run build
     Publish Directory: dist
     ```

3. **환경변수 설정**
   - Render Dashboard → **Environment Variables**
   - 다음 변수 추가:
     ```
     VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
     VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
     ```

4. **배포 완료**
   - 자동 빌드 및 배포 시작
   - 완료 후 제공되는 URL로 접속

### ⚡ **Vercel 배포**

#### 장점
- ✅ **초고속 배포**
- ✅ **엣지 네트워크**
- ✅ **자동 최적화**
- ✅ **프리뷰 배포**

#### 배포 단계

1. **Vercel CLI 설치**
   ```bash
   npm install -g vercel
   ```

2. **프로젝트 배포**
   ```bash
   vercel
   ```

3. **환경변수 설정**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

4. **재배포**
   ```bash
   vercel --prod
   ```

### 🔧 **자동 배포 설정**

#### GitHub Actions (권장)

`.github/workflows/deploy.yml` 생성:

```yaml
name: Deploy to Render/Vercel

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test --if-present
    
    - name: Build project
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 📊 데이터베이스 스키마

### 주요 테이블

```sql
-- 고객 테이블
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 자재 테이블
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL,
  name VARCHAR(200) NOT NULL,
  brand VARCHAR(100),
  price_per_unit NUMERIC(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 견적 테이블 (정규화된 구조)
CREATE TABLE estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  client_name VARCHAR(100) NOT NULL,
  total_price NUMERIC(12,2) DEFAULT 0,
  budget NUMERIC(12,2),
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 견적-공간 관계 테이블
CREATE TABLE estimate_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
  space_type VARCHAR(50) NOT NULL,
  space_name VARCHAR(100) NOT NULL,
  selected BOOLEAN DEFAULT true
);

-- 견적-자재 관계 테이블
CREATE TABLE estimate_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materials(id),
  quantity NUMERIC(10,2) NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  total_price NUMERIC(12,2) NOT NULL
);
```

## 🎯 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── ui/             # 기본 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Select.tsx
│   ├── layout/         # 레이아웃 컴포넌트
│   │   └── AppLayout.tsx
│   ├── ClientCard.tsx  # 고객 카드
│   └── MaterialCard.tsx # 자재 카드
├── pages/              # 페이지 컴포넌트
│   ├── HomePage.tsx
│   ├── ClientManagePage.tsx
│   ├── EstimateManagePage.tsx
│   ├── EstimateFormPage.tsx
│   ├── DataView.tsx
│   └── SettingsPage.tsx
├── hooks/              # 커스텀 훅
│   ├── useSupabaseClients.ts
│   ├── useSupabaseMaterials.ts
│   └── useSupabaseEstimates.ts
├── context/            # React Context
│   └── AppContext.tsx
├── types/              # TypeScript 타입 정의
│   ├── index.ts
│   └── supabase.ts
├── utils/              # 유틸리티 함수
│   └── helpers.ts
├── lib/                # 라이브러리 설정
│   └── supabase.ts
└── data/               # 모킹 데이터
    └── mockData.ts
```

## 📈 성능 최적화

### 프론트엔드
- ✅ **React 18** - 자동 배칭, Concurrent Features
- ✅ **Vite** - 빠른 HMR과 번들링
- ✅ **Code Splitting** - 지연 로딩
- ✅ **Memoization** - React.memo, useMemo
- ✅ **이미지 최적화** - WebP 포맷 지원

### 백엔드
- ✅ **PostgreSQL 인덱스** - 빠른 쿼리 성능
- ✅ **Connection Pooling** - Supabase 자동 관리
- ✅ **Row Level Security** - 보안과 성능 최적화
- ✅ **실시간 구독** - 필요한 테이블만 구독

## 🔐 보안

### 데이터 보안
- ✅ **Row Level Security (RLS)** - 테이블 레벨 접근 제어
- ✅ **HTTPS 강제** - 모든 통신 암호화
- ✅ **환경변수 분리** - 민감 정보 보호
- ✅ **SQL Injection 방지** - Prepared Statements

### 인증 (향후 계획)
- 🔜 **Supabase Auth** - 이메일/비밀번호 인증
- 🔜 **소셜 로그인** - Google, GitHub 연동
- 🔜 **MFA** - 2단계 인증
- 🔜 **역할 기반 접근 제어** - 관리자/사용자 구분

## 📱 반응형 디자인

### 브레이크포인트
- **모바일**: `< 768px` - 하단 네비게이션, 햄버거 메뉴
- **태블릿**: `768px - 1024px` - 최적화된 그리드 레이아웃
- **데스크톱**: `> 1024px` - 사이드바 네비게이션

### 터치 친화적
- ✅ **큰 터치 영역** (최소 44px)
- ✅ **제스처 지원** - 스와이프, 탭
- ✅ **가독성 최적화** - 적절한 폰트 크기

## 🌍 브라우저 지원

- ✅ **Chrome** 90+
- ✅ **Firefox** 88+  
- ✅ **Safari** 14+
- ✅ **Edge** 90+
- ✅ **모바일 브라우저** - iOS Safari, Chrome Mobile

## 📞 지원 및 문의

### 개발자 연락처
- **이메일**: developer@estimator.kr
- **GitHub**: [프로젝트 리포지토리](https://github.com/YOUR_USERNAME/interior-estimator)

### 기여하기
1. Fork 프로젝트
2. Feature 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push (`git push origin feature/AmazingFeature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참고하세요.

## 🙏 감사의 말

- **Supabase** - 훌륭한 Backend-as-a-Service 제공
- **React 팀** - 혁신적인 UI 라이브러리
- **Tailwind CSS** - 생산적인 CSS 프레임워크
- **Vite 팀** - 빠른 개발 경험

---

**Made with ❤️ by Interior Estimator Team**

> 💡 **팁**: 문제가 발생하면 [Issues](https://github.com/YOUR_USERNAME/interior-estimator/issues)에 등록해주세요!
