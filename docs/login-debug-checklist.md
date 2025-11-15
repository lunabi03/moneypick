# 로그인 문제 디버깅 체크리스트

로그인이 안 될 때 다음을 순서대로 확인하세요.

## 1. 브라우저 콘솔 확인 (가장 중요!)

1. **F12** 또는 **우클릭 → 검사**로 개발자 도구 열기
2. **Console** 탭 확인
3. 다음 메시지들을 확인:

### ✅ 정상적인 경우
```
✅ Supabase 환경 변수 확인됨
Supabase URL: https://xxxxx.supabase.co
```

### ❌ 문제 발견 시

#### 환경 변수 미설정
```
⚠️ Supabase 환경 변수가 설정되지 않았습니다!
```
**해결**: Vercel 환경 변수 설정 확인

#### 로그인 시도 시
- `🔐 로그인 시도:` 또는 `🔐 Google 로그인 시도` 메시지가 나타나는지 확인
- `❌`로 시작하는 오류 메시지 확인
- 오류 메시지의 전체 내용을 복사

## 2. 로그인 페이지에서 오류 메시지 확인

로그인 페이지에 빨간색 오류 메시지가 표시되는지 확인:
- "이메일과 비밀번호를 확인해주세요"
- "Invalid login credentials"
- "invalid request: both auth code and code verifier should be non-empty"
- 기타 오류 메시지

## 3. 어떤 로그인 방식인지 확인

### 이메일/비밀번호 로그인
- 이메일과 비밀번호가 올바른지 확인
- 회원가입이 완료되었는지 확인
- Supabase 대시보드 → **Authentication** → **Users**에서 사용자 확인

### Google 로그인
- Google 로그인 버튼 클릭 시 Google 인증 페이지로 이동하는지 확인
- Google 인증 후 어떤 페이지로 리다이렉트되는지 확인
- 콘솔에 `✅ Google OAuth URL 생성됨` 메시지가 나타나는지 확인

## 4. Vercel 환경 변수 확인

Vercel 대시보드 → **Settings** → **Environment Variables**에서:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` 설정됨
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정됨
- [ ] `NEXT_PUBLIC_BASE_URL` 설정됨 (선택사항이지만 권장)
- [ ] 모든 환경 변수가 **Production**, **Preview**, **Development**에 설정됨

## 5. Supabase 설정 확인

### Site URL 확인
1. Supabase 대시보드 → **Authentication** → **URL Configuration**
2. **Site URL**이 프로덕션 도메인으로 설정되어 있는지 확인:
   ```
   https://your-project.vercel.app
   ```
   ⚠️ `http://localhost:3000`으로 되어 있으면 프로덕션에서 작동하지 않습니다!

### Redirect URLs 확인
1. 같은 페이지에서 **Redirect URLs** 확인
2. 다음 URL들이 모두 추가되어 있는지 확인:
   ```
   http://localhost:3000/auth/callback
   https://your-project.vercel.app/auth/callback
   ```

### Google Provider 확인
1. **Authentication** → **Providers** → **Google**
2. **Enable Google** 토글이 켜져 있는지 확인
3. **Client ID**와 **Client Secret**이 올바르게 설정되어 있는지 확인

## 6. 네트워크 탭 확인

1. 개발자 도구 → **Network** 탭 열기
2. 로그인 시도
3. 다음 요청들을 확인:

### 이메일/비밀번호 로그인
- `https://xxxxx.supabase.co/auth/v1/token` 요청 확인
- 상태 코드가 **200**인지 확인
- **401**이면 인증 실패 (이메일/비밀번호 오류)
- **400**이면 요청 오류 (환경 변수 문제 가능)

### Google 로그인
- `https://xxxxx.supabase.co/auth/v1/authorize` 요청 확인
- Google 인증 페이지로 리다이렉트되는지 확인
- `/auth/callback`으로 리다이렉트되는지 확인

## 7. Vercel 로그 확인

1. Vercel 대시보드 → **Deployments** → 최신 배포 클릭
2. **Functions** 탭 확인
3. `/auth/callback` 함수의 로그 확인:
   - `✅ OAuth 코드 수신됨` 메시지 확인
   - `✅ Code verifier 쿠키 발견` 메시지 확인
   - `❌`로 시작하는 오류 메시지 확인

## 8. 브라우저 쿠키 확인

1. 개발자 도구 → **Application** → **Cookies** 확인
2. Supabase 관련 쿠키가 있는지 확인:
   - `sb-xxxxx-auth-token`
   - `sb-xxxxx-auth-token-code-verifier` (Google 로그인 시)

## 9. 일반적인 해결 방법

### 문제: 환경 변수 미설정
**해결**: Vercel에서 환경 변수 추가 후 **Redeploy**

### 문제: Supabase Site URL이 localhost
**해결**: Supabase Site URL을 프로덕션 도메인으로 변경

### 문제: Code verifier 쿠키 없음
**해결**: 
- 브라우저 쿠키 지우기
- 다시 로그인 시도
- 최신 코드가 배포되었는지 확인

### 문제: "Invalid login credentials"
**해결**: 
- 이메일/비밀번호 확인
- 회원가입 완료 확인
- Supabase에서 사용자 확인

## 10. 디버깅 정보 수집

문제가 계속되면 다음 정보를 수집하세요:

1. **브라우저 콘솔의 전체 오류 메시지** (스크린샷 또는 복사)
2. **로그인 페이지에 표시된 오류 메시지**
3. **네트워크 탭의 실패한 요청** (상태 코드, 응답 내용)
4. **Vercel 로그의 오류 메시지**
5. **어떤 로그인 방식인지** (이메일/비밀번호 또는 Google)
6. **Supabase Site URL 설정값**
7. **Vercel 환경 변수 설정 상태** (변수 이름만, 값은 공유하지 마세요!)

이 정보들을 함께 제공하면 더 정확한 진단이 가능합니다.

