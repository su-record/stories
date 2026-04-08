---
title: "tory 개발일지 #3 - 하루 만에 Phase 5~13 완성, 전 계층 구현 (10개 커밋)"
date: "2026-02-27"
category: "dev-log"
description: "Cognitive Core부터 SaaS 서버까지, Phase 5~13을 단 하루 만에 완성한 집중 구현 기록입니다."
tags: ["tory", "개발일지", "rust", "tauri", "solidjs", "rag", "saas", "secretary"]
author: "Su"
lang: "ko"
---

# tory 개발일지 #3 - 하루 만에 Phase 5~13 완성, 전 계층 구현 (10개 커밋)

**작업 기간**: 2026-02-26 ~ 2026-02-27

## 📝 이번 기간 작업 내용

### Phase 5 — Cognitive Core (1개 커밋)

인텐트 분석, 입찰 엔진, 비서 오케스트레이터를 구현했다. 사용자 요청이 들어왔을 때 어떤 종류의 작업인지 분류하고, 적합한 LLM이 작업을 가져가도록 경매 방식으로 할당하며, Secretary가 전체 흐름을 조율한다. 이 계층이 Tory의 두뇌에 해당한다.

| 커밋 | 내용 |
|------|------|
| `feat: Phase 5 Cognitive Core — 인텐트 분석, 입찰 엔진, 비서 오케스트레이터` | Secretary + 인텐트 분석 + 입찰 엔진 구현 |

### Phase 6~7 — Orchestrator + Quality & Security (2개 커밋)

정책 엔진, 작업 감독자, 워커 풀로 구성된 오케스트레이터 계층과 Safety Gate, 복구 엔진, 보안 모듈을 추가했다. Cognitive Core의 판단이 실제 실행으로 연결될 때 정책 준수 여부를 확인하고, 실패 시 복구 경로를 제공한다.

| 커밋 | 내용 |
|------|------|
| `feat: Phase 6 Orchestrator Layer — 정책 엔진, 작업 감독자, 워커 풀` | 오케스트레이터 계층 구현 |
| `feat: Phase 7 Quality & Security — Safety Gate, 복구 엔진, 보안 모듈` | 안전성 및 보안 계층 구현 |

### Phase 8 — RAG & Knowledge (1개 커밋)

BM25(FTS5) 기반 키워드 검색과 시간 감쇠를 결합한 하이브리드 RAG를 구현했다. 반감기 30일로 오래된 문서는 자연스럽게 가중치가 줄어든다. LightRAG 그래프 기반 지식 구조와 스킬 시스템도 이 Phase에서 함께 추가됐다.

| 커밋 | 내용 |
|------|------|
| `feat: Phase 8 RAG & Knowledge — 하이브리드 검색, LightRAG 그래프, 스킬 시스템` | RAG 하이브리드 검색 및 지식 시스템 구현 |

### Phase 9~11 — Rust Native + Desktop (3개 커밋)

Rust 네이티브 크레이트(Vision, Voice, Accessibility, Translation)와 Tauri 2 + SolidJS 데스크톱 앱, 그리고 음성·비전·번역·이메일 기능을 연달아 구현했다. Phase 9에서 정의한 네이티브 크레이트가 Phase 10~11의 데스크톱 UI에서 직접 사용된다.

| 커밋 | 내용 |
|------|------|
| `feat: Phase 9 Rust Native Crates — Vision, Voice, Accessibility, Translation` | 네이티브 크레이트 구현 |
| `feat: Phase 10 Desktop App — Tauri 2 + SolidJS UI` | 데스크톱 앱 기초 구현 |
| `feat: Phase 11 — Desktop Media & i18n (음성, 비전, 번역, 이메일)` | 미디어 및 국제화 기능 추가 |

### Phase 12~13 + 머지 — Gamification + SaaS Server (3개 커밋)

자기 진화 학습 루프, Ship Score 게임화 시스템을 구현하고, OAuth 인증, 실시간 통신, 과금, 시그널링, 7종 채널을 포함한 SaaS 서버를 완성했다. 마지막으로 PR #5를 머지해 이 날의 작업을 메인 브랜치에 합쳤다.

| 커밋 | 내용 |
|------|------|
| `feat: Phase 12 — Gamification & Self-Evolution (Ship Score, 학습 루프, 자율성)` | 게임화 및 자기 진화 시스템 구현 |
| `feat: Phase 13 — SaaS Server & Channels (인증, 실시간, 과금, 시그널링, 7종 채널)` | SaaS 서버 전체 구현 |
| `Merge pull request #5` | PR #5 머지 — tory 시스템 전체 통합 |

## 💡 작업 하이라이트

**한 계층씩, 하루 만에 전 스택 완성**

2026-02-26, 하루 동안 Phase 5에서 13까지 9개 Phase를 완성했다. Cognitive Core(비서 오케스트레이터), Orchestrator(정책 + 감독), Quality/Security(Safety Gate), RAG(하이브리드 검색), Rust Native(Vision/Voice), Desktop(Tauri 2 + SolidJS), SaaS Server(OAuth + 과금)까지 수직으로 관통했다.

이 속도가 가능했던 이유는 두 가지다. 첫째, 전날 확정한 13-phase SPEC이 각 Phase의 범위를 명확하게 정의하고 있었다. 범위가 명확하면 구현 결정이 빠르다. 둘째, Rust의 타입 시스템이 각 크레이트 간 인터페이스를 컴파일 타임에 강제한다. 계층이 많아도 타입이 맞으면 연결이 된다.

RAG의 시간 감쇠 설계는 별도로 언급할 만하다. 단순한 최신성 가중치가 아니라 물리학의 반감기 공식을 적용했다. 30일 기준으로 지식의 신선도가 자연스럽게 감소하므로, 오래된 정보가 최신 정보를 밀어내는 일이 없다.

## 📊 개발 현황

- **커밋**: 10개
- **핵심**: Cognitive Core(인텐트 + 입찰 + Secretary), Safety Gate, BM25 + 시간 감쇠 RAG, Tauri 2 + SolidJS 데스크톱, SaaS 서버(OAuth + 과금 + 7종 채널), Phase 5~13 완성
