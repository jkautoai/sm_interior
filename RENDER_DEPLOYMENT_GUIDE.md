# 🚀 Render 배포 가이드

## 📋 배포 준비사항

### ✅ 완료된 항목들
- [x] Supabase 프로젝트 설정 완료
- [x] 데이터베이스 스키마 생성 완료  
- [x] React 앱 Supabase 연동 완료
- [x] PHP 백엔드 제거 완료
- [x] 환경변수 보안 설정 완료

## 🔧 Render 배포 단계

### 1단계: GitHub 리포지토리 준비

```bash
# Git 리포지토리 초기화 (아직 안했다면)
git init

# 모든 파일 추가
git add .

# 커밋 생성
git commit -m "feat: Supabase 마이그레이션 완료 - 배포 준비"

# GitHub에 리포지토리 생성 후 연결
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2단계: Render에서 Static Site 생성

1. **Render 웹사이트 접속**: https://render.com
2. **로그인/회원가입** (GitHub 계정 연동 권장)
3. **"New +" 버튼 클릭**
4. **"Static Site" 선택**
5. **GitHub 리포지토리 연결**

### 3단계: 빌드 설정

```yaml
# 자동으로 감지되는 설정
Build Command: npm install && npm run build
Publish Directory: dist
```

### 4단계: 환경변수 설정

Render Dashboard에서 **Environment Variables** 추가:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `YOUR_SUPABASE_PROJECT_URL` |
| `VITE_SUPABASE_ANON_KEY` | `YOUR_SUPABASE_ANON_KEY` |

> ⚠️ **중요**: Supabase Dashboard → Settings → API에서 키 값들을 복사해서 사용하세요!

### 5단계: 배포 완료!

- **자동 배포**: GitHub에 push할 때마다 자동으로 재배포됩니다
- **배포 시간**: 약 2-3분 소요
- **무료 계정**: 월 750시간 무료 (개인 프로젝트에 충분)

## 🔗 배포 후 확인사항

### ✅ 기능 테스트 체크리스트

- [ ] 웹사이트 로딩 확인
- [ ] 고객 관리 기능 (추가/수정/삭제)
- [ ] 자재 목록 표시
- [ ] 견적 작성 기능
- [ ] 실시간 업데이트 작동

### 🐛 문제 해결

**Q: 빌드 실패시?**
- package.json의 dependencies 확인
- 환경변수 설정 확인
- Build 로그에서 에러 메시지 확인

**Q: 환경변수 문제?**
- VITE_ 접두사 확인
- Supabase 키 값 재확인
- Render에서 환경변수 올바르게 설정되었는지 확인

**Q: 라우팅 문제 (404 에러)?**
- render.yaml의 routes 설정 확인
- React Router와 정적 호스팅 호환성 확인

## 💰 비용 안내

### Render 무료 플랜
- ✅ **Static Sites**: 무제한 무료
- ✅ **대역폭**: 월 100GB 무료
- ✅ **SSL**: 무료 제공
- ✅ **Custom Domain**: 무료 지원

### Supabase 무료 플랜
- ✅ **데이터베이스**: 최대 500MB
- ✅ **API 요청**: 월 50,000회
- ✅ **실시간 연결**: 동시 200개
- ✅ **인증**: 월 50,000명 활성 사용자

**결론**: 중소 인테리어업체 사용에는 **완전 무료**로 충분합니다! 🎉

## 🔒 보안 고려사항

1. **Row Level Security (RLS)**: 이미 설정됨
2. **환경변수**: GitHub에 업로드되지 않음
3. **HTTPS**: Render에서 자동 제공
4. **API Keys**: Supabase Anon Key는 공개되어도 안전 (RLS로 보호)

## 📞 지원

문제가 발생하면:
- Render 문서: https://render.com/docs
- Supabase 문서: https://supabase.com/docs
- 또는 개발자에게 문의하세요! 😊
