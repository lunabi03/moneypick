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

# 데이터 수집 (선택사항)
PUBLIC_DATA_API_KEY=your_api_key_here
CRON_SECRET=your_cron_secret_here
```

### OAuth 설정 (구글 로그인)

이 프로젝트는 구글(Google) 소셜 로그인을 지원합니다. Supabase를 사용하는 경우와 직접 구현하는 경우 두 가지 방법이 있습니다.

#### Supabase를 사용한 소셜 로그인 설정

Supabase를 사용하면 인증 관리가 더 간편합니다. Supabase에서 소셜 로그인을 설정하는 방법입니다.

##### 1단계: Supabase 프로젝트 생성 및 설정

1. [Supabase](https://supabase.com/)에 접속하여 계정을 생성하거나 로그인합니다.
2. **New Project** 버튼을 클릭하여 새 프로젝트를 생성합니다.
3. 프로젝트 정보 입력:
   - **Name**: `MoneyPick` (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 설정 (반드시 저장해 두세요)
   - **Region**: 가장 가까운 리전 선택
4. 프로젝트가 생성될 때까지 몇 분 기다립니다.

##### 2단계: Supabase 프로젝트 URL 및 콜백 URL 확인

1. 프로젝트 대시보드에서 **Settings** → **API** 메뉴로 이동합니다.
2. 다음 정보를 확인하고 복사해 둡니다:
   - **Project URL**: `https://xxxxx.supabase.co` 형식
   - **anon/public key**: 공개 API 키
   - **service_role key**: 서비스 역할 키 (서버 사이드에서만 사용)
3. **Supabase 인증 콜백 URL** 확인:
   - Project URL에 `/auth/v1/callback`을 추가합니다.
   - 예: `https://gewhnzsljwravvrxryny.supabase.co/auth/v1/callback`
   - 이 URL은 Google OAuth 설정 시 **승인된 리디렉션 URI**에 추가해야 합니다.

##### 3단계: Supabase에서 구글 로그인 활성화

1. Supabase 프로젝트 대시보드에서 **Authentication** → **Providers**를 선택합니다.
2. **Google** 프로바이더를 찾아 **Enable Google** 토글을 켭니다.
3. 다음 정보를 입력합니다 (아래 "Google OAuth 설정" 섹션에서 생성한 값):
   - **Client ID (for OAuth)**: Google Cloud Console에서 복사한 클라이언트 ID
   - **Client Secret (for OAuth)**: Google Cloud Console에서 복사한 클라이언트 보안 비밀번호
4. **Save** 버튼을 클릭합니다.

##### 4단계: Supabase 리디렉션 URL 설정

1. **Authentication** → **URL Configuration** 메뉴로 이동합니다.
2. **Redirect URLs** 섹션에 다음 URL들을 추가합니다:
   ```
   http://localhost:3000/auth/callback
   https://your-project.vercel.app/auth/callback
   ```
   ⚠️ **중요**: `your-project.vercel.app`을 실제 Vercel 프로젝트 도메인으로 변경하세요!
3. **Site URL**에 기본 URL을 설정합니다:
   - 개발: `http://localhost:3000`
   - 프로덕션: `https://your-project.vercel.app` (실제 Vercel 도메인으로 변경)
4. **Save** 버튼을 클릭합니다.

##### 5단계: 환경 변수 설정 (Supabase)

프로젝트 루트의 `.env.local` 파일에 다음을 추가합니다:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**참고**: Supabase를 사용하는 경우, Google의 Client ID/Secret은 Supabase 대시보드에서 관리하므로 환경 변수에 추가할 필요가 없습니다.

---

#### 직접 구현 방식 (Supabase 미사용)

Supabase를 사용하지 않고 직접 OAuth를 구현하는 경우의 설정 방법입니다.

#### Google OAuth 설정

##### 1단계: Google Cloud Console 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속하여 Google 계정으로 로그인합니다.
2. 상단의 프로젝트 선택 드롭다운에서 **새 프로젝트**를 클릭합니다.
3. 프로젝트 정보 입력:
   - **프로젝트 이름**: `MoneyPick` (또는 원하는 이름)
   - **조직**: 선택사항
   - **위치**: 선택사항
4. **만들기** 버튼을 클릭하고 프로젝트가 생성될 때까지 기다립니다 (약 1-2분).

##### 2단계: OAuth 동의 화면 설정

1. 왼쪽 메뉴에서 **API 및 서비스** → **OAuth 동의 화면**을 선택합니다.
2. **사용자 유형** 선택:
   - **외부**: 일반 사용자도 사용할 수 있는 앱 (대부분의 경우)
   - **내부**: Google Workspace 조직 내부용
   - **외부**를 선택하고 **만들기**를 클릭합니다.
3. **앱 정보** 입력:
   - **앱 이름**: `MoneyPick` (또는 원하는 이름)
   - **사용자 지원 이메일**: 본인의 이메일 주소 선택
   - **앱 로고**: 선택사항 (256x256px 권장)
   - **앱 도메인**: 프로덕션 도메인 (예: `https://moneypick.com`)
   - **개발자 연락처 정보**: 본인의 이메일 주소
4. **저장 후 계속**을 클릭합니다.
5. **범위** 단계:
   - 기본 범위(`email`, `profile`, `openid`)가 자동으로 추가됩니다.
   - 추가 범위가 필요하면 여기서 추가할 수 있습니다.
   - **저장 후 계속**을 클릭합니다.
6. **테스트 사용자** 단계:
   - 앱이 아직 검토되지 않은 경우, 테스트 사용자로 등록된 계정만 로그인할 수 있습니다.
   - **+ ADD USERS**를 클릭하여 본인의 이메일 주소를 추가합니다.
   - **저장 후 계속**을 클릭합니다.
7. **요약** 단계에서 정보를 확인하고 **대시보드로 돌아가기**를 클릭합니다.

##### 3단계: OAuth 2.0 클라이언트 ID 생성

1. 왼쪽 메뉴에서 **API 및 서비스** → **사용자 인증 정보**를 선택합니다.
2. 상단의 **+ 사용자 인증 정보 만들기** → **OAuth 클라이언트 ID**를 선택합니다.
3. **애플리케이션 유형**: **웹 애플리케이션**을 선택합니다.
4. **이름**: `MoneyPick Web Client` (또는 원하는 이름)를 입력합니다.
5. **승인된 JavaScript 원본**에 다음 URL들을 각각 추가합니다:
   ```
   http://localhost:3000
   https://your-domain.com
   ```
   - 각 URL을 입력한 후 **+ URI 추가**를 클릭합니다.
6. **승인된 리디렉션 URI**에 다음 URL들을 각각 추가합니다:
   ```
   http://localhost:3000/api/auth/google/callback
   https://your-domain.com/api/auth/google/callback
   ```
   - 각 URL을 입력한 후 **+ URI 추가**를 클릭합니다.
   - **중요**: 정확한 경로(`/api/auth/google/callback`)를 포함해야 합니다.
7. **만들기** 버튼을 클릭합니다.
8. 팝업 창에서 다음 정보를 복사해 둡니다:
   - **클라이언트 ID**: 나중에 환경 변수에 사용
   - **클라이언트 보안 비밀번호**: 나중에 환경 변수에 사용
   - **중요**: 클라이언트 보안 비밀번호는 이 창을 닫으면 다시 볼 수 없으므로 반드시 복사해 둡니다.

##### 4단계: 환경 변수 설정

프로젝트 루트의 `.env.local` 파일에 다음을 추가합니다:

```bash
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

**예시**:
```bash
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
```

##### 5단계: 테스트

1. 개발 서버를 실행합니다:
   ```bash
   npm run dev
   ```
2. 브라우저에서 `http://localhost:3000/login`으로 이동합니다.
3. **구글로 로그인** 버튼을 클릭합니다.
4. Google 계정 선택 화면이 나타나고, 로그인 후 권한 승인 화면이 표시되어야 합니다.
5. 권한을 승인하면 리디렉션되어 로그인이 완료됩니다.

**문제 해결**:
- `redirect_uri_mismatch` 오류: 승인된 리디렉션 URI가 정확히 일치하는지 확인하세요.
- `access_denied` 오류: OAuth 동의 화면에서 테스트 사용자로 본인 이메일을 추가했는지 확인하세요.

---

#### 프로덕션 환경 설정

프로덕션 환경(Vercel 등)에 배포할 때는 다음을 확인하세요:

1. **환경 변수 설정**:
   - Vercel 대시보드에서 **Settings** → **Environment Variables**로 이동합니다.
   - 개발 환경에서 설정한 모든 환경 변수를 추가합니다.
   - 각 변수에 대해 **Production**, **Preview**, **Development** 환경을 선택합니다.

2. **Supabase 리디렉션 URL 설정** (⚠️ **가장 중요**):
   - Supabase 대시보드 → **Authentication** → **URL Configuration**으로 이동합니다.
   - **Site URL** 필드를 확인하고 프로덕션 도메인으로 설정합니다:
     ```
     https://your-project.vercel.app
     ```
     ⚠️ **Site URL이 `http://localhost:3000`으로 되어 있으면 프로덕션에서 localhost로 리다이렉트됩니다!**
   - **Redirect URLs** 섹션에 다음 URL들을 추가합니다:
     ```
     http://localhost:3000/auth/callback
     https://your-project.vercel.app/auth/callback
     ```
     ⚠️ `your-project.vercel.app`을 실제 Vercel 프로젝트 도메인으로 변경하세요!
   - 각 URL을 한 줄씩 입력하고 **+ Add** 버튼을 클릭합니다.
   - **Save** 버튼을 클릭합니다.

3. **Google Cloud Console 리디렉션 URI 업데이트** (Supabase 사용 시):
   - Google Cloud Console → **API 및 서비스** → **사용자 인증 정보**로 이동합니다.
   - OAuth 클라이언트의 **승인된 리디렉션 URI**에 Supabase 콜백 URL이 이미 추가되어 있는지 확인합니다:
     ```
     https://xxxxx.supabase.co/auth/v1/callback
     ```
   - 이 URL은 Supabase가 자동으로 처리하므로, 웹사이트의 프로덕션 URL을 추가할 필요는 없습니다.

4. **테스트**:
   - 프로덕션 환경에서 소셜 로그인이 정상적으로 작동하는지 확인합니다.

---

**참고**: 
- OAuth 설정 없이도 일반 이메일/비밀번호 로그인은 사용할 수 있습니다.
- Supabase를 사용하는 경우: `/docs/supabase-social-login-setup.md` 문서를 참고하세요.
- Supabase를 사용하지 않는 경우: 위의 "직접 구현 방식" 섹션을 따르세요.

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
- ✅ 사용자 인증 (이메일/비밀번호, 구글)
- ✅ 소셜 로그인 (구글)
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
- `/docs/supabase-social-login-setup.md` : Supabase 구글 로그인 설정 가이드

## 배포

Vercel에 배포하면 자동으로 Cron Jobs가 설정됩니다:

1. GitHub에 푸시
2. Vercel에서 프로젝트 연결
3. **환경 변수 설정** (아래 참고)
4. 자동 배포 및 Cron Jobs 활성화

### Vercel 환경 변수 설정

Vercel 대시보드 → **Settings** → **Environment Variables**에서 다음 변수들을 추가하세요:

#### 필수 환경 변수
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL (Settings → API에서 확인)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 공개 API 키 (Settings → API에서 확인)

#### 권장 환경 변수
- `NEXT_PUBLIC_BASE_URL`: 프로덕션 도메인 URL (예: `https://your-project.vercel.app`)

#### 선택사항 환경 변수
- `PUBLIC_DATA_API_KEY`: 공공데이터포털 API 키 (데이터 수집용)
- `CRON_SECRET`: Cron Job 인증 키 (임의의 긴 문자열)

**자세한 설정 방법**: `/docs/vercel-environment-variables.md` 문서를 참고하세요.

기여를 원하신다면 이슈 템플릿을 활용해 개선 아이디어나 새로운 데이터 소스를 제안해주세요.
