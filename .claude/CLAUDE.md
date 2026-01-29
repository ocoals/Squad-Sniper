# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**SQUAD SNIPER**는 축구/풋살 팀의 포지션을 공정하고 재미있게 배정하는 인터랙티브 웹 게임입니다. 페널티킥 슈팅 게임을 통해 선수들에게 역할을 할당하는 드래프트 시스템입니다.

## 개발 환경 설정

### 의존성 설치
```bash
cd Squad-Sniper
npm install
```

### 개발 서버 실행
```bash
npm run dev
```
- 기본 포트: `3000`
- 자동으로 `0.0.0.0`에 바인딩되어 네트워크 접근 가능

### 프로덕션 빌드
```bash
npm run build
npm run preview
```

## 기술 스택

- **런타임**: React 19.2.3 + TypeScript 5.8
- **빌드 도구**: Vite 6.2.0
- **스타일링**: Tailwind CSS (utility classes)
- **아이콘**: Lucide React
- **음성**: Web Audio API (외부 파일 없이 프로그래매틱 생성)

## 아키텍처 구조

### 주요 컴포넌트

```
App.tsx (최상위)
├── SetupScreen.tsx        # 선수 입력 및 설정 화면
│   └── 선수 추가/삭제, 커스텀 미션, 언어 전환
└── GameInterface.tsx      # 게임 플레이 메인 로직
    └── Jersey.tsx         # 개별 유니폼 컴포넌트
```

#### App.tsx
- 전역 상태 관리: `mode` ('setup' | 'game'), `players`, `language`
- 언어 변경 시 메타 태그 동적 업데이트 (SEO 최적화)

#### SetupScreen.tsx
- 선수 이름 입력 폼
- 커스텀 역할/미션 설정 (12명 초과 선수용)
- 다국어 UI 제공

#### GameInterface.tsx (핵심 게임 로직)
- `requestAnimationFrame` 기반 게임 루프
- WASD/방향키 조준, Shift 정밀 모드, 스페이스/Enter 슈팅
- 10초 타이머 (자동 슈팅)
- 히트 판정: `useRef`로 DOM bounding rect 직접 계산
- 마지막 선수는 자동 할당

#### Jersey.tsx
- 미스터리 모드: 역할 숨김 (색상 셔플)
- 포커스 시 스케일/글로우 효과
- 디버그 히트박스 시각화 옵션

### 유틸리티 & 상수

#### utils/audio.ts
- `playBeep(type)`: Web Audio API 음성 생성 (`move`, `shoot`, `hit`, `tick`, `locked`, `timeup`, `miss`)
- `shuffleArray()`: Fisher-Yates 셔플

#### constants.ts
- **ROLE_DEFINITIONS**: 12개 핵심 포지션 (GK, RB, RCB, LCB, LB, CDM, LW, CM, ST, RW, CAM, MGR)
- **EXTRA_ROLE_DEFINITIONS**: 13개 추가 역할 (SUB1~3, RES, MED, KIT, VAR, H2O, ASST, SCT, PHYS, ANL, GKC, FAN)
- **ROLE_MISSIONS**: 각 역할별 도전 과제 (한/영)
- **DEFAULT_NAMES**: 전설적 축구 스타 12명
- **TRANSLATIONS**: 한국어/영어 전체 UI 텍스트
- **색상 팔레트**: 16가지 Tailwind 색상

#### types.ts
- `Player` 인터페이스: `id`, `name`, `role`, `shortRole`, `number`, `color`, `customRole`, `customMission`
- `SoundEffect` 인터페이스

## 개발 가이드

### 경로 별칭
- `@/*` = 루트 디렉토리 (vite.config.ts, tsconfig.json 설정)

### 렌더링 최적화
- `useMemo`: 역할 생성, 색상 셔플, 인덱스 배열
- `useCallback`: 게임 루프, 히트 판정, 슈팅 로직
- `useRef`: DOM 직접 접근 (히트 판정용)

### 상태 관리
- React Hooks 기반 로컬 상태 (외부 라이브러리 없음)
- 상태를 최소화하고 필요한 부분만 관리

### 다국어 지원
- `constants.ts`의 `TRANSLATIONS` 객체 수정
- 새 언어 추가 시 타입도 함께 업데이트 (`'ko' | 'en'`)

### 새 역할 추가
1. `constants.ts`의 `EXTRA_ROLE_DEFINITIONS`에 정의 추가
2. `ROLE_MISSIONS`에 해당 역할의 미션 추가 (한/영)
3. 필요 시 `TRANSLATIONS`에 번역 추가

### 게임 설정 변경
- `constants.ts`의 `SHOT_CLOCK_SECONDS` 수정 (타이머 시간)
- `GameInterface.tsx`의 움직임 속도, 히트박스 크기 등 조정

## 주요 기능 흐름

1. **설정 단계** (SetupScreen)
   - 선수 이름 입력 (최소 1명, 무제한)
   - 12명 초과 시 추가 역할 선택 가능
   - 커스텀 미션 입력 (선택)

2. **게임 단계** (GameInterface)
   - 화면에 무작위 위치로 움직이는 유니폼 표시
   - 스코프로 조준 → 슈팅 → 히트 판정
   - 역할 할당 후 다음 선수로 진행
   - 10초 타이머 (자동 슈팅)
   - 마지막 선수는 자동 할당

3. **결과 화면**
   - 전체 드래프트 결과 표시
   - 선수별 역할, 미션 표시
   - "다시 하기" 버튼으로 설정 화면 복귀

## 디버깅

### 히트박스 시각화
- `Jersey.tsx`에서 `showDebugHitbox={true}` prop 전달

### 콘솔 로그
- 게임 이벤트는 `console.log` 대신 UI로 피드백
- 개발 시 필요한 경우 `useEffect` 내부에 로그 추가

## 주의사항

- **히트 판정 로직**: `useRef`로 DOM 요소의 `getBoundingClientRect()` 직접 계산하므로 컴포넌트 구조 변경 시 주의
- **requestAnimationFrame**: 게임 루프는 60fps 기준이므로 무거운 연산은 루프 밖에서 처리
- **Web Audio API**: iOS Safari는 사용자 인터랙션 후에만 음성 재생 가능 (자동 재생 불가)
- **무제한 선수**: 12명 초과 시 `EXTRA_ROLE_DEFINITIONS`에서 순차 할당, 모두 소진 시 에러 발생 (현재 최대 25명)

## 성능 최적화

- 컴포넌트 리렌더링 최소화: `useMemo`, `useCallback` 활용
- 불필요한 상태 업데이트 방지
- 게임 루프 내부에서는 상태 변경 최소화
