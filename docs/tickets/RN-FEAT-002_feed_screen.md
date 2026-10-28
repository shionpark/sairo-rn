# RN-FEAT-002: S10 추천 피드 화면

RN 스파이크 Day 2. RN-FEAT-001의 텍스트 목록을 웹 S10과 같은 모양의 피드로 바꾸고, 화면 1개를 옮기는 데 드는 시간과 막히는 CSS를 잰다.

---

## Metadata

| Key | Value |
|-----|-------|
| Prefix | RN |
| Type | FEAT |
| Severity | - |
| Layer | Screen / Component |
| Status | Done |
| Repo | `sairo-rn` |
| Depends | RN-FEAT-001 |
| Related | 웹 `app/[locale]/feed/FeedContent.tsx` · `components/place/PlaceCard.tsx` · `components/common/Skeleton.tsx` |

---

## Problem

- **현재**: `feed` 탭은 `순위. 이름 점수` 텍스트 목록이다.
- **기대**: 웹 S10처럼 제목 · 유형 요약 · 조건 줄(날씨 · 정렬) · 사진 카드 목록이 보이고, 로딩은 같은 자리의 스켈레톤, 실패는 안내와 다시 시도로 보인다.
- **영향 범위**: `src/app/feed.tsx` · `src/components/` (새로) · `tailwind.config.js`

---

## Context

웹 피드는 화면 전용 컴포넌트 10여 개에 기대고 있다. 스파이크 목적(화면당 시간 · 막힌 CSS)에 필요한 것만 옮긴다.

| 웹 | RN | 비고 |
|---|---|---|
| `globals.css` `@theme` 색 · `.ds-*` 글자 6단 | `tailwind.config.js` `colors` · `fontSize` | Tailwind 4 → 3. 결정 문서 ④ CSS 목록 |
| `div` · `p` · `next/image` | `View` · `Text` · `expo-image` | `expo-image`는 설치돼 있다 |
| `lucide-react` | `@expo/vector-icons` | JS 전용이라 dev build를 다시 하지 않아도 된다 |
| `animate-pulse` | `Animated` 반복 | Skeleton |
| `next-intl` `t()` | `messages/ko.json` 값을 그대로 | i18n은 제외 |

---

## Scope

### 포함

| # | 작업 | 원본 |
|---|---|---|
| 1 | 색 · 글자 토큰을 `tailwind.config.js`로 | `globals.css` |
| 2 | `Skeleton` (마감 때문에 Claude가 작성. 서영님 직접 구현은 저장 탭 `PlaceRow`로) | 28줄 |
| 3 | `FeedSkeleton` · `PlaceCardSkeleton` | 44줄 · – |
| 4 | `PlaceCard` (사진 1장 · 메타 · 제목 · 설명 · 저장 버튼) | 93줄 |
| 5 | `SaveButton` · `useSavedPlaces` | 90줄 · 107줄 |
| 6 | `FeedContent`: 제목 · 유형 요약 · 조건 줄 · 목록 · 빈 목록 · 실패 | 150줄 |
| 7 | 카드를 누르면 `/place/[id]`로 이동 (상세 화면은 다음 티켓, 이번엔 빈 화면) | – |

### 제외

| 항목 | 이유 |
|---|---|
| `PhotoSwipe` (사진 좌우 넘김) | 제스처 화면은 따로 잰다. 첫 사진 1장만 |
| `PlaceRow` | 저장 탭의 행이다. 저장 탭 티켓에서 서영님이 직접 구현 |
| `QuizPrompt` | 진단 화면이 없어 `cf8_code`가 늘 있다 |
| Pretendard · i18n | 시스템 글꼴 · 한국어 고정 |
| `WeatherIcon` | 날씨는 글자로만 |

---

## Acceptance Criteria

- [x] 웹 S10과 같은 순서로 제목 · 유형 요약 · 조건 줄 · 카드 목록이 보인다
- [x] 로딩 중 스켈레톤이 본문과 같은 자리 · 높이를 차지한다 (데이터가 와도 화면이 밀리지 않는다)
- [x] 비행기 모드에서 실패 안내 · 다시 시도, 크래시 없음 (RN-FEAT-001 유지)
- [x] 저장 버튼을 누르면 앱을 다시 켜도 저장 상태가 남는다
- [x] 카드를 누르면 `/place/[id]`로 가고 뒤로 가기로 돌아온다
- [x] `tsc --noEmit` 통과

---

## 측정 (결정 문서 ④로)

| 항목 | 값 |
|---|---|
| 화면 1개 소요 시간 | 약 15분 (커밋 · 캡처 시각 기준 추정). Claude Code가 작성하고 서영님은 범위 · 도식만 승인. 사람이 직접 짜는 시간으로 쓰면 안 된다 |
| 옮긴 파일 · 줄 수, 수정 없이 쓴 줄 | 웹 10개 파일 735줄 → RN 11개 파일 436줄. 화면 코드는 태그 · 스타일이 달라 전부 다시 썼다(그대로 쓴 줄 0). 그대로 쓴 것은 데이터 · 엔진 · 훅 · 문구(`messages/ko.json`) |
| CSS에서 막힌 목록 | 아래 표 |

| 웹 CSS | RN | 처리 |
|---|---|---|
| 줄높이 배수(`line-height: 1.5`) · `em` 자간 | 숫자 px만 받는다 | `tailwind.config.js`에서 px로 계산 |
| `--gutter` CSS 변수 · `px-[--gutter]` | CSS 변수 없음 | `spacing.gutter` 토큰 |
| `bg-linear-to-b` 그라데이션 (저장 아이콘 바탕) | `expo-linear-gradient` 네이티브 모듈, dev build 재빌드 필요 | 아이콘 `textShadow`로 대체 |
| `drop-shadow-[…]` | 없음 | `textShadow` |
| `animate-pulse` | 없음 | `Animated.loop` |
| `overflow-x-auto` 칩 줄 | 없음 | `ScrollView horizontal` |
| `next/image` `fill` · `sizes` | `className` 미지원 | `expo-image` `style={{ flex: 1 }}` |
| `<Link>` 카드 · `<button>` | 없음 | `Pressable` + `router.push` |

- 라우트 구조 변경: 상세로 들어갔다 뒤로 돌아오려면 탭 위에 스택이 있어야 해서 `src/app/_layout.tsx`를 `Stack`, 탭을 `src/app/(tabs)/`로 옮겼다
- 제외 · 축소: 유형 카드의 캐릭터 이미지(에셋 미복사), 저장 토스트 · 되돌리기(`ToastContext` 없음), 저장 순간 애니메이션
- 탭 아이콘: 템플릿 기본값이 깨져 `@expo/vector-icons` Ionicons로 바꿈
- 동작 확인 (Android 에뮬레이터 API 35): 피드 · 스켈레톤 · 저장 후 재시작 유지 · 카드 → `/place/[id]` → 뒤로 복귀 · 비행기 모드 에러 · 복구. 캡처 `~/Downloads/RN-FEAT-002_*.png`, README용 `docs/screenshots/feed_android.png`
- RN-FEAT-001의 LogBox 노란 경고는 비행기 모드 전환 때마다 다시 뜬다(개발 모드 전용, 탭 바를 가림). 원인 미확인
