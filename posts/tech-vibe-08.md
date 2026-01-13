---
title: "Vibe v2.3: 14개 프레임워크별 언어 룰과 모노레포 지원"
date: "2026-01-13"
category: "tech"
description: "Next.js, React, Vue, Nuxt 등 14개 프레임워크별 최적화 규칙 자동 적용. 모노레포 패키지별 감지와 명령어 구조 개선"
tags: ["vibe", "ai-coding", "claude-code", "monorepo", "framework-rules", "nextjs", "react", "vue", "nuxt", "release", "v2.3"]
author: "Su"
lang: "ko"
---

# Vibe v2.3: 14개 프레임워크별 언어 룰과 모노레포 지원

## AI에게 프레임워크 규칙을 가르치다

AI 코딩 도구를 쓰다 보면 이런 경험이 있습니다.

Next.js 프로젝트인데 Pages Router 스타일로 코드를 짜거나, Vue 3인데 Options API로 작성하거나, Nuxt 3인데 `useFetch` 대신 일반 `fetch`를 쓰거나.

**AI는 범용적인 지식은 있지만, 프로젝트의 프레임워크에 맞는 베스트 프랙티스를 모릅니다.**

v2.3에서 이 문제를 해결했습니다.

---

## 14개 프레임워크별 언어 룰

`vibe init` 또는 `vibe update` 실행 시, 프로젝트의 기술 스택을 감지하여 **해당 프레임워크에 맞는 규칙 파일**을 자동 설치합니다.

| 프레임워크 | 룰 파일 | 주요 내용 |
|-----------|---------|----------|
| **Next.js** | `typescript-nextjs.md` | App Router, Server Components, Server Actions |
| **React** | `typescript-react.md` | Hooks 패턴, 컴포넌트 구조, 상태관리 |
| **Vue.js** | `typescript-vue.md` | Composition API, Pinia, script setup |
| **Nuxt 3** | `typescript-nuxt.md` | useFetch, Server API, Auto-imports |
| **React Native** | `typescript-react-native.md` | 네이티브 모듈, 성능 최적화 |
| **Node.js** | `typescript-node.md` | Express/Fastify/NestJS 패턴 |
| **FastAPI** | `python-fastapi.md` | Pydantic, 비동기 처리, 의존성 주입 |
| **Django** | `python-django.md` | ORM, 뷰 패턴, 시그널 |
| **Flutter** | `dart-flutter.md` | Riverpod/BLoC, 위젯 트리 |
| **Go** | `go.md` | 에러 처리, 고루틴, 인터페이스 |
| **Rust** | `rust.md` | Result/Option, 소유권, unsafe |
| **Spring Boot** | `java-spring.md` | DI, JPA, 트랜잭션 |
| **Android** | `kotlin-android.md` | Compose, ViewModel, Coroutines |
| **iOS** | `swift-ios.md` | SwiftUI, Combine, 프로토콜 |

### 어떻게 감지하나?

`package.json`, `pyproject.toml`, `pubspec.yaml`, `go.mod`, `Cargo.toml` 등을 분석합니다.

```javascript
// package.json 의존성 분석
if (deps['next']) → typescript-nextjs
else if (deps['nuxt']) → typescript-nuxt
else if (deps['react-native']) → typescript-react-native
else if (deps['react']) → typescript-react
else if (deps['vue']) → typescript-vue
else if (deps['express'] || deps['@nestjs/core']) → typescript-node
```

Nuxt는 Vue 의존성도 있지만, Nuxt를 먼저 체크해서 정확한 프레임워크를 감지합니다.

---

## 모노레포 완벽 지원

이제 모노레포도 제대로 지원합니다.

```
monorepo/
├── packages/
│   ├── web/           ← package.json (next)
│   ├── mobile/        ← package.json (react-native)
│   └── api/           ← pyproject.toml (fastapi)
└── apps/
    └── admin/         ← package.json (vue)
```

`vibe init` 실행 결과:

```
🔍 감지된 기술 스택:
   - typescript-nextjs (packages/web/)
   - typescript-react-native (packages/mobile/)
   - python-fastapi (packages/api/)
   - typescript-vue (apps/admin/)

✅ 코딩 규칙 설치 완료 (.claude/vibe/rules/)
```

설치된 룰 파일:
- `typescript-nextjs.md`
- `typescript-react-native.md`
- `python-fastapi.md`
- `typescript-vue.md`

**각 패키지에 맞는 규칙만** 설치됩니다. Next.js 웹앱에는 Next.js 규칙, FastAPI 백엔드에는 FastAPI 규칙.

---

## 룰 파일은 어떻게 사용되나?

`.claude/vibe/rules/languages/` 폴더에 설치된 룰 파일은 Claude가 코드 작성 시 참조합니다.

예를 들어 `typescript-nuxt.md`에는:

```markdown
### useFetch / useAsyncData

// ✅ useFetch - 기본 데이터 페칭
const { data: user, pending, error } = await useFetch<User>(
  `/api/users/${props.userId}`
);

// ✅ useAsyncData - 커스텀 페칭 로직
const { data } = await useAsyncData(
  'user-posts',
  () => $fetch(`/api/users/${props.userId}/posts`)
);
```

이제 Claude는 Nuxt 프로젝트에서 `useFetch`를 사용하고, `fetch` 대신 `$fetch`를 씁니다.

---

## 명령어 구조 개선

v2.2까지는 12개 명령어였습니다. 일부는 사용 빈도가 낮았습니다.

v2.3에서 **7개 core 명령어 + 유틸리티**로 정리했습니다.

### Core 명령어 (7개)

| 명령어 | 용도 |
|--------|------|
| `/vibe.spec` | SPEC 작성 |
| `/vibe.run` | 구현 실행 |
| `/vibe.verify` | BDD 검증 |
| `/vibe.review` | 병렬 코드 리뷰 (13+ 에이전트) |
| `/vibe.analyze` | 코드 탐색/분석 |
| `/vibe.reason` | 9단계 체계적 추론 |
| `/vibe.utils` | 유틸리티 |

### 유틸리티 명령어

자주 쓰지 않는 기능은 `/vibe.utils`로 통합:

```bash
/vibe.utils --ui "로그인 폼"     # ASCII UI 미리보기
/vibe.utils --diagram            # 아키텍처 다이어그램
/vibe.utils --diagram --er       # ERD
/vibe.utils --e2e "login flow"   # E2E 테스트
/vibe.utils --compound           # 해결책 문서화
```

Tab 자동완성에서 7개만 보여서 더 깔끔합니다.

---

## 레거시 자동 정리

`vibe update` 실행 시 이전 버전의 불필요한 파일을 자동 삭제합니다.

```javascript
// 삭제되는 레거시 파일들
const legacyCommands = [
  'vibe.compound.md',   // → Hooks 자동 트리거로 변경
  'vibe.continue.md',   // → SessionStart Hook으로 변경
  'vibe.diagram.md',    // → /vibe.utils --diagram
  'vibe.e2e.md',        // → /vibe.utils --e2e
  'vibe.ui.md',         // → /vibe.utils --ui
];

const legacyAgents = [
  'reviewer.md',        // → commands/vibe.review.md로 이동
  'analyzer.md',        // → commands/vibe.analyze.md로 이동
  'reasoner.md',        // → commands/vibe.reason.md로 이동
];
```

기존 사용자가 `vibe update`만 하면 깔끔하게 정리됩니다.

---

## 업데이트 방법

### 신규 설치

```bash
npm install -g @su-record/vibe
vibe init
```

### 기존 사용자

```bash
npm update -g @su-record/vibe
vibe update
```

업데이트 후 `.claude/vibe/rules/languages/` 폴더에 프로젝트에 맞는 룰 파일이 설치됩니다.

---

## 변경 요약

### v2.2 → v2.3

| 항목 | v2.2 | v2.3 |
|------|------|------|
| 언어 룰 | 8개 (언어별) | 14개 (프레임워크별) |
| 모노레포 | 부분 지원 | 완벽 지원 |
| 명령어 | 12개 | 7개 + utils |
| 레거시 정리 | 수동 | 자동 |
| Nuxt 감지 | 없음 | 지원 |
| NestJS 감지 | 없음 | 지원 |

---

## 마무리

v2.0에서 MCP 오버헤드를 제거했습니다.
v2.1에서 병렬 코드 리뷰를 추가했습니다.
v2.2에서 ULTRAWORK 파이프라인을 완성했습니다.
v2.3에서 **프레임워크별 맞춤 규칙**을 적용합니다.

AI가 프로젝트의 기술 스택을 이해하고, 그에 맞는 베스트 프랙티스로 코드를 작성합니다.

Next.js면 App Router와 Server Components.
Nuxt면 useFetch와 Auto-imports.
FastAPI면 Pydantic과 의존성 주입.

**AI는 이제 프레임워크를 압니다.**

---

> 이전 편: [Vibe v2.0: MCP 프로토콜 오버헤드 제거와 멀티모델 오케스트레이션](tech-vibe-07.md)

**GitHub**: https://github.com/su-record/vibe
**NPM**: https://www.npmjs.com/package/@su-record/vibe
**Release**: https://github.com/su-record/vibe/releases/tag/v2.3.0
