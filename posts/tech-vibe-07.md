---
title: "Vibe v2.0: MCP 프로토콜 오버헤드 제거와 멀티모델 오케스트레이션"
date: "2026-01-10"
category: "tech"
description: "hi-ai MCP를 내장 도구로 전환하여 프로토콜 오버헤드를 제거하고, GPT/Gemini 서브에이전트 통합으로 멀티모델 AI 오케스트레이션 완성"
tags: ["vibe", "ai-coding", "claude-code", "mcp", "multi-model", "gpt", "gemini", "release", "v2.0"]
author: "Su"
lang: "ko"
---

# Vibe v2.0: MCP 프로토콜 오버헤드 제거와 멀티모델 오케스트레이션

## MCP는 좋은데, 무겁다

v1.3까지 vibe는 hi-ai라는 별도의 MCP 서버에 의존했습니다. 36개의 도구(코드 분석, 품질 검증, 세션 메모리 등)가 MCP 프로토콜을 통해 호출되었습니다.

문제는 **오버헤드**였습니다.

```
Claude → MCP 프로토콜 → hi-ai 서버 → 도구 실행 → 결과 반환 → Claude
```

매번 도구를 호출할 때마다 프로토콜 변환, 서버 통신, 결과 파싱이 일어납니다. 복잡도 분석 한 번에도 이 과정을 거칩니다. 세션 저장할 때도 마찬가지입니다.

**외부 서버가 필요한 도구가 아닌데 왜 외부 서버처럼 동작해야 하나?**

---

## MCP를 내장 도구로

v2.0에서 hi-ai MCP를 vibe 내부로 통합했습니다.

```
v1.3: Claude → MCP → hi-ai → 도구
v2.0: Claude → vibe 내장 도구 (직접 실행)
```

36개 도구가 이제 vibe에 내장됩니다. 프로토콜 오버헤드가 사라집니다.

### 도구 네이밍도 변경

```
v1.3: mcp__vibe__find_symbol
v2.0: vibe_find_symbol
```

MCP 프리픽스가 필요 없어졌습니다. 더 깔끔합니다.

### 주요 내장 도구

| 카테고리 | 도구 | 용도 |
|----------|------|------|
| 코드 분석 | `vibe_analyze_complexity` | 복잡도 분석 |
| | `vibe_validate_code_quality` | 품질 검증 |
| 시맨틱 검색 | `vibe_find_symbol` | 심볼 정의 찾기 |
| | `vibe_find_references` | 참조 찾기 |
| 추론 | `vibe_create_thinking_chain` | 사고 체인 생성 |
| | `vibe_analyze_problem` | 문제 분석 |
| 메모리 | `vibe_save_memory` | 결정사항 저장 |
| | `vibe_recall_memory` | 메모리 조회 |
| | `vibe_auto_save_context` | 컨텍스트 자동 저장 |
| UI | `vibe_preview_ui_ascii` | ASCII UI 미리보기 |

---

## 컨텍스트 관리 개선

### 세션 자동 복원

새 세션이 시작되면 SessionStart Hook이 자동으로 `vibe_start_session`을 호출합니다.

```
새 세션 시작
    ↓
SessionStart Hook 발동
    ↓
vibe_start_session 자동 호출
    ↓
이전 컨텍스트 복원 (프로젝트 메모리, 작업 상태, 결정사항)
    ↓
이어서 작업
```

`/vibe.continue`를 직접 호출할 필요가 없습니다. 세션 시작하면 자동으로 복원됩니다.

### 컨텍스트 임계값 변경

v1.3까지는 70%/85%/95%였습니다. v2.0에서 80%/90%/95%로 변경했습니다.

| 임계값 | 동작 | urgency |
|--------|------|---------|
| 80% | 자동 저장 | medium |
| 90% | 즉시 저장 | high |
| 95% | 긴급 저장 + 세션 전환 준비 | critical |

```
80% 도달 → vibe_auto_save_context 자동 호출 (MANDATORY)
90% 도달 → 즉시 저장 (urgency=high)
95% 도달 → 긴급 저장 + 세션 전환 준비
```

**MANDATORY**입니다. 선택이 아니라 필수입니다. Hook 메시지도 "call vibe_auto_save_context NOW. This is NOT optional"로 변경했습니다.

### /compact 금지

Claude의 `/compact` 명령은 **정보 손실/왜곡 위험**이 있습니다. vibe 메모리 시스템을 사용하세요.

```
❌ /compact (정보 손실 위험)
✅ vibe_auto_save_context → /new → vibe_start_session
```

vibe가 알아서 중요한 컨텍스트를 저장하고 복원합니다.

---

## 멀티모델 AI 오케스트레이션

### GPT-5.2 Codex 통합

GPT-5.2 Codex를 서브에이전트로 사용할 수 있습니다.

```bash
# OAuth 인증 (ChatGPT Plus/Pro 구독자, 권장)
vibe gpt --auth

# API 키 방식
vibe gpt <your-api-key>
```

사용 가능한 도구:

| 도구 | 용도 |
|------|------|
| `gpt_chat` | GPT-5.2 질의 |
| `gpt_analyze_architecture` | 아키텍처 분석 |
| `gpt_debug` | 디버깅 지원 |
| `gpt_quick_ask` | 빠른 질문 (GPT-5.1 Codex Mini) |

### Gemini 3 Flash/Pro 통합

Gemini도 서브에이전트로 사용할 수 있습니다.

```bash
# OAuth 인증 (Google AI Studio 구독자, 권장)
vibe gemini --auth

# API 키 방식
vibe gemini <your-api-key>
```

사용 가능한 도구:

| 도구 | 용도 |
|------|------|
| `gemini_chat` | Gemini 질의 |
| `gemini_analyze_code` | 코드 분석 |
| `gemini_review_ui` | UI/UX 리뷰 |
| `gemini_quick_ask` | 빠른 질문 |

### ULTRAWORK + 멀티모델

ULTRAWORK 모드에서 GPT/Gemini가 활성화되어 있으면 자동으로 활용합니다.

```
/vibe.run "기능명" ultrawork
    ↓
병렬 탐색 (Claude Haiku 3+)
    ↓
아키텍처 검토 필요? → GPT-5.2 호출
복잡한 로직 분석? → Gemini 3 Pro 호출
    ↓
구현 (Claude Sonnet)
    ↓
품질 검증 (BDD)
```

모델 선택은 vibe가 자동으로 합니다.

---

## MCP 서버 구조

v2.0에서 MCP 서버 구조도 정리했습니다.

| MCP 서버 | 용도 | 등록 방식 |
|----------|------|----------|
| `vibe-gemini` | Gemini 서브에이전트 | 전역 (`-s user`) |
| `vibe-gpt` | GPT 서브에이전트 | 전역 (`-s user`) |
| `context7` | 라이브러리 문서 검색 | 전역 (`-s user`) |

**내장 도구**와 **외부 LLM MCP**로 역할이 분리되었습니다:

- 내장 도구 (36개): 코드 분석, 품질 검증, 세션 메모리 → 오버헤드 없음
- MCP 서버: GPT/Gemini 호출, context7 문서 검색 → 외부 통신 필요

---

## TypeScript 마이그레이션

v2.0에서 전체 코드베이스를 TypeScript로 마이그레이션했습니다.

```
v1.x: CommonJS (.cjs)
v2.0: TypeScript (.ts) → ESM 빌드
```

타입 안정성이 향상되었습니다. 런타임 에러가 컴파일 타임에 잡힙니다.

---

## 변경 요약

### v1.3 → v2.0

| 항목 | v1.3 | v2.0 |
|------|------|------|
| 도구 호출 | MCP 프로토콜 | 내장 (직접 실행) |
| 도구 네이밍 | `mcp__vibe__*` | `vibe_*` |
| 세션 복원 | `/vibe.continue` 수동 호출 | SessionStart 자동 복원 |
| 컨텍스트 임계값 | 70%/85%/95% | 80%/90%/95% |
| 외부 LLM | 없음 | GPT-5.2, Gemini 3 |
| 코드베이스 | CommonJS | TypeScript |

### 호환성

- hi-ai MCP 제거됨 → vibe 내장으로 대체
- 도구 이름 변경 (`mcp__vibe__` → `vibe_`)
- 기존 `.vibe/` 설정 그대로 사용 가능

---

## 설치 및 업데이트

### 신규 설치

```bash
npm install -g @su-record/vibe
vibe init
```

### 기존 사용자 업데이트

```bash
npm update -g @su-record/vibe
vibe update
```

### 외부 LLM 설정 (선택)

```bash
# GPT 인증
vibe gpt --auth

# Gemini 인증
vibe gemini --auth
```

---

## 마무리

v1.0은 멀티 모델 오케스트레이션의 시작이었습니다.
v1.2는 ULTRAWORK 모드로 속도를 높였습니다.
v1.3은 SDD/BDD로 품질을 시스템이 보장하게 했습니다.
v2.0은 **프로토콜 오버헤드를 제거하고, 진짜 멀티모델 AI 오케스트레이션을 완성**했습니다.

Claude + GPT + Gemini. 세 모델이 하나의 워크플로우에서 협업합니다. 각자 잘하는 것을 합니다.

---

> 이전 편: [Vibe v1.3: SDD로 구현하고 BDD로 검증하는 품질 자동화](tech-vibe-06.md)

**GitHub**: https://github.com/su-record/vibe
**NPM**: https://www.npmjs.com/package/@su-record/vibe
**Release**: https://github.com/su-record/vibe/releases/tag/v2.0.0
