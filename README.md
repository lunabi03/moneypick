# 머니픽(MoneyPick)

돈이 되는 정보를 한눈에 확인하고, 바로 행동으로 이어지도록 돕는 토스 스타일의 정보 허브입니다. 정부 지원금부터 부업, 할인 혜택까지 사용자의 상황에 맞는 인사이트를 빠르게 제공합니다.

## 핵심 가치

- **신뢰성**: 공공 데이터, 공식 파트너, 검증된 커뮤니티 정보를 기준으로 자동 업데이트
- **개인화**: 연령, 지역, 직업, 관심사에 따라 맞춤 추천
- **행동 유도**: 신청, 지원, 등록 등 필요한 다음 행동을 명확히 안내

## 주요 기능

- **대시보드**
  - 오늘의 하이라이트 카드와 마감 임박 알림
  - 카테고리별 가장 인기 있는 정보 모듈 요약
  - 즐겨찾기/저장 콘텐츠 바로가기

- **카테고리 탐색**
  1. 정부·공공 지원금 / 보조금: 자격 진단, 신청 기한, 지원 난이도 안내 (정부24 데이터 자동 수집)
  2. 부업 / 재택근무 / 프리랜스 수익: 업무 유형, 소득 범위, 요구 스킬 필터
  3. 투자·자산·리셀(실물 경제형 수익): 위험도 인디케이터, 실물 시세 스냅샷
  4. 자기계발·자격증 기반 수익: 예상 학습 기간, 합격률, 교육비 정보
  5. 할인·리워드·절약 정보: 결제수단 호환 여부, 마감 타이머

- **검색 & 필터링**
  - 자연어 검색과 상세 조건 필터(지역, 소득, 난이도 등) 병행
  - 저장된 프로필을 기반으로 기본값 자동 적용

- **데이터 자동 수집**
  - 정부24 및 공공데이터포털에서 지원금/보조금 데이터 자동 수집
  - 매일 자동으로 데이터 갱신 (Vercel Cron Jobs)
  - API를 통한 실시간 데이터 제공

- **알림 & 캘린더 연동**
  - 신청 마감, 신규 혜택, 관심사 업데이트 푸시
  - 캘린더·리마인더 연동으로 일정 관리 지원

- **가이드 & 커뮤니티**
  - 혜택 신청 튜토리얼, FAQ, 사용자 후기 큐레이션
  - 신뢰도 점수, 데이터 출처 표시로 투명성 확보

## 디자인 시스템 (토스 레퍼런스)

- **타이포그래피**: Pretendard(기본), Apple SD 산돌고딕 Neo(대체)
- **컬러 토큰**
  - Primary: `#3182F6`
  - Success: `#4ECB71`
  - Background: `#F9FBFC`
  - Text Primary: `#111111`
  - Text Secondary: `#4C4C4C`
- **컴포넌트**
  - 카드: Radius 16px, Soft Shadow, 라인 아이콘
  - 버튼: 단색, Radius 999px, 프라이머리 블루/화이트
  - 배지: `#EFF3FA` 배경 + 블루 텍스트

## 시작하기

### 필수 요구사항

- Node.js 18.0 이상
- npm 또는 yarn

### 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정:
```bash
# .env.local 파일 생성
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Google OAuth (선택사항)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Kakao OAuth (선택사항)
KAKAO_CLIENT_ID=your_kakao_client_id_here
KAKAO_CLIENT_SECRET=your_kakao_client_secret_here

# 데이터 수집 (선택사항)
PUBLIC_DATA_API_KEY=your_api_key_here
CRON_SECRET=your_cron_secret_here
```

### OAuth 설정 (구글/카카오 로그인)

#### Google OAuth 설정
1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI에 추가: `http://localhost:3000/api/auth/google/callback` (개발), `https://your-domain.com/api/auth/google/callback` (프로덕션)
4. `.env.local`에 `GOOGLE_CLIENT_ID`와 `GOOGLE_CLIENT_SECRET` 설정

#### Kakao OAuth 설정
1. [Kakao Developers](https://developers.kakao.com/)에서 앱 생성
2. 플랫폼 설정에서 사이트 도메인 등록
3. 카카오 로그인 활성화
4. Redirect URI 등록: `http://localhost:3000/api/auth/kakao/callback` (개발), `https://your-domain.com/api/auth/kakao/callback` (프로덕션)
5. `.env.local`에 `KAKAO_CLIENT_ID`와 `KAKAO_CLIENT_SECRET` 설정

**참고**: OAuth 설정 없이도 일반 이메일/비밀번호 로그인은 사용할 수 있습니다.

3. 개발 서버 실행:
```bash
npm run dev
```

4. 브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

### 빌드

프로덕션 빌드를 생성하려면:

```bash
npm run build
npm start
```

## API 엔드포인트

### GET /api/government-programs
정부 지원금/보조금 데이터를 가져옵니다.

**쿼리 파라미터:**
- `refresh=true`: 데이터를 강제로 새로고침

**응답:**
```json
{
  "programs": [...],
  "lastUpdated": "2024-01-01T00:00:00.000Z",
  "total": 10
}
```

### POST /api/government-programs/refresh
데이터를 강제로 새로고침합니다. (Cron Jobs에서 사용)

**헤더:**
- `Authorization: Bearer {CRON_SECRET}`

## 데이터 자동 갱신

Vercel에 배포하면 `vercel.json`에 설정된 Cron Job이 매일 오전 2시에 자동으로 데이터를 갱신합니다.

수동으로 갱신하려면:
```bash
curl -X POST https://your-domain.com/api/government-programs/refresh \
  -H "Authorization: Bearer {CRON_SECRET}"
```

## 프로젝트 구조

```
moneypick/
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx           # 홈 페이지
│   ├── category/          # 카테고리별 페이지
│   ├── search/            # 검색 페이지
│   └── api/               # API 라우트
│       └── government-programs/
├── components/             # React 컴포넌트
│   ├── ui/                # 기본 UI 컴포넌트
│   ├── layout/            # 레이아웃 컴포넌트
│   └── cards/             # 카드 컴포넌트
├── lib/                    # 유틸리티 및 데이터 처리
│   ├── data-collector.ts  # 데이터 수집 로직
│   ├── data-storage.ts    # 데이터 저장/로드
│   └── types.ts           # TypeScript 타입 정의
├── docs/                  # 문서
└── data/                  # 저장된 데이터 (gitignore)
```

## 주요 기능 구현 현황

- ✅ 홈 대시보드 (하이라이트 카드, 카테고리별 요약)
- ✅ 5개 카테고리 페이지 (정부지원, 부업, 투자, 자기계발, 할인)
- ✅ 검색 및 필터 기능
- ✅ 반응형 디자인 (모바일/태블릿/데스크톱)
- ✅ 토스 스타일 디자인 시스템 적용
- ✅ 정부24 데이터 자동 수집 시스템
- ✅ API 엔드포인트 (데이터 제공 및 갱신)
- ✅ 자동 갱신 스케줄러 (Vercel Cron Jobs)
- ✅ 사용자 인증 (이메일/비밀번호, 구글, 카카오)
- ✅ 소셜 로그인 (구글, 카카오톡)
- ⏳ 자격 진단 기능 (예정)
- ⏳ 즐겨찾기/저장 기능 (예정)
- ⏳ 알림 기능 (예정)

## 데이터 소스

- **정부24**: https://www.gov.kr/portal/rcvfvrSvc/main/nonLogin
- **공공데이터포털**: https://www.data.go.kr/ (API 키 필요)

## 관련 문서

- `/docs/design/style-guide.md` : 디자인 시스템 스타일 가이드
- `/docs/design/ui-wireframes.md` : UI 와이어프레임 가이드
- `/docs/plan/next-steps.md` : 상세한 다음 단계 실행 계획

## 배포

Vercel에 배포하면 자동으로 Cron Jobs가 설정됩니다:

1. GitHub에 푸시
2. Vercel에서 프로젝트 연결
3. 환경 변수 설정 (`PUBLIC_DATA_API_KEY`, `CRON_SECRET`)
4. 자동 배포 및 Cron Jobs 활성화

기여를 원하신다면 이슈 템플릿을 활용해 개선 아이디어나 새로운 데이터 소스를 제안해주세요.
