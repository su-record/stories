---
title: "Vibe v2.6.17: Swarm Orchestrator와 23개 언어 감지"
date: "2026-01-28"
category: "tech"
description: "에이전트 자가 복제 Swarm 패턴 실험, 23개 프레임워크 전체 감지, Cursor 규칙 동적 변환, CLAUDE.md 마커 기반 중복 방지"
tags: ["vibe", "ai-coding", "claude-code", "swarm", "language-detection", "cursor", "release", "v2.6.17"]
author: "Su"
lang: "ko"
---

# Vibe v2.6.17: Swarm Orchestrator와 23개 언어 감지

## 에이전트가 에이전트를 만든다

v2.4에서 Agent Orchestrator로 에이전트를 프로그래밍 방식으로 제어할 수 있게 됐습니다. v2.6.9에서 Race Review로 GPT와 Gemini를 경쟁시켰습니다.

그런데 에이전트 수가 고정되어 있다는 한계가 있었습니다. 리뷰 에이전트 12개, 리서치 에이전트 4개. 작업이 크든 작든 같은 수의 에이전트가 투입됩니다.

**작업 규모에 따라 에이전트 수를 동적으로 결정할 수 없을까?**

---

## Swarm Orchestrator

Swarm 패턴은 에이전트가 필요에 따라 서브 에이전트를 스스로 생성하는 오케스트레이션 방식입니다.

```
작업 접수
    ↓
메인 에이전트가 작업 분석
    ↓
"이 작업은 5개 서브태스크로 나뉜다"
    ↓
5개 서브 에이전트 동적 생성
    ↓
각 서브 에이전트가 독립 작업
    ↓
결과 수집 → 통합
```

### 기존 오케스트레이터와의 차이

| 항목 | Agent Orchestrator (v2.4) | Swarm Orchestrator |
|------|--------------------------|-------------------|
| 에이전트 수 | 고정 (12 리뷰 + 4 리서치) | 동적 (작업 규모에 따라) |
| 에이전트 생성 | 사전 정의 | 런타임 자가 복제 |
| 작업 분배 | 역할 기반 | 태스크 기반 |
| 적합한 상황 | 정형화된 리뷰/리서치 | 비정형 탐색/분석 |

### 실제 동작 예시

```
/vibe.analyze "전체 프로젝트 보안 점검"
    ↓
Swarm Orchestrator:
  "프로젝트에 42개 파일. 7개 모듈로 그룹화"
    ↓
7개 서브 에이전트 생성:
  - Agent 1: auth/ 모듈 보안 점검
  - Agent 2: api/ 모듈 보안 점검
  - Agent 3: database/ 모듈 보안 점검
  - Agent 4: payment/ 모듈 보안 점검
  - Agent 5: file-upload/ 모듈 보안 점검
  - Agent 6: session/ 모듈 보안 점검
  - Agent 7: config/ 모듈 보안 점검
    ↓
7개 결과 통합 → 보안 리포트
```

작은 프로젝트면 2~3개, 큰 프로젝트면 10개 이상. 작업 규모에 맞게 에이전트가 스케일링됩니다.

### 현재 상태

Swarm Orchestrator는 **실험 단계**입니다. README에 기록은 했지만, 안정화가 더 필요합니다. 프로덕션 사용은 기존 Agent Orchestrator를 권장합니다.

---

## 23개 프레임워크 전체 감지

v2.3에서 14개 프레임워크를 지원했습니다. v2.6.17에서 **23개**로 확장했습니다.

### 추가된 프레임워크

| 프레임워크 | 감지 기준 | 룰 파일 |
|-----------|----------|---------|
| Svelte | `svelte` in deps | `typescript-svelte.md` |
| Angular | `@angular/core` in deps | `typescript-angular.md` |
| Remix | `@remix-run/react` in deps | `typescript-remix.md` |
| Astro | `astro` in deps | `typescript-astro.md` |
| Express | `express` in deps | `typescript-express.md` |
| NestJS | `@nestjs/core` in deps | `typescript-nestjs.md` |
| Deno | `deno.json` 존재 | `typescript-deno.md` |
| Electron | `electron` in deps | `typescript-electron.md` |
| Tauri | `@tauri-apps/api` in deps | `rust-tauri.md` |

### 감지 우선순위

프레임워크 감지에는 우선순위가 있습니다.

```
Nuxt > Vue (Nuxt는 Vue를 포함)
NestJS > Express (NestJS는 Express를 포함)
Next.js > React (Next.js는 React를 포함)
Remix > React
Tauri > Rust
```

상위 프레임워크가 감지되면 하위는 건너뜁니다.

---

## Cursor 규칙 동적 변환

v2.6.9에서 Cursor IDE 지원을 추가했고, v2.6.17에서 규칙 변환을 고도화했습니다.

### .md → .mdc 자동 변환

vibe의 마크다운 규칙 파일을 Cursor의 `.mdc` 형식으로 동적 변환합니다.

```markdown
<!-- vibe 원본 (.md) -->
### useFetch / useAsyncData
// ✅ useFetch - 기본 데이터 페칭
const { data } = await useFetch<User>('/api/users');
```

```
<!-- Cursor 변환 (.mdc) -->
---
description: Nuxt.js 코딩 규칙
globs: ["**/*.vue", "**/*.ts"]
---
### useFetch / useAsyncData
// ✅ useFetch - 기본 데이터 페칭
const { data } = await useFetch<User>('/api/users');
```

`.mdc` 형식은 frontmatter에 `globs` 패턴이 추가됩니다. Cursor가 파일 타입에 맞는 규칙만 적용할 수 있게 합니다.

### 프로젝트 스택 필터링

전체 23개 규칙을 설치하지 않고, 프로젝트에 실제로 사용되는 스택의 규칙만 설치합니다.

```bash
vibe init --cursor
# Next.js + TypeScript 프로젝트인 경우:
# .cursor/rules/typescript-nextjs.mdc ← 설치됨
# .cursor/rules/typescript-react.mdc  ← 건너뜀 (Next.js가 우선)
# .cursor/rules/python-fastapi.mdc   ← 건너뜀 (Python 미사용)
```

---

## CLAUDE.md 마커 기반 중복 방지

`vibe update`를 여러 번 실행해도 CLAUDE.md에 내용이 중복 추가되지 않습니다.

```markdown
<!-- VIBE:START -->
## Response Language
**IMPORTANT: Always respond in Korean...**
<!-- VIBE:END -->
```

마커 사이의 내용만 교체합니다. 사용자가 마커 밖에 추가한 커스텀 내용은 보존됩니다.

---

## README 영문 번역

npm 다운로드가 늘어나면서 글로벌 사용자를 위해 README를 영어로 번역했습니다.

---

## 변경 요약

### v2.6.9 → v2.6.17

| 항목 | v2.6.9 | v2.6.17 |
|------|--------|---------|
| 오케스트레이션 | 고정 에이전트 | Swarm (동적 생성) |
| 언어 감지 | 14개 | **23개** |
| Cursor 규칙 | 기본 변환 | 동적 .mdc + 스택 필터링 |
| CLAUDE.md | 중복 가능 | 마커 기반 교체 |
| README | 한국어 | **영문 번역** |

---

## 마무리

v2.6.0에서 Fire-and-Forget과 Cursor IDE를 추가했습니다.
v2.6.9에서 Race Review로 LLM을 경쟁시켰습니다.
v2.6.17에서 **에이전트가 에이전트를 만드는** Swarm 패턴을 실험했습니다.

23개 프레임워크 감지, Cursor .mdc 동적 변환, CLAUDE.md 중복 방지.

작은 개선들이 모여서 프레임워크의 완성도를 높입니다.

---

> 이전 편: [Vibe v2.6: Fire-and-Forget, Cursor IDE, Race Review](tech-vibe-12.md)

**GitHub**: https://github.com/su-record/vibe
**NPM**: https://www.npmjs.com/package/@su-record/vibe
