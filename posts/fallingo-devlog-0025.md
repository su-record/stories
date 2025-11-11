---
title: "fallingo 개발일지 - 2025-10-25 (20개 커밋)"
date: "2025-10-25"
category: "dev-log"
description: "Cloud Run 배포 최적화 및 169개 API 엔드포인트 정상화"
tags: ["fallingo", "개발일지"]
author: "Su"
lang: "ko"
---

# fallingo 개발일지 - 2025-10-25 (20개 커밋)

## 📝 이번 기간 작업 내용

### Cloud Run 최적화 (8개 커밋)
- **Optimize startup for Cloud Run deployment**: 시작 최적화<br />
- **Change default PORT to 8080 for Cloud Run compatibility**: PORT 8080<br />
- **Optimize Cloud Run startup and configuration**: 설정 최적화<br />
- **Remove PORT from env vars (Cloud Run reserved variable)**: PORT 제거<br />
- **Disable background tasks and add no-cpu-throttling for faster startup**: 백그라운드 태스크 비활성화<br />
- **Add database engine error handling with SQLite fallback**: SQLite fallback<br />
- **Add print statements to track startup process**: 디버깅 로그 추가

### 환경변수 및 시크릿 관리 (6개 커밋)
- **Standardize DATABASE_URL environment variable**: DATABASE_URL 표준화<br />
- **Use GitHub Secret for JWT_SECRET_KEY instead of GCP Secret Manager**: GitHub Secret 사용<br />
- **Restore jwt-secret-key from GCP Secret Manager**: GCP Secret 복원<br />
- **Change GCP secret name from DATABASE_URL_PROD to DATABASE_URL**: 시크릿명 변경<br />
- **Complete DATABASE_URL_PROD to DATABASE_URL migration**: 마이그레이션 완료<br />
- **Use hardcoded SECRET_KEY env var instead of GCP secret**: 하드코드 env<br />
- **Use GCP Secret Manager for JWT_SECRET_KEY**: GCP Secret 사용

### API 구조 개선 (6개 커밋)
- **Correct user router import path**: import 경로 수정<br />
- **Fix incorrect API path comments**: 주석 수정<br />
- **Remove v1 directory structure from API**: v1 디렉토리 제거<br />
- **Add service __init__.py exports and fix imports**: __init__.py 수정<br />
- **Add prefix to all sub-routers to prevent empty path errors**: prefix 추가<br />
- **로컬 테스트 통과 - 169개 API 엔드포인트 정상 로드**: 169개 엔드포인트 성공

## 💡 작업 하이라이트

**Cloud Run 배포 최적화의 긴 여정**

10월 25일 하루 동안 **20개의 커밋**으로 Cloud Run 배포를 최적화했습니다. 핵심은 **시작 시간 단축**과 **환경변수 관리**였습니다.

**PORT 설정**을 8080으로 변경하고, Cloud Run에서 예약된 변수이므로 env vars에서 제거했습니다. **백그라운드 태스크를 비활성화**하고 **no-cpu-throttling**을 추가하여 시작 시간을 단축했습니다.

**환경변수 혼란 해결**

**DATABASE_URL** 관리가 가장 복잡했습니다:
- DATABASE_URL_PROD → DATABASE_URL로 표준화<br />
- GCP Secret Manager 사용 결정

**JWT_SECRET_KEY**도 시행착오를 겪었습니다:
- GitHub Secret 사용 시도<br />
- GCP Secret Manager 복원<br />
- 하드코드 env 시도<br />
- 최종적으로 GCP Secret Manager 사용

**API 구조 개선**

**v1 디렉토리 구조를 완전히 제거**하며 API 경로를 단순화했습니다. service __init__.py exports를 추가하고, 모든 sub-router에 prefix를 추가하여 **169개 API 엔드포인트를 정상적으로 로드**했습니다.

## 📊 개발 현황

- **Cloud Run**: 시작 최적화, SQLite fallback<br />
- **환경변수**: DATABASE_URL, JWT_SECRET_KEY GCP Secret Manager 통합<br />
- **API**: v1 구조 제거, 169개 엔드포인트 정상 로드<br />
- **성능**: 백그라운드 태스크 비활성화, no-cpu-throttling

