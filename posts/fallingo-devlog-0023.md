---
title: "Fallingo 개발일지 - 2025-10-22 (20개 커밋)"
date: "2025-10-22"
category: "dev-log"
description: "프로덕션 Dockerfile 및 Cloud Run 배포 최적화"
tags: ["fallingo", "개발일지"]
author: "Su Ham"
lang: "ko"
---

# Fallingo 개발일지 - 2025-10-22 (20개 커밋)

## 📝 이번 기간 작업 내용

### Dockerfile 및 Poetry 설정 (4개 커밋)
- **FastAPI 백엔드용 프로덕션 Dockerfile 추가**: 프로덕션 Dockerfile 작성
- **poetry.lock을 Git 추적에 추가**: lock 파일 추가
- **Dockerfile에서 poetry.lock 자동 생성하도록 수정**: 자동 생성
- **Poetry 명령어 업데이트 (--no-dev → --only main)**: 최신 명령어

### Cloud Build 배포 시도 (4개 커밋)
- **Trigger deployment**: 배포 트리거
- **Cloud Build를 사용하도록 배포 워크플로우 개선**: Cloud Build 전환
- **Retry deployment with Cloud Build permissions**: 권한 재시도
- **dev check**: 개발 체크

### Docker 직접 빌드 전환 (5개 커밋)
- **Cloud Build 대신 Docker 직접 빌드로 변경**: Docker 직접 빌드
- **Retry deployment with iam.serviceAccountUser permission**: IAM 권한 추가
- **Remove --service-account option to use default Compute Engine SA**: 기본 SA 사용
- **Add DATABASE_URL and DATABASE_PASSWORD for Cloud SQL connection**: DB 환경변수
- **Cloud Run 배포 문제 해결**: 배포 문제 해결

### 의존성 및 버그 수정 (7개 커밋)
- **Update poetry.lock for google-generativeai**: poetry.lock 업데이트
- **Fix function parameter order in feed_curation_service**: 파라미터 순서 수정
- **Add missing aiohttp dependency**: aiohttp 추가
- **Add missing google-cloud-documentai dependency**: documentai 추가
- **Disable Redis cache manager (not currently used)**: Redis 비활성화
- **Re-enable in-memory cache manager (not Redis)**: 인메모리 캐시 활성화
- **Skip init_db() during startup for faster cold start**: DB 초기화 스킵

## 💡 작업 하이라이트

**Cloud Run 배포 최적화**

프로덕션 배포를 위한 Dockerfile을 작성하며 시작했습니다. Poetry 설정을 최신화하고 (--no-dev → --only main), poetry.lock을 Git에 추가했습니다.

**Cloud Build vs Docker 직접 빌드**

처음에는 **Cloud Build**를 사용하려 했으나, 권한 문제가 발생했습니다. Retry를 2회 시도했으나 결국 **Docker 직접 빌드**로 전환했습니다. IAM 권한을 추가하고, 기본 Compute Engine Service Account를 사용하도록 변경했습니다.

**의존성 및 성능 최적화**

배포 중 누락된 의존성을 발견했습니다:
- **google-generativeai**: poetry.lock 업데이트
- **aiohttp**: 누락 의존성 추가
- **google-cloud-documentai**: 누락 의존성 추가

**Redis 제거 및 Cold Start 최적화**

현재 사용하지 않는 **Redis cache manager를 비활성화**하고, 대신 **in-memory cache manager**를 활성화했습니다. 또한 **init_db() 스킵**으로 **Cold Start 시간을 단축**했습니다.

feed_curation_service의 함수 파라미터 순서 오류도 수정했습니다.

## 📊 개발 현황

- **배포**: Docker 직접 빌드, Cloud SQL 연결
- **의존성**: aiohttp, documentai 추가
- **성능**: Redis → 인메모리 캐시, init_db 스킵
- **Poetry**: 최신 명령어, lock 파일 관리

