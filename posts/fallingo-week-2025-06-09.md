---
title: "Fallingo 개발일지 - 2025년 6월 2주차 (06.09 ~ 06.15)"
date: "2025-06-15"
category: "dev-log"
project: "fallingo"
tags: ["시스템설계", "백엔드", "개발가이드"]
---

## 이번 주 요약

본격적인 개발이 시작되었다. Fallingo의 기술 아키텍처를 설계하고 개발 가이드 문서를 작성했다. Phase 0부터 Phase 2까지 단계별로 구현하면서 프로젝트의 기반을 다졌다. 프로젝트 구조, 환경 설정, 기본 API 엔드포인트까지 완성했다.

## 주요 작업

### 프로젝트 재시작 (6/13)
Fallingo로 완전히 넘어와서 프로젝트를 재시작했다.
- 개발 문서 업데이트
- 기술 스택 재정리
- 프로젝트 구조 확정

### 개발 가이드 문서 작성 (6/14)
체계적인 개발을 위해 Part 0 개발 가이드를 작성했다.
- 환경 설정 가이드
- 프로젝트 구조 설계
- 코딩 컨벤션 정의
- Git 워크플로우 설정

### Phase 0: 프로젝트 초기 설정 완료 (6/14)
**백엔드 구조**
```
backend/
├── app/
│   ├── main.py          # FastAPI 앱
│   ├── models/          # 데이터 모델
│   ├── routes/          # API 라우터
│   ├── services/        # 비즈니스 로직
│   └── config.py        # 설정
├── requirements.txt
└── README.md
```

**프론트엔드 구조**
```
frontend/
├── lib/
│   ├── main.dart
│   ├── models/
│   ├── screens/
│   ├── services/
│   └── widgets/
└── pubspec.yaml
```

### Phase 1: 시스템 설계 완료 (6/14)
**데이터베이스 스키마 설계**
- User (사용자)
- Feed (음식 피드)
- Restaurant (음식점)
- Menu (메뉴)
- Follow (팔로우)
- Point (포인트)
- Tier (등급)

**API 엔드포인트 설계**
- 인증: /auth/login, /auth/signup
- 피드: /feeds, /feeds/{id}
- 사용자: /users/{id}
- 음식점: /restaurants
- 팔로우: /follows

### Phase 2: 기본 API 구현 (6/15)
FastAPI 기반 백엔드 서버 구축을 시작했다.

**주요 모델 정의**
```python
class User(BaseModel):
    id: str
    username: str
    email: str
    tier: int
    points: int

class Feed(BaseModel):
    id: str
    user_id: str
    restaurant_id: str
    image_url: str
    description: str
    location: dict
```

**기본 엔드포인트 구현**
- GET /api/health (헬스체크)
- POST /api/auth/signup (회원가입)
- POST /api/auth/login (로그인)
- GET /api/feeds (피드 목록)

### 개발 문서 업데이트 (6/15)
개발 진행 상황을 문서화했다.
- 개발_진행_로드맵.md 작성
- 프롬프트 업데이트 (Claude와의 협업 최적화)
- 프로젝트 지식 문서 정리

## 기술 스택 변경사항

### Flask → FastAPI
초기에는 Flask를 고려했지만 FastAPI로 변경했다.

**FastAPI 선택 이유**
- 자동 API 문서 생성 (Swagger UI)
- 타입 힌트 기반 검증
- 비동기 처리 지원
- 더 빠른 성능
- 현대적인 Python 개발 방식

### PostgreSQL + PostGIS
위치 기반 서비스를 위해 PostGIS를 추가했다.
- 공간 데이터 저장 및 검색
- 반경 기반 쿼리 (ST_DWithin)
- 효율적인 위치 인덱싱

## 배운 점

**Phase라는 이정표**

대규모 프로젝트를 한 번에 만들려다 길을 잃었던 경험이 있다. 이번에는 Phase로 나눴다. Phase 0부터 2까지, 각 단계마다 테스트 가능한 결과물이 나왔다. 진행 상황이 보이니 안심이 되었다. 아직 갈 길은 멀지만, 방향은 맞다는 확신이 들었다.

**문서가 만드는 리듬**

개발 가이드를 먼저 작성하고 나서 코드를 짰다. 문서를 쓰는 동안 프로젝트 구조가 머릿속에서 정리되었다. 코드를 작성할 때는 헤매지 않았다. 일관성도 자연스럽게 유지되었다. 문서 우선 개발의 리듬이 몸에 배기 시작했다.

**타입이 잡아주는 것들**

FastAPI의 Pydantic 모델을 사용하면서 타입 안정성을 체감했다. 런타임 오류가 줄어들고, IDE가 자동완성을 정확하게 해줬다. 타입 하나로 수많은 버그를 예방할 수 있다는 것을 알았다.

**PostGIS와의 첫 만남**

위치 기반 서비스를 만들기 위해 PostGIS를 공부했다. 일반 데이터베이스로는 복잡한 공간 쿼리를, PostGIS는 간단하게 처리했다. 반경 500m 내 음식점 찾기, 거리 계산, 공간 인덱싱. 강력한 도구를 만났다는 생각이 들었다.
