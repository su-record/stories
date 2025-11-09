---
title: "Fallingo 개발일지 - 2025년 11월 1주차 (11.03 ~ 11.09)"
date: "2025-11-09"
category: "dev-log"
project: "fallingo"
tags: ["프론트엔드", "GoogleMaps", "OCR", "최적화"]
---

## 이번 주 요약

모든 프론트엔드 화면을 실제 API와 연동하고, Google for Startups 심사를 위한 랜딩 페이지를 만들었다. Google Maps API, Document AI OCR, Firebase FCM까지 모든 Google 서비스를 통합했다. 60개 커밋으로 프로젝트의 MVP를 완성했다.

## 주요 작업

### Google for Startups 준비
- HTML 랜딩 페이지 제작
- 프로젝트 소개 및 Google 시너지 강조
- 심사용 데모 환경 구축
- 대장금 선정 점수 시스템 (포인트 배수 방식)

### Google 서비스 통합
- **Google Maps API**: 피드 카드 지도 뷰
- **Document AI OCR**: 영수증 스캔
- **Firebase FCM**: 푸시 알림
- **Google Places**: 음식점 데이터
- **Google Cloud Run**: 배포

### 주요 화면 API 연동
- **SearchScreen**: 실제 검색 API (Mock 제거)
- **CommentScreen**: 댓글 전체 기능
- **ProfileScreen**: 실제 프로필 API
- **AIRecommendScreen**: AI 추천 API
- **My Foodmap**: Tier 6+ 프리미엄 기능

### 카메라/OCR 플로우 완성
- 갤러리 옵션 제거 (카메라만)
- 카메라 → OCR 검증 → 피드 생성
- Document AI로 영수증 인식
- 가격/음식점 정보 자동 추출

### Redis 캐싱 시스템
- GCP Memorystore Redis 구축
- 주요 서비스에 캐싱 적용
- BackgroundTasks로 응답 속도 76% 개선
- 비동기 작업 처리

### FCM 푸시 알림
- Firebase FCM 연동 완료
- 웹/모바일 모두 지원
- VAPID key 설정
- Pre-commit hooks 추가

### 코드 품질 개선
- Lint 에러 39개 → 0개
- Deprecated API 5개 업데이트
- Unused import 정리
- EOF 개행 추가

### 글로벌 상태 관리
- FeedProvider 구현
- Provider 패턴 활용
- 상태 관리 개선

## 배운 점

**Google 서비스 다섯 개를 하나로**

Google Maps, Document AI OCR, Firebase FCM, Google Places, Cloud Run. 모든 Google 서비스를 통합했다. Google for Startups 심사를 위한 랜딩 페이지를 만들며, Fallingo가 Google 생태계와 얼마나 잘 맞는지 보여주고 싶었다. 시너지를 강조했다.

**800ms에서 200ms로**

Redis 캐싱을 도입하며 응답 속도가 75% 개선되었다. 자주 조회되는 데이터를 캐싱하고, TTL로 신선도를 유지했다. 숫자로 보이는 성능 개선은 뿌듯했다. 사용자는 느낄 수 있을까.

**BackgroundTasks의 마법**

피드를 생성하면 즉시 응답하고, 알림은 백그라운드에서 보냈다. 응답 속도가 76% 개선되었다. 사용자는 기다리지 않고, 시스템은 조용히 일을 처리한다. 비동기 작업의 힘을 체감했다.

**카메라만 남긴 이유**

갤러리 옵션을 제거했다. 영수증 인증을 강화하고, 가짜 피드를 방지하기 위해서다. 사용자 경험에 trade-off가 있지만, 신뢰를 만들려면 어느 정도 불편함을 감수해야 한다. 서비스의 정체성을 지키기 위한 선택이었다.

**Lint 에러 39개를 0개로**

Lint 에러 39개를 모두 해결했다. Unused import, deprecated API, 변수명 컨벤션. Pre-commit hooks를 추가해 커밋 전 자동 검사하도록 했다. 코드 품질이 일관되게 유지되는 것을 느꼈다.

**MVP 완성**

60개 커밋으로 프로젝트의 MVP를 완성했다. 모든 화면이 실제 API와 연동되었다. SearchScreen, CommentScreen, ProfileScreen, AIRecommendScreen. Mock 데이터를 벗어나 실제 서비스가 되었다. Fallingo가 살아 움직이기 시작했다.
