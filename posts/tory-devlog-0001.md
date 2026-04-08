---
title: "tory 개발일지 #1 - 프로젝트 탄생, Visee에서 Tory로 (10개 커밋)"
date: "2026-02-25"
category: "dev-log"
description: "자율 AI 비서실장 Tory의 첫 커밋. Visee 리브랜딩, 모노레포 구축, 핵심 시스템 설계 과정을 기록합니다."
tags: ["tory", "개발일지", "모노레포", "tauri", "solidjs", "rust"]
author: "Su"
lang: "ko"
---

# tory 개발일지 #1 - 프로젝트 탄생, Visee에서 Tory로 (10개 커밋)

**작업 기간**: 2026-02-23 ~ 2026-02-25

## 📝 이번 기간 작업 내용

### 모노레포 초기 설정 (1개 커밋)

프로젝트의 첫 커밋이다. pnpm + Turbo + Cargo Workspace 기반의 모노레포 구조를 잡았다. 데스크톱(Tauri 2 + SolidJS), 서버(Axum + SeaORM), 웹(SolidJS + Vite), 공유 패키지, Rust 크레이트를 하나의 저장소에서 관리하는 구조다.

| 커밋 | 내용 |
|------|------|
| `chore: initial monorepo setup` | pnpm + Turbo + Cargo Workspace 모노레포 초기 구성 |

### 핵심 시스템 설계 (6개 커밋)

모노레포 뼈대 위에 Tory의 핵심 개념을 코드로 구현했다. Head LLM 지정, 자원봉사(volunteer) 시스템, 강제 회의(force meeting) 메커니즘이 이 시기에 정의됐다. 여러 LLM이 단톡방처럼 브레인스토밍을 벌이고 최적의 결론을 도출하는 회의 파이프라인의 원형이다.

NAPI 바인딩도 이 단계에 추가됐다. 제로카피 Buffer API와 화면 캡처 바인딩을 통해 Rust 네이티브 기능을 Node.js 레이어에서 호출할 수 있는 경로를 열었다.

| 커밋 | 내용 |
|------|------|
| `feat(core): add Head LLM assignment, volunteer system, and force meeting` | Head LLM 지정, 자원봉사 참여, 강제 회의 메커니즘 구현 |
| `docs: add README.md and CLAUDE.md for project documentation` | 프로젝트 문서 초기 작성 |
| `Merge pull request #1` | PR #1 머지 — 코드 리뷰 및 문서화 |
| `feat(napi): add zero-copy Buffer APIs and screen capture bindings` | NAPI 제로카피 버퍼, 화면 캡처 바인딩 추가 |
| `Merge pull request #2` | PR #2 머지 — NAPI 최적화 |
| `feat(core): add recommendation pipeline with group chat meeting` | 그룹 채팅 회의 기반 추천 파이프라인 구현 |

### QA 게이트 및 리브랜딩 (3개 커밋)

QA Lead 역할과 사전 엔지니어링 QA 검증 게이트를 추가했다. 회의 결과가 실행으로 넘어가기 전에 품질을 걸러내는 구조다.

마지막 커밋에서 프로젝트 이름이 Visee에서 Tory로 바뀌었다. 코어 패키지 구조도 함께 개편됐다. 단순한 이름 변경이 아니라 제품 정체성을 재정의한 리브랜딩이었다.

| 커밋 | 내용 |
|------|------|
| `feat(company): add QA Lead role and pre-engineering QA Validation Gate` | QA Lead 역할 및 검증 게이트 추가 |
| `Merge pull request #3` | PR #3 머지 — QA 검증 프로세스 |
| `refactor: rebrand Visee → Tory and restructure core package` | Visee → Tory 리브랜딩, 코어 패키지 재구조화 |

## 💡 작업 하이라이트

**자율 AI 비서실장이라는 개념의 탄생**

Tory의 핵심 아이디어는 단순하다. 하나의 LLM이 혼자 결정하는 게 아니라, 여러 LLM이 단톡방처럼 토론을 벌인 뒤 최적의 결론을 뽑아낸다. Head LLM 지정 시스템은 이 구조의 중심축이다. 어떤 LLM이 사회자 역할을 맡을지, 어떤 LLM이 자발적으로 의견을 낼지, 어떤 상황에서 강제로 회의를 소집할지를 코드로 정의했다.

QA 검증 게이트는 이 회의 결과를 실행으로 연결하는 안전장치다. 회의에서 나온 결론이 실제 작업으로 넘어가기 전에 품질 기준을 통과해야 한다는 원칙을 처음부터 시스템에 내재화했다.

리브랜딩은 방향성의 명확화였다. Visee라는 이름이 가진 범용적 뉘앙스를 버리고 Tory, 비서실장이라는 구체적인 역할을 이름에 담았다.

## 📊 개발 현황

- **커밋**: 10개
- **핵심**: 모노레포 초기 구성, Head LLM + 자원봉사 + 강제 회의 메커니즘, NAPI 화면 캡처, QA 검증 게이트, Visee → Tory 리브랜딩
