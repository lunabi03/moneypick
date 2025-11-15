# Supabase 소셜 로그인 설정 가이드

이 문서는 Supabase에서 구글(Google) 로그인과 카카오톡(Kakao) 로그인을 활성화하는 방법을 단계별로 안내합니다.

## 목차

1. [Supabase 프로젝트 설정](#1-supabase-프로젝트-설정)
2. [구글 로그인 설정](#2-구글-로그인-설정)
3. [카카오톡 로그인 설정](#3-카카오톡-로그인-설정)
4. [환경 변수 설정](#4-환경-변수-설정)
5. [테스트 및 확인](#5-테스트-및-확인)
6. [문제 해결](#6-문제-해결)

---

## 1. Supabase 프로젝트 설정

### 1.1 Supabase 프로젝트 생성

1. [Supabase](https://supabase.com/)에 접속하여 계정을 생성하거나 로그인합니다.
2. **New Project** 버튼을 클릭하여 새 프로젝트를 생성합니다.
3. 프로젝트 이름, 데이터베이스 비밀번호, 리전을 설정합니다.
4. 프로젝트가 생성될 때까지 몇 분 기다립니다.

### 1.2 프로젝트 URL 및 API 키 확인

1. 프로젝트 대시보드에서 **Settings** → **API** 메뉴로 이동합니다.
2. 다음 정보를 확인하고 복사해 둡니다:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: 공개 API 키
   - **service_role key**: 서비스 역할 키 (서버 사이드에서만 사용)

### 1.3 Supabase 인증 콜백 URL 확인

Supabase의 기본 인증 콜백 URL은 다음과 같은 형식입니다:

```
https://[project-ref].supabase.co/auth/v1/callback
```

**찾는 방법:**

1. **방법 1: Project URL에서 확인**
   - **Settings** → **API** 메뉴에서 **Project URL**을 확인합니다.
   - 예: `https://gewhnzsljwravvrxryny.supabase.co`
   - 이 URL에 `/auth/v1/callback`을 추가하면 됩니다:
     ```
     https://gewhnzsljwravvrxryny.supabase.co/auth/v1/callback
     ```

2. **방법 2: Authentication 설정에서 확인**
   - **Authentication** → **URL Configuration** 메뉴로 이동합니다.
   - **Site URL** 섹션에서 기본 URL을 확인할 수 있습니다.
   - 콜백 URL은 `[Site URL]/auth/v1/callback` 형식입니다.

3. **방법 3: 브라우저 주소창에서 확인**
   - Supabase 대시보드의 URL을 확인합니다.
   - 예: `https://app.supabase.com/project/gewhnzsljwravvrxryny`
   - 프로젝트 참조 ID(`gewhnzsljwravvrxryny`)를 사용하여 콜백 URL을 구성합니다:
     ```
     https://gewhnzsljwravvrxryny.supabase.co/auth/v1/callback
     ```

**중요**: 이 URL은 Google OAuth와 Kakao OAuth 설정 시 **승인된 리디렉션 URI**에 반드시 추가해야 합니다.

---

## 2. 구글 로그인 설정

### 2.1 Google Cloud Console 설정

#### 2.1.1 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속합니다.
2. 상단의 프로젝트 선택 메뉴에서 **새 프로젝트**를 클릭합니다.
3. 프로젝트 이름을 입력하고 **만들기**를 클릭합니다.

#### 2.1.2 OAuth 동의 화면 설정

1. 왼쪽 메뉴에서 **API 및 서비스** → **OAuth 동의 화면**을 선택합니다.
2. **외부** 사용자 유형을 선택하고 **만들기**를 클릭합니다.
3. 앱 정보를 입력합니다:
   - **앱 이름**: MoneyPick (또는 원하는 이름)
   - **사용자 지원 이메일**: 본인 이메일
   - **앱 로고**: 선택사항
   - **앱 도메인**: `https://your-domain.com` (프로덕션 도메인)
   - **개발자 연락처 정보**: 본인 이메일
4. **저장 후 계속**을 클릭합니다.
5. **범위** 단계에서 **저장 후 계속**을 클릭합니다.
6. **테스트 사용자** 단계에서 **저장 후 계속**을 클릭합니다.
7. **요약** 단계에서 **대시보드로 돌아가기**를 클릭합니다.

#### 2.1.3 OAuth 2.0 클라이언트 ID 생성

1. 왼쪽 메뉴에서 **API 및 서비스** → **사용자 인증 정보**를 선택합니다.
2. 상단의 **+ 사용자 인증 정보 만들기** → **OAuth 클라이언트 ID**를 선택합니다.
3. **애플리케이션 유형**: **웹 애플리케이션**을 선택합니다.
4. **이름**: MoneyPick OAuth Client (또는 원하는 이름)를 입력합니다.
5. **승인된 JavaScript 원본**에 다음을 추가:
   ```
   http://localhost:3000
   https://your-domain.com
   https://xxxxx.supabase.co
   ```
6. **승인된 리디렉션 URI**에 다음을 추가:
   ```
   http://localhost:3000/api/auth/google/callback
   https://your-domain.com/api/auth/google/callback
   https://xxxxx.supabase.co/auth/v1/callback
   ```
7. **만들기**를 클릭합니다.
8. 생성된 **클라이언트 ID**와 **클라이언트 보안 비밀번호**를 복사해 둡니다.

### 2.2 Supabase에서 구글 로그인 활성화

1. Supabase 프로젝트 대시보드로 돌아갑니다.
2. 왼쪽 메뉴에서 **Authentication** → **Providers**를 선택합니다.
3. **Google** 프로바이더를 찾아 **Enable Google** 토글을 켭니다.
4. 다음 정보를 입력합니다:
   - **Client ID (for OAuth)**: Google Cloud Console에서 복사한 클라이언트 ID
   - **Client Secret (for OAuth)**: Google Cloud Console에서 복사한 클라이언트 보안 비밀번호
5. **Save** 버튼을 클릭합니다.

### 2.3 리디렉션 URL 설정

1. **Authentication** → **URL Configuration** 메뉴로 이동합니다.
2. **Redirect URLs** 섹션에 다음 URL을 추가합니다:
   ```
   http://localhost:3000/auth/callback
   https://your-project.vercel.app/auth/callback
   ```
   ⚠️ **중요**: `your-project.vercel.app`을 실제 Vercel 프로젝트 도메인으로 변경하세요!
3. **Save** 버튼을 클릭합니다.

---

## 3. 카카오톡 로그인 설정

### 3.1 Kakao Developers 설정

#### 3.1.1 애플리케이션 등록

1. [Kakao Developers](https://developers.kakao.com/)에 접속하여 로그인합니다.
2. **내 애플리케이션** → **애플리케이션 추가하기**를 클릭합니다.
3. 앱 정보를 입력합니다:
   - **앱 이름**: MoneyPick (또는 원하는 이름)
   - **사업자명**: 개인 또는 회사명
4. **저장**을 클릭합니다.

#### 3.1.2 플랫폼 설정

1. 생성된 애플리케이션을 선택합니다.
2. 왼쪽 메뉴에서 **앱 설정** → **플랫폼**을 선택합니다.
3. **Web 플랫폼 등록**을 클릭합니다.
4. **사이트 도메인**에 다음을 입력:
   ```
   http://localhost:3000
   https://your-domain.com
   https://xxxxx.supabase.co
   ```
5. **저장**을 클릭합니다.

#### 3.1.3 카카오 로그인 활성화

1. 왼쪽 메뉴에서 **제품 설정** → **카카오 로그인**을 선택합니다.
2. **활성화 설정**에서 **카카오 로그인 활성화**를 **ON**으로 설정합니다.
3. **Redirect URI**에 다음을 추가:
   ```
   http://localhost:3000/api/auth/kakao/callback
   https://your-domain.com/api/auth/kakao/callback
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
   - **중요**: `[your-project-ref]`를 실제 Supabase 프로젝트 참조 ID로 교체하세요.
   - Supabase 콜백 URL 찾는 방법은 [1.3 섹션](#13-supabase-인증-콜백-url-확인)을 참고하세요.
   - 예: `https://gewhnzsljwravvrxryny.supabase.co/auth/v1/callback`
4. **저장**을 클릭합니다.

#### 3.1.4 REST API 키 확인

1. 왼쪽 메뉴에서 **앱 설정** → **앱 키**를 선택합니다.
2. 다음 정보를 확인하고 복사해 둡니다:
   - **REST API 키**: 클라이언트 ID로 사용
   - **Client Secret**: 카카오 로그인 설정에서 확인 가능

#### 3.1.5 동의 항목 설정 (선택사항)

1. 왼쪽 메뉴에서 **제품 설정** → **카카오 로그인** → **동의항목**을 선택합니다.
2. 필요한 사용자 정보 동의 항목을 설정합니다:
   - **닉네임**: 필수 또는 선택
   - **이메일**: 필수 또는 선택
   - **프로필 사진**: 선택
3. **저장**을 클릭합니다.

### 3.2 Supabase에서 카카오 로그인 활성화

> **참고**: Supabase는 기본적으로 카카오 로그인을 지원하지 않습니다. 카카오 로그인을 사용하려면 다음 중 하나의 방법을 선택해야 합니다:
> 
> 1. **Custom OAuth Provider 사용** (Supabase의 커스텀 프로바이더 기능 활용)
> 2. **직접 구현** (현재 프로젝트처럼 별도 API 라우트로 구현)

#### 방법 1: Custom OAuth Provider 사용 (권장)

1. Supabase 프로젝트 대시보드에서 **Authentication** → **Providers**로 이동합니다.
2. **Add new provider** 또는 **Custom OAuth** 옵션을 찾습니다.
3. 다음 정보를 입력합니다:
   - **Provider Name**: `kakao`
   - **Authorization URL**: `https://kauth.kakao.com/oauth/authorize`
   - **Token URL**: `https://kauth.kakao.com/oauth/token`
   - **User Info URL**: `https://kapi.kakao.com/v2/user/me`
   - **Client ID**: Kakao Developers에서 복사한 REST API 키
   - **Client Secret**: Kakao Developers에서 확인한 Client Secret
4. **Save** 버튼을 클릭합니다.

#### 방법 2: 직접 구현 (현재 프로젝트 방식)

현재 프로젝트는 이미 카카오 로그인을 직접 구현하고 있습니다. Supabase를 사용하면서도 이 방식을 유지할 수 있습니다.

---

## 4. 환경 변수 설정

### 4.1 로컬 개발 환경 (.env.local)

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수들을 설정합니다:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Google OAuth (Supabase를 통한 로그인 사용 시)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Kakao OAuth (직접 구현 방식 사용 시)
KAKAO_CLIENT_ID=your_kakao_rest_api_key_here
KAKAO_CLIENT_SECRET=your_kakao_client_secret_here

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4.2 Vercel 프로덕션 환경

1. Vercel 대시보드에서 프로젝트를 선택합니다.
2. **Settings** → **Environment Variables**로 이동합니다.
3. 위의 환경 변수들을 추가합니다:
   - **Key**: 변수 이름
   - **Value**: 변수 값
   - **Environment**: Production, Preview, Development에 모두 적용
4. **Save** 버튼을 클릭합니다.

---

## 5. 테스트 및 확인

### 5.1 구글 로그인 테스트

1. 개발 서버를 실행합니다:
   ```bash
   npm run dev
   ```
2. 브라우저에서 `http://localhost:3000/login`으로 이동합니다.
3. **구글로 로그인** 버튼을 클릭합니다.
4. Google 계정 선택 화면이 나타나는지 확인합니다.
5. 계정을 선택하고 권한을 승인합니다.
6. 리디렉션 후 로그인이 성공하는지 확인합니다.

### 5.2 카카오 로그인 테스트

1. `http://localhost:3000/login` 페이지로 이동합니다.
2. **카카오톡으로 로그인** 버튼을 클릭합니다.
3. 카카오 로그인 화면이 나타나는지 확인합니다.
4. 카카오 계정으로 로그인합니다.
5. 권한 동의 화면에서 필요한 정보에 동의합니다.
6. 리디렉션 후 로그인이 성공하는지 확인합니다.

### 5.3 Supabase 대시보드에서 확인

1. Supabase 프로젝트 대시보드로 이동합니다.
2. **Authentication** → **Users** 메뉴로 이동합니다.
3. 소셜 로그인으로 생성된 사용자가 표시되는지 확인합니다.

---

## 6. 문제 해결

### 6.1 구글 로그인 오류

**문제**: "redirect_uri_mismatch" 오류가 발생합니다.

**해결 방법**:
1. Google Cloud Console에서 **승인된 리디렉션 URI**에 다음을 모두 추가했는지 확인:
   - `http://localhost:3000/api/auth/google/callback`
   - `https://your-domain.com/api/auth/google/callback`
   - `https://xxxxx.supabase.co/auth/v1/callback`
2. Supabase의 Redirect URL 설정도 확인합니다.

**문제**: "access_denied" 오류가 발생합니다.

**해결 방법**:
1. OAuth 동의 화면에서 **테스트 사용자**로 본인 이메일을 추가했는지 확인합니다.
2. 프로덕션 배포 전에는 앱을 검토 제출해야 합니다.

### 6.2 카카오 로그인 오류

**문제**: "invalid_client" 오류가 발생합니다.

**해결 방법**:
1. Kakao Developers에서 **REST API 키**와 **Client Secret**이 올바른지 확인합니다.
2. 플랫폼 설정에서 사이트 도메인이 올바르게 등록되었는지 확인합니다.

**문제**: "redirect_uri_mismatch" 오류가 발생합니다.

**해결 방법**:
1. Kakao Developers에서 **Redirect URI**에 다음을 모두 추가했는지 확인:
   - `http://localhost:3000/api/auth/kakao/callback`
   - `https://your-domain.com/api/auth/kakao/callback`
   - `https://xxxxx.supabase.co/auth/v1/callback`

### 6.3 Supabase 연결 오류

**문제**: Supabase 클라이언트 초기화 오류가 발생합니다.

**해결 방법**:
1. 환경 변수 `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 올바르게 설정되었는지 확인합니다.
2. `.env.local` 파일이 프로젝트 루트에 있는지 확인합니다.
3. 개발 서버를 재시작합니다.

### 6.4 일반적인 문제

**문제**: 로그인 후 리디렉션이 작동하지 않습니다.

**해결 방법**:
1. `NEXT_PUBLIC_BASE_URL` 환경 변수가 올바르게 설정되었는지 확인합니다.
2. 브라우저 콘솔에서 오류 메시지를 확인합니다.
3. 네트워크 탭에서 API 요청이 성공했는지 확인합니다.

**문제**: 프로덕션에서 로그인 시 localhost로 리다이렉트됩니다.

**해결 방법** (⚠️ **가장 중요**):
1. **Supabase Site URL 확인 및 수정**:
   - Supabase 대시보드 → **Authentication** → **URL Configuration**으로 이동합니다.
   - **Site URL** 필드를 확인합니다.
   - 프로덕션 환경에서는 반드시 프로덕션 도메인으로 설정해야 합니다:
     ```
     https://your-project.vercel.app
     ```
   - ⚠️ **Site URL이 `http://localhost:3000`으로 되어 있으면 프로덕션에서 localhost로 리다이렉트됩니다!**
   - **Save** 버튼을 클릭합니다.

2. **Redirect URLs 확인**:
   - 같은 페이지에서 **Redirect URLs** 섹션을 확인합니다.
   - 다음 URL들이 모두 추가되어 있는지 확인:
     ```
     http://localhost:3000/auth/callback
     https://your-project.vercel.app/auth/callback
     ```
   - 각 URL을 한 줄씩 입력하고 **+ Add** 버튼을 클릭합니다.
   - **Save** 버튼을 클릭합니다.

3. **Vercel 환경 변수 확인**:
   - Vercel 대시보드 → **Settings** → **Environment Variables**로 이동합니다.
   - `NEXT_PUBLIC_BASE_URL`이 프로덕션 도메인으로 설정되어 있는지 확인:
     ```
     NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app
     ```
   - 환경 변수 수정 후 **Redeploy**가 필요합니다.

4. **캐시 클리어 및 재배포**:
   - Supabase 설정 변경 후 브라우저 캐시를 지웁니다.
   - Vercel에서 프로젝트를 **Redeploy**합니다.

---

## 추가 리소스

- [Supabase 공식 문서 - Authentication](https://supabase.com/docs/guides/auth)
- [Supabase 공식 문서 - Social Login](https://supabase.com/docs/guides/auth/social-login)
- [Google OAuth 2.0 문서](https://developers.google.com/identity/protocols/oauth2)
- [Kakao Developers 공식 문서](https://developers.kakao.com/docs)

---

## 다음 단계

소셜 로그인 설정이 완료되면:

1. 사용자 프로필 정보를 Supabase 데이터베이스에 저장하는 로직을 구현합니다.
2. 로그인 상태를 관리하는 컨텍스트를 Supabase Auth와 연동합니다.
3. 보호된 라우트를 구현하여 인증이 필요한 페이지를 보호합니다.
4. 사용자 세션 관리를 구현합니다.

---

**작성일**: 2024년
**최종 업데이트**: 2024년

