#!/bin/bash

# 🚀 인테리어 견적마스터 배포 스크립트

echo "🏠 인테리어 견적마스터 배포를 시작합니다..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 에러 발생시 스크립트 중단
set -e

# 1. 의존성 설치 확인
echo -e "${YELLOW}📦 의존성 확인 중...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📥 의존성 설치 중...${NC}"
    npm install
fi

# 2. 타입 체크
echo -e "${YELLOW}🔍 TypeScript 타입 체크...${NC}"
npm run type-check

# 3. 린트 체크
echo -e "${YELLOW}🔍 ESLint 체크...${NC}"
npm run lint

# 4. 빌드 테스트
echo -e "${YELLOW}🏗️  빌드 테스트...${NC}"
npm run build

echo -e "${GREEN}✅ 모든 검사 완료!${NC}"

# 5. 배포 플랫폼 선택
echo -e "${BLUE}🚀 배포할 플랫폼을 선택하세요:${NC}"
echo "1) Vercel"
echo "2) Render (GitHub Push)"
echo "3) 둘 다"
read -p "선택 (1-3): " choice

case $choice in
    1)
        echo -e "${BLUE}🚀 Vercel 배포 중...${NC}"
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo -e "${RED}❌ Vercel CLI가 설치되지 않았습니다.${NC}"
            echo -e "${YELLOW}다음 명령어로 설치하세요: npm install -g vercel${NC}"
        fi
        ;;
    2)
        echo -e "${BLUE}📤 GitHub에 Push 중... (Render 자동 배포)${NC}"
        git add .
        read -p "커밋 메시지를 입력하세요: " commit_msg
        git commit -m "$commit_msg"
        git push origin main
        echo -e "${GREEN}✅ GitHub Push 완료! Render에서 자동 배포가 시작됩니다.${NC}"
        ;;
    3)
        echo -e "${BLUE}🚀 Vercel 배포 중...${NC}"
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo -e "${YELLOW}⚠️  Vercel CLI가 설치되지 않아 건너뜁니다.${NC}"
        fi
        
        echo -e "${BLUE}📤 GitHub에 Push 중...${NC}"
        git add .
        read -p "커밋 메시지를 입력하세요: " commit_msg
        git commit -m "$commit_msg"
        git push origin main
        echo -e "${GREEN}✅ 모든 플랫폼 배포 완료!${NC}"
        ;;
    *)
        echo -e "${RED}❌ 잘못된 선택입니다.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 배포 완료!${NC}"
echo -e "${BLUE}📍 확인할 URL:${NC}"
echo "   • Vercel: https://interior-estimator.vercel.app"
echo "   • Render: https://interior-estimator.onrender.com"
echo ""
echo -e "${YELLOW}💡 팁: 배포 후 몇 분 정도 기다린 후 접속하세요.${NC}"
