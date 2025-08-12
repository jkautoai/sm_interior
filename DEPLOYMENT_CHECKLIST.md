# 🚀 배포 체크리스트

## 📋 배포 전 준비사항

### ✅ **코드 준비**
- [ ] 모든 기능 테스트 완료
- [ ] ESLint 오류 해결
- [ ] TypeScript 컴파일 오류 해결
- [ ] Console.log 제거 (production용)
- [ ] 민감 정보 환경변수 분리
- [ ] Build 테스트 (`npm run build`)

### ✅ **Supabase 설정**
- [ ] Supabase 프로젝트 생성
- [ ] Database 스키마 실행
- [ ] Row Level Security (RLS) 설정
- [ ] Realtime 활성화
- [ ] API Keys 확인

### ✅ **환경변수 준비**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🌐 Render 배포

### 1️⃣ **사전 준비**
- [ ] GitHub 리포지토리 생성
- [ ] 코드 Push 완료
- [ ] Render 계정 생성

### 2️⃣ **배포 설정**
1. **Render Dashboard** 접속
2. **"New +" → "Static Site"** 선택
3. **GitHub 연결**
4. **리포지토리 선택**
5. **설정 입력**:
   ```yaml
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

### 3️⃣ **환경변수 설정**
- [ ] `VITE_SUPABASE_URL` 추가
- [ ] `VITE_SUPABASE_ANON_KEY` 추가

### 4️⃣ **배포 확인**
- [ ] 빌드 성공 확인
- [ ] 웹사이트 접속 테스트
- [ ] 모든 기능 작동 확인

### 5️⃣ **커스텀 도메인 (선택사항)**
- [ ] 도메인 구입
- [ ] DNS 설정
- [ ] SSL 인증서 자동 발급 확인

## ⚡ Vercel 배포

### 1️⃣ **Vercel CLI 방법**
```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 프로젝트 배포
vercel

# 환경변수 설정
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Production 배포
vercel --prod
```

### 2️⃣ **Vercel Dashboard 방법**
1. **[Vercel Dashboard](https://vercel.com/dashboard)** 접속
2. **"Import Project"** 클릭
3. **GitHub 리포지토리 선택**
4. **환경변수 설정**
5. **Deploy** 클릭

### 3️⃣ **배포 확인**
- [ ] 자동 배포 확인
- [ ] Preview URL 테스트
- [ ] Production URL 테스트
- [ ] Performance 점수 확인

## 🤖 GitHub Actions 설정

### 1️⃣ **Repository Secrets 설정**
GitHub Repository → Settings → Secrets → Actions

**Vercel 배포용**:
- [ ] `VERCEL_TOKEN` - Vercel 토큰
- [ ] `VERCEL_ORG_ID` - Organization ID  
- [ ] `VERCEL_PROJECT_ID` - Project ID

**환경변수**:
- [ ] `VITE_SUPABASE_URL` - Supabase URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Supabase Anon Key

### 2️⃣ **워크플로우 파일 확인**
- [ ] `.github/workflows/deploy.yml` 파일 존재
- [ ] 모든 step 정상 작동 확인
- [ ] Branch protection rules 설정

## 🔍 배포 후 검증

### ✅ **기능 테스트**
- [ ] 홈페이지 로딩
- [ ] 고객 관리 (추가/수정/삭제)
- [ ] 견적 관리 (작성/수정/삭제)
- [ ] 자재 관리 (조회/검색)
- [ ] 데이터뷰 확인
- [ ] 설정 페이지 확인

### ✅ **반응형 테스트**
- [ ] 데스크톱 (1920x1080)
- [ ] 태블릿 (768x1024)
- [ ] 모바일 (375x667)
- [ ] 모바일 햄버거 메뉴

### ✅ **성능 테스트**
- [ ] Lighthouse 점수 확인
- [ ] Core Web Vitals 확인
- [ ] 이미지 최적화 확인
- [ ] Bundle 크기 확인

### ✅ **보안 테스트**
- [ ] HTTPS 강제 확인
- [ ] 환경변수 노출 확인
- [ ] XSS 방지 헤더 확인
- [ ] CSRF 보호 확인

## 🔧 트러블슈팅

### 🚨 **자주 발생하는 문제들**

#### 1. **빌드 실패**
```bash
# 의존성 문제
npm ci
npm run build

# 타입 오류
npm run type-check
```

#### 2. **환경변수 인식 안됨**
- Vite에서는 `VITE_` 접두사 필수
- 배포 플랫폼에서 환경변수 재확인
- 대소문자 정확히 입력

#### 3. **라우팅 404 오류**
- `render.yaml` / `vercel.json` 파일 확인
- SPA rewrites 설정 확인

#### 4. **Supabase 연결 실패**
- URL과 Key 재확인
- RLS 정책 확인
- CORS 설정 확인

### 📞 **지원 요청**
문제 해결이 어려운 경우:
1. **GitHub Issues** 등록
2. **배포 로그** 첨부
3. **에러 메시지** 포함
4. **재현 단계** 상세히 기술

## 🎯 **성공 기준**

### ✅ **배포 성공 조건**
- [ ] 웹사이트 정상 접속 (200 OK)
- [ ] 모든 페이지 라우팅 작동
- [ ] Supabase 데이터 로딩
- [ ] 실시간 업데이트 작동
- [ ] 모바일 반응형 정상
- [ ] Performance Score > 90
- [ ] Accessibility Score > 95

### 🚀 **최적화 후 단계**
- [ ] **CDN 설정** - 이미지 및 정적 파일
- [ ] **도메인 연결** - 브랜딩
- [ ] **Analytics 설정** - Google Analytics
- [ ] **모니터링 설정** - Uptime 체크
- [ ] **백업 전략** - 정기 백업

---

**🎉 축하합니다! 성공적으로 배포가 완료되었습니다!**

> 💡 **팁**: 배포 후에도 정기적인 업데이트와 모니터링을 통해 서비스 품질을 유지하세요.
