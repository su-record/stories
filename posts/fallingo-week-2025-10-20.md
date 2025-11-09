---
title: "Fallingo 개발일지 - 2025년 10월 3주차 (10.20 ~ 10.26)"
date: "2025-10-26"
category: "dev-log"
project: "fallingo"
tags: ["배포", "Docker", "CI/CD", "문서화"]
---

## 이번 주 요약

가장 바쁜 주(92개 커밋). 프로덕션 배포 파이프라인을 완성하고, 법률 문서 다국어 API, Android 인증 설정을 마무리했다. Poetry에서 Docker로, GitHub Actions에서 Cloud Build로, 그리고 다시 Docker로. 시행착오가 많았지만 최종적으로 안정적인 배포 시스템을 구축했다.

## 주요 작업

### 프로덕션 Dockerfile 완성
- Multi-stage build 적용
- Poetry → Docker 직접 빌드로 변경
- 이미지 크기 최적화
- 빌드 시간 단축

### 배포 워크플로우 개선
- Cloud Build 시도 → Docker 직접 빌드로 회귀
- GitHub Actions 최적화
- 환경변수 관리 개선
- 시크릿 관리 강화

### 법률 문서 다국어 API
- 이용약관, 개인정보처리방침
- 한국어/영어 지원
- 버전 관리 시스템
- API 엔드포인트 완성

### Android 인증 설정
- Firebase Android SDK 연동
- SHA-1 fingerprint 등록
- Google Play 콘솔 설정
- OAuth 클라이언트 ID 발급

### 코드 품질 관리
- spec-kit 도입
- 17개 도메인 스펙 생성
- 자동 문서 생성 시스템
- NO TODO 정책 (완전한 스펙)

### API 구조 개선
- `/v1` 경로 제거 (단순화)
- API_V1_PREFIX → API_PREFIX
- Follow 서비스 Facade 패턴 적용 (999 → 208 lines)
- 코드 가독성 향상

### 테스트 데이터 시딩
- 시딩 스크립트 추가
- 개발/테스트 환경 데이터
- 현실적인 샘플 데이터

## 배운 점

**Poetry를 포기한 날**

Poetry는 로컬 개발에 좋았지만, Docker와 궁합이 안 좋았다. poetry.lock 관리 문제, 빌드 캐싱 비효율. 결국 requirements.txt로 돌아갔다. 새로운 도구가 항상 좋은 것은 아니다. 때로는 전통적인 방법이 더 안정적이다.

**Cloud Build의 유혹과 포기**

Cloud Build는 GCP 네이티브라 좋아 보였다. 하지만 설정이 복잡하고 디버깅이 어려웠다. Docker 직접 빌드가 더 단순하고 안정적이었다. 화려한 것보다 단순한 것이 좋을 때가 있다.

**Multi-stage build의 마법**

Multi-stage build로 이미지 크기를 50% 줄였다. 빌드 도구는 제외하고, 런타임만 포함시켰다. 보안도 향상되었다. Dockerfile 몇 줄로 이런 효과를 낼 수 있다는 것이 신기했다.

**999줄에서 208줄로**

Follow 서비스를 Facade 패턴으로 리팩토링했다. 999줄이 208줄로, 79% 감소했다. 복잡한 로직을 서비스 레이어로 분리하니 API 레이어가 단순해졌다. 코드를 읽는 것이 편해졌다.

**92개 커밋, 44개 버그**

가장 바쁜 주였다. 92개 커밋 중 44개가 버그 수정이었다. Poetry.lock, Cloud Build, Dockerfile, 환경변수. 배포는 역시 어렵다. 하지만 하나씩 해결하며 안정적인 시스템을 만들어가고 있다.
