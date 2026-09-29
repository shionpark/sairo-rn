@~/.claude/WORKFLOW.md
@AGENTS.md

# SAIRO RN (스파이크)

SAIRO(부산 관광 추천 앱)를 Capacitor(Next.js 정적 export)에서 React Native(Expo)로 옮기는 3일 스파이크.
목적은 전환 공수 추정치(`docs/decisions/2026-09-25_RN_전환_검토.md` ④). 스토어에 올리지 않는다 · 원격 없음.

## 원본과 문서

| | 위치 | 역할 |
|---|---|---|
| 원본 코드 | `~/Projects/active/cfb-rn-plan/src` | 최신 main. 여기서만 복사한다 (`cultural-fit-busan` 폴더는 옛 브랜치) |
| 계획 | `~/Projects/active/cfb-rn-plan/docs/` | 팀 공유. 수정하지 않는다 |
| 작업 기록 | `docs/decisions/` · `docs/tickets/` | 사본. 측정 · 완료 조건 · 구현 노트 · 막힌 곳은 여기에 |

- 서버(`src/app/api/*`)는 원본 레포에 남는다. 앱은 Vercel API를 절대 주소로 호출한다

## 기술스택

Expo SDK 57 · React Native 0.86 · React 19 · expo-router · NativeWind 4.2.7(Tailwind 3) · TypeScript. 버전 정본은 `package.json`

## 코드베이스 지도

- `src/app/` 화면(파일 = 경로). `_layout.tsx` 하단 탭(`feed` · `saved` · `me`), `index`는 `/feed`로 이동
- `src/global.css` · `tailwind.config.js` NativeWind 입력 · 토큰
- `babel.config.js` · `metro.config.js` NativeWind 연결

## 명령어

```bash
npm run android      # Metro + 에뮬레이터 (Expo Go)
npx tsc --noEmit     # 타입 검사
```

Node 22 (`nvm deactivate` → `fnm use 22`). `ANDROID_HOME`은 `~/.zshrc`. ESLint · 테스트 프레임워크 없음.
babel · metro 설정을 바꾸면 `npm run android -- --clear`.

## 코드 규칙

- 커밋 메시지: `feat:` · `fix:` · `chore:` · `docs:` 접두사 + 한국어 본문 + `(티켓 ID)`
- 티켓 1개 = 브랜치 1개 (`chore/RN-CHORE-001` 형식)
