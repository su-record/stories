---
title: "fallingo 개발일지 - 2025-11-07 ~ 2025-11-09 (20개 커밋)"
date: "2025-11-09"
category: "dev-log"
description: "Redis 캐싱 및 BackgroundTasks로 76% 성능 개선"
tags: ["fallingo", "개발일지"]
author: "Su"
lang: "ko"
---

# fallingo 개발일지 - 2025-11-07 ~ 2025-11-09 (20개 커밋)

## 📝 이번 기간 작업 내용

### UI 및 광고 (3개 커밋)
- **라우팅 설정 및 About 화면 추가** (11/7): About 화면<br />
- **AdMob 설정 및 UI 텍스트 개선** (11/8): AdMob 설정<br />
- **의존성 버전 업데이트 (pubspec.lock)** (11/8): 의존성 업데이트

### Redis 캐싱 시스템 (5개 커밋)
- **GCP Memorystore Redis 캐싱 시스템 구축** (11/8): Redis 구축<br />
- **CLAUDE.md 업데이트 - PostgreSQL 17 및 Redis 활성화** (11/8): 문서 업데이트<br />
- **주요 서비스에 Redis 캐싱 적용** (11/8): 캐싱 적용<br />
- **Redis 캐싱 시스템 적용 문서화** (11/9): 문서화<br />
- **Redis 캐싱 시스템 로컬 환경 테스트 완료** (11/9): 테스트 완료

### BackgroundTasks 성능 개선 (2개 커밋)
- **BackgroundTasks 도입으로 API 응답 속도 76% 개선** (11/9): 76% 개선<br />
- **BackgroundTasks를 팔로우 및 피드 생성 API에도 확대 적용** (11/9): 확대 적용

### 배포 및 버그 수정 (7개 커밋)
- **Redis 패키지 의존성 추가로 배포 실패 수정** (11/8): 배포 수정<br />
- **Merge pull request #3**: PR 병합<br />
- **Cloud Run startup timeout 해결 (캐시 연결 타임아웃 추가)** (11/9): 타임아웃 수정<br />
- **pre-commit hook deprecated stage 수정 및 about.html API 문서 비활성화** (11/9): 설정 수정<br />
- **BackgroundTasks Depends() 제거 (FastAPI 자동 주입)** (11/9): Depends 제거<br />
- **BackgroundTasks 파라미터 순서 수정 (SyntaxError 해결)** (11/9): 파라미터 수정

### 보안 강화 (3개 커밋)
- **Remove exposed GoogleService-Info.plist** (11/9): API 키 제거<br />
- **Add Firebase config files to .gitignore** (11/9): gitignore 추가<br />
- **Firebase API 키 보안 강화** (11/9): 보안 강화<br />
- **Merge branch 'security/remove-api-keys'** (11/9): 보안 브랜치 병합

## 💡 작업 하이라이트

**Redis 캐싱 시스템 구축**

11월 8일, **GCP Memorystore Redis 캐싱 시스템**을 구축했습니다. 이전에 제거했던 Redis를 다시 도입한 것은 프로덕션 환경에서 성능이 필요하다고 판단했기 때문입니다.

주요 서비스에 캐싱을 적용하고, 로컬 환경 테스트를 완료했습니다. PostgreSQL 17과 Redis를 활성화하며 인프라를 강화했습니다.

**BackgroundTasks로 76% 성능 개선**

11월 9일, **FastAPI BackgroundTasks**를 도입하여 **API 응답 속도를 76% 개선**했습니다. 이는 매우 인상적인 성과입니다.

초기에는 특정 API에만 적용했으나, 효과가 검증되어 **팔로우 및 피드 생성 API**로 확대 적용했습니다.

구현 과정에서 Depends() 제거, 파라미터 순서 수정 등 FastAPI 특성을 이해하며 안정화했습니다.

**보안 강화: Firebase API 키**

11월 9일, **노출된 GoogleService-Info.plist를 제거**하고, Firebase 설정 파일을 .gitignore에 추가하며 **API 키 보안을 강화**했습니다. security/remove-api-keys 브랜치에서 작업 후 병합했습니다.

## 📊 개발 현황

- **캐싱**: GCP Memorystore Redis 구축 및 적용<br />
- **성능**: BackgroundTasks로 76% 개선<br />
- **보안**: Firebase API 키 제거, gitignore 추가<br />
- **배포**: Cloud Run 타임아웃 해결<br />
- **광고**: AdMob 설정 완료

