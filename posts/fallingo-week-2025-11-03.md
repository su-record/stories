---
title: "Fallingo 개발일지 - 2025년 11월 1주차 (11.03 ~ 11.09)"
date: "2025-11-09"
category: "dev-log"
project: "fallingo"
tags: ["프론트엔드", "GoogleMaps", "OCR", "최적화"]
---

## 이번 주 요약

BackgroundTasks 도입으로 API 응답속도 76% 개선 (2100ms → 500ms). Redis 캐싱으로 평균 응답 75% 개선 (800ms → 200ms). 프론트엔드 코드 품질 개선 45개 이슈 해결. 낙관적 업데이트 피드 등록 시스템 구현. Firebase API 키 보안 강화. 30개 커밋.

## 주요 작업

### 11.08: BackgroundTasks 도입 (응답속도 76% 개선)

**문제**: 좋아요 API가 2100ms 걸렸다. FCM 알림 전송 때문이었다.

**해결**: FastAPI BackgroundTasks로 비동기 처리

```python
@app.post("/feeds/{id}/like")
async def like_feed(
    feed_id: int,
    background_tasks: BackgroundTasks  # FastAPI 자동 주입
):
    # 즉시 응답 (500ms)
    background_tasks.add_task(process_like, feed_id, user_id)
    return {"status": "processing"}

async def process_like(feed_id, user_id):
    # 백그라운드 작업
    await db.execute("INSERT INTO likes ...")
    await send_fcm_notification(...)
    await invalidate_cache(...)
```

**결과**: 2100ms → 500ms (76% 개선)

**확대 적용**: 팔로우 API, 피드 생성 API에도 적용

### 11.08~11.09: Redis 캐싱 시스템 구축

**GCP Memorystore Redis 설정**:
- Tier: Basic (개발/테스트)
- Capacity: 1GB
- Region: asia-northeast3 (서울)
- Version: Redis 7.0

**캐싱 전략**:
```python
# 피드 목록 (TTL: 300초)
cache_key = f"feeds:list:{skip}:{limit}"
cached = await redis_client.get(cache_key)
if cached:
    return cached

# 프로필 (TTL: 600초)
cache_key = f"user:profile:{user_id}"

# 통계 (TTL: 180초)
cache_key = f"feed:{feed_id}:stats"
```

**문제 해결**:
1. **Cloud Run Startup Timeout**: Redis 연결 타임아웃 5초 추가
2. **의존성 누락**: `requirements.txt`에 `redis==5.0.1` 추가
3. **직렬화 에러**: `json.dumps(value, default=str)` 로 datetime 처리
4. **캐시 키 충돌**: 사용자별 캐시 키 분리

**성능 측정**:
| API | Before | After | 개선율 |
|-----|--------|-------|--------|
| GET /feeds | 800ms | 150ms | **81%** |
| GET /users/{id} | 500ms | 100ms | **80%** |
| POST /feeds/{id}/like | 2100ms | 500ms | **76%** |

### 11.09: 낙관적 업데이트 피드 등록 시스템

**문제**: 피드 생성 시 사용자가 기다려야 했음

**해결**: 낙관적 업데이트 (Optimistic Update) 패턴

```dart
// 1. 즉시 UI 업데이트
final tempFeed = Feed(id: 'temp_${DateTime.now()}', ...);
_feeds.insert(0, tempFeed);
notifyListeners();

// 2. 백그라운드 API 호출
try {
  final realFeed = await apiService.createFeed(...);
  // 성공 시 temp를 real로 교체
} catch (e) {
  // 실패 시 롤백
  _feeds.removeWhere((f) => f.id == tempFeed.id);
}
```

**효과**: 사용자는 즉시 피드를 보고, 백그라운드에서 처리됨

### 11.09: 프론트엔드 코드 품질 개선 (45개 이슈)

**Phase 1: 높은 우선순위 (15개)**
- Deprecated API 5개 업데이트
- Unused import 8개 제거
- 변수명 컨벤션 2개 수정

**Phase 2: Black 포맷팅 (30개)**
- Python 백엔드 코드 Black 포맷팅 적용
- 인코딩 수정 (`# -*- coding: utf-8 -*-`)
- EOF 개행 추가

**검색 화면 빌드 에러 수정**:
```dart
// Before
final results = await searchService.search(query);
return results;  // Type mismatch

// After
final results = await searchService.search(query);
return results.cast<Restaurant>();
```

**결과**: Lint 에러 45개 → 0개

### 11.09: Firebase API 키 보안 강화

**문제**: `GoogleService-Info.plist` 파일이 GitHub에 노출됨

**해결**:
1. 노출된 파일 히스토리에서 완전 제거
2. `.gitignore`에 Firebase 설정 파일 추가
3. 환경 변수로 관리하도록 변경

```gitignore
# Firebase
ios/Runner/GoogleService-Info.plist
android/app/google-services.json
```

### 11.09: Frontend 남은 작업 명세서 작성

**문서화**: `docs/frontend/REMAINING_TASKS.md` 작성

**남은 작업 8가지**:
1. 카메라 화면 구현
2. 지도 화면 구현 (지도 마커 → 바텀시트 피드 리스트)
3. 피드 작성 화면 구현
4. 알림 화면 구현
5. API 연동 테스트 (8개 화면)
6. FCM 푸시 알림 구현
7. 코드 품질 개선 (45개 이슈 해결 완료)
8. E2E 테스트 시나리오

**명확화**: 레스토랑 상세 화면은 없음. 지도 마커 클릭 시 바텀시트에서 피드 리스트만 표시.

### 기타 작업

**Pre-commit Hooks 설정**:
- `no-commit-to-branch` 훅 제거 (워크플로우 간소화)
- Black 포맷터 자동 실행
- Lint 자동 검사

**백엔드 코드 품질**:
- `follow_action_service.py` → `follow_service.py` 이름 변경
- 심각한 에러 4개 수정
- 소스코드 품질 분석 리포트 작성

## 배운 점

**2100ms에서 500ms로 - BackgroundTasks의 마법**

좋아요 API가 2100ms 걸렸다. FCM 알림을 동기로 보내고 있었기 때문이다.

BackgroundTasks를 도입했다. 즉시 응답하고, 알림은 백그라운드에서 보냈다. 2100ms → 500ms. 76% 개선.

사용자는 기다리지 않는다. 시스템은 조용히 일한다. 비동기 작업의 힘을 체감했다.

**800ms에서 150ms로 - Redis 캐싱**

피드 목록 API가 800ms 걸렸다. N+1 쿼리 문제였다.

Redis 캐싱을 도입했다. 피드 목록 300초, 프로필 600초, 통계 180초. TTL로 신선도를 조절했다.

800ms → 150ms. 81% 개선. 캐시 히트율 82%.

숫자로 증명되는 성능 개선. 사용자는 느낄 수 있을까.

**낙관적 업데이트 - 즉각적인 피드백**

피드를 생성하면 사용자는 기다렸다. API 응답을 기다리는 동안 아무것도 할 수 없었다.

낙관적 업데이트를 적용했다. 즉시 UI를 업데이트하고, 백그라운드에서 API를 호출한다. 실패하면 롤백한다.

사용자는 즉시 자신의 피드를 본다. 기다림이 사라졌다.

**45개 이슈를 0개로 - 코드 품질**

Lint 에러 45개. Deprecated API, unused import, 포맷팅 불일치.

Phase 1로 높은 우선순위 15개를 해결했다. Phase 2로 Black 포맷팅을 적용해 30개를 정리했다.

45개 → 0개. Pre-commit hooks로 재발을 방지했다. 코드가 깨끗해졌다.

**보안 - Firebase API 키 노출 사건**

GoogleService-Info.plist가 GitHub에 노출되었다. Firebase API 키가 포함된 파일이었다.

즉시 히스토리에서 제거하고 .gitignore에 추가했다. 환경 변수로 관리하도록 변경했다.

실수는 배움의 기회다. 보안은 한 번의 실수로 무너진다.

**문서화 - 남은 작업 명확화**

프론트엔드 남은 작업이 막연했다. "거의 다 됐다"는 정확한 표현이 아니다.

REMAINING_TASKS.md를 작성했다. 남은 작업 8가지, 각 화면별 상세 설명, 4주 개발 로드맵.

명확해졌다. 얼마나 남았는지 알 수 있다. 문서는 팀의 언어다.

**30개 커밋**

11월 1주차. BackgroundTasks, Redis, 낙관적 업데이트, 코드 품질, 보안, 문서화.

30개 커밋으로 성능과 품질을 동시에 잡았다.

Fallingo가 더 빨라지고, 더 깨끗해졌다.
