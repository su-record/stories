---
title: "fallingo 개발일지 - 2025-10-28 ~ 2025-10-29 (20개 커밋)"
date: "2025-10-29"
category: "dev-log"
description: "Trailing slash 문제 해결 및 광고 시스템 구현"
tags: ["fallingo", "개발일지"]
author: "Su"
lang: "ko"
---

# fallingo 개발일지 - 2025-10-28 ~ 2025-10-29 (20개 커밋)

## 📝 이번 기간 작업 내용

### Trailing slash 문제 (8개 커밋)
- **Add null-safe parsing for createdAt field**: null-safe 파싱<br />
- **Add trailing slash to feeds API endpoint**: trailing slash 추가<br />
- **Remove trailing slash from all 1depth API endpoints**: 전체 제거<br />
- **Remove automatic trailing slash appending in Dio interceptor**: Dio 제거<br />
- **Remove trailing slash from feeds API endpoint**: feeds 제거<br />
- **Revert empty string routes to slash routes**: slash 복원<br />
- **Remove trailing slashes from all 1-depth API endpoints**: 1-depth 제거

### 관리자 및 데이터 모델 수정 (6개 커밋)
- **Add admin API endpoint for test data seeding**: 관리자 API<br />
- **Exclude admin seed endpoint from CSRF protection**: CSRF 제외<br />
- **Make restaurant address optional and fix verification score field**: 필드 수정<br />
- **Simplify Advertisement model to match API response**: Advertisement 단순화<br />
- **Remove Advertisement.content references from feed_screen**: content 제거<br />
- **Add missing fields to feed API response (user_interactions, location, profile_image_url)**: 필드 추가

### 신규 기능 구현 (6개 커밋)
- **dev**: 일반 개발<br />
- **Add realistic seed data script with Google Places API**: Google Places 시딩<br />
- **Add SEO optimization (robots.txt, sitemap.xml, meta tags)**: SEO 최적화<br />
- **Add ad system for feed (web + mobile ready)**: 광고 시스템<br />
- **피드 이미지 1:1 크롭 및 테스트 데이터 개선**: 이미지 크롭<br />
- **Update Flutter dependencies**: Flutter 업데이트<br />
- **피드 이미지 1:1 크롭 강화 및 스플래시 피드 프리로드**: 크롭 강화

## 💡 작업 하이라이트

**Trailing slash 지옥 탈출**

10월 28일, **trailing slash 문제**로 8개의 커밋을 작성했습니다:
1. feeds API에 trailing slash 추가
2. 모든 1-depth 엔드포인트에서 제거
3. Dio 인터셉터의 자동 추가 제거
4. feeds에서 다시 제거
5. empty string routes를 slash routes로 복원
6. 다시 모든 1-depth에서 제거

결론: **trailing slash를 완전히 제거**하고 표준화했습니다.

**광고 시스템 구현**

10월 29일, **피드 광고 시스템**을 구현했습니다. 웹과 모바일 모두 지원하는 광고 시스템으로, Advertisement 모델을 API 응답 구조에 맞게 단순화했습니다.

**SEO 최적화**

**robots.txt, sitemap.xml, meta tags**를 추가하여 SEO를 최적화했습니다. 검색 엔진 최적화는 서비스 성장에 중요한 요소입니다.

**Google Places API 시딩**

**Google Places API를 활용한 현실적인 시드 데이터 스크립트**를 작성했습니다. 관리자 API 엔드포인트를 추가하고 CSRF 보호에서 제외하여 편리하게 테스트 데이터를 생성할 수 있게 했습니다.

**피드 이미지 1:1 크롭**

피드 이미지를 1:1 비율로 크롭하여 일관된 UI를 제공하도록 개선했습니다. 스플래시 화면에서 **피드 프리로드**를 추가하여 UX를 향상시켰습니다.

## 📊 개발 현황

- **API**: trailing slash 표준화, 관리자 엔드포인트<br />
- **광고**: 웹+모바일 광고 시스템 구현<br />
- **SEO**: robots.txt, sitemap.xml, meta tags<br />
- **데이터**: Google Places API 시딩<br />
- **UI**: 1:1 이미지 크롭, 피드 프리로드

