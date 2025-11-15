# 콘솔 경고 메시지 설명

Vercel 배포 후 브라우저 콘솔에 나타나는 일부 경고 메시지들은 실제 문제가 아닙니다.

## 무시해도 되는 경고들

### 1. "Deprecated API for given entry type"
```
Deprecated API for given entry type.
```
- **원인**: Vercel의 내부 스크립트에서 사용하는 API
- **영향**: 없음 (웹사이트 기능에 영향 없음)
- **조치**: 무시 가능

### 2. "/api/v1/projects/.../rolling-release" 404 오류
```
/api/v1/projects/moneypick-b3ci/rolling-release?teamId=... Failed to load resource: 404
```
- **원인**: Vercel 대시보드 관련 API 호출 (웹사이트 기능과 무관)
- **영향**: 없음 (실제 웹사이트 기능에 영향 없음)
- **조치**: 무시 가능

### 3. "The resource was preloaded using link preload but not used"
```
The resource <URL> was preloaded using link preload but not used within a few seconds
```
- **원인**: 리소스 프리로딩 최적화 관련 경고
- **영향**: 없음 (성능 최적화 관련, 기능 문제 아님)
- **조치**: 무시 가능

## 실제로 확인해야 할 메시지들

### ✅ 정상적인 메시지
```
✅ Supabase 환경 변수 확인됨
Supabase URL: https://xxxxx.supabase.co
```

### ❌ 문제가 있는 메시지
```
⚠️ Supabase 환경 변수가 설정되지 않았습니다!
NEXT_PUBLIC_SUPABASE_URL: ❌ 없음
```

```
❌ 로그인 오류: Invalid login credentials
```

```
❌ Google 로그인 오류: redirect_uri_mismatch
```

```
❌ 세션 교환 오류: invalid request: both auth code and code verifier should be non-empty
```

## 로그인 문제 진단 방법

1. **콘솔 필터링**: 콘솔에서 `Supabase`, `로그인`, `Google`, `❌`, `⚠️` 등의 키워드로 필터링
2. **로그인 시도**: 실제로 로그인 버튼을 클릭하고 나타나는 메시지 확인
3. **에러 메시지**: `❌` 또는 `⚠️`로 시작하는 메시지에 집중

## 결론

위의 경고 메시지들은 Vercel의 내부 동작이나 브라우저 최적화와 관련된 것이며, 실제 웹사이트 기능이나 로그인 문제와는 무관합니다. 

**실제 로그인 문제를 진단하려면:**
- 로그인 버튼을 클릭한 후 나타나는 메시지 확인
- `❌` 또는 `⚠️`로 시작하는 오류 메시지 확인
- 로그인 페이지에 표시되는 빨간색 오류 메시지 확인

