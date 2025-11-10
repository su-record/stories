---
title: "Fallingo 개발일지 - 2025-09-04 ~ 2025-09-09 (20개 커밋)"
date: "2025-09-09"
category: "dev-log"
description: "Cloud Run 배포 문제 해결 및 단계별 통합 테스트"
tags: ["fallingo", "개발일지"]
author: "Su Ham"
lang: "ko"
---

# Fallingo 개발일지 - 2025-09-04 ~ 2025-09-09 (20개 커밋)

## 📝 이번 기간 작업 내용

### 백엔드 완성 및 프로덕션 준비 (4개 커밋)
- **SQLAlchemy 관계 설정 오류 완전 수정 및 회원가입 API 추가**: DB 관계 수정
- **Cloud Run 배포를 위한 포트 설정 수정**: 배포 설정
- **백엔드 완성도 최적화 및 프로덕션 준비 완료**: 프로덕션 준비
- **commit used backend changes; remove test files and pytest cache**: 테스트 파일 정리
- **prompt**: 일반 업데이트

### Cloud Run 배포 문제 해결 (5개 커밋)
- **Cloud Run 배포 실패 문제 완전 해결**: 배포 수정
- **Cloud Run PORT 환경변수 충돌 문제 해결**: PORT 충돌 해결
- **Cloud Run 컨테이너 시작 최적화 및 배포 안정성 개선**: 시작 최적화
- **간단한 FastAPI 앱으로 Cloud Run 배포 테스트**: 최소 앱 테스트

### 단계별 배포 테스트 (11개 커밋)
- **step1: 기본 FastAPI 구조 복원 테스트**: 1단계 테스트
- **step2: 데이터베이스 연결 추가 테스트**: 2단계 테스트
- **step3: 미들웨어 단계별 추가 테스트**: 3단계 테스트
- **단계별 배포 테스트**: 일반 테스트
- **TrustedHost 미들웨어에 Cloud Run 도메인 패턴 추가**: TrustedHost 수정
- **TrustedHost 미들웨어 '*' 호스트 패턴 제거**: 패턴 제거
- **claude**: 일반 업데이트
- **step4: Secret Manager 통합 테스트**: 4단계 테스트
- **Claude 설정 파일 동기화**: 설정 동기화
- **5단계 Startup Application 통합 완료**: 5단계 완료
- **6단계 기본 API 라우터 통합 완료**: 6단계 완료

## 💡 작업 하이라이트

**단계별 통합 테스트로 배포 안정화**

9월 4일, SQLAlchemy 관계 설정을 완전히 수정하고 회원가입 API를 추가하며 **"백엔드 완성도 최적화 및 프로덕션 준비 완료"**를 선언했습니다.

그러나 9월 8일~9일, Cloud Run 배포에서 **PORT 환경변수 충돌, 컨테이너 시작 실패** 등 다양한 문제가 발생했습니다. 문제를 근본적으로 해결하기 위해 **단계별 통합 테스트** 전략을 채택했습니다:

**Step 1**: 기본 FastAPI 구조 복원 ✅
**Step 2**: 데이터베이스 연결 추가 ✅
**Step 3**: 미들웨어 단계별 추가 ✅
**Step 4**: Secret Manager 통합 ✅
**Step 5**: Startup Application 통합 ✅
**Step 6**: 기본 API 라우터 통합 ✅

각 단계마다 배포 테스트를 진행하며 문제가 발생한 지점을 정확히 파악했습니다. 특히 **TrustedHost 미들웨어**의 Cloud Run 도메인 패턴 문제를 발견하고 해결했습니다.

## 📊 개발 현황

- **배포**: Cloud Run 단계별 통합 테스트 6단계 완료
- **인프라**: PORT 충돌, TrustedHost, Secret Manager 이슈 해결
- **API**: 회원가입 API 추가
- **전략**: 단계별 통합 테스트 방법론 확립

다음 마일스톤: 모든 API 라우터 통합 및 전체 기능 배포가 예상됩니다.
