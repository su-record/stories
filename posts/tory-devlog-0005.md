---
title: "tory 개발일지 #5 - OAuth + 구조화 회의 + 모델 카탈로그 확장 (10개 커밋)"
date: "2026-03-03"
category: "dev-log"
description: "웹/데스크톱 OAuth 인증, 5단계 구조화 회의 프로토콜, 모델 카탈로그 DB 관리, Azure OpenAI 임베딩 프록시, Secretary 기능 확장을 기록합니다."
tags: ["tory", "개발일지", "oauth", "meeting", "secretary", "embedding", "solidjs"]
author: "Su"
lang: "ko"
---

# tory 개발일지 #5 - OAuth + 구조화 회의 + 모델 카탈로그 확장 (10개 커밋)

**작업 기간**: 2026-03-02 ~ 2026-03-03

## 📝 이번 기간 작업 내용

### OAuth 로그인 + 문서화 (1개 커밋)

웹과 데스크톱 양쪽에 OAuth 로그인을 구현했다. AGENTS.md 문서도 이 커밋에 포함됐다. 여러 AI 에이전트가 협업하는 프로젝트 특성상 에이전트별 역할과 권한을 명확히 문서화해야 했다.

| 커밋 | 내용 |
|------|------|
| `feat: 웹/데스크톱 OAuth 로그인 + AGENTS.md + 문서 업데이트` | OAuth 인증 구현 및 에이전트 문서 작성 |

### 구조화 회의 프로토콜 (1개 커밋)

5단계 구조화 회의 PhaseEngine을 구현했다. Briefing → Position → Review → Synthesis → Vote 순서로 진행된다. 자유토론 방식의 FreeformEngine이 단톡방이라면, PhaseEngine은 격식 있는 회의다. 각 단계에서 LLM들이 역할에 맞는 발언을 하고, Vote 단계에서 최종 결론을 낸다.

| 커밋 | 내용 |
|------|------|
| `feat: 5-Phase 구조화 회의 프로토콜 구현` | PhaseEngine 5단계 구조화 회의 구현 |

### 모델 카탈로그 DB 관리 + CORS 수정 (2개 커밋)

모델 카탈로그를 SQLite DB에서 관리하는 시스템을 구현했다. JSON SSOT에서 정의된 모델 정보를 DB에 동기화하고, 런타임에 조회·업데이트할 수 있다. CORS AllowHeaders::any()와 credentials 충돌 문제도 이 시점에 수정했다. any()는 credentials 모드와 함께 사용할 수 없다는 브라우저 보안 정책 때문이다.

| 커밋 | 내용 |
|------|------|
| `feat: 모델 카탈로그 DB 관리 시스템 구현` | 모델 카탈로그 DB 저장 및 조회 구현 |
| `fix: CORS AllowHeaders::any()와 credentials 충돌 해결` | CORS 설정 버그 수정 |

### 환경변수 정리 + 임베딩 인프라 (2개 커밋)

TORY_ 접두사로 환경변수명을 통일하고, 임베딩 모델을 최신 버전으로 업그레이드했다. Azure OpenAI 임베딩 프록시도 추가했다. 로컬에서 직접 OpenAI API를 호출하는 대신 서버 프록시를 통하도록 해, API 키가 클라이언트에 노출되지 않는다.

| 커밋 | 내용 |
|------|------|
| `refactor: TORY_ 접두사 환경변수명 정리 + 임베딩 모델 업그레이드` | 환경변수 네이밍 통일 및 임베딩 모델 업그레이드 |
| `feat: Azure OpenAI 임베딩 프록시 지원` | 서버 임베딩 프록시 구현 |

### Secretary 확장 + UI + 공유 타입 + 뉴스레터 (4개 커밋)

Secretary 기능을 확장하고 통합 테스트를 추가했다. 데스크톱에 DesignDocReview와 ModeSelector 컴포넌트를 추가했다. daemon API 계약과 공유 타입도 확장했다. 뉴스레터 메일 발송 기능은 Resend API를 통해 구현됐다.

| 커밋 | 내용 |
|------|------|
| `feat: Secretary 기능 확장 + 통합 테스트 추가` | Secretary 확장 및 테스트 |
| `feat: 데스크톱 DesignDocReview, ModeSelector 컴포넌트 추가` | SolidJS UI 컴포넌트 추가 |
| `feat: 공유 타입 및 daemon API 계약 확장` | shared-types 및 contracts 확장 |
| `feat: 뉴스레터 메일 발송 기능 추가 (Resend API)` | Resend API 연동 뉴스레터 기능 |

## 💡 작업 하이라이트

**세 가지 회의 모드의 완성**

이 시점에서 Tory의 회의 프로토콜 3종이 모두 갖춰졌다. FreeformEngine(자유토론, 수렴 시 종합), QuickEngine(병렬 조사 + 의장 종합, 2분 타임아웃), PhaseEngine(5단계 구조화, Briefing→Position→Review→Synthesis→Vote). 질문의 성격에 따라 적합한 회의 방식을 선택할 수 있다.

단순한 정보 조회는 QuickEngine이 빠르다. 열린 주제의 브레인스토밍은 FreeformEngine이 풍부한 결과를 낸다. 찬반이 있는 의사결정은 PhaseEngine의 Vote 단계가 명확한 결론을 도출한다. 각 엔진은 독립적으로 존재하면서 Secretary가 인텐트에 따라 적합한 엔진을 선택한다.

## 📊 개발 현황

- **커밋**: 10개
- **핵심**: 웹/데스크톱 OAuth, 5단계 PhaseEngine 구조화 회의, 모델 카탈로그 DB 관리, Azure OpenAI 임베딩 프록시, Secretary 통합 테스트, 회의 프로토콜 3종 완성
