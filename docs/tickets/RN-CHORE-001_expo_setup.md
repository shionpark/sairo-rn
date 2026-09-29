# RN-CHORE-001: Expo 프로젝트 세팅

RN 스파이크 Day 1-①. 빈 Expo 앱이 안드로이드 에뮬레이터에서 탭 3개로 뜨는 데까지.

---

## Metadata

| Key | Value |
|-----|-------|
| Prefix | RN |
| Type | CHORE |
| Severity | - |
| Layer | Config |
| Status | Done |
| Repo | `~/Projects/active/sairo-rn` (신규 · 로컬만, 푸시 안 함) |
| Depends | - |
| Related | `docs/decisions/2026-09-25_RN_전환_검토.md` |

---

## Problem

- **현재**: RN 프로젝트가 없다.
- **기대**: expo-router · NativeWind가 붙은 빈 앱이 에뮬레이터에서 뜬다.
- **영향 범위**: 신규 레포만. 이 레포(`cultural-fit-busan`)는 건드리지 않는다.

---

## Context

- 심사 기간 스토어 빌드 교체 여부가 미정이다. 스파이크는 **스토어에 올리지 않는다.**
- 지금 앱의 탭은 `추천 · 저장 · 내 정보` 3개다(`docs/decisions/하단탭_3개_구성.md`).
- Node 22를 쓴다(이 레포 `engines`와 맞춘다). `ANDROID_HOME`은 Capacitor 빌드 때 설정한 값을 쓴다.

---

## Scope

### 포함

| # | 작업 |
|---|---|
| 1 | `npx create-expo-app@latest sairo-rn` (TypeScript 템플릿) |
| 2 | expo-router 탭 레이아웃: `feed` · `saved` · `me` 빈 화면 |
| 3 | NativeWind 설치 · 한 화면에 `className` 하나로 적용 확인 |
| 4 | tsconfig `@/*` 경로 별칭 (이식할 코드가 `@/` import를 쓴다) |

### 제외

| 항목 | 이유 |
|---|---|
| Pretendard 폰트 | Day 2 화면 작업 때 |
| 디자인 토큰 이식 | Day 2 |
| EAS 설정 | Day 3 빌드 때 |

---

## Acceptance Criteria

- [x] `npx expo start` → 안드로이드 에뮬레이터에서 탭 3개가 보이고 전환된다
- [x] NativeWind `className`이 적용된다 (배경색 하나로 확인)
- [x] `import x from "@/..."`가 해석된다
- [x] `tsc --noEmit` 통과

---

## 측정 (결정 문서 ④로)

- 세팅에 걸린 시간: **약 3시간 (RN 처음 · 학습 포함)**
  - 9/28 15:59~16:27 프로젝트 생성 → 에뮬레이터에 기본 앱 (약 30분)
  - 9/29 13:19~15:50 탭 3개 · NativeWind (약 2시간 30분)
  - 9/25 23:53 Node 전환 (수 분)
  - 커밋 · 캡처 시각 기준 추정. 개념 질문 · 셸 환경 정리 포함
- 막힌 곳과 해결 방법

  | 막힌 곳 | 해결 | 성격 |
  |---|---|---|
  | `fnm use 22` 후에도 Node 20 — `.zshrc`에서 nvm이 fnm 뒤에 로드돼 PATH 앞을 차지 | 터미널마다 `nvm deactivate` → `fnm use 22` | 로컬 환경 |
  | `ANDROID_HOME` 미설정 (Context의 "Capacitor 때 설정한 값" 없음) | `~/.zshrc`에 `ANDROID_HOME` · `emulator` · `platform-tools` PATH 고정 | 로컬 환경 |
  | `expo start --android`가 `No Android connected device found` — 에뮬레이터 자동 부팅 실패 | 에뮬레이터를 먼저 켜고 `npm run android`. 원인 미확정 (`ANDROID_HOME` 없는 터미널로 추정) | 로컬 환경 |
  | Metro 재시작 뒤 `Cannot connect to Expo CLI` 경고, 화면이 옛 코드 그대로 | 경고 Dismiss → Metro에서 `r` 새로고침 | RN 개발 흐름 |
  | `reset-project` 기본값(Y)이 예제를 `example/`로 옮김. `.gitignore` 대상이라 git에 안 보이지만 `tsc`가 검사해 에러 30개 | `example/` 삭제 | 템플릿 |
  | NativeWind 안정판(v4.2.7)은 Tailwind 3. 원본은 Tailwind 4 | v4.2.7 채택. 원본 `globals.css` `@theme` 토큰은 Day 2에 `tailwind.config.js`로 옮겨야 함 → ④ CSS 목록 후보 | 전환 비용 |

- 템플릿이 이미 준 것: expo-router · TypeScript · `@/*` → `./src/*` 별칭(원본과 같음). Scope #2 · #4는 정리 · 확인만 했다

---

## 구현 노트

| 항목 | 값 |
|---|---|
| 버전 | Expo SDK 57 · RN 0.86.3 · React 19.2.3 · expo-router 57 · NativeWind 4.2.7 · Tailwind 3.4.19 |
| 생성 | 빈 폴더에 `npx create-expo-app@latest . --template default` (Scope #1의 `sairo-rn` 인자 대신 `.`) |
| 라우트 | `src/app/` 아래 `feed` · `saved` · `me`. `index`는 `/feed`로 `Redirect`, 탭 바에서는 `href: null` |
| 탭 | expo-router `Tabs`. 템플릿의 `NativeTabs`(`unstable-native-tabs`)는 쓰지 않음. 아이콘은 Day 2 |
| 실행 | Expo Go (에뮬레이터 `Medium_Phone_API_35`) |
| 커밋 | `efe26bd` 탭 3개 · `f817b55` NativeWind |
| 캡처 | `~/Downloads/RN-CHORE-001_step4_기본앱.png` · `_step5_탭3개.png` · `_step6_nativewind.png` |
