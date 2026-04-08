---
title: "tory 개발일지 #4 - Phase 14~17 + Azure 서버, 동기화와 CI/CD 구축 (10개 커밋)"
date: "2026-03-02"
category: "dev-log"
description: "서버-데몬 동기화, 멀티프로바이더 실행 레이어, Azure 전체 서버 구현, CSRF/JWKS 보안 강화, CI/CD 배포 파이프라인 구축 기록입니다."
tags: ["tory", "개발일지", "azure", "rust", "cicd", "oauth", "security", "sync"]
author: "Su"
lang: "ko"
---

# tory 개발일지 #4 - Phase 14~17 + Azure 서버, 동기화와 CI/CD 구축 (10개 커밋)

**작업 기간**: 2026-02-27 ~ 2026-03-02

## 📝 이번 기간 작업 내용

### Phase 14 — Daemon ↔ Server 동기화 (1개 커밋)

데몬(로컬 Tauri 앱)과 Azure 서버 사이의 동기화 레이어를 구현했다. REST 폴링 방식으로 서버 상태를 주기적으로 가져오고, 오프라인 상태에서도 로컬 SQLite에 데이터를 보존하는 Offline-first 전략을 적용했다. 네트워크가 끊겨도 로컬 기능은 정상 동작한다.

| 커밋 | 내용 |
|------|------|
| `feat: Phase 14 — Daemon ↔ Server 동기화 레이어 (REST 폴링, Offline-first)` | 서버-데몬 동기화 레이어 구현 |

### Phase 13 보충 + Phase 15~17 (4개 커밋)

Phase 13 보충 작업으로 workspace 구조, shared-types, contracts, 데스크톱 UI, 웹 앱, 서버 migration/models, device/usage 크레이트를 추가했다. 이어서 15기능 × 8프로바이더 × 4단계 소스 우선순위로 구성된 모델 관리 시스템(Phase 15), STT/TTS/이미지 생성/임베딩 멀티프로바이더 실행 레이어(Phase 16), 라이브 데스크톱 UI와 모델 카탈로그 동적 동기화(Phase 17)를 완성했다.

| 커밋 | 내용 |
|------|------|
| `feat: Phase 13 보충 — workspace 구조, shared-types, contracts, Desktop UI, Web app, Server migration/models, device/usage crates` | Phase 13 누락 항목 보충 |
| `feat: Phase 15 — 모델 관리 (15기능 × 8프로바이더 × 4단계 소스 우선순위)` | 모델 카탈로그 관리 시스템 구현 |
| `feat: Phase 16 — Provider Execution Layer (STT, TTS, ImageGen, Embedding 멀티프로바이더)` | 멀티프로바이더 실행 레이어 구현 |
| `feat: Phase 17 — Live Desktop UI + 모델 카탈로그 동적 동기화` | 라이브 UI 및 모델 카탈로그 동기화 |

### Azure 서버 전체 구현 + 머지 (2개 커밋)

Phase 1~6에 해당하는 Azure 서버 기능 전체를 한 번에 구현했다. OAuth 인증, AI 프록시, RAG, 프리미엄 기능, 데몬 연동을 포함한다. 이후 PR #6으로 머지했다.

| 커밋 | 내용 |
|------|------|
| `feat: Azure Server 전체 구현 (Phase 1~6) — OAuth, AI 프록시, RAG, 프리미엄, Daemon 연동` | Azure 서버 전체 구현 |
| `Merge pull request #6` | PR #6 머지 — Provider Execution 통합 |

### 보안 강화 + CI/CD (3개 커밋)

CSRF 방어와 JWKS 키 로테이션으로 서버 보안을 강화했다. Azure Container Apps 배포를 위한 CI/CD 워크플로우를 추가하고, Docker 베이스 이미지를 `rust:1-slim-bookworm`으로 교체해 하드코딩된 환경변수를 제거했다.

| 커밋 | 내용 |
|------|------|
| `feat: CSRF 방어 + JWKS 키 로테이션 보안 강화` | CSRF 방어 및 JWT 키 로테이션 구현 |
| `ci: add server deploy workflow for Azure Container Apps` | Azure Container Apps 배포 워크플로우 추가 |
| `fix: use rust:1-slim-bookworm base image and remove hardcoded ENV` | Docker 이미지 및 환경변수 정리 |

## 💡 작업 하이라이트

**모델 카탈로그 SSOT 설계**

Phase 15에서 확정된 모델 관리 구조는 이후 전체 시스템의 기준이 된다. 15개 기능, 8개 프로바이더, 4단계 소스 우선순위라는 매트릭스로 어떤 작업에 어떤 모델을 써야 하는지를 코드가 아닌 데이터로 표현한다. `packages/shared/src/models.json`이 SSOT가 되어 TypeScript와 Rust 양쪽에서 동일한 모델 정보를 소비한다. 모델을 추가할 때 JSON 한 곳만 수정하면 전체 시스템에 반영된다.

JWKS 키 로테이션은 JWT 비밀키가 노출됐을 때의 피해를 제한한다. 키를 주기적으로 교체하고, 클라이언트는 JWKS 엔드포인트에서 최신 공개키를 가져와 토큰을 검증한다. Azure 환경에서 하드코딩된 환경변수를 제거한 것도 같은 맥락의 보안 조치다.

## 📊 개발 현황

- **커밋**: 10개
- **핵심**: Offline-first 서버-데몬 동기화, 15×8×4 모델 카탈로그 SSOT, STT/TTS/ImageGen/Embedding 멀티프로바이더, CSRF + JWKS 보안, Azure Container Apps CI/CD
