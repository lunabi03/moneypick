# Vercel Environment Variables 설정 가이드

이 문서는 Vercel에 배포할 때 설정해야 하는 환경 변수 목록과 각 변수의 값을 어디서 찾는지 안내합니다.

## 필수 환경 변수

### 1. Supabase 설정 (필수)

#### `NEXT_PUBLIC_SUPABASE_URL`
- **설명**: Supabase 프로젝트 URL
- **값 찾는 방법**:
  1. Supabase 대시보드 접속
  2. 프로젝트 선택
  3. **Settings** → **API** 메뉴
  4. **Project URL** 복사
- **예시**: `https://gewhnzsljwravvrxryny.supabase.co`
- **중요**: `NEXT_PUBLIC_` 접두사가 있어야 클라이언트에서 접근 가능합니다.

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **설명**: Supabase 공개 API 키 (anon/public key)
- **값 찾는 방법**:
  1. Supabase 대시보드 접속
  2. 프로젝트 선택
  3. **Settings** → **API** 메뉴
  4. **anon/public** 키 복사
- **예시**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **중요**: `NEXT_PUBLIC_` 접두사가 있어야 클라이언트에서 접근 가능합니다.

### 2. Base URL 설정 (권장)

#### `NEXT_PUBLIC_BASE_URL`
- **설명**: 애플리케이션의 기본 URL
- **개발 환경**: `http://localhost:3000`
- **프로덕션 환경**: Vercel 배포 후 자동 생성된 도메인 또는 커스텀 도메인
- **예시**: 
  - 개발: `http://localhost:3000`
  - 프로덕션: `https://your-project.vercel.app` 또는 `https://your-domain.com`
- **참고**: Vercel에 배포하면 자동으로 도메인이 생성되므로, 배포 후 해당 도메인을 사용하세요.

---

## 선택사항 환경 변수

### 3. 데이터 수집 API (선택사항)

#### `PUBLIC_DATA_API_KEY`
- **설명**: 공공데이터포털 API 키 (정부 데이터 수집용)
- **값 찾는 방법**:
  1. [공공데이터포털](https://www.data.go.kr/) 접속
  2. 회원가입 및 로그인
  3. 마이페이지 → 인증키 관리
  4. 인증키 복사
- **참고**: 이 변수가 없어도 기본 샘플 데이터로 동작합니다.

#### `CRON_SECRET`
- **설명**: Cron Job 인증용 비밀 키
- **용도**: `/api/government-programs/refresh` 엔드포인트 보호
- **생성 방법**: 임의의 긴 문자열 생성 (예: `openssl rand -hex 32`)
- **예시**: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`
- **참고**: 이 변수가 없으면 데이터 자동 갱신 기능이 작동하지 않습니다.

---

## Vercel에 환경 변수 추가하는 방법

### 1단계: Vercel 대시보드 접속
1. [Vercel](https://vercel.com/)에 로그인
2. 프로젝트 선택

### 2단계: Environment Variables 메뉴로 이동
1. 프로젝트 대시보드에서 **Settings** 클릭
2. 왼쪽 메뉴에서 **Environment Variables** 선택

### 3단계: 환경 변수 추가
각 환경 변수를 하나씩 추가합니다:

1. **Key** 입력란에 변수 이름 입력 (예: `NEXT_PUBLIC_SUPABASE_URL`)
2. **Value** 입력란에 실제 값 입력 (예: `https://gewhnzsljwravvrxryny.supabase.co`)
3. **Environment** 선택:
   - **Production**: 프로덕션 환경에서만 사용
   - **Preview**: 프리뷰 환경에서만 사용
   - **Development**: 개발 환경에서만 사용
   - **모두 선택 가능**: 모든 환경에서 사용 (권장)
4. **Add** 버튼 클릭

### 4단계: 반복
위 과정을 모든 환경 변수에 대해 반복합니다.

---

## 환경 변수 설정 체크리스트

### 필수 항목
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase 프로젝트 URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase 공개 API 키

### 권장 항목
- [ ] `NEXT_PUBLIC_BASE_URL` - 프로덕션 도메인 URL

### 선택 항목
- [ ] `PUBLIC_DATA_API_KEY` - 공공데이터 API 키 (데이터 수집용)
- [ ] `CRON_SECRET` - Cron Job 인증 키

---

## 환경 변수 값 예시

```bash
# 필수
NEXT_PUBLIC_SUPABASE_URL=https://gewhnzsljwravvrxryny.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdld2huenNsand2YXZ2cnhyeW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 권장
NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app

# 선택사항
PUBLIC_DATA_API_KEY=your_public_data_api_key_here
CRON_SECRET=your_random_secret_key_here
```

---

## 주의사항

1. **`NEXT_PUBLIC_` 접두사**: 
   - 클라이언트 사이드에서 접근 가능한 변수는 반드시 `NEXT_PUBLIC_` 접두사가 필요합니다.
   - 이 접두사가 없으면 클라이언트에서 `undefined`로 표시됩니다.

2. **보안**:
   - `NEXT_PUBLIC_` 접두사가 있는 변수는 브라우저에서 접근 가능하므로 민감한 정보를 넣지 마세요.
   - `SUPABASE_SERVICE_ROLE_KEY`는 서버 사이드에서만 사용하므로 `NEXT_PUBLIC_` 접두사를 붙이지 않습니다.

3. **환경별 설정**:
   - Production, Preview, Development 환경에 따라 다른 값을 설정할 수 있습니다.
   - 대부분의 경우 모든 환경에서 동일한 값을 사용하는 것이 편리합니다.

4. **변경 후 재배포**:
   - 환경 변수를 추가하거나 수정한 후에는 **Redeploy**가 필요합니다.
   - Vercel 대시보드에서 **Deployments** → 최신 배포 → **Redeploy** 클릭

---

## 문제 해결

### 환경 변수가 적용되지 않는 경우
1. 변수 이름이 정확한지 확인 (대소문자 구분)
2. `NEXT_PUBLIC_` 접두사가 필요한 변수에 붙였는지 확인
3. 환경 변수 추가 후 재배포했는지 확인
4. 브라우저 캐시를 지우고 다시 시도

### Supabase 연결 오류
1. `NEXT_PUBLIC_SUPABASE_URL`이 올바른지 확인
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 올바른지 확인
3. Supabase 프로젝트가 활성화되어 있는지 확인

---

## 참고 자료

- [Vercel 환경 변수 문서](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase 시작 가이드](https://supabase.com/docs/guides/getting-started)
- [Next.js 환경 변수 문서](https://nextjs.org/docs/basic-features/environment-variables)

