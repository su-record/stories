---
title: "hi-ai MCP v1.4.0: 9단계 추론 프레임워크와 Gemini 프롬프팅 전략"
date: "2025-01-26"
category: "tech"
description: "복잡한 문제를 체계적으로 해결하는 추론 프레임워크와 Google Gemini API 최적화 전략. 2개 신규 도구로 AI 능력 대폭 향상"
tags: ["hi-ai", "mcp", "reasoning", "gemini", "prompting", "ai", "release"]
author: "Su"
lang: "ko"
---

# hi-ai MCP v1.4.0: 9단계 추론 프레임워크와 Gemini 프롬프팅 전략

## 복잡한 문제, 체계적으로 해결하기

v1.4.0에서는 **복잡한 문제를 논리적으로 분석하고 해결하는 능력**을 대폭 강화했습니다. 9단계 추론 프레임워크와 Google Gemini API 프롬프팅 전략을 도입하여, AI가 더 깊이 생각하고 더 정확하게 답변할 수 있게 되었습니다.

## 신규 도구 2개

### 1. apply_reasoning_framework: 9단계 추론 프레임워크

복잡한 문제를 **9단계로 체계적으로 분석**하는 도구입니다.

#### 9단계 프레임워크

```
1. 논리적 종속성 및 제약 조건
   - 정책, 규칙, 필수 전제 조건 확인
   - 작업 순서 최적화
   - 사용자 제약 조건 우선 적용

2. 위험 평가
   - 행동의 결과 분석
   - 롤백 가능성 확인
   - 호환성, 보안, 성능 위험 검토

3. 귀납적 추론 및 가설 탐색
   - 근본 원인에 대한 가설 생성
   - 가능성 기반 우선순위 지정
   - 각 가설의 검증 방법 제시

4. 결과 평가 및 적응성
   - 관찰 결과에 따른 계획 수정
   - 가설 반증 시 새 가설 생성
   - 백트래킹 필요성 판단

5. 정보 가용성
   - 사용 가능한 모든 도구 식별
   - 관련 정책/규칙 문서 참조
   - 이전 컨텍스트 복원

6. 정밀성 및 근거
   - 정책 인용 시 정확한 출처 명시
   - 코드 참조 시 파일명:라인 포함
   - 메트릭의 정확한 수치 제공

7. 완전성
   - 모든 요구사항, 옵션, 선호도 통합
   - 조기 결론 지양
   - 여러 대안 탐색

8. 끈기와 인내
   - 일시적 오류는 지능적으로 재시도
   - 전략 변경을 통한 문제 해결
   - 모든 추론 단계 완료까지 진행

9. 응답 억제
   - 추론 완료 후에만 행동
   - 복잡한 결정은 추론 과정 문서화
   - 단계별 실행으로 안전성 확보
```

#### 사용 사례

**복잡한 버그 디버깅**

```
문제: "사용자 로그인 후 프로필 페이지에서 간헐적으로 500 에러 발생"

추론 결과:
- 가설 1 (가능성 높음): 세션 데이터 불완전
  → 검증: 세션 저장 로직에 로깅 추가
- 가설 2 (가능성 중간): 비동기 처리 순서 문제
  → 검증: Promise 체인 확인
- 가설 3 (가능성 낮음): DB 쿼리 결과 null
  → 검증: 쿼리 로그 확인

권장 조치:
1. 즉시: 세션 저장/조회 시점에 상세 로깅 추가
2. 단기: 비동기 처리 코드 리뷰
3. 중기: 세션 저장소 모니터링 강화
```

**아키텍처 설계 결정**

```
문제: "실시간 알림 기능 구현 시 WebSocket vs SSE vs Long Polling 선택"

추론 결과:
- WebSocket: 양방향 통신, 복잡도 높음, 확장성 고려 필요
- SSE: 단방향, 간단한 구현, HTTP/2 최적화
- Long Polling: 레거시 호환, 성능 낮음

제약 조건 분석:
- 기존 인프라: HTTP/2 지원
- 트래픽 패턴: 서버→클라이언트 주도
- 확장성: 중간 규모 (1만 동시 접속)

추천: SSE (Server-Sent Events)
근거: 단방향 통신에 최적화, 구현 간단, HTTP/2 활용 가능
```

---

### 2. enhance_prompt_gemini: Gemini 프롬프팅 전략

**Google Gemini API 공식 프롬프팅 전략**을 적용하여 프롬프트 품질을 향상시키는 도구입니다.

#### 5가지 전략

**1. Few-Shot 예시 추가**

2-3개의 고품질 예시를 추가하여 모델이 패턴을 학습하도록 유도합니다.

```
개선 전:
"사용자 인증 기능을 구현해주세요"

개선 후:
"사용자 인증 기능을 구현해주세요

예시 1: 이메일/비밀번호 로그인
- POST /auth/login
- JWT 토큰 발급
- 비밀번호 bcrypt 해싱

예시 2: 소셜 로그인 (Google OAuth)
- GET /auth/google
- 사용자 정보 조회
- 자동 회원가입"
```

**2. 출력 형식 명시화**

XML 태그나 마크다운 헤더로 구조화된 형식을 지정합니다.

```
개선 전:
"데이터베이스 스키마를 설계해주세요"

개선 후:
"데이터베이스 스키마를 설계해주세요

<schema>
  <table name="users">
    <column>id</column>
    <column>email</column>
  </table>
</schema>

형식으로 출력해주세요"
```

**3. 컨텍스트 배치 최적화**

긴 컨텍스트를 특정 요청 전에 배치하여 Gemini 3 성능을 최적화합니다.

```
개선 전:
"코드를 리팩토링해주세요
[1000줄 코드]"

개선 후:
"[1000줄 코드]

위 코드를 다음 기준으로 리팩토링해주세요:
1. 함수 복잡도 10 이하
2. 중복 코드 제거
3. 단일 책임 원칙 준수"
```

**4. 프롬프트 분해**

복잡한 작업을 여러 단계로 분해하여 체인화합니다.

```
개선 전:
"전체 백엔드 API를 구현해주세요"

개선 후:
"Step 1: 사용자 인증 API 구현
Step 2: 할 일 목록 CRUD API 구현
Step 3: 파일 업로드 API 구현

각 단계별로 순차적으로 진행하겠습니다."
```

**5. 매개변수 튜닝 제안**

Temperature, Top-K, Top-P, Max Tokens 최적 값을 제안합니다.

```
작업 유형: 코드 생성

추천 매개변수:
- Temperature: 0.2 (낮은 창의성, 높은 일관성)
- Top-P: 0.8 (상위 80% 토큰만 고려)
- Top-K: 40 (상위 40개 토큰만 선택)
- Max Output Tokens: 2000
```

---

## 도구 수 정확도 개선

이전 버전에서 문서에는 40개 도구로 표기되어 있었지만, 실제로는 **36개**였습니다. v1.4.0에서 이를 정확히 수정했습니다.

### 카테고리별 도구 (36개)

```
메모리 관리     10개
순차적 사고      6개
코드 품질        6개
기획            4개
프롬프트        3개  (🆕 enhance_prompt_gemini)
시맨틱 분석      2개
브라우저 개발    2개
추론            1개  (🆕 apply_reasoning_framework)
UI              1개
시간            1개
```

---

## Vibe 프레임워크와 완벽한 통합

### Reasoning Agent 추가

9단계 추론 프레임워크를 활용하는 **Reasoning Agent**가 Vibe에 추가되었습니다.

### /vibe.reason 슬래시 커맨드

Claude Code에서 바로 사용 가능한 새로운 커맨드입니다.

```
/vibe.reason "복잡한 문제 설명"
```

### Specification Agent 개선

**Gemini 프롬프팅 전략**이 Specification Agent에 통합되어, SPEC 문서 품질이 향상되었습니다.

---

## 사용 예시

### 1. 복잡한 버그 추론

```typescript
// MCP 도구 호출
{
  "tool": "apply_reasoning_framework",
  "arguments": {
    "problem": "사용자 로그인 후 프로필 페이지에서 간헐적으로 500 에러 발생",
    "context": "로그: TypeError: Cannot read property 'id' of undefined"
  }
}
```

**출력:**
- 9단계 체계적 분석
- 3가지 가설 생성 및 우선순위화
- 각 가설의 검증 방법
- 단계별 권장 조치

### 2. 프롬프트 품질 향상

```typescript
// MCP 도구 호출
{
  "tool": "enhance_prompt_gemini",
  "arguments": {
    "prompt": "사용자 인증 기능을 구현해주세요",
    "agent_role": "Implementation Agent",
    "strategies": ["few-shot", "output-format", "decomposition"]
  }
}
```

**출력:**
- Few-Shot 예시 추가된 프롬프트
- 구조화된 출력 형식 지정
- 단계별 분해된 작업 계획

### 3. Vibe 워크플로우 통합

```bash
# 1. SPEC 작성 (Gemini 전략 자동 적용)
/vibe.spec "실시간 알림"

# 2. 기술적 결정이 필요한 경우
/vibe.reason "실시간 알림 구현 시 WebSocket vs SSE vs Long Polling 선택"

# 3. PLAN 작성 (추론 결과 반영)
/vibe.plan "실시간 알림"
```

---

## 성능 향상

### 추론 품질

9단계 프레임워크로 **복잡한 문제 해결 정확도** 향상:
- 근본 원인 파악률 증가
- 가설 검증 체계화
- 결정 과정 투명성 확보

### 프롬프트 품질

Gemini 전략으로 **응답 일관성** 향상:
- Few-Shot 예시로 형식 통일
- 출력 구조화로 파싱 용이
- 컨텍스트 최적화로 성능 개선

---

## 코드 품질

### TypeScript 타입 안정성

새로운 도구 모두 strict mode를 준수합니다:
- 명시적 타입 선언
- 템플릿 리터럴 이스케이핑
- 함수 호출 최적화

### 테스트

빌드 및 배포 테스트 모두 통과:
- TypeScript 컴파일 성공
- Smithery 스캔 통과 (36 tools)
- npm 배포 성공

---

## 설치 방법

### npm

```bash
npm install @su-record/hi-ai@1.4.0
```

### Vibe CLI (권장)

```bash
npm install -g @su-record/vibe
npx vibe init
```

### Smithery

```bash
npx @smithery/cli install @su-record/hi-ai --client claude
```

---

## 통계

**릴리즈 커밋:**
- v1.4.0 기능 추가
- 도구 수 정확도 개선

**코드 변경:**
- 2개 신규 파일 (추론, 프롬프트 도구)
- 671줄 추가 (applyReasoningFramework: 298줄, enhancePromptGemini: 373줄)
- 문서 전체 업데이트

**NPM 패키지:**
- 크기: 151.3 kB
- 파일: 105개

---

## 다음은?

v1.4.0은 AI의 **추론 능력**을 대폭 강화했습니다.

다음 버전에서는:
- 더 많은 추론 프레임워크 (디버깅, 최적화 전용)
- 실시간 협업 기능
- 고급 프롬프트 엔지니어링 도구

**hi-ai는 AI를 더 스마트하게 만듭니다.**

---

## 감사의 말

Google Gemini API 프롬프팅 전략 문서와 9단계 추론 프레임워크 방법론에서 많은 영감을 받았습니다.

Vibe 프레임워크와의 통합으로 더욱 강력한 개발 환경을 제공할 수 있게 되었습니다.

---

> 이전 편: [hi-ai MCP v1.3.0: Smithery 품질 점수 17% 향상과 4개 핵심 라이브러리](tech-hi-ai-05.md)

**GitHub**: https://github.com/su-record/hi-ai
**Release**: https://github.com/su-record/hi-ai/releases/tag/v1.4.0
**NPM**: https://www.npmjs.com/package/@su-record/hi-ai
