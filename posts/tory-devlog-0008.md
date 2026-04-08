---
title: "tory 개발일지 #8 - 모델 재배정 + Quick Meeting + 튜터 모드 (10개 커밋)"
date: "2026-03-05"
category: "dev-log"
description: "GPT-5.3 Instant 추가, Quick Meeting 프로토콜 구현, 스킬 eval 프레임워크, 5단계 튜터 모드까지 기록합니다."
tags: ["tory", "개발일지", "gpt-5.3", "quick-meeting", "tutor", "skill-eval", "readme"]
author: "Su"
lang: "ko"
---

# tory 개발일지 #8 - 모델 재배정 + Quick Meeting + 튜터 모드 (10개 커밋)

**작업 기간**: 2026-03-04 ~ 2026-03-05

## 📝 이번 기간 작업 내용

### 모델 재배정 및 GPT-5.3 추가 (2개 커밋)

PM 역할을 추론 1위 모델인 Gemini 3.1 Pro로, researcher 역할을 GPT-5.2 추론 모델로 교체했다. 이어서 GPT-5.3 Instant 모델을 카탈로그에 추가하고 회의 역할을 재배정했다. 모델 카탈로그는 `packages/shared/src/models.json`이 SSOT다. 변경은 항상 JSON부터 시작한다.

| 커밋 | 내용 |
|------|------|
| `refactor: PM→gemini-3.1-pro(추론1위), researcher→gpt-5.2(추론)` | PM, researcher 역할 모델 교체 |
| `feat: GPT-5.3 Instant 모델 추가 및 회의 역할 재배정` | GPT-5.3 Instant 카탈로그 추가 및 역할 매핑 |

### Quick Meeting 프로토콜 (1개 커밋)

기존 FreeformEngine과 PhaseEngine 외에 세 번째 회의 프로토콜을 추가했다. QuickEngine은 참여자가 병렬로 조사하고 의장이 결과를 종합한다. 타임아웃은 2분으로 고정이다. 빠른 팩트체크나 단답형 질의에 적합한 경량 회의 형식이다.

| 커밋 | 내용 |
|------|------|
| `feat: 일반회의(quick meeting) 프로토콜 추가` | 병렬 조사 + 의장 종합 방식의 QuickEngine 구현 |

### AGENTS.md 구조화 및 스킬 eval 프레임워크 (2개 커밋)

AGENTS.md를 목차 구조로 재편하고 구조 테스트, 피드백 루프, 실행 하네스를 추가했다. 에이전트 운영 가이드로서 더 실용적인 문서가 됐다.

스킬 eval 프레임워크는 스킬의 트리거 정확도를 측정하는 도구다. 트리거 테스트로 어떤 입력에 스킬이 발동하는지 확인하고, 벤치마크로 성능을 수치화한다. A/B 비교 기능으로 description 튜닝 전후의 차이를 측정할 수 있다.

| 커밋 | 내용 |
|------|------|
| `feat: AGENTS.md 목차화, 구조 테스트, 피드백 루프, 실행 하네스` | AGENTS.md 구조화 및 실행 가이드 강화 |
| `feat: 스킬 eval 프레임워크 구현 — 트리거 테스트, 벤치마크, A/B 비교, description 튜닝` | 스킬 평가 도구 구현 |

### PR 머지 (2개 커밋)

| 커밋 | 내용 |
|------|------|
| `Merge pull request #7 from su-record/claude/update-pricing-plans-ezmbm` | PR #7 머지 — 과금 플랜 업데이트 |
| `Merge pull request #8 from su-record/claude/improve-skill-creator-testing-9laf6` | PR #8 머지 — 스킬 생성 테스트 개선 |

### README 전면 재작성 및 신규 기능 (3개 커밋)

README를 258줄에서 987줄로 전면 재작성했다. 아키텍처, 설치, 회의 프로토콜, 과금 체계, 스킬 시스템 전반을 담은 종합 기술 문서다.

리서치 문서 생성 기능을 추가했다. 회의 결과를 구조화된 문서로 출력하고 다운로드하거나 이메일로 발송할 수 있다. 튜터 모드는 이 기간의 마지막 기능이다. 5단계 번역 분석, SM-2 알고리즘 기반 플래시카드, Glass HUD로 구성된 학습 보조 시스템이다.

| 커밋 | 내용 |
|------|------|
| `docs: README.md 종합 기술 문서로 전체 재작성 — 258줄→987줄` | README 전면 재작성 |
| `feat: 리서치 문서 생성 + 다운로드/이메일 발송 기능 구현` | 회의 결과 문서화 및 배포 기능 |
| `feat: 튜터 모드 구현 — 5단계 번역 분석 + SM-2 플래시카드 + Glass HUD` | 학습 보조 시스템 구현 |

## 💡 작업 하이라이트

**스킬 eval 프레임워크 — 스킬의 품질을 수치로 측정한다**

스킬 시스템은 사용자의 자연어 입력이 올바른 스킬을 발동시켜야 작동한다. description이 모호하면 엉뚱한 스킬이 발동하거나 아무것도 발동하지 않는다. 이 문제를 감으로 고치는 건 한계가 있었다.

eval 프레임워크는 트리거 정확도를 측정 가능하게 만든다. 테스트 케이스를 정의하고 실행하면 어떤 입력에서 스킬이 맞게, 혹은 틀리게 발동하는지 표로 확인할 수 있다. A/B 비교로 description을 바꿨을 때 정확도가 오르는지 내리는지도 측정한다.

스킬 description 튜닝이 체계적인 작업이 됐다.

## 📊 개발 현황

- **커밋**: 10개
- **핵심**: GPT-5.3 Instant, QuickEngine 병렬 회의, 스킬 eval 프레임워크, README 258→987줄, 튜터 모드(SM-2 플래시카드 + Glass HUD)
