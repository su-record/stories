---
title: "[기술 심화] Redis 캐싱으로 API 응답속도 76% 개선하기 - 실전 최적화 가이드"
date: "2025-11-10"
category: "tech"
description: "GCP Memorystore Redis를 활용한 FastAPI 백엔드 성능 최적화. 실제 성능 측정 데이터와 함께하는 캐싱 전략 완벽 가이드"
tags: ["fallingo", "redis", "caching", "performance", "fastapi", "gcp", "optimization", "technical"]
author: "Su"
lang: "ko"
---

# [기술 심화] Redis 캐싱으로 API 응답속도 76% 개선하기

## 들어가며

지난주 fallingo 백엔드에 Redis 캐싱을 적용하면서 **API 응답속도를 76%나 개선**했습니다.

이번 글에서는 단순히 "Redis를 적용했다"는 이야기가 아니라:
- 왜 Redis를 선택했는지
- 어떻게 구현했는지
- 실제 성능이 얼마나 나왔는지
- 어떤 문제를 겪고 해결했는지

**실전 경험**을 상세히 공유해보려고 합니다.

## 문제 상황: 느린 API 응답 속도

### Before: Redis 적용 전

fallingo 백엔드 API들의 평균 응답 시간:

```
GET /feeds        : 800ms (피드 목록 조회)
GET /users/{id}   : 500ms (프로필 조회)
GET /follows      : 600ms (팔로우 목록)
GET /stats        : 400ms (통계 조회)
POST /feeds/{id}/like : 2100ms (좋아요)
```

특히 피드 목록 조회가 느렸습니다. 왜냐하면:

```python
@app.get("/feeds")
async def get_feeds(skip: int = 0, limit: int = 20):
    # 1. 피드 목록 조회 (300ms)
    feeds = await db.execute(
        "SELECT * FROM feeds ORDER BY created_at DESC LIMIT $1 OFFSET $2",
        limit, skip
    )

    # 2. 각 피드마다 작성자 정보 조회 (200ms)
    for feed in feeds:
        feed.author = await db.fetchone(
            "SELECT * FROM users WHERE id = $1",
            feed.author_id
        )

    # 3. 각 피드마다 좋아요 수 조회 (200ms)
    for feed in feeds:
        feed.likes_count = await db.fetchone(
            "SELECT COUNT(*) FROM likes WHERE feed_id = $1",
            feed.id
        )

    # 4. 각 피드마다 댓글 수 조회 (100ms)
    for feed in feeds:
        feed.comments_count = await db.fetchone(
            "SELECT COUNT(*) FROM comments WHERE feed_id = $1",
            feed.id
        )

    return feeds  # 총 800ms
```

**N+1 쿼리 문제**가 심각했습니다. 피드 20개 조회하면 60개 이상의 쿼리가 발생했습니다.

### 해결 방안 검토

여러 방법을 고민했습니다:

**1) JOIN으로 쿼리 최적화**
```sql
SELECT f.*, u.*, COUNT(l.id) as likes, COUNT(c.id) as comments
FROM feeds f
LEFT JOIN users u ON f.author_id = u.id
LEFT JOIN likes l ON f.id = l.feed_id
LEFT JOIN comments c ON f.id = c.feed_id
GROUP BY f.id, u.id
```

장점: 단일 쿼리로 해결
단점: 복잡한 JOIN, 여전히 매번 DB 조회

**2) Materialized View**
```sql
CREATE MATERIALIZED VIEW feed_view AS ...
```

장점: 미리 계산된 결과
단점: 업데이트 타이밍 문제, 실시간성 부족

**3) Redis 캐싱**
```python
# 캐시 확인
cached = await redis.get(f"feed:{feed_id}")
if cached:
    return cached

# 없으면 DB 조회 후 캐싱
data = await db.fetch(...)
await redis.setex(f"feed:{feed_id}", 300, data)
return data
```

장점: 빠른 응답, 유연한 TTL 설정, 실시간 무효화 가능
단점: 캐시 관리 복잡도 증가

**결론: Redis 캐싱을 선택했습니다!**

이유는:
- Google for Startups Cloud Program으로 GCP Memorystore Redis 무료 사용이 가능했습니다
- 실시간성이 중요한 피드 서비스에 적합했습니다
- TTL로 자동 만료가 가능합니다
- 필요시 즉시 무효화가 가능합니다

## Redis 캐싱 시스템 구축

### 1. GCP Memorystore Redis 인스턴스 생성

```bash
# GCP Console에서 Redis 인스턴스 생성
# Tier: Basic (개발/테스트용)
# Capacity: 1GB
# Region: asia-northeast3 (서울)
# Version: Redis 7.0
```

### 2. FastAPI에 Redis 클라이언트 설정

```python
# config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    REDIS_HOST: str = "10.0.0.3"  # GCP Memorystore 내부 IP
    REDIS_PORT: int = 6379
    REDIS_SOCKET_TIMEOUT: int = 5
    REDIS_SOCKET_CONNECT_TIMEOUT: int = 5

settings = Settings()
```

```python
# redis_client.py
import redis
import json
from typing import Optional, Any

class RedisClient:
    def __init__(self):
        try:
            self.client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                decode_responses=True,
                socket_connect_timeout=settings.REDIS_SOCKET_CONNECT_TIMEOUT,
                socket_timeout=settings.REDIS_SOCKET_TIMEOUT
            )
            # 연결 테스트
            self.client.ping()
            self.available = True
        except Exception as e:
            print(f"Redis connection failed: {e}")
            self.client = None
            self.available = False

    async def get(self, key: str) -> Optional[Any]:
        """캐시 조회"""
        if not self.available:
            return None

        try:
            value = self.client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            print(f"Redis GET error: {e}")
            return None

    async def setex(self, key: str, ttl: int, value: Any) -> bool:
        """캐시 저장 (TTL 포함)"""
        if not self.available:
            return False

        try:
            self.client.setex(
                key,
                ttl,
                json.dumps(value, default=str)
            )
            return True
        except Exception as e:
            print(f"Redis SETEX error: {e}")
            return False

    async def delete(self, *keys: str) -> bool:
        """캐시 삭제"""
        if not self.available:
            return False

        try:
            self.client.delete(*keys)
            return True
        except Exception as e:
            print(f"Redis DELETE error: {e}")
            return False

redis_client = RedisClient()
```

**핵심 포인트**:
- **타임아웃 설정**: Cloud Run에서 startup timeout 방지
- **연결 실패 처리**: Redis 없이도 서비스 정상 동작 (Fallback)
- **JSON 직렬화**: Python 객체를 문자열로 변환

### 3. 서비스별 캐싱 전략

#### 3.1 피드 목록 캐싱 (TTL: 300초)

```python
# services/feed_service.py
async def get_feeds(skip: int = 0, limit: int = 20) -> list:
    # 캐시 키 생성
    cache_key = f"feeds:list:{skip}:{limit}"

    # 캐시 조회
    cached = await redis_client.get(cache_key)
    if cached:
        return cached

    # DB 조회
    feeds = await db.execute(
        """
        SELECT f.*, u.username, u.profile_image,
               COUNT(DISTINCT l.id) as likes_count,
               COUNT(DISTINCT c.id) as comments_count
        FROM feeds f
        LEFT JOIN users u ON f.author_id = u.id
        LEFT JOIN likes l ON f.id = l.feed_id
        LEFT JOIN comments c ON f.id = c.feed_id
        GROUP BY f.id, u.id
        ORDER BY f.created_at DESC
        LIMIT $1 OFFSET $2
        """,
        limit, skip
    )

    # 결과를 캐시에 저장 (5분)
    await redis_client.setex(cache_key, 300, feeds)

    return feeds
```

**왜 300초?**
- 피드는 자주 업데이트되지만, 실시간이 아니어도 괜찮습니다
- 5분 정도는 허용 가능한 지연입니다
- 너무 짧으면 캐시 효과 감소, 너무 길면 오래된 데이터가 됩니다

#### 3.2 사용자 프로필 캐싱 (TTL: 600초)

```python
async def get_user_profile(user_id: int) -> dict:
    cache_key = f"user:profile:{user_id}"

    cached = await redis_client.get(cache_key)
    if cached:
        return cached

    profile = await db.fetchone(
        """
        SELECT u.*,
               COUNT(DISTINCT f.id) as feeds_count,
               COUNT(DISTINCT followers.id) as followers_count,
               COUNT(DISTINCT following.id) as following_count
        FROM users u
        LEFT JOIN feeds f ON u.id = f.author_id
        LEFT JOIN follows followers ON u.id = followers.following_id
        LEFT JOIN follows following ON u.id = following.follower_id
        WHERE u.id = $1
        GROUP BY u.id
        """,
        user_id
    )

    # 10분 캐싱
    await redis_client.setex(cache_key, 600, profile)

    return profile
```

**왜 600초?**
- 프로필은 자주 변경되지 않습니다
- 팔로워 수 등은 약간의 지연을 허용할 수 있습니다
- 더 긴 TTL로 캐시 효율을 극대화했습니다

#### 3.3 팔로우 관계 캐싱 (TTL: 300초)

```python
async def get_following_list(user_id: int) -> list:
    cache_key = f"user:{user_id}:following"

    cached = await redis_client.get(cache_key)
    if cached:
        return cached

    following = await db.execute(
        """
        SELECT u.* FROM users u
        INNER JOIN follows f ON u.id = f.following_id
        WHERE f.follower_id = $1
        """,
        user_id
    )

    await redis_client.setex(cache_key, 300, following)

    return following
```

#### 3.4 통계 데이터 캐싱 (TTL: 180초)

```python
async def get_feed_stats(feed_id: int) -> dict:
    cache_key = f"feed:{feed_id}:stats"

    cached = await redis_client.get(cache_key)
    if cached:
        return cached

    stats = {
        "likes_count": await db.fetchone(
            "SELECT COUNT(*) FROM likes WHERE feed_id = $1", feed_id
        ),
        "comments_count": await db.fetchone(
            "SELECT COUNT(*) FROM comments WHERE feed_id = $1", feed_id
        ),
        "views_count": await db.fetchone(
            "SELECT view_count FROM feeds WHERE id = $1", feed_id
        )
    }

    # 3분 캐싱
    await redis_client.setex(cache_key, 180, stats)

    return stats
```

**왜 180초?**
- 통계는 실시간성이 더 중요합니다
- 좋아요/댓글이 빠르게 변하기 때문입니다
- 짧은 TTL로 최신성을 유지합니다

### 4. 캐시 무효화 전략

데이터가 변경되면 즉시 캐시를 삭제해야 합니다.

#### 4.1 피드 생성 시

```python
@app.post("/feeds")
async def create_feed(
    content: str,
    user_id: int = Depends(get_current_user),
    background_tasks: BackgroundTasks = None
):
    # 피드 생성
    feed = await db.execute(
        "INSERT INTO feeds (author_id, content) VALUES ($1, $2) RETURNING *",
        user_id, content
    )

    # 백그라운드에서 캐시 무효화
    background_tasks.add_task(
        invalidate_feed_caches,
        user_id
    )

    return feed

async def invalidate_feed_caches(user_id: int):
    """피드 관련 캐시 무효화"""
    # 피드 목록 캐시 삭제 (모든 페이지)
    pattern = "feeds:list:*"
    # Redis SCAN으로 패턴 매칭 키 찾기
    keys = []
    for key in redis_client.client.scan_iter(pattern):
        keys.append(key)

    if keys:
        await redis_client.delete(*keys)

    # 작성자 프로필 캐시 삭제
    await redis_client.delete(f"user:profile:{user_id}")
```

#### 4.2 좋아요 시

```python
@app.post("/feeds/{feed_id}/like")
async def like_feed(
    feed_id: int,
    user_id: int = Depends(get_current_user),
    background_tasks: BackgroundTasks = None
):
    # 즉시 응답 (낙관적 업데이트)
    background_tasks.add_task(
        process_like,
        feed_id, user_id
    )

    return {"status": "processing"}

async def process_like(feed_id: int, user_id: int):
    # 좋아요 추가
    await db.execute(
        "INSERT INTO likes (feed_id, user_id) VALUES ($1, $2)",
        feed_id, user_id
    )

    # 캐시 무효화
    await redis_client.delete(
        f"feed:{feed_id}:stats",  # 피드 통계
        f"feeds:list:*"            # 피드 목록
    )

    # FCM 알림 전송
    await send_notification(feed_id, user_id, "like")
```

**핵심**: 백그라운드에서 처리하니까 사용자는 빠르게 응답을 받습니다!

#### 4.3 프로필 수정 시

```python
@app.put("/users/{user_id}")
async def update_profile(
    user_id: int,
    data: dict,
    background_tasks: BackgroundTasks = None
):
    # 프로필 수정
    await db.execute(
        "UPDATE users SET ... WHERE id = $1",
        user_id
    )

    # 캐시 무효화
    background_tasks.add_task(
        invalidate_user_caches,
        user_id
    )

    return {"status": "success"}

async def invalidate_user_caches(user_id: int):
    """사용자 관련 캐시 무효화"""
    await redis_client.delete(
        f"user:profile:{user_id}",
        f"user:{user_id}:following",
        f"user:{user_id}:followers"
    )
```

## 성능 측정 결과

### Before vs After

| API | Before | After | 개선율 |
|-----|--------|-------|--------|
| GET /feeds | 800ms | 150ms | **81%** |
| GET /users/{id} | 500ms | 100ms | **80%** |
| GET /follows | 600ms | 120ms | **80%** |
| GET /stats | 400ms | 200ms | **50%** |
| POST /feeds/{id}/like | 2100ms | 500ms | **76%** |

**평균 응답 시간: 860ms → 214ms (75% 개선)**

### 캐시 히트율

```
총 요청 수: 10,000
캐시 히트: 8,200 (82%)
캐시 미스: 1,800 (18%)
```

**82%의 요청이 캐시에서 처리**됐습니다!

### 데이터베이스 부하 감소

```
Before Redis:
- DB 쿼리 수: 50,000 / 시간
- DB CPU 사용률: 65%

After Redis:
- DB 쿼리 수: 9,000 / 시간 (**82% 감소**)
- DB CPU 사용률: 12% (**81% 감소**)
```

Redis 덕분에 DB 부하가 엄청나게 줄었습니다!

## 겪었던 문제들과 해결

### 문제 1: Cloud Run Startup Timeout

**증상**:
```
ERROR: Container failed to start.
Failed to start and then listen on the port defined by the PORT environment variable.
```

**원인**:
Redis 연결 시 타임아웃 설정이 없어서, 연결이 안 되면 무한정 기다렸습니다.

**해결**:
```python
redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    socket_connect_timeout=5,  # 타임아웃 추가!
    socket_timeout=5
)
```

### 문제 2: Redis 패키지 의존성 누락

**증상**:
```
ModuleNotFoundError: No module named 'redis'
```

**원인**:
`requirements.txt`에 `redis` 패키지 추가를 깜빡했습니다.

**해결**:
```txt
redis==5.0.1
```

### 문제 3: 직렬화 에러

**증상**:
```
TypeError: Object of type datetime is not JSON serializable
```

**원인**:
Python `datetime` 객체를 JSON으로 변환할 수 없었습니다.

**해결**:
```python
json.dumps(value, default=str)  # datetime을 문자열로 변환
```

### 문제 4: 캐시 키 충돌

**증상**:
다른 사용자가 같은 캐시를 공유하는 버그.

**원인**:
캐시 키에 사용자 ID를 포함하지 않았습니다.

**해결**:
```python
# Before
cache_key = "feeds:list:0:20"  # 모든 사용자가 공유!

# After
cache_key = f"user:{user_id}:feeds:list:0:20"  # 사용자별 캐시
```

## 배운 점

### 1. 캐싱은 만능이 아닙니다

캐싱이 항상 좋은 것은 아닙니다:

**캐싱이 좋은 경우**:
- 자주 읽히는 데이터 (피드 목록, 프로필)
- 변경이 드문 데이터 (설정, 카테고리)
- 계산 비용이 높은 데이터 (통계, 집계)

**캐싱이 안 좋은 경우**:
- 실시간성이 중요한 데이터 (채팅 메시지)
- 항상 다른 데이터 (검색 결과)
- 한 번만 읽히는 데이터

### 2. TTL 설정이 중요합니다

TTL을 너무 짧게 하면:
- 캐시 효과 감소
- Redis 트래픽 증가

TTL을 너무 길게 하면:
- 오래된 데이터 제공
- 사용자 경험 저하

**적절한 균형**을 찾는 게 핵심입니다!

### 3. Fallback 메커니즘 필수

Redis가 죽으면 서비스 전체가 죽으면 안 됩니다.

```python
cached = await redis_client.get(key)
if cached:
    return cached

# Redis 실패 시 DB 조회 (Fallback)
return await db.fetch(...)
```

### 4. 모니터링이 중요합니다

캐시 히트율, TTL 적정성, 메모리 사용량 등을 지속적으로 모니터링해야 합니다.

```python
# Redis INFO 명령으로 모니터링
info = redis_client.client.info()
print(f"Used memory: {info['used_memory_human']}")
print(f"Keyspace hits: {info['keyspace_hits']}")
print(f"Keyspace misses: {info['keyspace_misses']}")
```

## 더 나아갈 방향

캐싱은 끝이 아닙니다. 앞으로 더 개선할 부분들:

**캐시 워밍**: 앱 시작 시 인기 피드를 미리 캐싱해두면 첫 사용자 경험이 더 좋아질 것입니다.

**캐시 압축**: 큰 데이터는 gzip으로 압축해서 저장하면 메모리 효율이 올라갑니다.

**Redis Cluster**: 트래픽이 증가하면 Primary/Replica 구조로 확장성을 확보할 수 있습니다.

## 핵심 정리

Redis 캐싱으로 **평균 응답속도 76% 개선**을 달성했습니다.

성공의 요인:
- **적절한 TTL 설정**: 데이터 특성별로 180초~600초 차등 적용
- **즉각적인 무효화**: BackgroundTasks로 데이터 변경 시 실시간 캐시 삭제
- **Fallback 메커니즘**: Redis 장애 시에도 서비스 정상 작동
- **캐시 히트율 82%**: 데이터베이스 부하 82% 감소

단순히 Redis를 붙인 게 아니라, 서비스 특성에 맞는 캐싱 전략을 설계했기에 가능했습니다.

**그리고 AI(Claude)와의 협업 덕분에 3일 만에 완성할 수 있었습니다.**

---

**레퍼런스**
- [Redis 공식 문서](https://redis.io/docs/)
- [FastAPI BackgroundTasks](https://fastapi.tiangolo.com/tutorial/background-tasks/)
- [GCP Memorystore for Redis](https://cloud.google.com/memorystore/docs/redis)
