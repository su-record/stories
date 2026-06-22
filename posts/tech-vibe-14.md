---
title: "Vibe v2.6.27: Session RAG와 Smart Hook Dispatcher"
date: "2026-02-03"
category: "tech"
description: "SQLite FTS5 기반 Session RAG로 세션 컨텍스트 구조화, Smart Hook Dispatcher로 훅 지능화, E2E 테스트 자동 생성, LLM 호출 통합"
tags: ["vibe", "ai-coding", "claude-code", "session-rag", "smart-hook", "e2e", "release", "v2.6.27"]
author: "Su"
lang: "ko"
---

# Vibe v2.6.27: Session RAG와 Smart Hook Dispatcher

## 세션을 기억하게 만들다

vibe의 세션 관리는 v1.0부터 있었습니다. `vibe_save_memory`로 결정사항을 저장하고, `vibe_start_session`으로 복원했습니다.

문제는 **구조가 없었다**는 점입니다. 메모리에 텍스트를 저장하면, 나중에 관련 정보를 찾기 어렵습니다. "이전에 Vitest를 쓰기로 결정했는데, 왜 결정했더라?" 같은 질문에 답하려면 전체 메모리를 뒤져야 합니다.

v2.6.27에서 **Session RAG**를 도입했습니다. 구조화된 데이터로 저장하고, 하이브리드 검색으로 찾습니다.

---

## Session RAG

### 4가지 엔티티

세션에서 발생하는 정보를 4가지 유형으로 구조화합니다.

| 엔티티 | 설명 | 예시 |
|--------|------|------|
| **Decision** | 사용자 확인 결정사항 | "Vitest를 사용하기로 결정" |
| **Constraint** | 명시적 제약조건 | "벡터 DB 사용 금지" |
| **Goal** | 현재 목표 스택 | "Session RAG 구현" |
| **Evidence** | 검증/테스트 결과 | "빌드 성공, 테스트 42개 통과" |

### 저장

```typescript
// 결정 저장
await saveSessionItem({
  itemType: 'decision',
  title: 'Use Vitest',
  rationale: 'Fast and modern, better DX than Jest',
  alternatives: ['Jest', 'Mocha'],
  impact: 'high',
  priority: 1
});

// 제약 저장
await saveSessionItem({
  itemType: 'constraint',
  title: 'No vector DB',
  type: 'technical',
  severity: 'high'
});

// 목표 저장
await saveSessionItem({
  itemType: 'goal',
  title: 'Implement Session RAG',
  priority: 2,
  successCriteria: ['CRUD 동작', 'BM25 검색 동작', '세션 자동 주입']
});
```

### 검색

SQLite FTS5의 BM25 알고리즘과 recency, priority를 결합한 하이브리드 검색입니다.

```typescript
const results = await retrieveSessionContext({
  query: 'testing framework decision'
});

// 결과: Decision "Use Vitest" (relevance: 0.92)
```

**하이브리드 스코어링:**
```
score = BM25_relevance * 0.5
      + recency_score * 0.3
      + priority_score * 0.2
```

최근에 저장된, 우선순위 높은, 키워드가 일치하는 항목이 상위에 노출됩니다.

### 자동 주입

`start_session` 호출 시 활성 Goals, 중요 Constraints, 최근 Decisions가 자동으로 세션 컨텍스트에 포함됩니다.

```
새 세션 시작
    ↓
start_session 호출
    ↓
자동 주입:
  - 활성 Goals (status: active)
  - severity: high 이상 Constraints
  - 최근 7일 내 Decisions
    ↓
Claude가 이전 맥락을 이해한 상태로 시작
```

### 목표 관리

Goal은 생명주기를 가집니다.

```typescript
// 목표 목록
await manageGoals({ action: 'list' });

// 진행률 업데이트
await manageGoals({
  action: 'update',
  goalId: 1,
  progressPercent: 80
});

// 완료
await manageGoals({
  action: 'complete',
  goalId: 1
});
```

---

## Smart Hook Dispatcher

기존 Hook은 단순 패턴 매칭이었습니다. 매칭되면 무조건 실행했습니다.

```
기존: "ultrawork" 매칭 → ULTRAWORK 훅 실행 (항상)
```

Smart Hook Dispatcher는 컨텍스트를 분석해서 필요한 훅만 실행합니다.

```
v2.6.27:
  사용자 메시지 분석
      ↓
  필요한 훅 판단
      ↓
  선택적 실행
```

### 추가 기능

**Progress Tracking**: 작업 진행 상황을 자동 추적합니다.

**Auto-Retrospective**: Phase 완료 시 자동으로 회고를 생성합니다. 무엇이 잘 됐고, 무엇이 개선 가능한지.

**SPEC Summary**: SPEC 문서의 핵심 내용을 요약해서 훅 메시지에 포함합니다.

---

## E2E 테스트 스켈레톤 생성기

Playwright 기반 E2E 테스트의 기본 구조를 자동 생성합니다.

```bash
/vibe.utils --e2e "login flow"
```

생성되는 파일:

```typescript
// tests/e2e/login-flow.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';

test.describe('Login Flow', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login with valid credentials', async () => {
    await loginPage.login('user@example.com', 'password');
    await expect(loginPage.successMessage).toBeVisible();
  });

  test('should show error with invalid credentials', async () => {
    await loginPage.login('user@example.com', 'wrong');
    await expect(loginPage.errorMessage).toBeVisible();
  });
});
```

Page Object 패턴을 적용하고, Visual regression 설정도 포함합니다.

### 추가 에이전트

E2E 테스트와 함께 3개의 전문 에이전트를 추가했습니다.

| 에이전트 | 역할 |
|---------|------|
| `planning-agent` | 구현 계획 수립 |
| `qa-agent` | 품질 검증 |
| `docs-agent` | 문서 생성 |

---

## LLM 호출 통합

여러 커맨드에 분산되어 있던 GPT/Gemini 호출 로직을 통합했습니다.

```
Before:
  vibe.spec → 자체 GPT/Gemini 호출 스크립트
  vibe.run → 자체 GPT/Gemini 호출 스크립트
  vibe.review → 자체 GPT/Gemini 호출 스크립트
  vibe.spec.review → 자체 GPT/Gemini 호출 스크립트

After:
  모든 커맨드 → llm-orchestrate.js → GPT/Gemini API
```

### Windows 호환성

Windows에서 CLI 인자 길이 제한(8191자)이 문제였습니다. 긴 프롬프트를 전달할 때 잘리는 현상이 있었습니다.

**해결**: stdin pipe로 전달.

```javascript
// Before: CLI 인자로 전달 (길이 제한)
child_process.exec(`node llm.js --prompt "${longPrompt}"`);

// After: stdin pipe로 전달 (길이 무제한)
const child = child_process.spawn('node', ['llm.js']);
child.stdin.write(longPrompt);
child.stdin.end();
```

---

## 변경 요약

### v2.6.17 → v2.6.27

| 항목 | v2.6.17 | v2.6.27 |
|------|---------|---------|
| 세션 관리 | 비구조화 메모리 | **Session RAG** (SQLite + FTS5) |
| Hook | 패턴 매칭 | **Smart Dispatcher** |
| E2E 테스트 | 수동 | **자동 스켈레톤 생성** |
| LLM 호출 | 커맨드별 분산 | **llm-orchestrate.js 통합** |
| Windows | 인자 길이 제한 | **stdin pipe** |

---

## 마무리

v2.6.0에서 Fire-and-Forget과 Cursor IDE를 추가했습니다.
v2.6.9에서 Race Review를 도입했습니다.
v2.6.17에서 Swarm Orchestrator를 실험했습니다.
v2.6.27에서 **세션에 구조와 검색을 부여**했습니다.

Session RAG는 단순한 메모리 저장이 아닙니다. 의사결정의 맥락, 제약조건의 이유, 목표의 진행률. 이 모든 것이 구조화되어 다음 세션에 자동으로 전달됩니다.

AI가 "왜 이렇게 결정했는지"를 기억합니다.

---

> 이전 편: [Vibe v2.6.17: Swarm Orchestrator와 23개 언어 감지](tech-vibe-13.md)

**GitHub**: https://github.com/su-record/vibe
**NPM**: https://www.npmjs.com/package/@su-record/vibe
