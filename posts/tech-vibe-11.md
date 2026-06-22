---
title: "Vibe v2.5: Multi-LLM Research와 품질 보증 자동화"
date: "2026-01-20"
category: "tech"
description: "GPT+Gemini 병렬 리서치로 SPEC 품질 향상, SkillRepository 도입, Rule Build System으로 프레임워크 감지 고도화"
tags: ["vibe", "ai-coding", "claude-code", "multi-llm", "research", "skill-repository", "release", "v2.5"]
author: "Su"
lang: "ko"
---

# Vibe v2.5: Multi-LLM Research와 품질 보증 자동화

## 리서치의 깊이를 높이다

v2.4에서 Agent Orchestrator로 에이전트를 프로그래밍 방식으로 제어할 수 있게 됐습니다.

그런데 SPEC 작성 시 리서치 결과가 Claude의 지식에 의존하고 있었습니다. Claude만의 관점입니다. **GPT와 Gemini의 관점도 필요합니다.**

v2.5에서 Multi-LLM Research를 도입했습니다.

---

## Multi-LLM Research

SPEC 리서치 단계에서 Claude 에이전트 4개에 GPT와 Gemini를 추가합니다.

```
/vibe.spec "passkey authentication"
    ↓
요구사항 확정
    ↓
┌─────────────────────────────────────────┐
│ Claude 에이전트 (4개 병렬)              │
│  - best-practices-agent                 │
│  - framework-docs-agent                 │
│  - codebase-patterns-agent              │
│  - security-advisory-agent              │
│                                         │
│ GPT (병렬)                              │
│  - 아키텍처 관점 리서치                 │
│                                         │
│ Gemini (병렬)                           │
│  - 최신 동향 및 대안 기술 리서치        │
└─────────────────────────────────────────┘
    ↓
6개 관점 통합 → SPEC 초안
```

### 왜 3개 LLM인가

| LLM | 강점 | 리서치 역할 |
|-----|------|------------|
| Claude | 코드 이해, 정밀한 분석 | 코드베이스 패턴, 보안 |
| GPT | 넓은 지식, 아키텍처 | 설계 패턴, 베스트 프랙티스 |
| Gemini | 최신 정보, 빠른 처리 | 최신 동향, 대안 기술 |

각 모델의 강점을 살려서 리서치의 깊이와 넓이를 모두 확보합니다.

### parallelResearch.ts

```typescript
// 6개 리서치를 병렬로 실행
const results = await Promise.allSettled([
  runClaudeAgents(feature, techStack),  // 4개 에이전트
  runGPTResearch(feature),              // GPT 리서치
  runGeminiResearch(feature),           // Gemini 리서치
]);
```

---

## SkillRepository

`~/.claude/vibe/skills/`에서 스킬을 관리하는 시스템을 도입했습니다.

```
~/.claude/vibe/skills/
├── vibe-capabilities.md       # vibe 기능 가이드
├── multi-llm-orchestration.md # GPT/Gemini 사용법
├── tool-fallback.md           # 에러 복구 전략
├── context7-usage.md          # 라이브러리 문서 검색
├── parallel-research.md       # 병렬 리서치 전략
└── priority-todos.md          # 작업 관리 전략
```

스킬은 Claude가 특정 상황에서 참조하는 지식 파일입니다. Hook이 자동으로 필요한 스킬을 활성화합니다.

```json
{
  "UserPromptSubmit": [{
    "matcher": ".*",
    "hooks": [{
      "type": "command",
      "command": "node hooks/scripts/skill-activator.js"
    }]
  }]
}
```

---

## Rule Build System

프레임워크 감지와 규칙 생성을 독립적인 빌드 시스템으로 분리했습니다.

```
프로젝트 스캔
    ↓
Framework Detector
    ↓
감지 결과: [Next.js, TypeScript, Tailwind]
    ↓
Rule Builder
    ↓
.claude/vibe/rules/languages/
├── typescript-nextjs.md
└── ...
```

기존에는 감지와 규칙 설치가 하나의 함수에 섞여 있었습니다. 분리하면서 테스트 가능성과 유지보수성이 향상됐습니다.

---

## SPEC 리뷰 커맨드 분리

기존에는 `/vibe.spec`에 리뷰가 포함되어 있었습니다. v2.5에서 분리했습니다.

```bash
# 기존: SPEC 작성 + 리뷰가 같은 세션
/vibe.spec "feature"

# v2.5: SPEC 작성과 리뷰를 별도 세션에서
/vibe.spec "feature"         # 1. SPEC 작성
/new                          # 2. 새 세션
/vibe.spec.review "feature"  # 3. 리뷰 (깨끗한 컨텍스트)
```

**왜 분리했나?** 같은 세션에서 작성하고 리뷰하면, 작성 시의 맥락이 리뷰를 편향시킵니다. 새 세션에서 리뷰하면 SPEC 문서만 보고 객관적으로 판단합니다.

---

## Ralph Loop 완료 검증

Ralph Loop는 "100% 완료까지 반복"하는 패턴입니다. v2.5에서 실제 100%인지 검증하는 로직을 추가했습니다.

```
Phase 완료 체크
    ↓
모든 Acceptance Criteria 통과?
    ↓ Yes                    ↓ No
다음 Phase              수정 후 재검증
    ↓
모든 Phase 완료?
    ↓ Yes                    ↓ No
완료                    다음 Phase
```

---

## God Object 리팩토링

기능을 빠르게 추가하다 보니 일부 모듈이 비대해졌습니다.

```
Before: installer.ts (500+ lines, 15+ functions)
After:
├── installer.ts (100 lines, 핵심 로직)
├── framework-detector.ts (감지)
├── rule-builder.ts (규칙 생성)
└── hook-installer.ts (훅 설치)
```

---

## 변경 요약

### v2.4 → v2.5

| 항목 | v2.4 | v2.5 |
|------|------|------|
| 리서치 | Claude 에이전트만 | Claude + GPT + Gemini |
| 스킬 관리 | 없음 | SkillRepository |
| 프레임워크 감지 | 설치 시 감지 | Rule Build System |
| SPEC 리뷰 | /vibe.spec 내장 | /vibe.spec.review 분리 |
| Ralph Loop | 검증 없음 | 완료 검증 추가 |
| 코드 구조 | God Object | 모듈 분해 |

---

## 마무리

v2.0에서 MCP 오버헤드를 제거했습니다.
v2.1에서 병렬 코드 리뷰를 추가했습니다.
v2.2에서 ULTRAWORK 파이프라인을 완성했습니다.
v2.3에서 프레임워크별 맞춤 규칙을 적용했습니다.
v2.4에서 에이전트를 프로그래밍 가능하게 만들었습니다.
v2.5에서 **리서치에 3개 LLM의 관점을 통합**했습니다.

하나의 LLM만으로는 놓치는 관점이 있습니다. 3개 LLM이 동시에 리서치하면 더 넓고 깊은 SPEC이 만들어집니다.

---

> 이전 편: [Vibe v2.4.76: 18K 다운로드와 베타의 끝이 보인다](tech-vibe-10.md)

**GitHub**: https://github.com/su-record/vibe
**NPM**: https://www.npmjs.com/package/@su-record/vibe
