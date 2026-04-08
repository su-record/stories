---
title: "tory 개발일지 #23 - 데몬 제거 설계 + Rust 네이티브 전환 (10개 커밋)"
date: "2026-03-17"
category: "dev-log"
description: "Wave 기반 자율 회의 엔진 구현, 이벤트 드리븐 토론 리팩토링, 데몬 제거와 Rust 네이티브 임베딩 설계, tory-store Phase 0까지 사흘간의 작업을 기록합니다."
tags: ["tory", "개발일지", "wave-engine", "event-driven", "daemon", "rust", "tauri", "store", "architecture"]
author: "Su"
lang: "ko"
---

# tory 개발일지 #23 - 데몬 제거 설계 + Rust 네이티브 전환 (10개 커밋)

**작업 기간**: 2026-03-15 ~ 2026-03-17

## 📝 이번 기간 작업 내용

### Wave 기반 자율 회의 엔진 (2개 커밋)

Wave 기반 다모델 토론 엔진을 구현했다. 여러 AI 모델이 Wave 단위로 순차 발언하고, 각 Wave 결과를 누적해 합의 방향을 도출한다. 단순 병렬 실행과 달리 이전 Wave의 발언이 다음 Wave에 영향을 준다.

이벤트 드리븐 방식으로 자율 토론 엔진을 리팩토링했다. 실시간 스트리밍을 적용하고 여러 버그를 수정했다. v10 마이그레이션에서 task_results 컬럼 수 불일치도 함께 해결했다.

| 커밋 | 내용 |
|------|------|
| `feat: 자율형 AI 회의 시스템 구현 — Wave 기반 다모델 토론 엔진` | Wave 토론 엔진 구현 |
| `fix: v10 마이그레이션 task_results 컬럼 수 불일치 수정` | 마이그레이션 버그 수정 |

### 이벤트 드리븐 + 실시간 스트리밍 (1개 커밋)

토론 엔진을 이벤트 드리븐 아키텍처로 전환했다. 발언, 수렴, 의장 개입이 각각 이벤트로 발행되고 구독자가 처리한다. SSE를 통해 클라이언트로 실시간 스트리밍한다.

| 커밋 | 내용 |
|------|------|
| `refactor: 이벤트 드리븐 자율 토론 엔진 + 실시간 스트리밍 + 버그픽스` | 이벤트 드리븐 토론 엔진 |

### 설계 문서 작업 (4개 커밋)

데몬을 제거하고 Tauri 네이티브 임베딩으로 전환하는 설계 문서를 작성했다. 별도 프로세스로 동작하는 데몬의 한계를 정리하고, Rust 코드를 Tauri 앱 내부에 직접 임베딩하는 구조로 전환하는 근거와 방식을 문서화했다.

ClosedLoopController 크레이트 설계도 작성했다. 컨텍스트 리셋, 태스크 분할, 누적 학습 기능을 설계에 반영했다. AI 프로필과 회의실 시스템 설계 문서도 별도로 작성해 두 PR로 머지했다.

| 커밋 | 내용 |
|------|------|
| `docs: 데몬 제거 — Tauri 네이티브 임베딩 설계문서` | 데몬 제거 설계 문서 |
| `docs: ClosedLoopController 크레이트 설계 추가` | ClosedLoop 설계 문서 |
| `docs: ClosedLoop에 컨텍스트 리셋, 태스크 분할, 누적 학습 반영` | ClosedLoop 설계 보강 |
| `docs: AI 프로필 & 회의실 시스템 설계 문서 작성` | 프로필 및 회의실 설계 문서 |

### Phase 0 — tory-store + JSON SSOT 기반 구축 (1개 커밋)

Rust 네이티브 전환의 첫 단계로 tory-store 크레이트를 구축했다. SQLite WAL 기반 저장소와 JSON SSOT 기반 설정을 함께 구성했다. 이후 Phase들이 쌓일 기반이다.

| 커밋 | 내용 |
|------|------|
| `feat: Phase 0 — tory-store 크레이트 + JSON SSOT 기반 구축` | Phase 0 tory-store |

### PR 머지 (2개 커밋)

데몬 아키텍처 재고 PR과 회의실 코드 분석 PR을 각각 머지했다.

| 커밋 | 내용 |
|------|------|
| `Merge pull request #17 from su-record/claude/rethink-daemon-architecture-xTN23` | 데몬 아키텍처 재고 PR 머지 |
| `Merge pull request #18 from su-record/claude/analyze-meeting-room-code-UWyD5` | 회의실 분석 PR 머지 |

## 💡 작업 하이라이트

**데몬 제거 결정**

데몬은 Tauri 앱과 별도 프로세스로 동작했다. IPC 오버헤드가 있고, 앱과 데몬 사이의 상태 동기화가 복잡했다. Rust 코드를 Tauri 앱 내부에 직접 임베딩하면 이 문제가 사라진다. 함수 호출 수준의 속도로 상태에 접근하고, 프로세스 관리 부담도 없다. 설계 문서로 근거를 정리하고 다음 기간에 실제 전환을 진행했다.

**Wave 엔진과 이벤트 드리븐의 결합**

Wave 단위 발언은 자연스럽게 이벤트로 표현된다. Wave 시작, 발언 생성, Wave 완료, 수렴 판단이 각각 이벤트가 된다. 클라이언트는 이벤트를 구독해 실시간으로 화면을 갱신한다. 이 구조가 후속 SSE 스트리밍의 기반이 됐다.

## 📊 개발 현황

- **커밋**: 10개
- **핵심**: Wave 토론 엔진, 이벤트 드리븐 아키텍처, 데몬 제거 설계 문서, Phase 0 tory-store
