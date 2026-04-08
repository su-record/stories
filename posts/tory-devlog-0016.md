---
title: "tory 개발일지 #16 - 아키텍처 리팩토링 + 품질 전수 검수 (10개 커밋)"
date: "2026-03-09"
category: "dev-log"
description: "Facade 패턴 분해, N+1 쿼리 배치화, WCAG 접근성 7건, 타입 에러 전수 해소까지 기록합니다."
tags: ["tory", "개발일지", "facade-pattern", "refactor", "wcag", "accessibility", "n+1", "typescript"]
author: "Su"
lang: "ko"
---

# tory 개발일지 #16 - 아키텍처 리팩토링 + 품질 전수 검수 (10개 커밋)

**작업 기간**: 2026-03-09

## 📝 이번 기간 작업 내용

### Facade 패턴 + ClosedLoop 메서드 분해 (2개 커밋)

Orchestrator를 Facade 패턴으로 분해했다. 기존에는 Orchestrator가 회의, 도구, 동기화, 인텐트 분석을 모두 직접 처리했다. Facade로 분리하면서 각 도메인은 자신의 인터페이스를 통해서만 호출된다. ClosedLoop Controller의 메서드도 같은 원칙으로 분해했다.

| 커밋 | 내용 |
|------|------|
| `refactor: Orchestrator를 Facade 패턴으로 분해` | Orchestrator Facade 분리 |
| `refactor: ClosedLoop Controller 메서드 분해` | ClosedLoop 메서드 분리 |

### Import 정리 + Mock 타입 어노테이션 (2개 커밋)

IStore 인터페이스의 inline import를 명시적 import 문으로 전환했다. 코드 가독성과 IDE 분석 정확도가 높아진다. test-utils의 mock 객체에 명시적 타입 어노테이션을 추가해 테스트 코드의 타입 안전성을 확보했다.

| 커밋 | 내용 |
|------|------|
| `refactor: IStore 인터페이스 inline import를 명시적 import으로 전환` | import 명시화 |
| `refactor: test-utils mock 객체에 명시적 타입 어노테이션 추가` | mock 타입 안전성 |

### 코드 리뷰 P1/P2 수정 + 전수 검수 (6개 커밋)

아키텍처/복잡도 리뷰 결과를 문서로 정리하고 TODO를 추가했다. 리뷰에서 나온 P1/P2 이슈를 수정하고 테스트를 보강했다. PR #13으로 머지했다. 머지 이후에도 전수 검수를 계속 진행해 P1 보안, 성능, 무결성 이슈 12건을 추가 수정했다.

LLM re-export 14개를 제거하고 RAG의 N+1 쿼리를 배치 쿼리로 전환했다. N+1은 문서를 하나씩 조회하던 패턴에서 발생했다. 배치화 후 쿼리 횟수가 문서 수에 비례하지 않는다. 타입 에러 전수 해소와 WCAG P1 접근성 7건 수정도 이 단계에서 처리했다.

| 커밋 | 내용 |
|------|------|
| `docs: 아키텍처/복잡도 리뷰 문서 및 TODO 추가` | 리뷰 문서화 |
| `fix: 코드 리뷰 P1/P2 이슈 수정 및 테스트 보강` | P1/P2 이슈 수정 |
| `Merge pull request #13 from su-record/feature/fix-review-findings` | PR #13 머지 |
| `fix: 전수 검수 P1 보안/성능/무결성 12건 수정` | P1 전수 검수 수정 |
| `refactor: LLM re-export 14개 제거 + RAG N+1 쿼리 배치화` | re-export 정리 + N+1 해소 |
| `fix: Phase 4 — 타입에러 전수 해소 + WCAG P1 접근성 7건 수정` | 타입 에러 + WCAG P1 수정 |

## 💡 작업 하이라이트

**RAG N+1 쿼리 배치화**

RAG 검색에서 관련 문서를 가져올 때 문서마다 별도 쿼리가 발생하는 N+1 패턴이 있었다. 문서 100개를 조회하면 쿼리도 100번 발생한다. 배치 쿼리로 전환해 쿼리 횟수를 상수 수준으로 줄였다. SQLite 환경에서도 체감할 수 있는 성능 차이가 생긴다.

**전수 검수 4라운드**

이 기간의 품질 작업은 단일 패스가 아니다. 코드 리뷰 → P1/P2 수정 → PR 머지 → 추가 전수 검수 순서로 4라운드를 진행했다. 각 라운드마다 새로운 문제가 나왔다. WCAG 접근성처럼 기능 개발 중에는 놓치기 쉬운 항목들이 전수 검수에서 발견됐다.

## 📊 개발 현황

- **커밋**: 10개
- **핵심**: Facade 패턴, ClosedLoop 분해, RAG N+1 배치화, LLM re-export 14개 제거, WCAG P1 7건
