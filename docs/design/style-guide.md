# 스타일 가이드 (Toss Inspired)

## 1. 브랜딩 컨셉

- **Tone & Manner**: 신뢰, 간결함, 투명함, 금융 서비스 수준의 안정감
- **Layouts**: 화이트 스페이스를 넉넉히 사용해 정보 과밀을 피하고, 카드 중심으로 구성
- **Interactivity**: 자연스러운 미세 상호작용(hover, tap feedback)으로 행동 유도

## 2. 디자인 토큰

| Token | Value | Usage |
| --- | --- | --- |
| `color.primary` | `#3182F6` | 주요 CTA 버튼, 링크, 강조 텍스트 |
| `color.secondary` | `#4ECB71` | 성공/완료 상태, 리워드 배지 |
| `color.background` | `#F9FBFC` | 전체 화면 배경 |
| `color.surface` | `#FFFFFF` | 카드/모달/바텀시트 배경 |
| `color.text.primary` | `#111111` | 본문 텍스트 |
| `color.text.secondary` | `#4C4C4C` | 세부 설명, 라벨 |
| `color.text.muted` | `#8A94A6` | 보조 정보, 플레이스홀더 |
| `color.border` | `#E5EAF0` | 구분선, 테이블 보더 |
| `color.badge` | `#EFF3FA` | 소프트 배지 배경 |
| `color.warning` | `#FFAA2B` | 마감 임박, 주의 상태 |
| `color.error` | `#FF5B5C` | 오류, 비활성 조건 |
| `shadow.card` | `0 12px 32px rgba(30, 61, 116, 0.08)` | 카드 베이스 그림자 |
| `radius.card` | `16px` | 카드, 모달 라운드 |
| `radius.pill` | `999px` | 버튼, 배지 |
| `spacing.xs` | `8px` | 아이콘 주변, 라벨 간격 |
| `spacing.sm` | `12px` | 작은 카드 내부 패딩 |
| `spacing.md` | `16px` | 기본 섹션 패딩 |
| `spacing.lg` | `24px` | 섹션 간 간격 |
| `spacing.xl` | `32px` | 주요 블록 간 간격 |
| `font.sans` | Pretendard / Apple SD 산돌고딕 Neo | 기본 서체 |
| `font.weight.light` | 300 | 긴 본문, 보조 설명 |
| `font.weight.regular` | 400 | 일반 본문 |
| `font.weight.medium` | 500 | 섹션 타이틀, 버튼 |
| `font.weight.bold` | 600 | 주요 헤드라인, 금액 강조 |

## 3. 타이포그래피 스케일

| 이름 | Desktop | Mobile | 사용 예시 |
| --- | --- | --- | --- |
| Display | 40px / 56px | 32px / 44px | 주요 헤드라인 |
| Heading L | 28px / 40px | 24px / 34px | 섹션 타이틀 |
| Heading M | 22px / 32px | 20px / 30px | 카드 타이틀 |
| Body L | 18px / 28px | 18px / 28px | 중요 본문 |
| Body M | 16px / 26px | 16px / 26px | 일반 설명 |
| Body S | 14px / 22px | 14px / 22px | 서브 텍스트 |
| Caption | 12px / 18px | 12px / 18px | 배지, 라벨 |

- Line-height는 기본 `150%` 유지, 타이틀은 `140%`.
- 숫자 데이터 표시는 Tabular Figures 사용.

## 4. 컴포넌트 가이드

### 버튼

| 타입 | 배경 | 텍스트 | 테두리 | 상태 |
| --- | --- | --- | --- | --- |
| Primary | `#3182F6` | `#FFFFFF` | 없음 | Hover: 8% 짙은 블루, Pressed: `#2363C8`, Disabled: `#CCE1FF` |
| Secondary | `#FFFFFF` | `#3182F6` | `1px solid #3182F6` | Hover: 배경 `#E6F0FF`, Pressed: `#D4E4FF`, Disabled: `#DCE6F6` |
| Ghost | Transparent | `#3182F6` | 없음 | Hover: 배경 `#E6F0FF`, Pressed: `#D4E4FF` |

- 아이콘 버튼은 40px 정사각형, 라운드 12px.
- 로딩 상태: 좌측에 16px 스피너 삽입.

### 카드

- 기본 패딩: `24px`
- 상단 좌측에 라벨/배지, 우측에 상태 아이콘 배치
- 데이터 강조 영역은 18px/24px 텍스트, 금액/혜택은 Bold
- 카드 간 간격: 모바일 16px, 데스크톱 24px

### 배지 & 태그

- 파스텔 배경 `#EFF3FA`, 텍스트 `#3182F6`
- 상태별 컬러:
  - `마감 임박`: 배경 `#FFF4E0`, 텍스트 `#FF9A1F`
  - `신규`: 배경 `#E6F6FF`, 텍스트 `#007DFF`
  - `검증됨`: 배경 `#E8F9F0`, 텍스트 `#2BA55D`

### 입력 필드

- 필드 높이 52px, 라운드 12px
- 기본 테두리 `#E5EAF0`, 포커스시 `#3182F6`
- 도움말 텍스트 `#8A94A6`, 에러 텍스트 `#FF5B5C`
- Prefix/Suffix 아이콘 사용 시 내부 패딩 조정 (텍스트 시작 16px)

## 5. 레이아웃 시스템

- 8px Grid System 사용
- 모바일: 기본 여백 20px, 바텀 탭/버튼 Safe Area 고려
- 데스크톱: 12 컬럼, 80px gutter, 최대 폭 1280px
- 카드 리스트: 모바일 1열, 태블릿 2열, 데스크톱 3열

## 6. 인터랙션 & 모션

- **전환(Transition)**: 180ms ease-out (hover), 240ms cubic-bezier(0.22, 1, 0.36, 1) (모달/시트)
- **피드백**: 버튼 클릭 시 subtle scale(0.98) + 음영 강화
- **로딩 스켈레톤**: `#EFF3FA` 배경, 애니메이션 1200ms linear infinite
- **알림**: 토스트는 우측 상단(데스크톱) / 상단 중앙(모바일), 4초 유지

## 7. 접근성 체크포인트

- 텍스트 대비: 최소 4.5:1 유지
- 폰트 사이즈 모바일 16px 이하 금지
- 포커스 표시는 2px 아웃라인(`rgba(49, 130, 246, 0.5)`)
- 스크린리더용 숨김 텍스트는 `.sr-only` 패턴 유지

## 8. 에셋 & 아이콘

- 아이콘 스타일: 라인(1.5px), 라운디드 코너
- 일관된 24px 그리드 사용
- 일러스트는 파스텔 톤, 긍정적/신뢰감 있는 표정 강조

## 9. 샘플 컴포넌트 명세

```
Button.Primary(height: 52, radius: 999, bg: color.primary, text: white, padding: 0 24)
Card.SupportProgram(padding: 24, radius: 16, header: [badge, title], body: [summary, stats], footer: [CTA])
BottomSheet(height: 70vh, handleBar: 48x4, safeArea: true, background: color.surface)
```

## 10. 다운로드 에셋 가이드

- `assets/logo.svg`: 심볼 + 텍스트 로고, Primary 컬러 사용
- `assets/icon-set/24px/*.svg`: 카테고리별 아이콘
- `assets/illustrations/*.png`: onboarding, empty state, success 장면

> *Figma 라이브러리 제안*: `Moneypick Design System` 파일을 생성하고 위 토큰을 Styles로 등록한 뒤 컴포넌트/변형을 구성합니다.

