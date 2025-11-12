---
title: "hi-ai MCP: 개발자를 위한 34개 도구의 똑똑한 AI 비서"
date: "2025-11-10"
category: "tech"
description: "키워드 기반 자연어로 작동하는 MCP 1.0 표준 개발 도구 - 100ms 이하 응답, 50MB 이하 메모리"
tags: ["mcp", "ai-tools", "typescript", "developer-tools", "hi-ai"]
author: "Su"
lang: "ko"
---

# hi-ai MCP: 개발자를 위한 34개 도구의 똑똑한 AI 비서

## 시작: fallingo를 개발하던 어느 날

fallingo 백엔드 API를 개발하던 중이었습니다. FastAPI로 RESTful 엔드포인트를 구현하고, Redis 캐싱 전략을 짜고, BackgroundTasks로 FCM 알림을 비동기 처리하는 복잡한 아키텍처를 다루고 있었죠.

Claude와 함께 코딩하면서(바이브코딩) 반복되는 패턴을 발견했습니다:

- "이 API 엔드포인트의 성능 병목 지점을 찾아줘"
- "이 함수의 복잡도를 분석하고 리팩토링 제안해줘"
- "이 Redis 캐싱 전략이 적절한지 평가해줘"
- "이 컴포넌트 구조를 ASCII로 시각화해줘"

매번 긴 프롬프트를 작성하는 게 번거로웠습니다. 더 큰 문제는 대화가 길어지면 컨텍스트가 손실되고, 같은 설명을 반복해야 한다는 것이었죠.

**"바이브코딩에 특화된 MCP 도구가 있으면 좋겠다"**

그렇게 탄생한 것이 **hi-ai MCP**입니다.

## WHAT: hi-ai MCP란?

Model Context Protocol(MCP) 1.0 표준을 구현한 TypeScript 기반 개발 도구 세트입니다. Claude 같은 AI 에이전트가 실제 개발 작업에 사용할 수 있는 **34개의 전문화된 도구 모음**이죠.

### 핵심 특징

**1. 키워드 기반 자연어 인식**

한국어와 영어 키워드만 입력하면 알아서 적절한 도구를 실행합니다:

```
"코드 품질 평가해줘" → 자동으로 code quality evaluation 도구 실행
"메모리 저장" → memory management 도구 활성화
"UI 미리보기" → ASCII art preview 시스템 작동
```

**2. 34개 전문화 도구**

- **시맨틱 코드 분석**: 단순 문법 검사를 넘어 코드의 의미와 맥락 파악
- **지능형 메모리 관리**: 컨텍스트 유지하며 대화 이력 관리
- **코드 품질 평가**: 실시간 코드 리뷰와 개선 제안
- **프롬프트 엔지니어링**: 효과적인 AI 프롬프트 자동 생성
- **UI 미리보기 시스템**: ASCII 아트로 레이아웃 시각화

**3. 성능에 진심**

```
평균 응답 시간: <100ms
메모리 사용량: <50MB
동시 세션: 무제한
```

가볍고 빠르게. 개발 흐름을 끊지 않는 것이 철학입니다.

## WHY: 왜 필요했나?

### fallingo 개발 중 마주한 문제들

fallingo를 개발하면서 Claude와 바이브코딩할 때 이런 불편함이 있었습니다:

1. **매번 긴 프롬프트 작성**: "이 FastAPI 엔드포인트의 성능을 분석하고, Redis 캐싱 전략을 평가하고, 개선점을 제안하고..."
2. **컨텍스트 손실**: 대화가 길어지면 AI가 "이 프로젝트는 FastAPI를 사용합니다"라고 매번 다시 설명해야 함
3. **일관성 없는 응답**: 같은 코드 품질 질문에도 매번 다른 기준으로 평가
4. **도구 통합의 어려움**: 코드 분석, 성능 측정, 아키텍처 검증 등 여러 작업을 일일이 요청해야 함

특히 BackgroundTasks로 FCM 알림을 비동기 처리하는 로직을 구현할 때, 매번 "이 코드의 성능 병목 지점을 찾고, 비동기 처리가 적절한지 평가하고, 개선 방안을 제시해줘"라는 긴 프롬프트를 작성하는 것이 비효율적이었습니다.

### hi-ai의 해결법

**키워드 기반 의도 인식**으로 복잡한 프롬프트를 단순화했습니다. AI가 개발자의 의도를 정확히 파악하고 적절한 도구를 자동 선택하는 것이죠.

**모듈화된 아키텍처**로 각 도구가 독립적으로 작동하면서도 서로 협력합니다. 메모리 관리 시스템이 컨텍스트를 유지하고, 코드 분석 도구가 일관된 평가 기준을 제공합니다.

실제로 fallingo 개발에 적용한 결과, 프롬프트 작성 시간이 70% 감소했고, AI와의 대화 효율성이 크게 향상되었습니다.

## HOW: 어떻게 사용하나?

### 설치

**방법 1: Smithery 플랫폼 (추천)**

가장 쉬운 방법입니다. MCP 호환 에디터에서 바로 설치 가능합니다:

```
https://smithery.ai/server/@su-record/hi-ai
```

**방법 2: NPM 패키지**

```bash
# 전역 설치
npm install -g @su-record/hi-ai

# 프로젝트 로컬 설치
npm install @su-record/hi-ai
```

### 시스템 요구사항

```
Node.js 18.0+
TypeScript 5.0+
MCP 호환 에디터 (Claude Desktop, Cursor 등)
```

### 실제 사용 예시

#### 1. 코드 품질 평가

```typescript
// AI에게 이렇게 물어보면
"이 함수 코드 품질 어때요?"

// hi-ai가 자동으로 분석 도구 실행:
// - 복잡도 계산
// - 네이밍 규칙 검사
// - 성능 병목 지점 파악
// - 개선 제안 제공
```

**실제 케이스:**

```javascript
function processData(data) {
  let result = [];
  for(let i = 0; i < data.length; i++) {
    if(data[i].active) {
      result.push({
        id: data[i].id,
        name: data[i].name,
        value: data[i].value * 2
      });
    }
  }
  return result;
}
```

AI가 hi-ai MCP로 분석한 결과:

```
품질 점수: 6.5/10

개선 포인트:
1. 함수형 프로그래밍 활용 (filter + map)
2. 매직 넘버 제거 (2를 상수로)
3. 타입 안정성 추가

개선된 코드:
const MULTIPLIER = 2;

function processData(data: DataItem[]): ProcessedItem[] {
  return data
    .filter(item => item.active)
    .map(({ id, name, value }) => ({
      id,
      name,
      value: value * MULTIPLIER
    }));
}
```

#### 2. 시맨틱 코드 분석

```typescript
// 단순 문법이 아니라 '의미'를 파악합니다

"이 컴포넌트의 역할이 뭔가요?"

// hi-ai 분석:
// - 컴포넌트의 책임 범위
// - 다른 모듈과의 관계
// - 잠재적 리팩토링 포인트
```

**예시: React 컴포넌트**

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`/api/users/${userId}`).then(r => r.json()).then(setUser);
    fetch(`/api/users/${userId}/posts`).then(r => r.json()).then(setPosts);
    fetch(`/api/users/${userId}/comments`).then(r => r.json()).then(setComments);
  }, [userId]);

  return (/* 복잡한 UI */);
}
```

hi-ai의 시맨틱 분석:

```
역할 분석:
- 주 책임: 사용자 프로필 데이터 표시
- 부 책임: 게시글, 댓글 데이터 페칭 (SRP 위반)

문제점:
1. 너무 많은 책임 (데이터 페칭 + UI 렌더링)
2. 3개의 독립적 API 호출 (병렬 처리 가능)
3. 로딩/에러 상태 미처리

제안:
- Custom Hook 분리 (useUserData)
- React Query/SWR 도입
- Suspense 경계 추가
```

#### 3. UI 미리보기 (ASCII Art)

```typescript
"이 레이아웃 미리보기 보여줘"

// hi-ai가 ASCII 아트로 시각화:

┌─────────────────────────────────────┐
│            Header                   │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │   Main Content Area      │
│          │                          │
│          │                          │
├──────────┴──────────────────────────┤
│            Footer                   │
└─────────────────────────────────────┘
```

터미널에서 바로 레이아웃 확인이 가능합니다. 디자이너와 소통할 때 정말 편리합니다.

#### 4. 지능형 메모리 관리

```typescript
// 대화 컨텍스트 자동 저장

Session 1:
"이 프로젝트는 FastAPI 백엔드를 사용해"
→ hi-ai가 메모리에 저장

Session 2 (30분 후):
"API 라우터 추가해줘"
→ hi-ai가 자동으로 FastAPI 문법 적용
```

매번 기술 스택을 다시 설명할 필요가 없습니다. 컨텍스트를 기억하고 있으니까요.

### 통합 워크플로우

실제 개발에서는 이렇게 사용하고 있습니다:

```
1. 프로젝트 시작 시
   → "프로젝트 구조 분석해줘" (semantic analysis)

2. 코드 작성 중
   → "이 로직 품질 체크" (quality evaluation)

3. 리팩토링 전
   → "개선 포인트 찾아줘" (code analysis)

4. UI 작업 시
   → "레이아웃 미리보기" (ASCII preview)

5. 프롬프트 최적화
   → "이 작업에 맞는 프롬프트 생성" (prompt engineering)
```

## 기술적 특징

### MCP 1.0 표준 구현

Model Context Protocol은 AI 에이전트와 외부 도구를 연결하는 표준 인터페이스입니다. hi-ai는 이 표준을 완전히 따르기 때문에:

- Claude Desktop과 즉시 통합
- Cursor, Windsurf 등 MCP 지원 에디터에서 작동
- 다른 MCP 도구와 조합 사용 가능

### TypeScript 기반 아키텍처

```typescript
// 타입 안정성 + 확장성
interface ToolExecutor {
  name: string;
  execute(params: ToolParams): Promise<ToolResult>;
  validate(params: ToolParams): boolean;
}

// 모듈화된 도구 시스템
class CodeQualityTool implements ToolExecutor {
  async execute(params) {
    // 코드 품질 분석 로직
  }
}
```

각 도구가 독립적으로 작동하면서도 일관된 인터페이스를 유지합니다. 새 도구 추가도 쉽습니다.

### 로컬 실행, 프라이버시 보장

모든 처리가 로컬에서 실행됩니다. 네트워크 왕복 없이 즉각 반응하고, 코드가 외부로 나가지 않아 보안도 안심할 수 있습니다.

## 실전 활용 팁

### 1. 키워드 조합으로 더 정교하게

```
"코드 품질 + 성능" → 품질과 성능을 동시에 분석
"UI 미리보기 + 반응형" → 반응형 레이아웃 시각화
"메모리 저장 + 프로젝트 설정" → 프로젝트 컨텍스트 영구 저장
```

### 2. 프롬프트 엔지니어링 활용

복잡한 작업은 hi-ai에게 프롬프트 생성을 맡기세요:

```
"REST API를 GraphQL로 마이그레이션하는 작업에 맞는 프롬프트 만들어줘"

→ hi-ai가 최적화된 프롬프트 제공:
  1. 현재 API 스키마 분석
  2. GraphQL 스키마 설계
  3. Resolver 구현
  4. 테스트 케이스 작성
  5. 마이그레이션 검증
```

### 3. 팀 협업에서 활용

일관된 코드 품질 기준을 팀 전체가 공유할 수 있습니다:

```
팀 규칙 설정 → hi-ai 메모리에 저장
모든 팀원이 같은 기준으로 코드 리뷰 받음
일관성 있는 코드베이스 유지
```

## 한계와 고려사항

솔직히 말하면 완벽하지는 않습니다.

**1. 학습 곡선**

처음에는 어떤 키워드가 어떤 도구를 실행하는지 익숙해지는 시간이 필요합니다. 하지만 몇 번 사용해보면 자연스럽게 체득됩니다.

**2. MCP 호환 환경 필요**

Claude Desktop, Cursor 같은 MCP 지원 도구가 필요합니다. 기존 에디터에 바로 통합은 되지 않습니다.

**3. 언어 제한**

현재는 한국어와 영어만 지원합니다. 다른 언어는 추가 개발이 필요합니다.

## hi-ai의 차별점

**키워드 기반 자연어 인터페이스**
다른 MCP 도구들은 정확한 명령어를 요구합니다. hi-ai는 자연어로 의도만 전달하면 알아서 실행됩니다.

**개발 워크플로우 완전 커버**
코드 작성부터 리뷰, 리팩토링까지 34개 도구로 전 과정을 지원합니다.

**성능 최적화**
100ms 이하 응답, 50MB 이하 메모리. 개발 흐름을 방해하지 않습니다.

**오픈소스 + MIT 라이선스**
자유롭게 사용, 수정, 배포 가능합니다. 커뮤니티 기여를 환영합니다.

## 시작해보세요

GitHub: https://github.com/su-record/hi-ai

가장 빠른 시작 방법:

```bash
# 1. 설치
npm install -g @su-record/hi-ai

# 2. MCP 호환 에디터에서 설정
# (Claude Desktop의 경우 자동 인식)

# 3. 바로 사용
"코드 품질 체크해줘"
```

## 핵심 정리

AI와 코딩하는 시대에 필요한 것은 **더 긴 프롬프트가 아니라 더 똑똑한 도구**입니다.

hi-ai MCP의 가치:
- **키워드 하나로 작동**: "코드 품질" → 즉시 분석 실행
- **34개 전문 도구**: 코드 작성부터 리팩토링까지 완전 커버
- **100ms 응답, 50MB 메모리**: 개발 흐름 방해 없음
- **MCP 1.0 표준**: Claude Desktop, Cursor 등 즉시 통합

실제로 fallingo를 개발하면서 이런 도구의 필요성을 절실히 느꼈습니다. AI와 대화하듯 개발하는 시대, 이제 시작입니다.

---

**참고 링크:**
- GitHub: https://github.com/su-record/hi-ai
- Smithery: https://smithery.ai/server/@su-record/hi-ai
- MCP Specification: https://modelcontextprotocol.io
