---
title: "vibe 개발일지 #6 - SDD와 훅 안정화 대작전 (10개 커밋)"
date: "2026-01-09"
category: "dev-log"
description: "Scenario-Driven Development 도입, PostToolUse 훅 안정화"
tags: ["vibe", "개발일지", "SDD", "BDD"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #6 - SDD와 훅 안정화 대작전 (10개 커밋)

**작업 기간**: 2026-01-09

## 📝 이번 기간 작업 내용

### 훅 안정화 대작전 (10개 커밋)

이 날은 **PostToolUse 훅**과의 전쟁이었습니다. 수많은 시도와 롤백을 거쳤습니다.

| 커밋 | 내용 |
|------|------|
| `fix: PostToolUse hook should not stop workflow` | 워크플로우 중단 방지 |
| `docs: clarify .claude/ folder must be committed to git` | 문서 보강 |
| `docs: add context management tips and model selection strategy` | 컨텍스트 관리 팁 |
| `fix: correct PostToolUse hook path from .agent/ to .vibe/` | 경로 수정 |
| `fix: force update hooks on vibe update` | 훅 강제 업데이트 |
| `fix: optimize PostToolUse hook - read checklist once at session start` | 최적화 |
| `fix: remove file read from SessionStart hook` | 파일 읽기 제거 |
| `fix: remove SessionStart hook - causing stalls` | 세션 훅 제거 |
| `fix: remove PostToolUse hook - causing workflow stalls` | 훅 제거 |
| `fix: restore SessionStart and PostToolUse hooks` | 훅 복원 |

## 💡 작업 하이라이트

**훅 시스템과의 사투**

하루 동안 PostToolUse 훅을 제거했다가 복원하기를 **3번** 반복했습니다:

```
훅 추가 → 워크플로우 멈춤 → 제거 → 기능 누락 → 다시 추가 → 최적화 → 안정화
```

결국 핵심은 **"훅에서 너무 많은 일을 하지 말 것"**이었습니다. 파일 읽기, 복잡한 조건문 모두 제거하고 단순한 메시지 출력만 남겼더니 안정화되었습니다.

**SDD (Scenario-Driven Development)**

v1.3.0에서 BDD 기반 자동 검증이 추가되었습니다. SPEC에서 정의한 시나리오가 자동으로 검증 체크리스트가 됩니다.

## 📊 개발 현황

- **버전**: v1.2.1 → v1.3.4
- **새 기능**: SDD with BDD auto-verification
- **수정**: PostToolUse 훅 10회 이상 수정
