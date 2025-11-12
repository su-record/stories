---
title: "fallingo 개발일지 - 2025-10-27 ~ 2025-10-28 (20개 커밋)"
date: "2025-10-28"
category: "dev-log"
description: "CORS 및 API 경로 문제 집중 해결"
tags: ["fallingo", "개발일지"]
author: "Su"
lang: "ko"
---

# fallingo 개발일지 - 2025-10-27 ~ 2025-10-28 (20개 커밋)

## 📝 이번 기간 작업 내용

### 프론트엔드 UI 개선 (4개 커밋)
- **Add assets/images/ to pubspec.yaml**: 이미지 에셋 추가
- **Always use production API URL and UI improvements**: 프로덕션 URL 고정
- **Update favicon and branding to fallingo logo**: fallingo 로고 적용
- **Remove CORS-blocked pravatar.cc avatar images**: CORS 차단 이미지 제거

### API 경로 수정 (8개 커밋)
- **Remove duplicate /api in API URLs**: 중복 /api 제거
- **Use correct API paths without /v1 prefix**: /v1 제거
- **Remove all /api/ prefixes from service endpoints**: /api prefix 전체 제거
- **Update frontend deployment to use API_BASE_URL env var**: 환경변수 사용
- **Add /api to API_BASE_URL in deployment**: /api 추가
- **Make API_BASE_URL environment variable required**: 필수 환경변수 설정
- **Support both /feeds and /feeds/ routes**: 양쪽 경로 지원
- **Remove empty path route and redirect_slashes=False**: 빈 경로 제거

### CORS 및 리다이렉트 문제 (8개 커밋)
- **Add production domains to CORS origins**: CORS 도메인 추가
- **Disable redirect_slashes to prevent CORS preflight errors**: redirect_slashes 비활성화
- **Redeploy frontend with fixed API_BASE_URL**: 프론트엔드 재배포
- **Add trailing slash automatically in Dio interceptor**: Dio 인터셉터 추가
- **Set redirect_slashes=False to prevent HTTP redirect**: redirect 방지
- **Use redirect_slashes=True with trailing slash auto-append**: redirect 활성화
- **Update Feed.fromJson() to match backend nested schema structure**: Feed 파싱 수정
- **Fix Feed parsing to match actual API response structure**: API 응답 구조 매칭

## 💡 작업 하이라이트

**API 경로 혼란 해결**

프론트엔드-백엔드 통합 과정에서 **API 경로 문제**가 복잡하게 얽혔습니다:
- /api 중복 제거
- /v1 prefix 제거
- /api prefix를 환경변수로 관리
- 양쪽 모두 제거 → 다시 /api 추가
- API_BASE_URL을 필수 환경변수로 설정

**8개의 연속 커밋**으로 API 경로를 안정화했습니다.

**CORS 및 trailing slash 문제**

**CORS preflight 에러**가 발생하며 여러 해결책을 시도했습니다:
1. 프로덕션 도메인을 CORS origins에 추가
2. redirect_slashes=False로 HTTP redirect 방지
3. Dio 인터셉터로 trailing slash 자동 추가
4. redirect_slashes=False 유지
5. redirect_slashes=True로 다시 전환

**/feeds와 /feeds/ 양쪽 경로를 지원**하도록 설정했습니다.

**Feed 파싱 수정**

백엔드 API 응답 구조가 **nested schema**인 것을 발견하고, **Feed.fromJson()을 수정**하여 실제 API 응답 구조와 매칭했습니다.

## 📊 개발 현황

- **API 경로**: API_BASE_URL 환경변수 관리, /v1 제거
- **CORS**: 프로덕션 도메인 추가, redirect_slashes 설정
- **파싱**: Feed 모델을 백엔드 응답 구조와 매칭
- **UI**: fallingo 로고, CORS 차단 이미지 제거

