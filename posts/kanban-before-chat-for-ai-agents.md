---
title: "AI 에이전트 팀에는 채팅보다 Kanban이 먼저입니다"
date: "2026-07-22"
category: "tech"
description: "AI 에이전트 7개를 동시에 돌리면, 진짜 문제는 속도가 아니라 책임 소재입니다. 채팅창은 처음 30분 정도만 편합니다. 세 번째 에이전트가 같은 파일을 건드리기 시작하면 로그는 금방 뒤엉킵니다. 누가 무엇을 끝냈는지, 어디서 멈췄는지 확인하는 데 작업보다 더 많은 시간이 들어"
image: "/images/kanban-before-chat-for-ai-agents/01.png"
imageAlt: "Kanban은 작업 목록이 아니라 책임 장부"
author: "Su Ham"
lang: "ko"
---

AI 에이전트 7개를 동시에 돌리면, 진짜 문제는 속도가 아니라 책임 소재입니다.

채팅창은 처음 30분 정도만 편합니다.
세 번째 에이전트가 같은 파일을 건드리기 시작하면 로그는 금방 뒤엉킵니다.
누가 무엇을 끝냈는지, 어디서 멈췄는지 확인하는 데 작업보다 더 많은 시간이 들어갑니다.

## 보드는 작업 목록이 아니라 책임 장부입니다

![Kanban은 작업 목록이 아니라 책임 장부](/images/kanban-before-chat-for-ai-agents/01.png)
*책임장부*


Hermes Agent 문서는 Kanban을 multi-profile, multi-project collaboration board로 설명합니다.
핵심은 예쁜 카드 UI가 아닙니다.
여러 프로필이 같은 보드에서 shared task를 보고, 각자 실행하고, 막힌 지점을 남기는 구조입니다.

AGENTS.md는 이 보드를 durable SQLite-backed board라고 요약합니다.
이 표현이 핵심에 가깝습니다.
채팅 컨텍스트가 날아가도 보드는 남습니다. 재시작한 뒤에도 작업 상태를 다시 잡을 수 있습니다.

commit `feat(kanban): durable multi-profile collaboration board (#16081)`도 같은 방향을 보여줍니다.
Kanban은 부가 기능이라기보다 에이전트 협업의 저장 계층에 가깝습니다.

| 방식 | 2개 에이전트 | 7개 에이전트 |
|---|---:|---:|
| 채팅 로그 | 대화로 추적 가능 | 중복 작업과 누락 발생 |
| 개인 TODO | 빠르게 시작 가능 | 전체 상태가 보이지 않음 |
| 공유 Kanban | 약간 번거로움 | 책임자와 blocker가 남음 |

2026년 6월 Reddit 사례는 Hermes Kanban으로 seven or more AI agents를 조율했다고 설명합니다.
API로 작업을 만들고, web UI에서 상태를 추적했습니다.
규모가 커지면 보드가 필요해진다는 점을 보여주는 사례입니다.

## 여러 프로필은 역할이 아니라 실행 경계입니다

![프로필은 역할명이 아니라 실행 경계](/images/kanban-before-chat-for-ai-agents/02.png)
*실행경계*


AI 팀에서 profile은 사람 이름 대신 실행 경계를 만듭니다.
planner, backend, test, reviewer를 한 프로젝트에 붙이면 충돌이 줄어듭니다.

Norbert Hranitzky의 write-up은 default container가 all profiles용 task를 만든다고 설명합니다.
profile-specific container는 독립 실행됩니다.
이 구조에서는 전체 지시와 개별 실행이 분리됩니다.

| 프로필 | 맡길 작업 | 보드에 남겨야 할 출력 |
|---|---|---|
| planner | 요구사항 분해, 의존성 정리 | 카드 5~8개, 우선순위 |
| backend | API 구현, DB 변경 | PR 링크, migration 파일 |
| test | 재현 스크립트, 회귀 테스트 | 실패 로그, 테스트 명령 |
| reviewer | diff 검토, 위험 표시 | 승인 또는 blocker 사유 |

제가 결제 장애 재현 작업을 쪼갠다면, 첫 카드는 로그 수집입니다.
두 번째는 실패 재현입니다. 세 번째는 수정안입니다. 네 번째는 회귀 테스트입니다.
한 프로필이 네 카드를 전부 붙잡지 않게 하는 것이 핵심입니다.

이때 Kanban은 업무 배분표가 됩니다. 충돌을 막는 장치이기도 합니다.
backend가 수정 중이면 reviewer는 기다립니다. test는 재현 로그부터 확보합니다.

## 막힘은 실패가 아니라 인터페이스입니다

![Blocker는 실패가 아니라 다음 행동을 정하는 인터페이스](/images/kanban-before-chat-for-ai-agents/03.png)
*막힘신호*


에이전트 협업에서 가장 위험한 상태는 조용히 계속 진행하는 상태입니다.
권한이 없거나, 스펙이 불명확하거나, 테스트가 깨졌는데도 그럴듯한 답을 만들어낼 수 있습니다.

Anthropic은 2026년 7월 18일 자율형 에이전트의 통제 불가능한 행동을 공식적으로 경고했습니다.
문명적 위험까지 가지 않아도 됩니다. 작은 개발팀에서는 잘못된 자동 merge 하나면 충분합니다.

그래서 blocker는 예외가 아닙니다. 프로토콜입니다.
Hermes Kanban 문서의 `kanban_block`, `kanban_unblock`은 이 지점을 직접 다룹니다.

```yaml
task: reproduce-checkout-timeout
owner: test-profile
state: blocked
reason: staging 로그 접근 권한 없음
needed_from: human-operator
evidence:
  - curl 명령은 504를 재현함
  - request_id가 로그 시스템에서 조회되지 않음
next_when_unblocked: 같은 request_id로 backend trace 확인
```

이 정도로 막힘을 남기면 다음 행동이 분명해집니다.
사람은 권한을 열어주면 됩니다. backend profile은 trace 위치를 확인하면 됩니다.
에이전트가 추측으로 코드를 고칠 이유도 줄어듭니다.

## 명령은 적을수록 오래 갑니다

Hermes Agent 문서는 Kanban 도구로 `kanban_show`, `kanban_create`, `kanban_complete`, `kanban_block`, `kanban_unblock`을 나열합니다.
도구가 다섯 개라서 좋습니다. 운영 규칙을 짧게 만들 수 있습니다.

```bash
kanban_create project=checkout title=reproduce-timeout owner=test-profile
kanban_show project=checkout
kanban_block task=reproduce-timeout reason=staging-log-access-denied
kanban_unblock task=reproduce-timeout note=log-access-granted
kanban_complete task=reproduce-timeout result=504-reproduced-with-request-id
```

저는 상태를 더 늘리지 않습니다.
todo, doing, blocked, done 네 개면 충분했습니다.
상태가 여덟 개로 늘면, 에이전트는 일을 하기 전에 상태 해석부터 합니다.

| 상태 | 의미 | 금지할 행동 |
|---|---|---|
| todo | 아직 실행 전 | owner 없이 방치 |
| doing | 한 프로필이 처리 중 | 다른 프로필의 동시 수정 |
| blocked | 외부 입력 필요 | 추측 기반 진행 |
| done | 검증 증거 있음 | 로그 없는 완료 처리 |

완료 기준도 짧아야 합니다.
코드 작업이면 PR 링크가 있어야 합니다. 테스트 작업이면 실행 명령과 결과가 있어야 합니다.
분석 작업이면 근거 URL이나 로그 위치가 있어야 합니다.

## 좋은 보드는 에이전트를 느리게 만들지 않습니다

처음에는 Kanban이 느려 보입니다.
카드를 만들고, owner를 붙이고, blocker를 남기는 일이 손해처럼 느껴집니다.
하지만 4개 프로필을 넘으면 손해는 채팅 로그에서 터집니다.

보드가 없으면 같은 파일을 두 번 고칩니다.
테스트 실패가 사라집니다. 리뷰어는 마지막 답변만 보고 승인합니다.
가장 비싼 문제는 중복이 아닙니다. 근거 없는 진행입니다.

제가 쓰는 기준은 단순합니다.

- 1개 에이전트: 채팅으로 충분합니다.
- 2~3개 에이전트: 간단한 TODO가 필요합니다.
- 4개 이상 프로필: 공유 Kanban이 필요합니다.
- 권한, 배포, 결제, 보안 작업: 숫자와 관계없이 blocker 기록이 필요합니다.

Kanban은 AI를 더 똑똑하게 만들지 않습니다.
대신 AI가 어디까지 알고, 어디서 멈췄는지 보이게 합니다.
여러 프로필이 한 보드를 보면, 협업은 프롬프트보다 상태 관리에 가까워집니다.

---

이전 편: [AI 에이전트에게 일을 맡기기 전에 정할 것](/stories/ai-agent-operating-rules)
다음 편: [프로필별 컨텍스트 격리와 리뷰 루프](/stories/profile-context-review-loop)