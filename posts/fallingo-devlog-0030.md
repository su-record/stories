---
title: "Fallingo 개발일지 - 2025-11-06 ~ 2025-11-07 (20개 커밋)"
date: "2025-11-07"
category: "dev-log"
description: "전체 화면 API 연동 및 FCM 푸시 알림 구현"
tags: ["fallingo", "개발일지"]
author: "Su Ham"
lang: "ko"
---

# Fallingo 개발일지 - 2025-11-06 ~ 2025-11-07 (20개 커밋)

## 📝 이번 기간 작업 내용

### 화면 API 연동 (5개 커밋)
- **Enable Google Maps API integration for feed card map view** (11/6): Maps 통합
- **Integrate SearchScreen with real API (remove mock data)** (11/6): 검색 화면
- **Implement CommentScreen with full functionality** (11/6): 댓글 화면
- **Integrate ProfileScreen with real API** (11/6): 프로필 화면
- **Integrate AIRecommendScreen with real API** (11/6): AI 추천 화면

### FCM 푸시 알림 (6개 커밋)
- **Add Document AI OCR integration for receipt scanning** (11/7): OCR 통합
- **Add pre-commit hooks for code quality** (11/7): pre-commit 훅
- **Add FCM push notification service** (11/7): FCM 서비스
- **Add VAPID_PUBLIC_KEY environment variable for FCM web** (11/7): VAPID 키
- **Firebase FCM 연동 완료** (11/7): FCM 완료
- **Merge branch 'feature/fcm-integration'** (11/7): FCM 병합

### PR 및 코드 품질 (9개 커밋)
- **Add comprehensive PR description for frontend development** (11/7): PR 문서화
- **Merge pull request #2**: PR 병합
- **mail** (11/7): 메일 업데이트
- **dev config** (11/7): 개발 설정
- **린트 에러 수정 (39개 → 0개)** (11/7): 린트 수정
- **privacy_policy_widget_example.dart → .dart.example** (11/7): 파일명 수정
- **EOF 개행 추가** (11/7): EOF 개행
- **코드 품질 개선 (Unused 정리)** (11/7): Unused 정리
- **Deprecated API 업데이트 (5개)** (11/7): Deprecated 수정

## 💡 작업 하이라이트

**전체 화면 API 연동 완료**

11월 6일, 모든 Mock 데이터를 제거하고 **실제 API와 연동**했습니다:
- **SearchScreen**: 실시간 검색 API
- **CommentScreen**: 댓글 CRUD 전체 기능
- **ProfileScreen**: 사용자 프로필 API
- **AIRecommendScreen**: AI 추천 API

이제 Fallingo 프론트엔드는 **100% 실제 데이터**로 작동합니다.

**FCM 푸시 알림 시스템**

11월 7일, **Firebase Cloud Messaging (FCM) 푸시 알림**을 구현했습니다:
- FCM 서비스 추가
- VAPID_PUBLIC_KEY 환경변수 (웹 지원)
- feature/fcm-integration 브랜치에서 작업 후 병합

**Document AI OCR** 영수증 스캔 통합도 완료하여 멀티모달 검증 시스템을 구축했습니다.

**코드 품질 대폭 개선**

11월 7일, **5개의 리팩토링 커밋**으로 코드 품질을 개선했습니다:
1. **린트 에러 39개 → 0개**: 완전 해결
2. privacy_policy_widget 파일명 수정
3. EOF 개행 추가
4. Unused 코드 정리
5. **Deprecated API 5개 업데이트**

**pre-commit hooks**를 추가하여 앞으로 코드 품질이 자동으로 관리됩니다.

## 📊 개발 현황

- **화면**: Search, Comment, Profile, AI Recommend 100% API 연동
- **푸시 알림**: FCM 완전 구현 (모바일 + 웹)
- **OCR**: Document AI 영수증 스캔
- **코드 품질**: 린트 0개, Deprecated 0개, pre-commit 훅
- **PR**: #2 병합 완료

다음 마일스톤: 전체 기능 통합 테스트 및 출시 준비가 예상됩니다.
