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
| Status | Done |
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

- [x] `storage.ts`의 export 시그니처가 바뀌지 않는다
- [x] `cf8_code`를 쓰고 앱을 완전히 종료했다 다시 켜도 읽힌다
- [x] `JUST_DIAGNOSED`는 앱을 재시작하면 사라진다
- [x] `tsc --noEmit` 통과

---

## 측정 (결정 문서 ④로)

- 고른 저장소와 이유: `react-native-mmkv` 4.3.2 (+ `react-native-nitro-modules` 0.37.1). 동기 API(`set` · `getString` · `remove`)라 `storage.ts` 본문을 고치지 않는다
- Expo Go로 되는지, dev build가 필요한지: **dev build 필요** (Nitro 네이티브 모듈). `npx expo run:android` 첫 빌드 `BUILD SUCCESSFUL in 18m 18s` (실측. NDK 27.1 · Build-Tools 36 · CMake 3.22.1 첫 설치 포함)
- 수정 범위: `storage.ts` 원본 207줄 그대로 · 맨 위 18줄 추가 (`localStorage` → MMKV 객체, `sessionStorage` → 모듈 변수 `Map`). 원본의 `typeof window` 검사도 RN에서 그대로 통과
- prebuild가 바꾼 파일: `app.json` `android.package` 추가 · `package.json` `android`/`ios` 스크립트가 `expo run:*`로 바뀜. `android/`는 `.gitignore`
- 동작 확인 (Android 에뮬레이터 API 35, 강제 종료 후 재실행)

  ```
  1회 before {"cf8": null,  "justDiagnosed": false, "saved": ""}
      after  {"cf8": "CLD", "justDiagnosed": true,  "saved": "test"}
  2회 before {"cf8": "CLD", "justDiagnosed": false, "saved": "test"}
  ```

- 막힌 곳

  | 막힌 곳 | 해결 | 성격 |
  |---|---|---|
  | `expo run:android`를 비대화형으로 실행하면 Metro가 CI 모드라 코드 변경을 다시 읽지 않음 | Metro를 `npx expo start --dev-client`로 다시 띄움 | RN 개발 흐름 |
  | iOS dev build: SDK 57은 Xcode 26.4+ 필요, 맥이 macOS 14.5라 설치 불가 | macOS Tahoe 업그레이드 후 진행 | 로컬 환경 |
