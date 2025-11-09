---
title: "Fallingo 개발일지 - 2025년 8월 2주차 (08.11 ~ 08.17)"
date: "2025-08-17"
category: "dev-log"
project: "fallingo"
tags: ["인증", "백엔드", "아키텍처", "GCP"]
---

## 이번 주 요약

가장 많은 커밋(94개)과 가장 많은 버그 수정(47개)이 있었던 주. Identity Platform 인증 시스템을 구현하고, 백엔드 아키텍처를 전면 개선했다. Feed, Restaurant, User API를 모두 완성했다. Redis를 비활성화하고 비용 최적화도 진행했다.

## 주요 작업

### Identity Platform 인증 시스템
- GCP Identity Platform 연동 완료
- JWT 토큰 기반 인증 구현
- OAuth 소셜 로그인 연동 (Google, Apple)
- 인증 미들웨어 구현

### 핵심 API 완성
- **User API**: 회원가입, 프로필, 설정
- **Feed API**: 피드 생성/조회/수정/삭제, 좋아요, 댓글
- **Restaurant API**: 음식점 정보, 위치 기반 검색
- FastAPI 자동 문서화 (Swagger UI)

### 백엔드 아키텍처 개선
- Cloud SQL Proxy 설정 최적화
- 환경변수 관리 체계화
- 데이터베이스 세션 관리 개선
- Secret 관리 (JWT secret key)

### 코드 품질 관리
- .gitignore 통합 및 정리
- 스크립트 폴더 구조화
- pytest 설정 개선
- 테스트 환경 설정

## 배운 점

**Identity Platform의 복잡함**

Identity Platform은 엔터프라이즈급 기능을 제공하지만, 초기 설정이 복잡했다. JWT 검증 로직을 직접 구현해야 했고, 토큰 갱신 전략도 고민해야 했다. Firebase Auth보다 강력하지만, 그만큼 배워야 할 것도 많았다.

**Redis를 포기한 이유**

캐싱을 위해 Redis를 고려했지만, GCP Memorystore는 최소 월 50달러였다. 초기에는 캐싱이 필요 없을 수도 있다는 판단이 들었다. PostgreSQL 쿼리 최적화만으로도 충분할 것 같았다. 필요하면 나중에 추가할 수 있다. 비용과 필요성 사이에서 균형을 찾았다.

**47개의 버그**

94개 커밋 중 47개가 버그 수정이었다. 패키지 의존성 문제, 환경변수 누락, import 이름 오류, pyproject.toml 중복 필드. 대부분이 통합 과정에서 발생했다. 각 기능은 잘 동작하는데, 합치면 문제가 생기는 경험. 통합의 어려움을 체감했다.

**리팩토링의 타이밍**

9개의 리팩토링 커밋이 있었다. 코드가 빠르게 복잡해지는 것을 느꼈다. 초기부터 구조를 잘 잡는 것이 중요하다는 것을 다시 배웠다. 리팩토링은 필요하지만, 처음부터 잘 설계하면 리팩토링을 줄일 수 있다.
