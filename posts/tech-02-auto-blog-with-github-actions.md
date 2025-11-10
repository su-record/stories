---
title: "GitHub Actions + Gemini API로 커밋 히스토리 자동 블로그 포스팅 시스템 만들기"
date: "2025-11-10"
category: "tech"
description: "블로그 작성이 어려운 개발자를 위한 해결책. 프로젝트 저장소의 커밋 히스토리를 Gemini API로 자동 분석하여 블로그 포스팅을 생성하고, GitHub Actions로 배포까지 자동화하는 시스템 구축 가이드"
tags: ["github-actions", "gemini-api", "automation", "blog", "devops"]
author: "Su Ham"
lang: "ko"
---

# GitHub Actions + Gemini API로 커밋 히스토리 자동 블로그 포스팅 시스템 만들기

## 문제: 블로그를 꾸준히 쓰기 어렵다

개발자라면 누구나 이런 고민을 합니다:

- **"블로그를 꾸준히 작성하고 싶은데 시간이 없다"**
- **"프로젝트 진행 상황을 기록하고 싶은데 귀찮다"**
- **"커밋은 매일 하는데 문서화는 못하고 있다"**

저도 Fallingo 개발하면서 같은 문제를 겪었습니다. 매주 개발 일지를 작성하려고 했지만, 막상 앉아서 쓰려니 "뭐 했더라?" 하면서 커밋 히스토리를 다시 읽어야 했습니다.

## 해결책: 커밋 20개마다 자동으로 블로그 포스팅 생성

그래서 이런 시스템을 만들었습니다:

1. **프로젝트 저장소**에서 **최근 20개의 커밋 히스토리**를 수집
2. **Gemini API**(Google의 무료 AI API)로 커밋 메시지 분석 및 **마크다운 포스팅 자동 생성**
3. 생성된 포스팅을 **블로그 저장소**(su-record/stories)로 **자동 푸시**
4. 블로그 저장소에 새 파일이 등록되면 **GitHub Actions가 자동으로 재배포**

**왜 20개인가?**
- Gemini API의 프롬프트 토큰 제한 때문입니다
- 20개의 커밋 메시지 + 시스템 프롬프트 ≈ 2,000~3,000 토큰
- Gemini 2.0 Flash의 무료 티어 제한(128K 토큰) 내에서 여유롭게 사용 가능

**결과:** 20개의 커밋이 쌓이면, 블로그 포스팅이 자동으로 작성되고 배포됩니다.

## 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│  1. Fallingo Repository (프로젝트 저장소)                    │
│                                                               │
│  ┌─────────────────────────────────────┐                    │
│  │  GitHub Actions Workflow            │                    │
│  │  (Manual Trigger)                   │                    │
│  └────────────┬────────────────────────┘                    │
│               │                                               │
│               ▼                                               │
│  ┌─────────────────────────────────────┐                    │
│  │  1. Fetch Last 20 Commits           │                    │
│  │     git log -20 --no-merges         │                    │
│  └────────────┬────────────────────────┘                    │
│               │                                               │
│               ▼                                               │
│  ┌─────────────────────────────────────┐                    │
│  │  2. Generate Blog Post via Gemini   │                    │
│  │     POST https://generativelanguage.│                    │
│  │     googleapis.com/v1beta/models/   │                    │
│  │     gemini-2.0-flash-exp:generate   │                    │
│  └────────────┬────────────────────────┘                    │
│               │                                               │
│               ▼                                               │
│  ┌─────────────────────────────────────┐                    │
│  │  3. Push to Stories Repository      │                    │
│  │     git clone su-record/stories     │                    │
│  │     echo "$content" > posts/new.md  │                    │
│  │     git push                         │                    │
│  └─────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Stories Repository (블로그 저장소)                        │
│                                                               │
│  ┌─────────────────────────────────────┐                    │
│  │  GitHub Actions Workflow            │                    │
│  │  (Trigger: Push to main)            │                    │
│  └────────────┬────────────────────────┘                    │
│               │                                               │
│               ▼                                               │
│  ┌─────────────────────────────────────┐                    │
│  │  1. Generate posts-index.json       │                    │
│  │     npm run prebuild                │                    │
│  └────────────┬────────────────────────┘                    │
│               │                                               │
│               ▼                                               │
│  ┌─────────────────────────────────────┐                    │
│  │  2. Build React App                 │                    │
│  │     npm run build (Vite)            │                    │
│  └────────────┬────────────────────────┘                    │
│               │                                               │
│               ▼                                               │
│  ┌─────────────────────────────────────┐                    │
│  │  3. Deploy to GitHub Pages          │                    │
│  │     https://su-record.github.io/    │                    │
│  │     stories/                         │                    │
│  └─────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

## 1단계: Gemini API 키 발급받기

### Gemini API란?

Google의 생성형 AI API입니다. **무료 티어로도 충분히 사용 가능**합니다.

**무료 티어 제한:**
- 분당 15 요청
- 일일 1,500 요청
- 월 100만 토큰

블로그 포스팅 생성용으로는 충분합니다.

### API 키 발급 방법

1. **Google AI Studio 접속**: https://aistudio.google.com/
2. **Get API Key** 클릭
3. **Create API Key** 선택
4. API Key 복사 (예: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)

## 2단계: GitHub Secrets에 API 키 등록

### Fallingo Repository에 Secrets 등록

1. **Fallingo Repository** → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. 2개의 Secret 등록:

**Secret 1: GEMINI_API_KEY**
```
Name: GEMINI_API_KEY
Secret: AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Secret 2: BLOG_REPO_TOKEN**
```
Name: BLOG_REPO_TOKEN
Secret: ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### BLOG_REPO_TOKEN 발급 방법

블로그 저장소(su-record/stories)에 푸시하려면 **Personal Access Token**이 필요합니다.

1. **GitHub** → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token (classic)** 클릭
3. **Note**: `Fallingo to Stories Blog`
4. **Expiration**: `No expiration` (또는 원하는 기간)
5. **Select scopes**:
   - ✅ `repo` (전체 선택)
   - ✅ `workflow`
6. **Generate token** 클릭
7. 토큰 복사 (`ghp_`로 시작)

**⚠️ 주의:** 토큰은 한 번만 표시되니 반드시 저장하세요.

## 3단계: Fallingo Repository에 GitHub Actions Workflow 작성

### `.github/workflows/auto-blog-post.yml` 작성

GitHub Actions 워크플로우를 작성합니다. 이 워크플로우는 다음 작업을 수행합니다:

**주요 단계:**

1. **최근 20개 커밋 가져오기**
   - `git log -20 --no-merges`로 병합 커밋 제외
   - 커밋 해시, 메시지, 작성자, 시간 수집

2. **Gemini API로 블로그 포스팅 생성**
   - 커밋 히스토리를 프롬프트로 전달
   - 한국어 개발 일지 형식으로 생성 요청
   - 마크다운 frontmatter 포함

3. **Stories Repository에 푸시**
   - 생성된 마크다운 파일을 블로그 저장소에 복사
   - Git으로 자동 커밋 및 푸시

**프롬프트 구조:**
- 시스템 역할: "기술 블로그 작성 전문가"
- 요구사항: 존댓말, 날짜별 그룹화, 기술적 분석
- 출력 형식: Frontmatter + 섹션별 구성

## 4단계: Stories Repository GitHub Actions 설정

Stories 블로그 저장소는 이미 설정되어 있습니다. `.github/workflows/deploy.yml` 파일이 다음 작업을 수행합니다:

**작동 방식:**
1. `main` 브랜치에 푸시되면 자동 트리거
2. `posts/*.md` 파일들을 스캔하여 `public/posts-index.json` 생성
3. React 앱 빌드 (Vite)
4. GitHub Pages에 자동 배포

**배포 과정:**
- Node.js 20 환경 설정
- npm 의존성 설치
- 포스트 인덱스 생성 (`npm run prebuild`)
- Vite 빌드 (`npm run build`)
- GitHub Pages 아티팩트 업로드
- 자동 배포 실행

## 5단계: 테스트 실행

### 수동 실행

**20개의 커밋이 쌓였을 때 수동으로 실행합니다:**

1. **Fallingo Repository** → **Actions** → **Auto Generate Blog Post**
2. **Run workflow** 클릭
3. 워크플로우 실행 확인

### 실행 타이밍

**언제 실행하나요?**
- 20개 정도의 의미 있는 커밋이 쌓였을 때
- 프로젝트의 한 단락이 마무리됐을 때
- 주요 기능 개발이 완료됐을 때

**자동 실행은 안 하나요?**
- Cron 스케줄은 사용하지 않습니다
- 이유: 커밋 개수는 예측할 수 없기 때문입니다
- 20개 미만이면 포스팅이 빈약하고, 40개 이상이면 토큰 초과 가능

## 실제 사용 예시

### 1. 커밋 히스토리 (20개)

```bash
# Fallingo Repository에서 최근 20개 커밋
a1b2c3d - feat: Add Redis caching to feed API (Su Ham, 2 hours ago)
e4f5g6h - fix: Resolve FCM notification timeout (Su Ham, 4 hours ago)
i7j8k9l - refactor: Optimize SQL query with indexing (Su Ham, 1 day ago)
m0n1o2p - docs: Update API documentation (Su Ham, 1 day ago)
q3r4s5t - feat: Implement optimistic UI updates (Su Ham, 2 days ago)
u6v7w8x - fix: Handle edge case in feed pagination (Su Ham, 2 days ago)
y9z0a1b - refactor: Extract reusable components (Su Ham, 3 days ago)
c2d3e4f - feat: Add user profile caching (Su Ham, 3 days ago)
g5h6i7j - fix: Resolve race condition in like API (Su Ham, 4 days ago)
k8l9m0n - test: Add integration tests for feed (Su Ham, 4 days ago)
... (10 more commits)
```

### 2. Gemini API가 생성한 블로그 포스팅 예시

**생성된 개발일지 구조:**

```
---
title: "Fallingo 개발일지 - 최근 20개 커밋 분석 (2025.11.10)"
date: "2025-11-10"
category: "dev-log"
tags: ["fallingo", "개발일지"]
---

## 작업 요약
- 주요 작업 3-5줄 요약

## 주요 작업 내용
### [날짜]: [작업 주제]
- 커밋별 상세 설명
- 기술적 맥락 분석

## 기술적 개선사항
- 성능 최적화 내용
- 아키텍처 변경사항
- 코드 품질 개선

## 배운 점
- 개발 과정에서 얻은 인사이트
```

**Gemini API가 분석하는 내용:**
- 커밋 메시지에서 작업 의도 파악
- 날짜별로 작업 그룹화
- 기술적 맥락 추론
- 성능 개선 수치 강조

### 3. Stories Repository에 자동 푸시

생성된 마크다운 파일이 `posts/` 디렉토리에 자동으로 추가됩니다.

**파일명 형식:** `fallingo-devlog-YYYYMMDD-HHMMSS.md`

### 4. 자동 배포

- Stories Repository에 새 파일이 푸시되면 GitHub Actions 트리거
- React 앱 재빌드
- GitHub Pages에 자동 배포
- 결과: 블로그에 새 포스트 표시

## 비용 분석

### Gemini API 비용

**무료 티어 사용 시:**
- 20개 커밋당 1회 실행: **$0**
- 월 평균 2-3회 실행 (약 40-60개 커밋): **$0**
- 연 약 30회 실행: **$0**

**토큰 사용량:**
- 프롬프트: 20개 커밋 메시지 + 시스템 프롬프트 ≈ 2,000~3,000 토큰
- 응답: 생성된 블로그 포스팅 ≈ 3,000~5,000 토큰
- 요청당 총 토큰: 약 5,000~8,000 토큰

**무료 티어 제한:**
- 일일 1,500 요청 (충분함)
- 분당 128K 토큰 (충분함)

**유료 전환 시 (예상):**
- Gemini 2.0 Flash 요금: $0.000075 per 1K tokens (input), $0.0003 per 1K tokens (output)
- 요청당 비용: ~$0.002
- 월 비용 (2-3회): ~$0.005
- 연 비용: ~$0.06

### GitHub Actions 비용

**Public Repository:**
- 무제한 무료

**Private Repository:**
- Free 플랜: 월 2,000분 무료
- 1회 실행 시간: ~3분
- 월 2-3회 실행: 월 6-9분 사용 (전체의 0.3-0.5%)
- **실질적으로 무료**

**총 비용: $0 (무료 티어 사용 시)**

## 왜 20개인가? (토큰 제한 분석)

### 토큰 계산

**1개 커밋 메시지 예시:**
```
a1b2c3d - feat: Add Redis caching to feed API (Su Ham, 2 hours ago)
```

이 커밋 메시지는 약 **20-30 토큰**입니다.

**20개 커밋:**
- 커밋 메시지: 20 × 25 = 500 토큰
- 시스템 프롬프트: 약 1,500 토큰
- 형식 지정: 약 500 토큰
- **총 입력 토큰: 약 2,500 토큰**

**생성된 블로그 포스팅:**
- 약 3,000~5,000 토큰

**요청당 총 토큰: 5,500~7,500 토큰**

### 다른 개수를 선택하면?

**10개 커밋:**
- 입력 토큰: 약 1,500 토큰
- 문제: 포스팅 내용이 너무 빈약함
- 결과: 의미 있는 개발 일지가 되기 어려움

**40개 커밋:**
- 입력 토큰: 약 4,500 토큰
- 출력 토큰: 약 6,000~8,000 토큰
- 문제: 총 10,000 토큰 이상 사용
- 비용: 무료 티어 내이지만 너무 긴 포스팅

**결론: 20개가 최적**
- 적당한 분량의 포스팅
- 토큰 효율성
- 읽기 좋은 길이

## 장점과 한계

### 장점

1. **완전 자동화**
   - 커밋만 하면 블로그 포스팅이 자동 생성됩니다
   - 수동으로 문서 작성할 필요 없음

2. **일관된 형식**
   - Gemini API가 항상 같은 형식으로 생성
   - 블로그 스타일 유지

3. **비용 효율적**
   - Gemini API 무료 티어로 충분
   - GitHub Actions도 Public Repository는 무료

4. **유연한 스케줄링**
   - Cron으로 자동 실행 (주간, 월간 등)
   - 수동 실행도 가능

### 한계

1. **AI 생성 콘텐츠의 품질**
   - 커밋 메시지가 부실하면 생성된 포스팅도 부실합니다
   - 사람이 작성한 것만큼 깊이 있지 않을 수 있음

2. **커밋 메시지 의존성**
   - 좋은 커밋 메시지가 필수
   - Conventional Commits 같은 규칙 준수 필요

3. **수정 필요**
   - 생성된 포스팅을 검토하고 수정해야 할 수 있습니다
   - 완전히 손을 떼기는 어려움

4. **수동 실행 필요**
   - 20개 커밋이 쌓였는지 수동으로 확인
   - 자동 트리거 없음 (Cron 스케줄 불가)

## 개선 아이디어

### 1. 커밋 메시지 품질 향상

**Before:**
```
fix bug
```

**After:**
```
fix: Resolve FCM notification timeout issue

- Problem: FCM sends took 2100ms, causing API timeout
- Solution: Move FCM to BackgroundTasks
- Result: API response time reduced from 2100ms to 500ms (76% improvement)
```

### 2. 이미지 자동 삽입

스크린샷 캡처 도구(Puppeteer 등)를 사용하여:
- 앱 화면 자동 캡처
- Cloud Storage에 업로드
- 마크다운에 이미지 링크 자동 삽입

### 3. 커밋 개수 자동 체크

GitHub Actions Cron으로 매일 체크:
- 마지막 블로그 포스팅 이후 커밋 개수 확인
- 20개 이상이면 워크플로우 자동 트리거
- `.last-blog-post-date` 파일로 상태 관리

### 4. 다중 프로젝트 지원

Matrix 전략으로 여러 프로젝트 동시 처리:
- Fallingo, hi-ai 등 여러 저장소
- 각 프로젝트별로 독립적으로 포스팅 생성

### 5. Slack 알림 연동

Slack Webhook으로 알림 전송:
- 블로그 포스트 생성 완료 알림
- 에러 발생 시 즉시 알림

## 마치며

이 시스템으로 **블로그 작성의 심리적 부담**이 크게 줄었습니다.

"오늘은 뭐 했더라?" 고민하지 않아도, 20개의 커밋이 쌓이면 GitHub Actions가 알아서 정리해줍니다.

물론 AI가 생성한 콘텐츠는 검토가 필요하지만, **초안을 자동으로 작성**해주는 것만으로도 엄청난 시간 절약입니다.

**핵심 장점:**
- **토큰 효율성**: 20개 커밋 = 약 6,000 토큰 (무료 티어 내)
- **적절한 분량**: 너무 짧지도, 길지도 않은 포스팅
- **비용 제로**: Gemini API 무료 티어 + GitHub Actions 무료

**20개 커밋 = 1개 블로그 포스팅**

개발자에게 딱 맞는 블로그 작성 방식이 아닐까 생각합니다.

---

**참고 링크:**
- [Google AI Studio (Gemini API)](https://aistudio.google.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Fallingo Blog (Stories)](https://su-record.github.io/stories/)
- [Gemini API Pricing](https://ai.google.dev/pricing)
