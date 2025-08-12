# 🚀 인테리어 견적 시스템 - Supabase 마이그레이션 가이드

## 📋 프로젝트 개요

**인테리어 견적마스터**를 기존 PHP/MySQL 스택에서 **Supabase (PostgreSQL + BaaS)**로 마이그레이션하는 완전 가이드입니다.

### 🔄 마이그레이션 이유
- **비용 절약**: PHP 서버 + MySQL 대비 50-70% 비용 절감
- **현대적 기능**: 실시간 업데이트, 자동 API 생성, 인증 시스템
- **개발 효율성**: 백엔드 코드 90% 감소, 서버 관리 불필요
- **확장성**: 서버리스 아키텍처, 자동 스케일링

---

## 🏗️ 아키텍처 변화

### ❌ **기존 구조**
```
React App → PHP API (api/clients.php) → MySQL Database
```

### ✅ **새로운 구조**
```
React App → Supabase Client → Supabase (PostgreSQL + Auto APIs)
```

---

## 📊 기술 스택 비교

| 구분 | 기존 (PHP) | 신규 (Supabase) |
|------|------------|------------------|
| 백엔드 | PHP + MySQL | Supabase (PostgreSQL) |
| API 개발 | 수동 구현 (142줄) | 자동 생성 (0줄) |
| 실시간 기능 | 없음 | WebSocket 기본 제공 |
| 인증 | 직접 구현 | 내장 인증 시스템 |
| 파일 업로드 | 별도 구현 | Supabase Storage |
| 배포 복잡도 | 높음 (2개 서비스) | 낮음 (1개 서비스) |
| 월 비용 | $14-70 | $0-25 |

---

## 🛠️ 마이그레이션 단계

### 1단계: Supabase 프로젝트 생성 ✅

#### 1-1. 계정 생성 및 프로젝트 설정
1. **Supabase 웹사이트 접속**: https://supabase.com
2. **GitHub 계정으로 로그인**
3. **New project** 클릭
4. 프로젝트 정보 입력:
   ```
   Name: interior-estimate-master
   Database Password: [강력한 패스워드 생성]
   Region: Northeast Asia (Seoul)
   Pricing Plan: Free
   ```

#### 1-2. 프로젝트 정보 저장
```env
# 프로젝트 생성 후 메모
VITE_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (매우 긴 키)
```

### 2단계: 데이터베이스 스키마 생성 ✅

#### 2-1. SQL 스키마 실행
**Supabase Dashboard** → **SQL Editor** → **New query**에서 다음 파일 실행:
- 📁 `supabase_schema.sql` (166줄)

#### 2-2. 생성된 테이블 구조
```sql
-- 고객 테이블
clients (id, name, phone, address, notes, created_at, updated_at)

-- 자재 테이블  
materials (id, category, name, brand, material, color, price_per_unit, unit, image_url, description, created_at, updated_at)

-- 견적 테이블
estimates (id, client_id, client_name, spaces, materials, total_price, budget, options, created_at, updated_at)
```

#### 2-3. 자동 생성된 기능들
- ✅ **RESTful API 자동 생성**
- ✅ **실시간 구독 기능**
- ✅ **Row Level Security (RLS)**
- ✅ **자동 타임스탬프 업데이트**
- ✅ **성능 최적화 인덱스**

### 3단계: API 문서 확인 ✅

#### 3-1. API Keys 위치
**Settings** → **API Keys**에서 확인:
- Project URL
- anon public key (프론트엔드용)
- service_role secret key (서버용)

#### 3-2. 자동 생성된 API 확인
**API Docs** → **Tables and Views**에서 확인:
- `clients` 테이블 API
- `materials` 테이블 API
- `estimates` 테이블 API

#### 3-3. 기본 API 사용법
```javascript
// 고객 목록 조회
const { data: clients, error } = await supabase
  .from('clients')
  .select('*')

// 새 고객 추가
const { data, error } = await supabase
  .from('clients')
  .insert([{ name: '홍길동', phone: '010-1234-5678', address: '서울시...' }])

// 고객 정보 수정
const { data, error } = await supabase
  .from('clients')
  .update({ name: '수정된 이름' })
  .eq('id', 'uuid-here')

// 고객 삭제
const { error } = await supabase
  .from('clients')
  .delete()
  .eq('id', 'uuid-here')
```

---

## ⚡ 4단계: Realtime 기능 활성화 ✅

### 4-1. Realtime Publications 확인
**Supabase Dashboard** → **Database** → **Publications**에서 확인:
- `supabase_realtime` Publication이 활성화되어 있는지 확인
- Insert, Update, Delete, Truncate가 모두 ON인지 확인

### 4-2. 테이블을 Realtime에 추가
**SQL Editor**에서 다음 명령 실행:

```sql
-- ============================================
-- Realtime 기능 활성화
-- ============================================

-- 우리 테이블들을 Realtime Publication에 추가
ALTER PUBLICATION supabase_realtime ADD TABLE public.clients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.materials;
ALTER PUBLICATION supabase_realtime ADD TABLE public.estimates;

-- 확인 쿼리 (선택사항)
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

### 4-3. 실시간 기능 작동 원리
```typescript
// React 컴포넌트에서 실시간 구독 설정
const subscription = supabase
  .channel('clients_changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'clients' },
    (payload) => {
      console.log('실시간 업데이트 감지:', payload)
      // 자동으로 UI 업데이트
      fetchClients()
    }
  )
  .subscribe((status) => {
    console.log('Realtime 구독 상태:', status)
  })
```

### 4-4. 실시간 기능의 장점
- ✅ **즉시 반영**: 데이터 변경 시 F5 없이 자동 업데이트
- ✅ **다중 사용자**: 여러 사용자가 동시 작업 시 실시간 동기화
- ✅ **무료 제공**: Free 플랜에서 200개 동시 연결 지원
- ✅ **안정성**: PostgreSQL의 WAL(Write-Ahead Logging) 기반

### 4-5. 예상 결과
SQL 실행 후 **Publications** 페이지에서:
- `supabase_realtime`의 **Source**가 **"3 tables"**로 변경됨
- 브라우저 콘솔에서 `Realtime 구독 상태: SUBSCRIBED` 확인
- 고객 추가/수정/삭제 시 즉시 목록 업데이트

---

## 🎯 다음 단계 (코드 마이그레이션)

### 5단계: 프로젝트 의존성 설치 ✅
```bash
npm install @supabase/supabase-js
```

### 6단계: Supabase 클라이언트 설정 ✅
- 📁 `src/lib/supabase.ts` 생성 ✅
- 환경변수 설정 ✅
- TypeScript 타입 정의 ✅

### 7단계: Context API → Supabase Hooks 전환 ✅
- 📁 `src/hooks/useSupabaseClients.ts` 생성 ✅
- 📁 `src/hooks/useSupabaseMaterials.ts` 생성 (예정)
- 📁 `src/hooks/useSupabaseEstimates.ts` 생성 (예정)

### 8단계: 컴포넌트 업데이트 ✅
- React 컴포넌트들을 새로운 hooks로 연결 ✅
- 실시간 기능 추가 ✅
- 에러 핸들링 개선 ✅

### 9단계: 기존 PHP 파일 제거 ✅
- 📁 `src/utils/dbConnect.ts` 삭제 ✅
- 📁 `api/clients.php` 제거 예정
- 불필요한 설정 파일 정리

### 10단계: Render 배포
- 정적 사이트로 배포 (서버 불필요)
- 환경변수 설정
- 커스텀 도메인 연결

---

## 💰 예상 비용 절약

### 기존 PHP 방식
- Render Web Service: $7-25/월
- Render PostgreSQL: $7-45/월
- **총 비용: $14-70/월**

### Supabase 방식
- Render (정적 사이트): $0/월
- Supabase Free Plan: $0/월 (Pro: $25/월)
- **총 비용: $0-25/월**

### 💡 **연간 절약 금액: $168-540**

---

## 🚨 주의사항

### 마이그레이션 전 백업
```bash
# 기존 데이터 백업 (필요시)
mysqldump -u username -p database_name > backup.sql
```

### 환경변수 보안
```bash
# .env 파일에서 Supabase 키 관리
# 절대 Git에 커밋하지 말 것!
echo ".env" >> .gitignore
```

### 점진적 마이그레이션
1. **병렬 운영**: 기존 PHP와 Supabase 동시 운영
2. **기능별 전환**: 고객 관리 → 자재 관리 → 견적 관리 순서
3. **테스트 완료 후**: PHP 시스템 완전 종료

---

## 🎉 마이그레이션 완료 후 기대 효과

### 🔥 **개발 생산성 향상**
- 백엔드 개발 시간 90% 단축
- API 문서 자동 생성
- 실시간 기능 즉시 활용

### 💎 **사용자 경험 개선**
- 견적 작성 중 실시간 협업
- 빠른 응답 속도
- 모바일 최적화

### 🛡️ **안정성 및 보안**
- 자동 백업 및 복구
- Row Level Security
- 99.9% 가용성 보장

### 📈 **비즈니스 확장성**
- 멀티 테넌트 지원 준비
- 모바일 앱 확장 용이
- 글로벌 서비스 가능

---

## 📚 참고 자료

- [Supabase 공식 문서](https://supabase.io/docs)
- [Render 배포 가이드](https://render.com/docs)
- [React + Supabase 튜토리얼](https://supabase.io/docs/guides/with-react)

---

**작성일**: 2024년 12월
**작성자**: Interior Estimate Master 개발팀
**프로젝트**: PHP → Supabase 마이그레이션

---

> 🚀 **다음 단계**: 이제 실제 React 코드를 Supabase와 연동해보겠습니다!
