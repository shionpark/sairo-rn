# RN-FEAT-001: 추천 결과를 텍스트로 출력

RN 스파이크 Day 1-④. Vercel API → 엔진 → 화면까지 한 줄로 잇는다. 디자인 없이 장소 이름과 점수만 나열한다.

---

## Metadata

| Key | Value |
|-----|-------|
| Prefix | RN |
| Type | FEAT |
| Severity | - |
| Layer | Hook / Screen |
| Status | Done |
| Repo | `sairo-rn` |
| Depends | RN-CHORE-002 · RN-CHORE-003 |
| Related | `src/hooks/useRecommendations.ts` · `src/lib/apiBase.ts` (웹) |

---

## Problem

- **현재**: 추천 흐름은 웹 훅 `useRecommendations`에만 있다.
- **기대**: RN `feed` 탭에서 실제 API 데이터로 계산한 추천 목록이 텍스트로 보인다.
- **영향 범위**: `src/lib/apiBase.ts` · `src/hooks/useRecommendations.ts` · `src/hooks/useStoredSnapshot.ts` · `app/(tabs)/feed.tsx`

---

## Context

`useRecommendations`는 `/api/recommend`와 `/api/weather`를 부르고 `rankPlaces()`로 정렬한다. 의존은 `react` · `useStoredSnapshot` · `apiBase` · `storage` · `cfp` · `recommendEngine` · `kma` · `tripSetupMode` · 타입이다.

| 웹 | RN |
|---|---|
| `process.env.NEXT_PUBLIC_API_BASE` | `process.env.EXPO_PUBLIC_API_BASE` |
| 첫 줄 `"use client"` | 삭제 |
| CORS 헤더 필요 | 불필요 (RN `fetch`는 브라우저가 아니다) |

API는 운영 Vercel(`https://cultural-fit-busan.vercel.app`)을 그대로 부른다. **읽기만 한다.**

---

## Scope

### 포함

| # | 작업 |
|---|---|
| 1 | `apiBase.ts` 복사 · 환경변수 이름 교체 · `.env`에 `EXPO_PUBLIC_API_BASE` |
| 2 | `useRecommendations.ts` 복사 · `"use client"` 삭제 |
| 2-1 | `useStoredSnapshot.ts` 복사 · `"use client"` 삭제 (React `useSyncExternalStore`만 써서 그대로 동작) |
| 3 | `feed` 탭: 로딩 · 에러 · 목록(이름 + 점수)을 `Text`로 출력 |
| 4 | `cf8_code`가 없으면 고정값(예: `CLD`)을 저장해 두고 시작 |

### 제외

| 항목 | 이유 |
|---|---|
| 카드 · 이미지 · 스타일 | Day 2 (S10 피드) |
| 진단 · 조건 입력 화면 | 스파이크 범위 밖 |
| i18n (`use-intl`) | Day 2. 이번 출력은 데이터 그대로 |

---

## Acceptance Criteria

- [x] `feed` 탭에 추천 목록이 뜬다
- [x] 같은 `cf8_code`로 웹(`/ko/feed`) 상위 5개와 순서가 같다
- [x] 비행기 모드에서 에러 문구가 뜨고 크래시하지 않는다
- [x] `tsc --noEmit` 통과

---

## 측정 (결정 문서 ④로)

- `useRecommendations.ts`에서 바꾼 줄 수: 205줄 중 3줄 (`"use client"`와 빈 줄 삭제 2 · storage import 1)
- 복사한 3개 파일 257줄 중 수정 6줄: `apiBase.ts` 환경변수 이름 1 · `useStoredSnapshot.ts` `"use client"` 2 · `useRecommendations.ts` 3. 그 밖에 `storage.ts` `export` 1줄, `feed.tsx` 40줄 새로 작성
- 티켓에 없던 수정: `useRecommendations`가 전역 `localStorage`를 2곳에서 직접 부른다. RN에는 전역이 없어서 `storage.ts`의 MMKV 객체를 export해 import로 바꿈
- Day 1 전체 소요 시간: 합산 불가. RN-CHORE-001 약 3시간 · RN-CHORE-003 약 1시간(첫 dev build 18분 18초 포함) · RN-FEAT-001 약 30분, RN-CHORE-002는 시간 기록 없음 (모두 커밋 · 캡처 시각 기준 추정)
- 동작 확인 (Android 에뮬레이터 API 35, dev build)
  - 목록: 118곳 중 상위가 웹 `/ko/feed`(`cf8_code` `CLD`, 조건 입력 없음)와 22위까지 같은 순서 (2026-10-28 15:00 무렵 비교)
  - 오프라인: 목록 표시 → 비행기 모드 → 당겨서 새로고침 → 에러 문구 · 다시 시도 → 오프라인에서 다시 시도해도 앱 유지 → 비행기 모드 해제 후 다시 시도 → 목록 복구
  - 캡처: `~/Downloads/RN-FEAT-001_list.png` · `_error.png` · `_recovered.png`
- Scope 밖 추가: 오프라인 재현을 위해 목록에 당겨서 새로고침(`onRefresh={retry}`)을 붙임. 앱을 오프라인에서 새로 켜면 dev build가 Metro에서 번들을 못 받아 화면까지 가지 못한다
- 막힌 곳: 비행기 모드 후 화면 하단에 LogBox 노란 경고 1건이 떴으나 내용을 확인하기 전에 사라짐. Metro 로그에는 없음 (개발 모드 전용, 원인 미확인)
- `cf8_code` 고정값(Scope #4)은 `_layout.tsx` 모듈 맨 위 `seedCf8Code()`. 화면이 첫 렌더에 읽어서 `useEffect`로는 늦다. 이전 티켓의 `logStorageCheck`(앱을 켤 때마다 저장 목록을 뒤집음)는 삭제
