# RN-CHORE-003: 저장소를 localStorage에서 기기 저장소로

RN 스파이크 Day 1-③. `storage.ts`의 읽기·쓰기를 RN 저장소로 바꾼다. **동기 API를 유지**해서 호출하는 쪽을 고치지 않는 게 목표다.

---

## Metadata

| Key | Value |
|-----|-------|
| Prefix | RN |
| Type | CHORE |
| Severity | - |
| Layer | Lib |
| Status | Todo |
| Repo | `sairo-rn` |
| Depends | RN-CHORE-002 |
| Related | `docs/decisions/2026-09-25_RN_전환_검토.md` "무엇이 바뀌나" |

---

## Problem

- **현재**: `storage.ts`가 `localStorage`(7곳)와 `sessionStorage`(6곳)를 부른다. RN에는 둘 다 없다.
- **기대**: `readCf8Code()` · 저장 목록 읽기·쓰기가 RN에서 같은 시그니처로 동작한다.
- **영향 범위**: `src/lib/storage.ts` 1개

---

## Context

### 저장소 선택

| 후보 | 동기 API | Expo Go | 비고 |
|---|---|---|---|
| `react-native-mmkv` | ✅ | ⚠️ 확인 필요 | 네이티브 모듈이라 dev build(`npx expo run:android`)가 필요할 수 있다 |
| `expo-sqlite/kv-store` | ✅ (`getItemSync`) ⚠️ 확인 필요 | ✅ | Expo 공식 |
| `@react-native-async-storage/async-storage` | ❌ | ✅ | 비동기라 호출하는 쪽을 전부 고쳐야 한다 |

**동기 API가 있는 쪽을 고른다.** 두 후보 중 설치해서 먼저 동작하는 쪽을 쓰고, 고른 이유를 기록한다.

### sessionStorage

`JUST_DIAGNOSED` · `QUIZ_LEFT`는 "이번 방문에만" 유효한 신호다. RN에는 탭 개념이 없으니 **모듈 변수**로 둔다. 앱을 완전히 끄면 사라져서 뜻이 같다.

```ts
const session = new Map<string, string>();
```

---

## Scope

### 포함

| # | 작업 |
|---|---|
| 1 | 저장소 라이브러리 설치 |
| 2 | `localStorage.getItem/setItem/removeItem` → 선택한 저장소의 동기 호출 |
| 3 | `sessionStorage` → 모듈 변수 `Map` |

### 제외

| 항목 | 이유 |
|---|---|
| `useStoredState` · `useSavedPlaces` | 화면에서 쓰는 훅이다. Day 2 화면 작업 때 필요한 것만 옮긴다 |
| `useStoredSnapshot` | RN-FEAT-001에서 옮긴다 (`useRecommendations`가 쓴다) |
| 웹 `localStorage` 값 마이그레이션 | 앱이 새로 설치되므로 옮길 데이터가 없다 |

---

## Acceptance Criteria

- [ ] `storage.ts`의 export 시그니처가 바뀌지 않는다
- [ ] `cf8_code`를 쓰고 앱을 완전히 종료했다 다시 켜도 읽힌다
- [ ] `JUST_DIAGNOSED`는 앱을 재시작하면 사라진다
- [ ] `tsc --noEmit` 통과

---

## 측정 (결정 문서 ④로)

- 고른 저장소와 이유
- Expo Go로 되는지, dev build가 필요한지
