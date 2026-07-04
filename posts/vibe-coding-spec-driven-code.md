---
title: "바이브코딩이란? SPEC이 코드를 쓰게 하는 방식"
date: "2026-07-04"
category: "tech"
description: "title: 바이브코딩이란? SPEC이 코드를 쓰게 하는 방식 date: 2026 07 04 category: methodology description: 바이브코딩은 감으로 AI에게 코드를 맡기는 일이 아니다. SPEC을 단일 진실의 원천으로 두고 요구사항, 제약, 테스트 기"
image: "/images/vibe-coding-spec-driven-code/01.png"
imageAlt: "프롬프트가 아니라 SPEC이 단일 진실의 원천"
author: "Su Ham"
lang: "ko"
---

---
title: 바이브코딩이란? SPEC이 코드를 쓰게 하는 방식
date: 2026-07-04
category: methodology
description: 바이브코딩은 감으로 AI에게 코드를 맡기는 일이 아니다. SPEC을 단일 진실의 원천으로 두고 요구사항, 제약, 테스트 기준을 먼저 고정한다. 그다음 AI가 구현과 수정을 반복하게 만드는 개발 방식이다.
tags:
  - vibe-coding
  - spec-driven-development
  - ai-coding
  - cursor
  - claude-code
author: Su Ham
lang: ko
---

# 바이브코딩이란? SPEC이 코드를 쓰게 하는 방식

## 프롬프트 한 줄은 빠르지만, 오래가지 못했습니다

![프롬프트가 아니라 SPEC이 단일 진실의 원천](/images/vibe-coding-spec-driven-code/01.png)
*명세가먼저*


처음에는 프롬프트 한 줄이면 된다고 생각했습니다. 아니었습니다. AI는 빠르게 만들었고, 문제도 빠르게 만들었습니다.

버튼 하나를 추가해 달라고 했습니다. AI는 버튼을 만들었습니다. 대신 기존 로딩 상태를 깨뜨렸습니다.

API 필드를 하나 바꾸라고 했습니다. AI는 타입을 고쳤습니다. 대신 저장 로직에서 같은 필드를 빠뜨렸습니다.

바이브코딩의 첫인상은 이렇습니다. 원하는 기능을 자연어로 말하면 AI가 코드를 생성하고 수정합니다.

이 용어는 Andrej Karpathy가 2025년에 제안한 표현으로 알려져 있습니다. 핵심은 개발자가 코드를 전부 손으로 치지 않는다는 점입니다.

문제는 그다음입니다. 감으로 시작한 개발은 감으로 무너집니다. 기준이 없으면 AI는 그럴듯해 보이는 코드를 만듭니다.

---

## 바이브코딩과 SPEC 기반 개발은 출발점이 다릅니다

![수용 기준과 테스트가 AI 구현을 통과시키는 문이다](/images/vibe-coding-spec-driven-code/02.png)
*테스트문*


바이브코딩은 대개 즉흥적으로 시작합니다. 지금 보이는 문제를 말하고, 결과를 확인하고, 다시 지시합니다.

작은 스크립트에는 잘 맞습니다. 50줄짜리 변환기나 관리자용 일회성 페이지는 빠르게 만들 수 있습니다.

제품 코드는 다릅니다. 요구사항, 예외, 권한, 데이터 구조, 테스트가 한꺼번에 엮입니다.

SPEC 기반 개발은 출발점을 바꿉니다. 중심에 두는 것은 프롬프트가 아니라 명세서입니다.

| 구분 | 즉흥형 바이브코딩 | SPEC 기반 바이브코딩 |
|---|---|---|
| 시작점 | 자연어 지시 한 줄 | 요구사항과 제약을 담은 SPEC |
| AI 역할 | 코드를 바로 생성 | SPEC을 읽고 구현, 수정, 검증 |
| 사람 역할 | 결과를 보고 계속 지시 | 기준을 정하고 변경을 승인 |
| 실패 방식 | 기존 기능 회귀가 늦게 발견됨 | 수용 기준에서 먼저 걸림 |
| 산출물 | 대화 로그와 코드 | spec.md, task.md, test, 코드 |

SPEC은 단일 진실의 원천입니다. 요구사항이 바뀌면 SPEC이 먼저 바뀝니다. 코드는 그다음입니다.

Cursor, Claude Code, Windsurf, GitHub Copilot, Devin, Codex를 써도 원리는 같습니다.

중요한 것은 도구 순위가 아닙니다. AI가 무엇을 기준으로 코드를 쓰는지입니다.

---

## SPEC은 두꺼운 문서가 아니라, AI가 지켜야 할 계약입니다

![자동화 에이전트에는 숫자로 된 중단 조건이 필요하다](/images/vibe-coding-spec-driven-code/03.png)
*멈춤조건*


SPEC은 30쪽짜리 문서일 필요가 없습니다. 작은 기능 하나라면 60줄 안에서도 충분합니다.

좋은 SPEC에는 최소한 여섯 가지가 들어갑니다. 목표, 입력, 출력, 제약, 수용 기준, 제외 범위입니다.

```yaml
feature: 콘텐츠 초안 자동 생성
goal: 사용자가 주제를 입력하면 sutory가 블로그 초안을 생성한다
actors:
  - 토리
  - 미니
input:
  topic: string, required
  tone: su-voice, fixed
output:
  format: markdown
  length: 2500-4000 korean characters
constraints:
  - H2 소제목 3-5개 사용
  - 이모지 사용 금지
  - 과한 수식어 금지
  - frontmatter 포함
acceptance_criteria:
  - title, date, category, description, tags가 존재한다
  - 첫 문단에 문제 제기가 있다
  - 표 또는 코드 블록이 1개 이상 있다
non_goals:
  - 이미지 생성은 하지 않는다
  - 외부 발행은 하지 않는다
```

이 정도만 있어도 AI의 행동이 달라집니다. 코드를 쓰기 전에 빠진 조건부터 묻기 시작합니다.

수용 기준도 중요합니다. 테스트가 없는 SPEC은 부탁에 가깝습니다. 테스트가 있는 SPEC은 계약에 가깝습니다.

위 기능은 이런 테스트로 내려갈 수 있습니다.

```ts
it('frontmatter 필드를 모두 포함한다', () => {
  const draft = generateDraft({ topic: '바이브코딩이란?' })

  expect(draft).toContain('title:')
  expect(draft).toContain('date:')
  expect(draft).toContain('category:')
  expect(draft).toContain('tags:')
})
```

AI에게 바로 구현을 시키지 않습니다. 먼저 SPEC과 테스트를 함께 읽게 합니다.

그다음 이렇게 지시합니다.

```text
이 SPEC을 만족하는 최소 구현을 작성합니다.
기존 공개 API는 바꾸지 않습니다.
수용 기준을 통과하지 못하면 구현을 멈추고 이유를 설명합니다.
```

짧지만 효과가 있습니다. AI가 마음대로 범위를 넓히기 어려워집니다.

---

## 실제 흐름: sutory 기능 하나를 맡기는 방식

sutory는 hermes 기반 콘텐츠 자동화 시스템입니다. 토리와 미니라는 두 캐릭터가 운영 흐름에 들어갑니다.

여기에 예약 초안 생성 기능을 붙인다고 가정해 보겠습니다. 즉흥형 바이브코딩이라면 이렇게 시작하기 쉽습니다.

```text
매일 아침 8시에 블로그 초안을 만들어 줘.
```

AI는 스케줄러를 만들 수 있습니다. 다만 누가 실행하는지, 실패하면 어떻게 재시도하는지는 알 수 없습니다.

SPEC 기반으로 쓰면 질문이 달라집니다. 기능보다 운영 조건을 먼저 고정합니다.

| 항목 | 결정 |
|---|---|
| 실행 시간 | 매일 08:00 KST |
| 입력 | topic queue의 첫 번째 항목 |
| 실패 처리 | 3회 재시도 후 error log 저장 |
| 중복 방지 | 같은 topic_id는 하루 1회만 생성 |
| 결과 위치 | drafts/YYYY-MM-DD-topic.md |
| 검증 | frontmatter와 본문 길이 검사 |

이 표가 있으면 AI는 스케줄러만 만들지 않습니다. 큐, 로그, 중복 방지까지 함께 봅니다.

Google Gemini Spark 같은 24/7 AI 에이전트도 같은 문제를 가집니다. 태스크, 스킬, 스케줄로 일을 계속 돌릴 수 있습니다.

Gmail, 캘린더, 서드파티 앱과 연결하면 업무 흐름은 자동화됩니다. SPEC이 없으면 잘못된 작업도 24시간 반복됩니다.

자동화의 위험은 속도에 있습니다. 사람이 한 번 틀리면 한 번 고치면 됩니다. 에이전트는 밤새 300번 틀릴 수 있습니다.

그래서 SPEC에는 중단 조건이 필요합니다. 실패율, 재시도 횟수, 권한 범위를 숫자로 적어야 합니다.

```yaml
stop_conditions:
  - retry_count > 3
  - generated_body_length < 2500
  - frontmatter_missing == true
  - same_topic_generated_today == true
```

이런 조건은 사소해 보입니다. 운영에서는 코드보다 오래 남습니다.

---

## 정리: 감은 시작점이고, SPEC은 안전장치입니다

바이브코딩은 코딩을 없애는 방식이 아닙니다. 사람이 직접 타이핑하던 시간을 줄이는 방식입니다.

SDD, 즉 SPEC 기반 개발은 그 시간을 다른 곳으로 옮깁니다. 구현보다 기준 작성에 더 많은 주의를 씁니다.

작은 기능은 프롬프트로 시작해도 됩니다. 오래 유지할 기능은 SPEC부터 쓰는 편이 낫습니다.

제가 쓰는 기준은 단순합니다. 같은 기능을 두 번 이상 수정할 것 같으면 SPEC을 만듭니다.

팀원이 만질 코드라면 SPEC을 만듭니다. 에이전트가 백그라운드에서 실행할 작업이라면 반드시 만듭니다.

AI는 코드를 빠르게 씁니다. 기준이 없을수록 빠른 코드는 빨리 망가집니다.

코드는 AI가 쓸 수 있습니다. 책임을 적어 두는 곳은 SPEC입니다.

---

- 이전 편: [AI 에이전트에게 일을 맡기는 법](/stories/ai-agent-workflow)
- 다음 편: [SPEC 문서 템플릿으로 기능 정의하기](/stories/spec-template)