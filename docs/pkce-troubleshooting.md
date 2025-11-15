# PKCE Code Verifier 문제 해결 가이드

"invalid request: both auth code and code verifier should be non-empty" 오류가 계속 발생하는 경우 다음을 확인하세요.

## 문제 원인

PKCE (Proof Key for Code Exchange) 플로우에서:
1. 브라우저에서 `signInWithOAuth` 호출 시 code verifier가 생성됨
2. Code verifier가 쿠키에 저장되어야 함
3. OAuth 콜백 시 서버에서 code verifier 쿠키를 읽어야 함
4. Code verifier가 없으면 세션 교환 실패

## 진단 단계

### 1. 브라우저 콘솔 확인

로그인 버튼 클릭 후 콘솔에서 다음을 확인:

```
🔐 Google 로그인 시도
현재 브라우저 쿠키: [...]
Supabase 관련 쿠키: [...]
✅ Google OAuth URL 생성됨, 리다이렉트 중...
```

**문제가 있는 경우:**
- `Supabase 관련 쿠키:`가 비어있음
- `OAuth URL이 생성되지 않았습니다` 메시지

### 2. Vercel 로그 확인

1. Vercel 대시보드 → **Deployments** → 최신 배포
2. **Functions** 탭 → `/auth/callback` 함수 클릭
3. 로그에서 다음 확인:

**정상:**
```
✅ OAuth 코드 수신됨, 세션 교환 시도...
✅ Code verifier 쿠키 발견: sb-xxxxx-auth-token-code-verifier
✅ 세션 교환 성공
```

**문제:**
```
✅ OAuth 코드 수신됨, 세션 교환 시도...
⚠️ Code verifier 쿠키를 찾을 수 없습니다!
예상 쿠키 이름: sb-xxxxx-auth-token-code-verifier
사용 가능한 쿠키: ...
❌ 세션 교환 오류: invalid request: both auth code and code verifier should be non-empty
```

### 3. 브라우저 쿠키 확인

1. 개발자 도구 → **Application** → **Cookies**
2. 사이트 도메인 선택
3. 다음 쿠키 확인:
   - `sb-{project-ref}-auth-token-code-verifier` (Google 로그인 시도 후 생성되어야 함)
   - `sb-{project-ref}-auth-token`

**쿠키가 없는 경우:**
- 브라우저가 쿠키를 차단하고 있을 수 있음
- SameSite 설정 문제
- 도메인/경로 설정 문제

## 해결 방법

### 방법 1: 브라우저 쿠키 설정 확인

1. 브라우저 설정에서 쿠키가 허용되어 있는지 확인
2. 시크릿 모드에서 테스트 (확장 프로그램 비활성화)
3. 다른 브라우저에서 테스트

### 방법 2: Supabase Site URL 확인

1. Supabase 대시보드 → **Authentication** → **URL Configuration**
2. **Site URL**이 정확한 프로덕션 도메인인지 확인:
   ```
   https://your-project.vercel.app
   ```
3. **Redirect URLs**에 프로덕션 URL이 추가되어 있는지 확인

### 방법 3: 쿠키 도메인 확인

브라우저 콘솔에서 다음 실행:

```javascript
// 현재 쿠키 확인
console.log(document.cookie);

// Supabase 쿠키 확인
const cookies = document.cookie.split(';');
const supabaseCookies = cookies.filter(c => c.includes('sb-'));
console.log('Supabase 쿠키:', supabaseCookies);
```

### 방법 4: Vercel 환경 변수 확인

Vercel 대시보드에서:
- `NEXT_PUBLIC_SUPABASE_URL` 설정 확인
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정 확인
- 환경 변수 변경 후 **Redeploy** 실행

### 방법 5: 브라우저 캐시 및 쿠키 완전 삭제

1. 개발자 도구 → **Application** → **Storage**
2. **Clear site data** 클릭
3. 모든 항목 선택 후 삭제
4. 페이지 새로고침 후 다시 로그인 시도

## 추가 디버깅

### Vercel 로그에서 확인할 정보

로그인 시도 후 Vercel 로그에서 다음 정보를 확인하세요:

1. **예상 쿠키 이름**: `sb-{project-ref}-auth-token-code-verifier`
2. **사용 가능한 쿠키**: 실제로 전달된 쿠키 목록
3. **요청 쿠키 헤더**: 쿠키 헤더에 code verifier가 포함되어 있는지

이 정보를 확인하면 문제의 원인을 더 정확히 파악할 수 있습니다.

## 여전히 문제가 있다면

다음 정보를 수집하여 공유해주세요:

1. **브라우저 콘솔 로그** (전체)
2. **Vercel 로그** (`/auth/callback` 함수)
3. **브라우저 쿠키 스크린샷** (Application → Cookies)
4. **Supabase Site URL 설정값**
5. **사용 중인 브라우저 및 버전**

이 정보를 통해 더 정확한 진단이 가능합니다.

