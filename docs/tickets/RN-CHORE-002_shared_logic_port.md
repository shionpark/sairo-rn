# RN-CHORE-002: 엔진 · 타입 · 데이터 이식

RN 스파이크 Day 1-②. 웹 코드 중 화면과 무관한 로직을 복사하고, **수정 없이 쓰이는 비율**을 잰다.

---

## Metadata

| Key | Value |
|-----|-------|
| Prefix | RN |
| Type | CHORE |
| Severity | - |
| Layer | Lib |
| Status | Done |
| Repo | `sairo-rn` |
| Depends | RN-CHORE-001 |
| Related | `docs/decisions/2026-09-25_RN_전환_검토.md` ④ |

---

## Problem

- **현재**: 엔진은 `cultural-fit-busan/src/lib`에만 있다.
- **기대**: 같은 파일이 RN 프로젝트에서 타입 체크를 통과한다.
- **영향 범위**: `sairo-rn/src/lib` · `src/types` · `src/data` · `messages`

---

## Context

import를 확인한 결과(2026-09-25):

| 파일 | 외부 의존 | 예상 |
|---|---|---|
| `recommendEngine` · `cf8Match` · `hardFilter` · `situationalScore` · `finalScore` · `reasonText` · `tripSetupMode` · `placeDisplay` · `distance` · `cfp` · `kma` | 없음 (서로만 import) | 그대로 |
| `src/types/*` | 없음 | 그대로 |
| `src/data/quiz.ts` · `cf8Profiles.ts` | `@/i18n/routing`의 `Locale` 타입 | 한 줄 수정 |
| `src/data/tripSetup*.ts` · `placeTypeDraft.ts` | 타입만 | 그대로 |
| `messages/ko.json` · `en.json` | 없음 | 그대로 |

`src/i18n/routing.ts`는 `next-intl`의 `defineRouting`을 쓴다. RN에서는 타입만 필요하다.

```ts
export type Locale = "ko" | "en";
```

---

## Scope

### 포함

| # | 작업 |
|---|---|
| 1 | 위 표의 파일을 같은 경로로 복사 |
| 2 | `src/i18n/routing.ts`를 `Locale` 타입 한 줄로 대체 |
| 3 | `tsc --noEmit` 통과할 때까지 수정 · **수정한 파일과 줄 수 기록** |

### 제외

| 항목 | 이유 |
|---|---|
| `storage.ts` | RN-CHORE-003 |
| `apiBase.ts` · `useRecommendations.ts` | RN-FEAT-001 |
| `mongodb.ts` · `recommend.ts` · `nearbyPlaces.ts` · `placeDetail.ts` | 서버 코드. Vercel에 남는다 |
| 모노레포 · 공용 패키지 | 웹을 유지하지 않으므로 복사로 충분 |

---

## Acceptance Criteria

- [x] 복사한 파일 전부 `tsc --noEmit` 통과
- [x] 엔진 동작 확인: 앱 진입 시 고정 입력으로 `rankPlaces()`를 한 번 부르고 결과 상위 3개를 콘솔에 출력
  - Android 에뮬레이터(API 35) · Expo Go: `[engineCheck] ["1. A 100.0", "2. B 44.4", "3. C 0.0"]`

---

## 측정 (결정 문서 ④로)

| 항목 | 값 |
|---|---|
| 복사한 파일 수 · 줄 수 | 22개 · 3,333줄 (`src/lib` 11 · `src/types` 3 · `src/data` 5 · `src/i18n` 1 · `messages` 2) |
| 수정 없이 통과한 파일 수 · 줄 수 | 20개 · 3,242줄 (파일 91% · 줄 97%) |
| 수정한 곳과 이유 | ① `src/i18n/routing.ts` 14줄 → 1줄: `next-intl`의 `defineRouting` 대신 `Locale` 타입만 남김 ② `src/types/trip.ts` import 1줄 → 타입 12줄: 화면 컴포넌트(`ChoiceChipGroup`)에서 가져오던 `ChoiceOption` 타입을 파일 안에 옮김 |
