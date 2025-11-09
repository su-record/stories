---
title: "Fallingo 개발일지 - 2025년 10월 4주차 (10.27 ~ 11.02)"
date: "2025-11-02"
category: "dev-log"
project: "fallingo"
tags: ["Flutter", "프론트엔드", "SEO", "광고"]
---

## 이번 주 요약

드디어 실제 Flutter UI를 프로덕션에 배포했다. Google Places API를 활용한 현실적인 테스트 데이터, SEO 최적화, 광고 시스템까지 완성했다. 54개 커밋, 그중 25개가 버그 수정. CORS, URL 경로, API 연동 등 프론트엔드-백엔드 통합의 어려움을 체감했다.

## 주요 작업

### Flutter UI 프로덕션 배포
- 실제 UI를 Cloud Run에 배포
- Fallingo 로고로 브랜딩 업데이트
- 프로덕션 도메인 (fallingo.app) 연결
- 프론트엔드 README 작성

### 현실적인 테스트 데이터
- Google Places API 연동
- 실제 음식점 데이터 수집
- 위치 기반 샘플 데이터
- Admin API 시딩 엔드포인트 추가

### SEO 최적화
- robots.txt 추가
- sitemap.xml 생성
- meta tags 최적화
- 검색 엔진 최적화

### 광고 시스템 완성
- 피드 사이 광고 삽입
- 웹/모바일 모두 지원
- AdMob/AdSense 준비 완료

### 이메일 화이트리스트
- 초기 테스터 관리
- 특정 이메일만 가입 허용
- 베타 테스트 준비

### API URL 최종 정리
- 프로덕션 도메인으로 통일
- `/api` 경로 정리
- CORS 설정 수정
- Trailing slash 처리

## 배운 점

**CORS와의 끝없는 싸움**

CORS는 언제나 까다롭다. 프로덕션 도메인, 와일드카드, Preflight 요청. 하나씩 추가하며 해결했지만, 여전히 예상치 못한 문제가 생긴다. 백엔드와 프론트엔드가 대화하려면 CORS를 넘어야 한다.

**Trailing Slash의 함정**

FastAPI는 `/feeds`와 `/feeds/`를 다르게 본다. 자동 리다이렉트가 CORS preflight와 충돌했다. 모든 1depth API는 slash 없이 통일하기로 했다. 작은 디테일이 큰 문제를 만든다.

**/api/api/feeds의 실수**

환경변수에 `/api`를 포함시켰는데, 클라이언트 코드에서 `/api/feeds`를 추가하며 `/api/api/feeds`가 되었다. 웃긴 실수지만 찾는 데 시간이 걸렸다. URL 경로 관리는 신중해야 한다.

**Google Places로 현실감 더하기**

Google Places API로 실제 음식점 데이터를 수집했다. 위치, 주소, 전화번호. 테스트 데이터가 현실적이니 개발하는 맛이 났다. 하지만 API 비용을 주의해야 한다.

**54개 커밋, 25개 버그**

드디어 Flutter UI를 프로덕션에 배포했다. 54개 커밋 중 25개가 버그 수정이었다. CORS, URL 경로, API 연동. 프론트엔드와 백엔드를 통합하는 것은 여전히 어렵다. 하지만 fallingo.app에 접속하면 실제 UI가 보인다.
