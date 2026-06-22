---
title: "Vibe v2.6: Fire-and-Forget, Cursor IDE, Race Review"
date: "2026-01-26"
category: "tech"
description: "Fire-and-Forget 비동기 SPEC, Cursor IDE 지원, Multi-LLM Race Review, UI 디자인 도구, E2E 테스트 생성기"
tags: ["vibe", "ai-coding", "claude-code", "cursor", "race-review", "fire-and-forget", "release", "v2.6"]
author: "Su"
lang: "ko"
---

# Vibe v2.6: Fire-and-Forget, Cursor IDE, Race Review

## Claude Code를 넘어서

v2.5까지 vibe는 Claude Code 전용이었습니다.

v2.6에서 두 가지 큰 변화가 있습니다. **Cursor IDE 지원**으로 사용자 저변을 넓히고, **Fire-and-Forget 패턴**으로 워크플로우 속도를 높였습니다.

---

## Fire-and-Forget

SPEC 작성 후 리뷰를 기다리지 않고 즉시 구현을 시작할 수 있습니다.

```
기존:
/vibe.spec → (리뷰 완료 대기) → /vibe.run

v2.6:
/vibe.spec → /vibe.run (즉시 시작)
                ↑
          리뷰는 백그라운드에서 진행
          결과가 나오면 자동 반영
```

SPEC 리뷰에서 P1(Critical) 이슈가 발견되면 구현을 중단하고 SPEC을 수정합니다. P2 이하는 구현 후 반영합니다.

### Phase Pipelining

Phase 단위로도 같은 원칙이 적용됩니다.

```
Phase 1 [구현 중] ──────────────────────>
        Phase 2 [분석 중] ───────>
                Phase 2 [구현 시작] ──────>
                        Phase 3 [분석 중] ──>
```

Phase 1을 구현하는 동안 Phase 2의 분석이 백그라운드에서 시작됩니다. 순차 실행 대비 상당한 시간을 절약합니다.

### PRD-to-SPEC 변환

기존 PRD(Product Requirements Document)가 있으면 vibe SPEC 형식으로 자동 변환합니다.

```bash
/vibe.spec "feature" --prd ./docs/prd.md
# → PRD를 분석해서 PTCF 구조의 SPEC으로 변환
```

---

## Cursor IDE 지원

vibe의 코딩 규칙과 프레임워크별 룰을 Cursor에서도 사용할 수 있습니다.

```bash
vibe init --cursor
# → .cursor/rules/ 에 프로젝트에 맞는 규칙 설치
```

### Claude Code vs Cursor

| 항목 | Claude Code | Cursor |
|------|-------------|--------|
| 규칙 형식 | `.md` | `.mdc` |
| 규칙 위치 | `.claude/vibe/rules/` | `.cursor/rules/` |
| 커맨드 | `/vibe.spec` | 자연어 |
| Hook | 지원 | 미지원 |

Cursor는 `.mdc` 형식의 룰 파일을 사용합니다. vibe는 동일한 규칙 소스에서 두 가지 형식을 동적으로 생성합니다.

```
vibe 규칙 소스 (.md)
    ↓
┌──────────────────┬──────────────────┐
│ Claude Code용    │ Cursor용         │
│ .claude/vibe/    │ .cursor/rules/   │
│ rules/*.md       │ *.mdc            │
└──────────────────┴──────────────────┘
```

### 23개 언어 타입 전체 감지

Cursor 지원과 함께 감지 가능한 프레임워크를 23개로 확장했습니다.

기존 14개에 추가:
- Svelte, Angular, Remix, Astro
- Express, NestJS, Deno
- Electron, Tauri

---

## Multi-LLM Race Review

코드 리뷰 시 GPT와 Gemini를 동시에 실행해서 결과를 비교합니다.

```
코드 변경
    ↓
┌──────────────┬──────────────┐
│ GPT 리뷰     │ Gemini 리뷰  │
│ (병렬 실행)  │ (병렬 실행)  │
└──────────────┴──────────────┘
    ↓
결과 비교
    ↓
┌──────────────────────────────┐
│ 공통 이슈 → P1 (높은 신뢰)  │
│ 단독 이슈 → P2 (검토 필요)  │
└──────────────────────────────┘
```

**Race의 의미**: 두 모델이 독립적으로 같은 코드를 리뷰합니다. 결과를 "경주"시켜서 교차 검증합니다.

---

## UI 디자인 도구

Gemini를 활용한 UI 디자인 생성 도구를 추가했습니다.

```bash
/vibe.utils --ui "login form with social auth"
# → Gemini가 UI 디자인 생성
# → HTML/CSS 코드 변환
```

디자인 폴더가 있으면 기존 디자인 시스템과 일관되게 생성합니다.

---

## E2E 테스트 스켈레톤 생성기

Playwright 기반 E2E 테스트의 기본 구조를 자동 생성합니다.

```bash
/vibe.utils --e2e "login flow"
# → tests/e2e/login-flow.spec.ts 생성
# → Page Object 패턴 적용
# → Visual regression 설정 포함
```

---

## Session RAG

세션 중 발생하는 의사결정, 제약조건, 목표를 구조화해서 저장하고 검색합니다.

```typescript
// 결정 저장
await saveSessionItem({
  itemType: 'decision',
  title: 'Use Vitest',
  rationale: 'Fast and modern'
});

// 컨텍스트 검색
await retrieveSessionContext({ query: 'testing' });
```

SQLite + FTS5 BM25 하이브리드 검색으로 관련 컨텍스트를 빠르게 찾습니다.

---

## Smart Hook Dispatcher

기존 Hook은 단순 패턴 매칭이었습니다. Smart Hook Dispatcher는 컨텍스트를 분석해서 필요한 훅만 실행합니다.

```
기존: 모든 매칭 훅 실행 (불필요한 실행 포함)
v2.6: 컨텍스트 분석 → 필요한 훅만 선택 실행
```

progress tracking과 auto-retrospective도 추가했습니다.

---

## GPT/Gemini 호출 통합

여러 커맨드에 분산되어 있던 GPT/Gemini 호출 로직을 `llm-orchestrate.js` 하나로 통합했습니다.

```
모든 커맨드 → llm-orchestrate.js → GPT/Gemini API
```

Windows에서 CLI 인자 길이 제한(8191자)을 우회하기 위해 stdin pipe 방식을 도입했습니다.

---

## 변경 요약

### v2.5 → v2.6

| 항목 | v2.5 | v2.6 |
|------|------|------|
| 워크플로우 | 순차 실행 | Fire-and-Forget |
| IDE 지원 | Claude Code만 | Claude Code + Cursor |
| 코드 리뷰 | 개별 LLM | Race Review (교차 검증) |
| 언어 감지 | 14개 | 23개 |
| UI 도구 | ASCII 미리보기 | Gemini UI 생성 |
| E2E 테스트 | 수동 | 스켈레톤 자동 생성 |
| 세션 관리 | 메모리 기반 | Session RAG (구조화) |
| Hook | 패턴 매칭 | Smart Dispatcher |

---

## 마무리

v2.0에서 MCP를 내장으로 전환했습니다.
v2.1에서 병렬 코드 리뷰를 추가했습니다.
v2.2에서 ULTRAWORK 파이프라인을 완성했습니다.
v2.3에서 프레임워크별 맞춤 규칙을 적용했습니다.
v2.4에서 에이전트를 프로그래밍 가능하게 만들었습니다.
v2.5에서 3개 LLM 리서치를 통합했습니다.
v2.6에서 **Claude Code를 넘어 Cursor까지, 순차에서 비동기까지** 확장했습니다.

```bash
# Claude Code
/vibe.spec "feature"
/vibe.run "feature" ultrawork

# Cursor
vibe init --cursor
# → .cursor/rules/ 자동 설치
```

---

> 이전 편: [Vibe v2.5: Multi-LLM Research와 품질 보증 자동화](tech-vibe-11.md)

**GitHub**: https://github.com/su-record/vibe
**NPM**: https://www.npmjs.com/package/@su-record/vibe
