---
title: "fallingo 개발일지 - 2025-08-12 (20개 커밋)"
date: "2025-08-12"
category: "dev-log"
description: "Redis 제거, 보안 강화 및 대규모 리팩토링"
tags: ["fallingo", "개발일지"]
author: "Su"
lang: "ko"
---

# fallingo 개발일지 - 2025-08-12 (20개 커밋)

## 📝 이번 기간 작업 내용

### 의존성 정리 (3개 커밋)
- **pyproject.toml에도 psycopg2-binary 추가**: 의존성 동기화<br />
- **Poetry lock 파일 업데이트 및 requirements.txt 재생성**: 의존성 재생성<br />
- **Redis 비활성화 및 비용 최적화**: Redis 비활성화<br />
- **Cloud Run 배포 오류 해결**: 배포 수정<br />
- **Redis 완전 제거**: Redis 완전 삭제

### Cloud Run 최적화 (6개 커밋)
- **콘피그 hide**: 설정 숨김<br />
- **config_simple.py로 전환하여 배포 문제 해결**: 설정 단순화<br />
- **Cloud Run 배포 시작 시간 최적화 - uvicorn workers 설정 조정**: 성능 최적화<br />
- **otel_service_name 속성 추가로 테스트 오류 해결**: OpenTelemetry 설정<br />
- **Cloud Run 시작 문제 해결**: lifespan 에러 처리 추가<br />
- **claude**: 일반 업데이트<br />
- **config_simple.py에서 config.py로 복원**: 설정 복원

### API 경로 개선 (3개 커밋)
- **/api prefix 추가로 fallingo.app/api/docs 접근 가능하도록 수정**: API prefix 추가<br />
- **/health 엔드포인트 제거, /api/health만 유지**: 경로 통일<br />
- **hide open**: 설정 숨김<br />
- **health check 테스트 경로를 /api/health로 수정**: 테스트 수정

### 보안 강화 (1개 커밋)
- **보안 강화 구현**:<br />
  - JWT 시크릿 키 환경변수 사용<br />
  - Rate Limiting 미들웨어 추가 (60req/min)<br />
  - CORS 프로덕션 도메인만 허용<br />
  - 토큰 블랙리스트 구현 (로그아웃 시 무효화)

### 대규모 리팩토링 (3개 커밋)
- **백엔드 코드 품질 개선 및 레거시 제거**: 전체 코드 정리<br />
- **main.py 대규모 리팩토링 및 코드 구조 개선**: 메인 파일 리팩토링<br />
- **인증 서비스 대규모 리팩토링 및 분리**: 인증 로직 분리

## 💡 작업 하이라이트

**비용 최적화와 프로덕션 준비**

**Redis를 완전 제거**하여 인프라 비용을 최적화했습니다. 초기에는 캐싱 레이어로 Redis를 고려했으나, 현재 단계에서는 불필요하다고 판단하여 과감히 제거했습니다.

Cloud Run 배포를 위해 lifespan에서 **외부 연결 실패 시에도 앱이 시작**되도록 에러 처리를 추가했고, uvicorn workers 설정을 조정하여 **시작 시간을 최적화**했습니다.

**보안 강화**가 이번 작업의 핵심입니다:
- **Rate Limiting**: 60req/min으로 DDoS 방어<br />
- **CORS**: 프로덕션 환경에서 실제 도메인만 허용<br />
- **토큰 블랙리스트**: 로그아웃 시 JWT 무효화

마지막으로 **main.py와 인증 서비스를 대규모 리팩토링**하며 코드 품질을 대폭 향상시켰습니다. **/api prefix** 추가로 API 경로를 표준화했습니다.

## 📊 개발 현황

- **인프라**: Redis 제거, 비용 최적화<br />
- **보안**: Rate Limiting, CORS, JWT 블랙리스트 구현<br />
- **API**: /api prefix 표준화<br />
- **코드**: main.py, 인증 서비스 리팩토링 완료

