---
title: "Fallingo 개발일지 - 2025-10-25 ~ 2025-10-27 (20개 커밋)"
date: "2025-10-27"
category: "dev-log"
description: "테스트 데이터 시딩 및 Flutter 프론트엔드 배포"
tags: ["fallingo", "개발일지"]
author: "Su Ham"
lang: "ko"
---

# Fallingo 개발일지 - 2025-10-25 ~ 2025-10-27 (20개 커밋)

## 📝 이번 기간 작업 내용

### 배포 및 경로 수정 (3개 커밋)
- **GitHub Actions 테스트 워크플로우를 Poetry로 변경**: Poetry 전환
- **Load Balancer와 경로 충돌 해결 - /api prefix 제거**: 경로 충돌 해결
- **API 문서 경로를 /api prefix 안으로 이동**: 문서 경로 수정

### 테스트 데이터 시딩 (4개 커밋)
- **테스트 데이터 시딩 스크립트 추가**: 시딩 스크립트 작성
- **Add Cloud Shell one-click seeding guide**: Cloud Shell 가이드
- **Update seed_test_data.py to match production DB schema**: DB 스키마 매칭
- **Add Windows env vars and fix like_count field name**: Windows 지원

### API 게스트 접근 및 버그 수정 (7개 커밋)
- **Allow guest access to feed list/detail APIs**: 게스트 접근 허용
- **Add missing VisionService and DocumentAIService dependencies**: 의존성 추가
- **Add VisionService and DocumentAIService to FeedService facade**: Facade 수정
- **Map AI_SERVICES_API_KEY to GOOGLE_GEMINI_API_KEY**: API 키 매핑
- **Replace GOOGLE_GEMINI_API_KEY with AI_SERVICES_API_KEY**: API 키 교체
- **Add detailed error messages to feed API for troubleshooting**: 에러 메시지 추가
- **Add 'pending' to verification_status enum**: enum 수정

### Flutter 프론트엔드 배포 (6개 커밋)
- **Deploy real Flutter UI to Cloud Run** (10/27): Flutter UI 배포
- **Add README** (10/27): README 추가
- **Use GitHub Actions Docker build instead of Cloud Build**: Docker 빌드 전환
- **Remove Docker Buildx and simplify GCR auth**: GCR 인증 단순화
- **Use Artifact Registry instead of GCR**: Artifact Registry 전환
- **Update API URL to production domain (fallingo.app/api)**: 프로덕션 URL 설정

## 💡 작업 하이라이트

**테스트 데이터 시딩 시스템**

프로덕션 DB에 테스트 데이터를 투입하기 위한 **시딩 스크립트**를 작성했습니다. **Cloud Shell one-click seeding 가이드**를 추가하여 간편하게 테스트 데이터를 생성할 수 있도록 했습니다. Windows 환경변수 지원과 like_count 필드명 수정 등 세부 사항을 개선했습니다.

**API 게스트 접근 개선**

**피드 목록/상세 API를 게스트 접근 허용**으로 변경하여 로그인 없이도 피드를 볼 수 있게 했습니다. 이는 사용자 유입에 중요한 기능입니다.

FeedService Facade에 **VisionService와 DocumentAIService 의존성**을 추가하여 AI 기능을 통합했습니다. API 키 관리도 **GOOGLE_GEMINI_API_KEY → AI_SERVICES_API_KEY**로 표준화했습니다.

**Flutter 프론트엔드 프로덕션 배포**

10월 27일, **실제 Flutter UI를 Cloud Run에 배포**했습니다. GitHub Actions를 통한 Docker 빌드로 전환하고, **GCR에서 Artifact Registry**로 이동했습니다.

**API URL을 프로덕션 도메인(fallingo.app/api)**으로 설정하여 백엔드와 프론트엔드를 완전히 연동했습니다.

## 📊 개발 현황

- **테스트**: 시딩 스크립트, Cloud Shell 가이드
- **API**: 게스트 접근, AI 서비스 통합, API 키 표준화
- **프론트엔드**: Flutter UI Cloud Run 배포, Artifact Registry
- **인프라**: fallingo.app/api 프로덕션 URL

