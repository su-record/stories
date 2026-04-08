---
title: "tory 개발일지 #24 - Rust 네이티브 대전환 (10개 커밋)"
date: "2026-03-17"
category: "dev-log"
description: "LLM 클러스터부터 Secretary, RAG, Tauri AppCore까지 7개 Phase를 하루에 구현하고 데몬을 완전히 제거한 대전환을 기록합니다."
tags: ["tory", "개발일지", "rust", "tauri", "llm-cluster", "meeting-engine", "secretary", "rag", "closed-loop", "ssot"]
author: "Su"
lang: "ko"
---

# tory 개발일지 #24 - Rust 네이티브 대전환 (10개 커밋)

**작업 기간**: 2026-03-17

## 📝 이번 기간 작업 내용

### Phase 1 — tory-llm 크레이트 (1개 커밋)

LLM 클러스터와 3개 프로바이더 구현체를 하나의 크레이트로 만들었다. Claude, Gemini, OpenAI-compatible(GPT/Grok/DeepSeek/Kimi/GLM/Qwen) 프로바이더를 구현했다. CircuitBreaker는 lock-free AtomicU8/U32/U64로 구현해 Mutex 없이 동작한다. 3회 실패 시 open 상태로 전환하고 60초 후 half-open으로 복구한다. SSE 스트리밍과 폴백 체인도 포함됐다.

| 커밋 | 내용 |
|------|------|
| `feat: Phase 1 — tory-llm 크레이트 (LLM 클러스터 + 3프로바이더 + 스트리밍)` | LLM 클러스터 크레이트 |

### Phase 2 — AI 프로필 SSOT + Active Roster (1개 커밋)

`packages/shared/src/profiles.json`을 SSOT로 삼아 Rust에서 소비하는 구조를 구축했다. 8개 AI 프로필의 페르소나, 전문성, 등급 정보를 JSON에서 읽어 런타임에 사용한다. Active Roster는 회의 주제와 프로필 전문성을 매칭해 최적 참여자를 선정한다.

| 커밋 | 내용 |
|------|------|
| `feat: Phase 2 — AI 프로필 SSOT + Active Roster + 지능형 참여자 선정` | 프로필 SSOT 및 로스터 |

### Phase 3 — 회의 엔진 3종 (1개 커밋)

FreeformEngine, QuickEngine, PhaseEngine 세 가지 회의 엔진을 구현했다. Freeform은 단톡방 방식의 자율토론으로 수렴 시 종합한다. Quick은 병렬 조사와 의장 종합을 2분 타임아웃으로 진행한다. Phase는 Briefing, Position, Review, Synthesis, Vote 5단계 구조로 진행한다.

| 커밋 | 내용 |
|------|------|
| `feat: Phase 3 — 회의 엔진 (Freeform 자율토론 + Quick + Phase)` | 회의 엔진 3종 |

### Phase 4 — Secretary + Tools + ClosedLoop (1개 커밋)

Secretary 오케스트레이터가 인텐트를 분석하고 적절한 엔진으로 라우팅한다. Tools 실행기는 파일 I/O, 웹, grep 도구를 지원한다. ClosedLoop은 plan-execute-verify 사이클로 자율 실행한다. 실패 시 루프를 재시작한다.

| 커밋 | 내용 |
|------|------|
| `feat: Phase 4 — Secretary 오케스트레이터 + Tools + ClosedLoop 자율 실행` | Secretary 및 자율 실행 |

### Phase 5 — RAG 하이브리드 검색 (1개 커밋)

BM25(FTS5)와 시간 감쇠를 결합한 하이브리드 RAG를 구현했다. 시간 감쇠는 반감기 30일로 최근 문서에 가중치를 준다. 온톨로지 태그와 결합해 의미 기반 검색이 가능하다.

| 커밋 | 내용 |
|------|------|
| `feat: Phase 5 — RAG 하이브리드 검색 (BM25 + 시간 감쇠)` | RAG 하이브리드 검색 |

### Phase 6 — Tauri AppCore 통합 (1개 커밋)

AppCore가 Store, Cluster, Secretary, Roster, Tools를 하나의 중앙 상태로 관리한다. Tauri `State<'_, AppCore>`로 모든 커맨드에서 접근한다. 네이티브 커맨드를 등록하고 `window.emit()`으로 실시간 이벤트를 스트리밍한다.

| 커밋 | 내용 |
|------|------|
| `feat: Phase 6 — Tauri AppCore 통합 + 네이티브 커맨드 등록` | Tauri AppCore 통합 |

### Phase 7a — 부가 크레이트 + Phase 7b — 데몬 완전 제거 (3개 커밋)

sync, scheduler, trends, skills, pairing 5개 부가 크레이트를 구현했다. 이어서 `apps/daemon/` 디렉토리를 완전히 제거하고 CLAUDE.md를 업데이트했다. 데몬에 의존하던 프론트엔드 연결 에러를 완화하는 수정도 함께 진행했다.

| 커밋 | 내용 |
|------|------|
| `feat: Phase 7a — 부가 크레이트 구현 (sync, scheduler, trends, skills, pairing)` | 부가 크레이트 5종 |
| `feat!: Phase 7b — apps/daemon/ 완전 제거 + CLAUDE.md 업데이트` | 데몬 완전 제거 |
| `fix: 데몬 제거 후 프론트엔드 연결 에러 완화` | 프론트엔드 연결 수정 |

### PR 머지 (1개 커밋)

데몬 네이티브 임베딩 전환 PR을 머지했다.

| 커밋 | 내용 |
|------|------|
| `Merge pull request #19 from su-record/feature/daemon-native-embedding` | 데몬 네이티브 임베딩 PR 머지 |

## 💡 작업 하이라이트

**하루에 7개 Phase**

Phase 0부터 Phase 7b까지 하루에 완료했다. LLM 클러스터, 프로필 SSOT, 회의 엔진 3종, Secretary, RAG, Tauri AppCore, 부가 크레이트 5종, 그리고 데몬 삭제까지다. 각 Phase는 이전 Phase 위에 쌓인다. Phase 1의 LLM 클러스터가 없으면 Phase 3의 회의 엔진이 없고, Phase 3이 없으면 Phase 4의 Secretary가 없다. 의존성 순서를 지켜 순차적으로 구현했다.

**데몬이 사라지다**

`apps/daemon/` 디렉토리가 제거됐다. 별도 프로세스, IPC 통신, 프로세스 관리 코드가 모두 사라졌다. 대신 Rust 크레이트들이 Tauri 앱 내부에 직접 임베딩된다. LLM 호출이 함수 호출이 됐고, 상태 접근에 직렬화가 없어졌다. 아키텍처가 단순해진 만큼 코드도 줄었다.

**SSOT 체계의 완성**

`models.json`과 `profiles.json`이 TypeScript와 Rust 양쪽에서 소비된다. 모델을 추가하거나 프로필을 변경할 때 JSON 하나만 수정한다. 이전에는 데몬 측 설정과 프론트엔드 설정이 따로 존재했다. 이제 단일 소스에서 파생된다.

## 📊 개발 현황

- **커밋**: 10개
- **핵심**: LLM 클러스터, 회의 엔진 3종, Secretary, RAG 하이브리드, Tauri AppCore, 데몬 완전 제거
