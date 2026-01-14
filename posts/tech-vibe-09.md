---
title: "Vibe v2.4: Agent Orchestrator와 Claude Agent SDK"
date: "2026-01-14"
category: "tech"
description: "Claude Agent SDK 기반 멀티에이전트 오케스트레이션. 프로그래밍 방식으로 병렬 에이전트 제어"
tags: ["vibe", "ai-coding", "claude-code", "agent-sdk", "orchestrator", "parallel-agents", "release", "v2.4"]
author: "Su"
lang: "ko"
---

# Vibe v2.4: Agent Orchestrator와 Claude Agent SDK

## 에이전트를 프로그래밍하다

v2.1에서 병렬 코드 리뷰 에이전트를 추가했습니다. 13개 전문 에이전트가 동시에 코드를 검토합니다.

그런데 이 에이전트들을 **직접 제어**하고 싶다면?

```javascript
// 리뷰 에이전트 3개만 실행하고 싶다
// 커스텀 에이전트를 추가하고 싶다
// 에이전트 결과를 조합하고 싶다
```

v2.4에서 이걸 가능하게 만들었습니다.

---

## Agent Orchestrator 모듈

`@su-record/vibe/orchestrator`로 에이전트를 프로그래밍 방식으로 제어할 수 있습니다.

```javascript
import('@su-record/vibe/orchestrator').then(o => {
  // 병렬 리서치 (4개 에이전트 동시 실행)
  o.research('passkey auth', ['React', 'Supabase']);

  // 병렬 코드 리뷰 (12+ 에이전트 동시 실행)
  o.review(['src/api/users.ts'], ['TypeScript', 'React']);

  // 커스텀 에이전트 실행
  o.runAgent('Analyze authentication flow', 'auth-analyzer');
});
```

### 주요 함수

| 함수 | 설명 |
|------|------|
| `research(feature, techStack)` | 4개 병렬 리서치 에이전트 |
| `review(filePaths, techStack)` | 12+ 병렬 리뷰 에이전트 |
| `runAgent(prompt, agentName?)` | 커스텀 에이전트 실행 |
| `listAgents()` | 프로젝트 에이전트 목록 |
| `status()` | 오케스트레이터 상태 |

---

## Claude Agent SDK 통합

이 모듈은 [Claude Agent SDK](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk)를 사용합니다.

Agent SDK는 Claude 세션을 프로그래밍 방식으로 관리할 수 있게 해줍니다.

```javascript
import { Session } from '@anthropic-ai/claude-agent-sdk';

const session = new Session();
const result = await session.run('Analyze this code for security issues');
```

vibe의 오케스트레이터는 이 SDK를 추상화해서:
1. 에이전트 동적 탐색 (`.claude/agents/` 폴더)
2. 병렬 실행 관리
3. 백그라운드 에이전트 지원
4. 세션 히스토리 추적

---

## 명령어와 오케스트레이터

각 `/vibe.*` 명령어는 내부적으로 오케스트레이터를 활용합니다.

| 명령어 | 오케스트레이터 사용 |
|--------|-------------------|
| `/vibe.spec` | `research()` - 요구사항 확정 후 4개 병렬 리서치 |
| `/vibe.review` | `review()` - 12+ 리뷰 에이전트 동시 실행 |
| `/vibe.run ultrawork` | `runAgent()` - 백그라운드에서 다음 Phase 준비 |
| `/vibe.analyze` | `runAgent()` - 병렬 코드 탐색 |

### /vibe.spec의 리서치

요구사항이 확정되면 4개 에이전트가 동시에 조사합니다:

```bash
node -e "import('@su-record/vibe/orchestrator').then(o =>
  o.research('passkey authentication', ['React', 'Supabase'])
    .then(r => console.log(r.content[0].text))
)"
```

| 에이전트 | 역할 |
|----------|------|
| `best-practices-agent` | 베스트 프랙티스 조사 |
| `framework-docs-agent` | 최신 문서 검색 (context7) |
| `codebase-patterns-agent` | 기존 코드 패턴 분석 |
| `security-advisory-agent` | 보안 권고 확인 |

### /vibe.review의 병렬 리뷰

```bash
node -e "import('@su-record/vibe/orchestrator').then(o =>
  o.review(['src/api/users.ts', 'src/components/Login.tsx'], ['TypeScript', 'React'])
    .then(r => console.log(r.content[0].text))
)"
```

**Core Reviewers (항상 실행):**
- security-reviewer
- performance-reviewer
- architecture-reviewer
- complexity-reviewer
- simplicity-reviewer
- data-integrity-reviewer
- test-coverage-reviewer
- git-history-reviewer

**Stack-Specific Reviewers (조건부):**
- typescript-reviewer (`.ts/.tsx` 파일)
- react-reviewer (React 프로젝트)
- python-reviewer (`.py` 파일)
- rails-reviewer (Rails 프로젝트)

---

## 에이전트 디렉토리 구조

오케스트레이터는 프로젝트의 `.claude/agents/` 또는 `agents/` 폴더에서 에이전트를 자동 탐지합니다.

```
.claude/agents/
├── review/           # 리뷰 에이전트 (12개)
│   ├── security-reviewer.md
│   ├── performance-reviewer.md
│   ├── architecture-reviewer.md
│   └── ...
└── research/         # 리서치 에이전트 (4개)
    ├── best-practices-agent.md
    ├── framework-docs-agent.md
    ├── codebase-patterns-agent.md
    └── security-advisory-agent.md
```

### 에이전트 마크다운 형식

```markdown
---
name: security-reviewer
description: OWASP Top 10 취약점 검토
category: review
---

# Security Reviewer

## 역할
OWASP Top 10 기준으로 보안 취약점을 검토합니다.

## 검토 항목
- SQL Injection
- XSS
- CSRF
- ...
```

에이전트 파일의 frontmatter에서 메타데이터를 읽고, 본문은 에이전트의 시스템 프롬프트로 사용됩니다.

---

## 백그라운드 에이전트

ULTRAWORK 모드에서 현재 Phase를 구현하는 동안, 백그라운드에서 다음 Phase를 준비합니다.

```javascript
// Phase 1 구현 중...
o.runAgent('Phase 2 prep: Analyze auth API endpoints', 'phase2-prep');

// Phase 1 완료 후 Phase 2 결과 확인
const result = await o.getBackgroundAgentResult(sessionId);
```

### Phase 파이프라이닝

```
Phase 1 [구현 중] ──────────────────────────────>
        Phase 2 [백그라운드 준비] ───────>
                Phase 2 [구현 시작] ────────────>
```

기존에는 Phase 1 완료 → Phase 2 분석 → Phase 2 구현이 순차적이었습니다.
이제 Phase 1 구현 중에 Phase 2 분석이 백그라운드에서 진행됩니다.

---

## 오케스트레이터 상태 확인

```javascript
import('@su-record/vibe/orchestrator').then(o => {
  console.log(o.status().content[0].text);
});
```

출력:
```
## Orchestrator Status

### Active Sessions
- session-abc123: research (passkey auth) - running
- session-def456: review (users.ts) - completed

### Recent History
1. 2026-01-14 10:30: research completed (4 agents)
2. 2026-01-14 10:25: review completed (12 agents)
```

---

## 자동 설치

`vibe init` 또는 `vibe update` 실행 시 Claude Agent SDK가 자동 설치됩니다.

```bash
vibe init
# ...
# ✅ Claude Agent SDK 설치 완료
```

오케스트레이터 모듈은 SDK 없이도 시뮬레이션 모드로 동작하므로, SDK 설치 실패 시에도 기본 기능은 사용 가능합니다.

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

---

## 변경 요약

### v2.3 → v2.4

| 항목 | v2.3 | v2.4 |
|------|------|------|
| 에이전트 실행 | 명령어 내부 | 프로그래밍 가능 |
| Agent SDK | 없음 | 자동 설치 |
| 백그라운드 에이전트 | 제한적 | 완전 지원 |
| 에이전트 탐지 | 하드코딩 | 동적 탐지 |
| 오케스트레이터 API | 없음 | `@su-record/vibe/orchestrator` |

---

## 마무리

v2.0에서 MCP 오버헤드를 제거했습니다.
v2.1에서 병렬 코드 리뷰를 추가했습니다.
v2.2에서 ULTRAWORK 파이프라인을 완성했습니다.
v2.3에서 프레임워크별 맞춤 규칙을 적용했습니다.
v2.4에서 **에이전트를 프로그래밍 가능하게** 만들었습니다.

이제 vibe의 에이전트들을 직접 제어할 수 있습니다.

```javascript
import('@su-record/vibe/orchestrator').then(o => {
  // 당신만의 에이전트 워크플로우를 만드세요
});
```

---

> 이전 편: [Vibe v2.3: 14개 프레임워크별 언어 룰과 모노레포 지원](tech-vibe-08.md)

**GitHub**: https://github.com/su-record/vibe
**NPM**: https://www.npmjs.com/package/@su-record/vibe
**Release**: https://github.com/su-record/vibe/releases/tag/v2.4.0
