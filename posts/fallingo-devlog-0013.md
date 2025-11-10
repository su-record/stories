---
title: "Fallingo 개발일지 - 2025-08-12 (20개 커밋)"
date: "2025-08-12"
category: "dev-log"
description: "Python 버전 시행착오 및 Cloud Run 배포 안정화"
tags: ["fallingo", "개발일지"]
author: "Su Ham"
lang: "ko"
---

# Fallingo 개발일지 - 2025-08-12 (20개 커밋)

## 📝 이번 기간 작업 내용

### Python 버전 시행착오 (7개 커밋)
- **Update to Python 3.13.6 (latest stable)**: 3.13.6 업그레이드
- **Regenerate requirements.txt for Python 3.13 compatibility**: 의존성 재생성
- **Update GitHub Actions to properly install dependencies for Python 3.13.6**: CI/CD 수정
- **Downgrade to Python 3.12 for better compatibility**: 3.12로 다운그레이드
- **Use requirements.txt directly in Dockerfile instead of Poetry**: Poetry → requirements.txt
- **Add email-validator dependency for Pydantic email validation**: 의존성 추가
- **Update to Python 3.13.6 with Poetry support**: 다시 3.13.6 + Poetry
- **Remove --with dev flag from Poetry install**: Poetry 설정 수정

### Cloud Run 배포 개선 (9개 커밋)
- **Update Dockerfile to use PORT environment variable for Cloud Run**: PORT 환경변수 추가
- **Update Dockerfile to properly handle PORT environment variable**: PORT 처리 개선
- **Simplify Dockerfile and add dedicated startup script for Cloud Run**: 시작 스크립트 추가
- **Use PORT environment variable for Cloud Run deployment**: PORT 사용
- **Simplify backend for Cloud Run deployment**: 백엔드 단순화
- **Update logging to use simplified config**: 로깅 설정 단순화
- **모든 모듈을 config_simple 사용하도록 변경**: 전체 모듈 config 변경
- **Cloud Run URL을 TrustedHostMiddleware에 추가**: 신뢰 호스트 추가
- **원래 config.py 사용하도록 복구 및 환경 변수 수정**: config 복구

### 보안 및 설정 개선 (4개 커밋)
- **SECRET_KEY를 JWT_SECRET_KEY로 수정**: 환경변수명 명확화
- **secret_key를 jwt_secret_key로 명확하게 변경**: 코드 명확화
- **psycopg2-binary 패키지 추가**: PostgreSQL 드라이버 추가

## 💡 작업 하이라이트

**Python 버전 선택과 Cloud Run 최적화**

Python 3.13.6으로 업그레이드했다가 호환성 문제로 **Python 3.12로 다운그레이드**, 그러다 다시 **Python 3.13.6**으로 돌아오는 과정을 거쳤습니다. Poetry와 requirements.txt 사이에서도 고민하며 최적의 의존성 관리 방식을 찾았습니다.

Cloud Run 배포를 위해 **PORT 환경변수** 처리를 개선하고, Dockerfile을 단순화했으며, **TrustedHostMiddleware**에 Cloud Run URL을 추가하여 보안을 강화했습니다. config.py를 config_simple로 변경했다가 다시 원래대로 복구하는 과정에서 최적의 설정을 찾았습니다.

**SECRET_KEY → JWT_SECRET_KEY** 리네이밍으로 환경변수의 용도를 명확히 했으며, psycopg2-binary를 추가하여 PostgreSQL 연결을 안정화했습니다.

## 📊 개발 현황

- **Python**: 3.13.6 (최종 선택)
- **배포**: Cloud Run PORT 환경변수 처리 완료
- **보안**: JWT_SECRET_KEY 명확화, TrustedHost 설정
- **DB**: psycopg2-binary 추가

