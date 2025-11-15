# 로그인 문제 해결 가이드

Vercel에서 로그인이 안 되는 경우 다음 단계를 따라 확인하세요.

## 1. 브라우저 콘솔 확인

1. Vercel 배포된 사이트에서 **F12** 또는 **우클릭 → 검사**를 눌러 개발자 도구를 엽니다.
2. **Console** 탭을 확인합니다.
3. 다음 메시지들을 확인하세요:

### ✅ 정상적인 경우
```
✅ Supabase 환경 변수 확인됨
Supabase URL: https://xxxxx.supabase.co
```

### ❌ 문제가 있는 경우

#### 환경 변수 미설정
```
⚠️ Supabase 환경 변수가 설정되지 않았습니다!
NEXT_PUBLIC_SUPABASE_URL: ❌ 없음
NEXT_PUBLIC_SUPABASE_ANON_KEY: ❌ 없음
```

**해결 방법:**
- Vercel 대시보드 → **Settings** → **Environment Variables**로 이동
- 다음 변수들을 추가:
  - `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 공개 API 키
- **Redeploy** 실행

#### 로그인 오류
```
❌ 로그인 오류: Invalid login credentials
```

**해결 방법:**
- 이메일과 비밀번호가 올바른지 확인
- 회원가입이 완료되었는지 확인
- Supabase 대시보드 → **Authentication** → **Users**에서 사용자 확인

#### Google 로그인 오류
```
❌ Google 로그인 오류: redirect_uri_mismatch
```

**해결 방법:**
- Supabase 대시보드 → **Authentication** → **URL Configuration** 확인
- **Site URL**이 프로덕션 도메인으로 설정되어 있는지 확인
- **Redirect URLs**에 프로덕션 URL이 추가되어 있는지 확인

## 2. 네트워크 탭 확인

1. 개발자 도구에서 **Network** 탭을 엽니다.
2. 로그인을 시도합니다.
3. 다음 요청들을 확인하세요:

### Supabase 인증 요청
- `https://xxxxx.supabase.co/auth/v1/token` (이메일/비밀번호 로그인)
- `https://xxxxx.supabase.co/auth/v1/authorize` (Google 로그인)

### 오류 상태 코드
- **401**: 인증 실패 (이메일/비밀번호 오류)
- **400**: 잘못된 요청 (환경 변수 문제 가능)
- **500**: 서버 오류 (Supabase 설정 문제)

## 3. Vercel 환경 변수 확인

Vercel 대시보드에서 다음 환경 변수들이 설정되어 있는지 확인:

### 필수 환경 변수
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 공개 API 키

### 권장 환경 변수
- `NEXT_PUBLIC_BASE_URL`: 프로덕션 도메인 (예: `https://your-project.vercel.app`)

**확인 방법:**
1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 각 변수가 **Production**, **Preview**, **Development** 환경에 모두 설정되어 있는지 확인

## 4. Supabase 설정 확인

### Site URL 확인
1. Supabase 대시보드 → **Authentication** → **URL Configuration**
2. **Site URL**이 프로덕션 도메인으로 설정되어 있는지 확인:
   ```
   https://your-project.vercel.app
   ```
   ⚠️ `http://localhost:3000`으로 되어 있으면 프로덕션에서 작동하지 않습니다!

### Redirect URLs 확인
1. 같은 페이지에서 **Redirect URLs** 섹션 확인
2. 다음 URL들이 모두 추가되어 있는지 확인:
   ```
   http://localhost:3000/auth/callback
   https://your-project.vercel.app/auth/callback
   ```

### Google Provider 확인
1. **Authentication** → **Providers** → **Google**
2. **Enable Google** 토글이 켜져 있는지 확인
3. **Client ID**와 **Client Secret**이 올바르게 설정되어 있는지 확인

## 5. 일반적인 문제와 해결 방법

### 문제 1: "Invalid login credentials"
- **원인**: 이메일 또는 비밀번호가 잘못됨
- **해결**: 올바른 이메일/비밀번호로 다시 시도하거나 회원가입

### 문제 2: "Email not confirmed"
- **원인**: 이메일 인증이 완료되지 않음
- **해결**: Supabase에서 이메일 인증을 비활성화하거나 이메일 인증 링크 클릭

### 문제 3: Google 로그인 후 localhost로 리다이렉트
- **원인**: Supabase Site URL이 localhost로 설정됨
- **해결**: Supabase Site URL을 프로덕션 도메인으로 변경

### 문제 4: "redirect_uri_mismatch"
- **원인**: Supabase Redirect URLs에 프로덕션 URL이 없음
- **해결**: Supabase Redirect URLs에 프로덕션 URL 추가

### 문제 5: 환경 변수가 적용되지 않음
- **원인**: 환경 변수 추가 후 재배포하지 않음
- **해결**: Vercel에서 **Redeploy** 실행

### 문제 6: "invalid request: both auth code and code verifier should be non-empty"
- **원인**: Next.js 14+의 쿠키 지연 평가로 인해 PKCE code verifier가 제대로 읽히지 않음
- **해결**: 
  - 코드가 최신 버전으로 업데이트되었는지 확인 (쿠키 강제 평가 코드 포함)
  - 브라우저 쿠키를 지우고 다시 시도
  - Vercel에서 최신 배포가 완료되었는지 확인

## 6. 디버깅 체크리스트

다음 항목들을 순서대로 확인하세요:

- [ ] Vercel 환경 변수 설정 확인
- [ ] Supabase Site URL이 프로덕션 도메인으로 설정됨
- [ ] Supabase Redirect URLs에 프로덕션 URL 추가됨
- [ ] Google Provider가 활성화되어 있음
- [ ] 브라우저 콘솔에 오류 메시지 없음
- [ ] 네트워크 요청이 성공적으로 완료됨
- [ ] 환경 변수 변경 후 Redeploy 완료
- [ ] 브라우저 캐시를 지웠음

## 7. 추가 도움

위의 모든 단계를 확인했는데도 문제가 해결되지 않으면:

1. 브라우저 콘솔의 전체 오류 메시지를 복사
2. 네트워크 탭에서 실패한 요청의 응답 내용 확인
3. Vercel 로그 확인 (Deployments → 최신 배포 → Functions 탭)
4. Supabase 로그 확인 (Logs → API 탭)

이 정보들을 함께 제공하면 더 정확한 진단이 가능합니다.

