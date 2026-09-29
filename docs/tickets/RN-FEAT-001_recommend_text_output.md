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
| Status | Todo |
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

- [ ] `feed` 탭에 추천 목록이 뜬다
- [ ] 같은 `cf8_code`로 웹(`/ko/feed`) 상위 5개와 순서가 같다
- [ ] 비행기 모드에서 에러 문구가 뜨고 크래시하지 않는다
- [ ] `tsc --noEmit` 통과

---

## 측정 (결정 문서 ④로)

- `useRecommendations.ts`에서 바꾼 줄 수
- Day 1 전체 소요 시간 (RN-CHORE-001~RN-FEAT-001 합)
