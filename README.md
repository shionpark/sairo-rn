# SAIRO RN

부산 관광 추천 앱 **SAIRO**를 Capacitor(Next.js 정적 export)에서 React Native(Expo)로 옮기는 스파이크입니다.
전환하면 얼마나 드는지 실제로 옮겨 보며 재고, 그 값을 전환 결정 근거로 씁니다.

- 원본(웹 · Capacitor): [sairo-busan/cultural-fit-busan](https://github.com/sairo-busan/cultural-fit-busan)
- 서버(`/api/*`)는 원본의 Vercel 배포를 그대로 호출합니다

## 기술 스택

Expo SDK 57 · React Native 0.86 · React 19 · expo-router · NativeWind 4(Tailwind 3) · TypeScript

## 진행 현황

| 티켓 | 내용 | 상태 |
|---|---|---|
| [RN-CHORE-001](docs/tickets/RN-CHORE-001_expo_setup.md) | Expo 프로젝트 · 하단 탭 3개 · NativeWind | 완료 |
| [RN-CHORE-002](docs/tickets/RN-CHORE-002_shared_logic_port.md) | 추천 엔진 · 타입 · 데이터 이식 | 완료 |
| [RN-CHORE-003](docs/tickets/RN-CHORE-003_storage_port.md) | 저장소 이식 (localStorage → MMKV) | 완료 |
| [RN-FEAT-001](docs/tickets/RN-FEAT-001_recommend_text_output.md) | 추천 결과 목록 (로딩 · 에러 · 목록) | 완료 |
| 피드 화면 | `FeedContent` · `PlaceRow` · `PlaceCard` · `Skeleton` | 진행 전 |
| 장소 상세 | 피드 → 상세 진입 · 뒤로가기 복귀 · 로딩 · 에러 | 진행 전 |
| iOS 실행 | iOS 시뮬레이터 · 아이폰 dev build (Xcode 26.4+ 필요) | 진행 전 |

## 측정

| 항목 | 값 |
|---|---|
| 엔진 · 타입 · 데이터 복사 | 22개 파일 · 3,333줄 |
| 수정 없이 통과 | 20개 파일 · 3,242줄 (파일 91% · 줄 97%) |
| 수정한 곳 | `i18n/routing.ts`(next-intl → 타입 한 줄) · `types/trip.ts`(컴포넌트 의존 타입을 파일 안으로) |
| 추천 훅 · API 이식 | 3개 파일 257줄 중 6줄 수정 · 운영 API로 웹과 같은 순위 확인 |
| 저장소 교체 (MMKV) | `storage.ts` 원본 207줄 그대로 · 맨 위 18줄 추가. Android dev build 첫 빌드 18분 18초 |

자세한 근거는 [전환 검토 문서](docs/decisions/2026-09-25_RN_전환_검토.md)에 있습니다.

## 실행

Node 22, Android 에뮬레이터 또는 iOS 시뮬레이터가 필요합니다. MMKV(네이티브 모듈)를 써서 Expo Go 대신 dev build로 실행합니다.

```bash
npm install
npm run android      # dev build (expo run:android)
npx tsc --noEmit     # 타입 검사
```

## 구조

```
src/app/      화면 (expo-router, 파일 = 경로)
src/lib/      추천 엔진 (원본에서 복사)
src/types/    도메인 타입
src/data/     퀴즈 · 프로필 · 여행 설정 데이터
messages/     ko · en 문구
docs/         전환 검토 문서 · 티켓
```
