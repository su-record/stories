---
title: "tory 개발일지 #7 - 테스트 + 운영 안정화 + 과금 개편 (10개 커밋)"
date: "2026-03-04"
category: "dev-log"
description: "P1~P3 보안·품질 수정, 7패턴 운영 안정화, 과금 체계를 4단계에서 2단계로 통일한 과정을 기록합니다."
tags: ["tory", "개발일지", "rust", "testing", "billing", "operations", "meeting"]
author: "Su"
lang: "ko"
---

# tory 개발일지 #7 - 테스트 + 운영 안정화 + 과금 개편 (10개 커밋)

**작업 기간**: 2026-03-03 ~ 2026-03-04

## 📝 이번 기간 작업 내용

### P1/P2/P3 코드 리뷰 수정 (3개 커밋)

vibe.review 결과를 반영했다. P1/P2는 보안과 안정성 이슈 7건이다. 인증 경로 취약점, 에러 전파 누락, 잠재적 패닉 지점을 수정했다. P3는 코드 품질 7건으로 중복 로직 제거, 함수 분리, 가독성 개선이 주를 이뤘다. 신규 모듈 6개에 대한 테스트도 추가해 전체 테스트를 249개, expect를 485개로 늘렸다.

| 커밋 | 내용 |
|------|------|
| `fix: vibe.review P1/P2 보안·안정성 7건 수정` | 인증 취약점, 에러 전파 누락 등 보안·안정성 수정 |
| `refactor: vibe.review P3 코드 품질 7건 개선` | 중복 제거, 함수 분리, 가독성 개선 |
| `test: 신규 모듈 6건 테스트 추가 — 249 tests, 485 expects` | 신규 모듈 테스트 작성으로 커버리지 확대 |

### 문서 및 모델 업데이트 (2개 커밋)

Phase 18 작업 결과를 README, Tory.md, CLAUDE.md, AGENTS.md 네 문서에 일괄 반영했다. head와 intent 분류에 사용하는 통합 모델을 Gemini 3.1 Flash-Lite로 교체했다. 빠른 응답이 필요한 경로에 더 적합한 모델이다.

| 커밋 | 내용 |
|------|------|
| `docs: README, Tory.md, CLAUDE.md, AGENTS.md Phase 18 반영` | Phase 18 기능 전체를 4개 문서에 동기화 |
| `refactor: head+intent 통합 모델을 Gemini 3.1 Flash-Lite로 변경` | 인텐트 분류 경로 모델 교체 |

### 운영 안정화 7패턴 (1개 커밋)

운영 환경에서 발생하는 문제를 예방하는 패턴 7개를 한 번에 구현했다. config migration으로 설정 파일의 버전 간 호환을 처리하고, time decay 가중치로 오래된 RAG 항목의 영향을 줄인다. manifest 파일은 빌드 산출물을 추적하며, tool policy는 도구 실행 권한을 정책으로 제어한다. doctor 커맨드로 시스템 상태를 점검하고, browser profiles와 pairing 모듈이 외부 연동을 안정화한다.

| 커밋 | 내용 |
|------|------|
| `feat: 운영 안정화 7패턴 구현 — config migration, time decay, manifest, tool policy, doctor, browser profiles, pairing` | 운영 환경 안정성을 높이는 7가지 패턴 구현 |

### Phase 19-20 기능 및 과금 개편 (3개 커밋)

Canvas, Meeting UI, Live 세션, CSS 모듈화를 포함한 Phase 19-20 기능을 구현했다. 가장 큰 변화는 과금 체계다. free/plus/pro/ultra 4단계를 free/pro 2단계로 단순화했다. 계층이 늘어날수록 사용자 혼란이 커진다는 판단이었다. 회의 참여 프로필도 기본 9개 역할을 전체 확장하고 추가 밴더의 동적 참여를 지원한다.

| 커밋 | 내용 |
|------|------|
| `feat: Phase 19-20 기능 구현 — Canvas, Meeting UI, Live 세션, CSS 모듈화, 과금 체계 개편` | Phase 19-20 전체 기능 구현 |
| `refactor: 과금 체계 개편 — 4단계(free/plus/pro/ultra) → 2단계(free/pro)` | 과금 단계 단순화 |
| `feat: 회의 기본 프로필 9개 역할 전체 확장 + 추가 밴더 동적 참여` | 회의 프로필 확장 |

### 개발 라인 모델 재배정 (1개 커밋)

기술 리드 역할을 Codex 모델로, 백엔드 역할을 Opus 모델로 재배정했다. 각 역할의 특성에 더 맞는 모델을 매핑한 결과다.

| 커밋 | 내용 |
|------|------|
| `refactor: 개발 라인 모델 재배정 — tech_lead→codex, backend→opus` | 역할별 모델 재매핑 |

## 💡 작업 하이라이트

**과금 체계 2단계 통일**

free/plus/pro/ultra 4단계 구조는 만들 때는 세밀해 보였다. 실제로는 plus와 pro의 차이를 사용자에게 설명하기 어려웠고, 코드 곳곳에서 4개 티어를 분기 처리하는 로직이 복잡성을 키웠다.

free/pro 2단계로 줄이니 경계가 명확해졌다. 자체 API 키를 쓰거나 CLI를 직접 사용하면 free, Tory가 API 크레딧을 제공하는 관리형 서비스를 원하면 pro다. 코드에서도 `is_paid()` 한 번으로 분기가 끝난다.

과금 단순화는 제품 결정이기도 하고 엔지니어링 결정이기도 하다. 두 관점 모두에서 2단계가 옳았다.

## 📊 개발 현황

- **커밋**: 10개
- **핵심**: P1~P3 보안·품질 수정, 249 tests/485 expects, 운영 안정화 7패턴, 과금 2단계(free/pro) 통일, Phase 19-20 Canvas·Meeting UI·Live 세션
