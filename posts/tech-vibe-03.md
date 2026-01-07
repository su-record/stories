---
title: "Vibe v0.4: 2-Step 워크플로우로 단순화"
date: "2026-01-07"
category: "tech"
description: "4단계 워크플로우를 SPEC → RUN 2단계로 단순화. 코딩 규칙 내장, BDD 기반 품질 검증, vibe update 명령어 추가"
tags: ["vibe", "ai-coding", "claude-code", "workflow", "bdd", "release"]
author: "Su"
lang: "ko"
---

# Vibe v0.4: 2-Step 워크플로우로 단순화

## 복잡함을 걷어내다

v0.3.0에서 7개 에이전트와 9개 슬래시 커맨드를 제공했습니다. 기능은 많았지만, 실제로 사용하면서 느꼈습니다. 너무 복잡합니다.

v0.4.0에서는 과감하게 단순화했습니다.

```
Before (v0.3.0):
/vibe.spec → /vibe.plan → /vibe.tasks → /vibe.run → /vibe.verify

After (v0.4.0):
/vibe.spec → /vibe.run → /vibe.verify
```

PLAN과 TASKS 단계를 제거했습니다. SPEC 문서 하나로 AI가 바로 구현합니다.

---

## v0.4.x 주요 변경사항

### v0.4.0: 2-Step 워크플로우

**삭제된 것들**:
- `/vibe.plan` - 별도 계획 문서 불필요
- `/vibe.tasks` - SPEC에 Phase로 통합
- 7개 에이전트 → Claude Code 전용으로 단순화

**새로운 워크플로우**:

```
┌─────────────────────────────────────────────────────┐
│  /vibe.spec "기능명"                                │
│  ↓ 대화형 요구사항 수집                              │
│  ↓ .vibe/specs/{기능명}.md (PTCF 구조)              │
│  ↓ .vibe/features/{기능명}.feature (BDD)            │
├─────────────────────────────────────────────────────┤
│  /vibe.run "기능명"                                 │
│  ↓ SPEC 읽고 바로 구현                              │
│  ↓ Phase별 순차 실행                                │
│  ↓ .vibe/rules/ 규칙 준수                          │
├─────────────────────────────────────────────────────┤
│  /vibe.verify "기능명"                              │
│  ↓ Acceptance Criteria 검증                        │
│  ↓ 품질 점수 (A+ ~ F)                              │
└─────────────────────────────────────────────────────┘
```

### v0.4.1: Hooks Auto-Install

`vibe init` 실행 시 Claude Code hooks가 자동으로 설치됩니다.

```bash
vibe init
# → .claude/commands/ 설치
# → .claude/agents/ 설치
# → hooks 자동 설정
```

### v0.4.4: Collaborator Auto-Install & Language Rules

**Collaborator 자동 설치**:
프로젝트 협업자가 처음 접근할 때 필요한 설정이 자동으로 설치됩니다.

**언어별 규칙 확장**:
`.vibe/rules/languages/`에 언어별 코딩 규칙이 추가되었습니다.

### v0.4.9: BDD 기반 품질 검증 강화

**BDD Feature 파일 자동 생성**:
`/vibe.spec` 실행 시 `.vibe/features/{기능명}.feature` 파일이 함께 생성됩니다.

```gherkin
Feature: 로그인 기능

  Scenario: 이메일로 로그인
    Given 사용자가 로그인 페이지에 있을 때
    When 올바른 이메일과 비밀번호를 입력하면
    Then 메인 페이지로 이동한다
```

`/vibe.verify`에서 이 Feature 파일을 기준으로 검증합니다.

---

## 새로운 명령어

### vibe update

설정을 최신 버전으로 업데이트합니다.

```bash
vibe update
# → 슬래시 커맨드 업데이트
# → 코딩 규칙 업데이트
# → Hooks 업데이트
```

기존 `CLAUDE.md`는 덮어쓰지 않고 병합합니다.

### /vibe.analyze 확장

특정 기능이나 모듈만 분석할 수 있습니다.

```bash
/vibe.analyze              # 프로젝트 전체 분석
/vibe.analyze "로그인"      # 특정 기능 분석
/vibe.analyze --code       # 코드 품질만
/vibe.analyze --deps       # 의존성만
/vibe.analyze --arch       # 아키텍처만
```

---

## 코딩 규칙 내장 (.vibe/rules/)

### 디렉토리 구조

```
.vibe/rules/
├── core/           # 핵심 원칙
├── quality/        # 품질 체크리스트
├── standards/      # 복잡도, 네이밍, 안티패턴
├── languages/      # 언어별 규칙
└── tools/          # MCP 가이드
```

### 핵심 원칙

- **수술적 정밀도**: 요청받지 않은 코드는 절대 수정하지 않음
- **한국어 우선**: 모든 커뮤니케이션은 한국어로
- **DRY**: 반복하지 말고 재사용
- **SRP**: 하나의 함수는 하나의 목적만
- **YAGNI**: 필요하지 않으면 만들지 않음

### 복잡도 기준

| 메트릭 | 기준 |
|--------|------|
| 순환 복잡도 | ≤ 10 |
| 함수 길이 | ≤ 20줄 |
| 중첩 깊이 | ≤ 3단계 |
| 매개변수 | ≤ 5개 |

### 품질 등급

| 등급 | 점수 | 설명 |
|------|------|------|
| A+ | 95-100 | 완벽 |
| A | 90-94 | 우수 |
| B+ | 85-89 | 양호 |
| B | 80-84 | 개선 권장 |
| C | 70-79 | 개선 필요 |
| F | < 70 | 리팩토링 필요 |

---

## SPEC 문서 구조 (PTCF)

```markdown
# SPEC: {기능명}

## Persona
AI의 역할과 전문성 정의

## Context
- 배경, 목적
- 기술 스택
- 관련 코드

## Task
### Phase 1: {단계명}
1. [ ] 작업 1
2. [ ] 작업 2

### Phase 2: {단계명}
...

## Constraints
- 기존 코드 패턴 준수
- 에러 메시지 한글화

## Output Format
- 생성할 파일
- 수정할 파일

## Acceptance Criteria
- [ ] 검증 기준 1
- [ ] 검증 기준 2
```

---

## 슬래시 커맨드 정리

### 핵심 워크플로우

| 명령어 | 설명 |
|--------|------|
| `/vibe.spec "기능명"` | SPEC 작성 (PTCF 구조) |
| `/vibe.run "기능명"` | 구현 실행 |
| `/vibe.run "기능명" --phase N` | 특정 Phase만 실행 |
| `/vibe.verify "기능명"` | BDD 기반 검증 |

### 분석 & 도구

| 명령어 | 설명 |
|--------|------|
| `/vibe.analyze` | 프로젝트 분석 |
| `/vibe.analyze "기능명"` | 특정 기능/모듈 분석 |
| `/vibe.reason "문제"` | 체계적 추론 (9단계) |
| `/vibe.ui "설명"` | ASCII UI 미리보기 |
| `/vibe.diagram` | 아키텍처 다이어그램 |

---

## 왜 단순화했나

### 실제 사용 경험

fallingo 개발에 Vibe를 사용하면서 느꼈습니다.

1. **PLAN 문서는 거의 안 봤습니다** - SPEC만 보고 바로 구현했습니다
2. **TASKS 분해는 SPEC의 Phase로 충분했습니다** - 별도 파일이 필요 없었습니다
3. **에이전트 선택이 번거로웠습니다** - Claude Code 하나로 다 됩니다

### 결과

- 파일 수 감소: PLAN.md, TASKS.md 불필요
- 명령어 수 감소: 5개 → 3개 (핵심)
- 학습 곡선 완화: 바로 시작 가능

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

---

## 변경 요약

| 항목 | v0.3.0 | v0.4.9 |
|------|--------|--------|
| 워크플로우 | 5단계 | 3단계 |
| 에이전트 | 7개 | Claude Code 전용 |
| 코딩 규칙 | 없음 | .vibe/rules/ 내장 |
| BDD | 없음 | Feature 파일 자동 생성 |
| 업데이트 | 수동 | `vibe update` |

---

> 이전 편: [Vibe v0.3.0: Reasoning Agent로 복잡한 문제를 체계적으로 해결하기](tech-vibe-02.md)

**GitHub**: https://github.com/su-record/vibe
**NPM**: https://www.npmjs.com/package/@su-record/vibe
