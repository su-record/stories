---
title: "tory 개발일지 #15 - 가입 필수화 + Repository 패턴 (10개 커밋)"
date: "2026-03-09"
category: "dev-log"
description: "가입 필수화, TypeScript 타입 에러 전수 해소, PR 보안 리뷰, Repository 패턴 전환까지 기록합니다."
tags: ["tory", "개발일지", "typescript", "security", "repository-pattern", "mandatory-signup", "refactor"]
author: "Su"
lang: "ko"
---

# tory 개발일지 #15 - 가입 필수화 + Repository 패턴 (10개 커밋)

**작업 기간**: 2026-03-08 ~ 2026-03-09

## 📝 이번 기간 작업 내용

### 가입 필수화 + Free 티어 동기화 (1개 커밋)

비로그인 상태에서 앱을 사용하던 경로를 모두 차단했다. 가입을 필수화하고, Free 티어 사용자도 회의와 Closed Loop 데이터를 서버에 동기화한다. 데이터 지속성을 보장하고 이후 유료 전환 시 히스토리를 유지할 수 있다.

| 커밋 | 내용 |
|------|------|
| `feat: 가입 필수화 + Free 티어 회의/Closed Loop 동기화` | 가입 필수 + Free 동기화 |

### TypeScript 타입 에러 전수 해소 (2개 커밋)

데몬 전체에 쌓인 TypeScript 타입 에러 100개 이상을 전부 수정했다. 에러 0개를 확인했다. 이어서 테스트 실패도 수정하고 desktop 타입체크를 통과시켰다. 최종적으로 902개 테스트가 전부 통과하고 실패 0개 상태를 확인했다.

| 커밋 | 내용 |
|------|------|
| `fix: 데몬 전체 TypeScript 타입 에러 수정 (100개+ → 0개)` | 타입 에러 전수 해소 |
| `fix: 테스트 실패 수정 + desktop 타입체크 해결 (902 pass, 0 fail)` | 테스트 전수 통과 |

### PR #11/#12 머지 + 보안 리뷰 (4개 커밋)

PR #11을 머지한 직후 P1 보안 취약점 5건과 P2 3건을 추가로 발견해 수정했다. 인증 우회, 데이터 무결성 손상 가능성이 있는 코드가 포함돼 있었다. 수정 후 PR #12로 분리해 다시 머지했다. 보안 리뷰 결과와 SPEC, Feature 문서도 함께 커밋했다.

| 커밋 | 내용 |
|------|------|
| `Merge pull request #11 from su-record/feature/mandatory-signup-free-sync` | PR #11 머지 |
| `fix: PR#11 보안/데이터 무결성 취약점 수정 (P1 5건 + P2 3건)` | 보안/무결성 취약점 수정 |
| `docs: PR#11 보안 리뷰 + SPEC/Feature 문서 추가` | 보안 리뷰 문서화 |
| `Merge pull request #12 from su-record/feature/fix-pr11-security-data-integrity` | PR #12 머지 |

### Azure SWA 배포 복원 + Repository 패턴 전환 (3개 커밋)

Azure SWA 배포 설정이 이전 변경 과정에서 일부 깨져 원본 패턴으로 복원했다. Store를 Repository 패턴으로 전환하는 큰 리팩토링도 이 기간에 완료했다. Secretary, RAG, ClosedLoop의 메서드를 각 도메인별로 분해해 책임을 명확히 나눴다. README와 웹 PPT 슬라이드도 최신화했다.

| 커밋 | 내용 |
|------|------|
| `fix: Azure SWA 배포 설정을 원본 패턴으로 복원` | SWA 배포 설정 복원 |
| `refactor: Store를 Repository 패턴으로 전환 + Secretary/RAG/ClosedLoop 메서드 분해` | Repository 패턴 전환 |
| `docs: README + 웹 PPT 슬라이드 최신화` | 문서 최신화 |

## 💡 작업 하이라이트

**타입 에러 100개를 한 번에 해소**

TypeScript 타입 에러가 장기간 방치되면 코드베이스 전체의 신뢰도가 떨어진다. 에러가 있는 상태에서는 새로운 타입 오류를 알아채기 어렵다. 100개 이상의 에러를 한 커밋에 정리하고 0개 상태로 되돌린 것은 이후 개발 속도에 직접적인 영향을 준다.

**PR 머지 후 즉시 보안 리뷰**

PR #11을 머지한 뒤 코드를 다시 검토해 P1 5건을 발견했다. 머지 전에 잡지 못한 취약점이었다. PR #12로 수정을 격리하고 별도 머지하는 방식으로 대응했다. 인증 우회나 데이터 무결성 문제는 기능 버그와 달리 조용히 시스템을 손상시키기 때문에 즉각 처리했다.

## 📊 개발 현황

- **커밋**: 10개
- **핵심**: 가입 필수화, 타입 에러 전수 해소, P1/P2 보안 수정, Repository 패턴 전환
