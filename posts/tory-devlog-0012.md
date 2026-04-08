---
title: "tory 개발일지 #12 - Canvas 독립 + CI/CD 정비 (10개 커밋)"
date: "2026-03-07"
category: "dev-log"
description: "Canvas를 독립 Tauri 윈도우로 분리, jspdf 보안 취약점 해결, GitHub Actions 3종 정비, Azure SWA 자동 배포 구축 과정을 기록합니다."
tags: ["tory", "개발일지", "tauri", "canvas", "ci-cd", "github-actions", "azure-swa"]
author: "Su"
lang: "ko"
---

# tory 개발일지 #12 - Canvas 독립 + CI/CD 정비 (10개 커밋)

**작업 기간**: 2026-03-06 ~ 2026-03-07

## 📝 이번 기간 작업 내용

### 잔여 변경사항 일괄 커밋 및 PR 머지 (2개 커밋)

daemon, desktop, web, shared 전반의 잔여 변경사항을 일괄 커밋했다. Meeting Orchestrator 리팩토링 브랜치를 PR #10으로 메인에 머지했다.

| 커밋 | 내용 |
|------|------|
| `feat: 나머지 변경사항 일괄 커밋 — daemon, desktop, web, shared` | 분산된 변경사항 정리 |
| `Merge pull request #10 from su-record/feature/meeting-orchestrator-refactor` | PR #10 머지 — Meeting Orchestrator 리팩토링 |

### Canvas 독립 Tauri 윈도우 (1개 커밋)

Glass 모드 안에 내장됐던 Canvas를 독립적인 Tauri 윈도우로 분리했다. 별도 윈도우가 되면서 Glass HUD와 Canvas를 동시에 사용할 수 있다. 캔버스 기능도 강화됐다. 드로잉, 텍스트 레이어, 이미지 임포트 등 캔버스로서의 기본 기능이 갖춰졌다.

| 커밋 | 내용 |
|------|------|
| `feat: Glass에서 Canvas를 독립 Tauri 윈도우로 분리 + 캔버스 기능 강화` | Canvas 윈도우 분리 및 기능 확장 |

### 보안 취약점 수정 (1개 커밋)

jspdf의 critical 취약점 1건, high 취약점 7건, moderate 취약점 5건을 해결했다. `^2.5.2`를 `^4.2.0`으로 버전을 올리는 것으로 처리됐다. 의존성 취약점은 방치할수록 마이그레이션 비용이 커진다. 발견하는 즉시 처리하는 게 원칙이다.

| 커밋 | 내용 |
|------|------|
| `fix: jspdf ^2.5.2 → ^4.2.0 보안 취약점 해결 (critical 1, high 7, moderate 5)` | jspdf 보안 취약점 13건 해결 |

### GitHub Actions CI/CD 정비 (2개 커밋)

GitHub Actions 워크플로우를 전면 정비했다. CI와 배포를 분리하고 데스크톱 빌드 워크플로우를 추가했다. CI는 테스트와 린트, 배포는 각 타겟(서버, 웹, 데스크톱)별로 독립적인 워크플로우가 된다. 데스크톱 Linux CI에 libpipewire, libasound2, clang 의존성이 빠져서 빌드가 실패하는 문제도 수정했다.

| 커밋 | 내용 |
|------|------|
| `ci: GitHub Actions 워크플로우 3종 정비 — CI/배포 분리 + 데스크톱 빌드 추가` | 워크플로우 구조 재편 |
| `fix(ci): desktop Linux CI에 libpipewire, libasound2, clang 의존성 추가` | Linux 빌드 의존성 누락 수정 |

### 안건 기반 회의 및 개발 실행 루프 (1개 커밋)

안건을 입력받아 회의를 구성하고 실행 결과를 검증하는 루프를 구현했다. 회의에서 나온 결론을 코드 변경이나 작업 실행으로 연결하고, 결과를 다시 검증하는 closed-loop 구조다.

| 커밋 | 내용 |
|------|------|
| `feat: 안건 기반 회의 + 개발 실행 + 검증 루프 시스템 구현` | 회의→실행→검증 closed-loop 구현 |

### Azure SWA 자동 배포 (3개 커밋)

Azure Static Web Apps 배포 워크플로우를 추가했다. 자동 생성된 Azure SWA 워크플로우는 삭제하고 기존 web-deploy.yml에 자동 배포를 통합했다. production_branch를 명시해 메인 브랜치 푸시 시 자동으로 프로덕션에 배포된다.

| 커밋 | 내용 |
|------|------|
| `ci: add Azure Static Web Apps workflow file on-behalf-of: @Azure opensource@microsoft.com` | Azure SWA 워크플로우 초기 추가 |
| `ci: Azure SWA 자동 생성 워크플로우 삭제, web-deploy.yml에 자동 배포 통합` | 워크플로우 통합 정리 |
| `ci: web-deploy에 production_branch 명시 추가` | 프로덕션 배포 브랜치 명시 |

## 💡 작업 하이라이트

**Tauri 멀티윈도우 — Canvas를 분리한 이유**

Glass HUD와 Canvas가 같은 윈도우 안에 있으면 서로가 서로를 방해한다. 반투명 오버레이인 Glass 위에 캔버스 레이어를 올리는 방식은 z-index 관리와 이벤트 처리가 복잡해진다.

Tauri에서 윈도우를 추가로 띄우는 비용은 낮다. 독립 윈도우로 분리하면 각자의 생명 주기를 가지고, 포커스와 입력 이벤트가 명확하게 분리된다. Canvas 윈도우를 닫아도 Glass HUD는 계속 동작한다.

멀티윈도우 구조는 Tory가 데스크톱 네이티브 앱이라는 점을 적극 활용한 결정이다.

CI/CD 정비는 지금 시점에 하지 않으면 나중에 더 어렵다. 배포 대상이 하나일 때 정리해두면 서버, 웹, 데스크톱 세 타겟이 각자의 파이프라인을 갖게 된다.

## 📊 개발 현황

- **커밋**: 10개
- **핵심**: Canvas 독립 Tauri 윈도우 분리, jspdf 취약점 13건 해결, GitHub Actions 3종 재편(CI/배포 분리), Azure SWA 프로덕션 자동 배포, closed-loop 회의→실행→검증
