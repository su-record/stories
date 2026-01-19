---
title: "vibe 개발일지 #2 - BDD 통합과 v0.2.0 (10개 커밋)"
date: "2025-11-18"
category: "dev-log"
description: "BDD 기반 검증 시스템 도입, Gemini 프롬프팅 전략 통합"
tags: ["vibe", "개발일지", "BDD", "Gemini"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #2 - BDD 통합과 v0.2.0 (10개 커밋)

**작업 기간**: 2025-11-18 ~ 2025-12-09

## 📝 이번 기간 작업 내용

### BDD 기반 품질 검증 시스템 (6개 커밋)

vibe의 핵심 철학인 **SPEC-driven development**를 강화했습니다. BDD(Behavior Driven Development)와 Contract Testing을 모든 커맨드에 통합했습니다.

| 커밋 | 내용 |
|------|------|
| `feat: integrate BDD and Contract Testing across all commands (v0.2.0)` | BDD 전면 도입 |
| `feat: major improvements to /vibe.spec command` | SPEC 커맨드 대폭 개선 |
| `feat: integrate reasoning framework and Gemini prompting strategies` | Gemini 프롬프팅 전략 |
| `docs: update MCP tool count to 36 (hi-ai v1.4.0)` | 도구 수 업데이트 |
| `chore: bump version to 0.3.0` | v0.3.0 릴리스 |

### Universal Agent 지원 (4개 커밋)

여러 AI 에이전트를 지원하는 구조로 개선했습니다.

| 커밋 | 내용 |
|------|------|
| `feat: universal agent support with interactive selection` | 에이전트 선택 기능 |
| `refactor: improve code quality in bin/vibe and install-mcp.js` | 코드 품질 개선 |

## 💡 작업 하이라이트

**BDD + SPEC의 시너지**

SPEC 문서에서 정의한 요구사항이 자동으로 BDD 시나리오로 변환되어, 구현 후 자동 검증이 가능해졌습니다:

```
SPEC 작성 → BDD 시나리오 생성 → 구현 → 자동 검증
```

Gemini의 프롬프팅 전략(Few-shot, Chain-of-Thought)을 통합하여 AI의 추론 품질을 높였습니다.

## 📊 개발 현황

- **버전**: v0.1.3 → v0.3.0 (메이저 기능 추가)
- **MCP 도구**: 36개 (hi-ai v1.4.0)
- **핵심 기능**: BDD 검증, Gemini 통합, Universal Agent
