---
title: "Hermes Agent 운영 노트 2: 프로필로 AI 직원을 나누는 법"
date: "2026-06-22"
category: "tech"
description: "Hermes profiles로 AI 직원의 역할, 기억, 세션, 스킬, 게이트웨이 상태를 분리하는 방법과 Sutory식 멀티에이전트 운영 기준을 정리했다. 직원 한 명을 프로필 하나로 나누고, 권한과 금지선을 분명히 세우는 실무 기준과 시작 순서를 함께 구체적으로 담았다."
draft: false
approved: true
series: "Hermes 운영 노트"
seriesOrder: 2
tags: ["Hermes Agent", "Profiles", "AI 직원", "멀티에이전트"]
author: "Su Ham"
lang: "ko"
publishGate: "Do not publish before explicit #배포-승인. Keep draft: true and approved: false until ready."
---

> 이전 편: [Hermes Agent 운영 노트 1: 채팅봇이 아니라 작업 시스템으로 보기](tech-hermes-operations-01-system.md)

## 한 에이전트에게 모든 일을 시키면 흐려집니다

처음에는 AI 하나에게 모든 일을 맡기고 싶습니다.

기획도 시킵니다. 개발도 시킵니다. 코드 리뷰도 시킵니다. 콘텐츠도 쓰게 합니다. 배포까지 맡깁니다.

가능은 합니다. 하지만 오래 가지 않습니다.

역할이 섞입니다. 기억이 섞입니다. 어떤 도구를 열어야 하는지도 애매해집니다. 기획자처럼 말하다가 갑자기 배포 권한을 행사합니다. 리뷰어가 되어야 할 때도 구현자 관성으로 넘어갑니다.

사람 팀에서는 이 문제를 직무로 나눕니다. Hermes에서는 프로필로 나눕니다.

공식 문서 기준으로 Hermes profile은 별도의 Hermes home directory입니다. 각 프로필은 자기 `config.yaml`, `.env`, `SOUL.md`, memories, sessions, skills, cron jobs, state database를 가집니다. 한 머신에서 여러 에이전트를 굴릴 수 있지만, 상태는 섞이지 않습니다.

---

## 직원 한 명은 프로필 하나입니다

Sutory에서 쓰는 기준은 단순합니다.

AI 직원 한 명은 Hermes profile 하나입니다.

| 분리 대상 | 왜 분리하는가 |
|---|---|
| `SOUL.md` | 정체성, 말투, 금지선을 직원마다 다르게 둡니다 |
| `config.yaml` | 모델, 도구, 승인 모드를 역할에 맞게 조정합니다 |
| `.env` | 플랫폼 토큰과 API 키를 프로필 단위로 관리합니다 |
| memories | 사용자 선호와 운영 사실이 역할별로 쌓입니다 |
| sessions | 대화 이력이 섞이지 않습니다 |
| skills | 반복 업무 절차를 직무별로 다르게 로드합니다 |
| cron jobs | 반복 업무를 담당자별로 나눕니다 |
| gateway state | Discord, Telegram 같은 외부 연결을 직원별로 둡니다 |

이렇게 나누면 AI가 사람처럼 된다는 뜻이 아닙니다. 운영 경계가 생긴다는 뜻입니다.

경계가 있어야 책임도 생깁니다.

---

## 프로필을 만드는 기본 흐름

새 프로필은 이렇게 만듭니다.

```bash
hermes profile create researcher --description "Reads source code and external docs, writes findings."
researcher setup
researcher chat
```

`--description`은 가볍게 보이지만 중요합니다. 칸반 오케스트레이터가 작업을 라우팅할 때 이 설명이 역할 힌트가 됩니다.

이미 설정된 프로필을 바탕으로 만들 수도 있습니다.

```bash
hermes profile create writer --clone
hermes profile create reviewer --clone-from writer
hermes profile create backup --clone-all
```

운영 기준은 다음과 같이 잡았습니다.

| 옵션 | 쓸 때 | 주의할 점 |
|---|---|---|
| blank create | 완전히 다른 직무를 만들 때 | setup을 다시 해야 합니다 |
| `--clone` | 같은 모델·도구를 공유하고 역할만 바꿀 때 | 세션과 기억은 새로 시작합니다 |
| `--clone-from` | 특정 프로필을 기준으로 복제할 때 | 원본을 명확히 지정합니다 |
| `--clone-all` | 백업이나 실험용 복제본이 필요할 때 | 메모리와 cron까지 복사되므로 신중해야 합니다 |

처음부터 8명을 만들 필요는 없습니다. 먼저 3명으로 충분합니다.

---

## 처음 만들 추천 3명

작은 팀은 세 역할이면 시작할 수 있습니다.

| 프로필 | 역할 | 열어줄 도구 |
|---|---|---|
| orchestrator | 요청을 쪼개고 담당자를 정합니다 | kanban, session_search |
| builder | 실제 구현과 문서 작성을 합니다 | terminal, file, web |
| reviewer | 결과를 검토하고 위험을 찾습니다 | file, terminal, web |

콘텐츠 팀이면 이름만 바꿉니다.

| 프로필 | 역할 |
|---|---|
| planner | 주제와 구조를 잡습니다 |
| writer | 초안을 씁니다 |
| publisher | 승인된 것만 배포합니다 |

중요한 것은 이름이 아닙니다. 권한입니다.

publisher에게는 발행 도구가 필요합니다. writer에게는 필요 없습니다. reviewer는 수정 권한보다 검토 권한이 먼저입니다. orchestrator는 직접 구현하지 않고 작업을 나누는 데 집중해야 합니다.

역할을 나누는 이유는 일을 빠르게 하기 위해서만이 아닙니다. 사고를 줄이기 위해서입니다.

---

## SOUL은 소개문이 아니라 경계선입니다

프로필을 만들고 나면 `SOUL.md`가 중요해집니다.

SOUL은 단순한 캐릭터 설정이 아닙니다. 이 직원이 무엇을 하고, 무엇을 하지 않는지 적는 운영 계약입니다.

Gutenberg의 예를 들면 이렇습니다.

- 승인된 콘텐츠를 채널에 배포합니다.
- 채널별 포맷과 스케줄을 지킵니다.
- 발행 로그를 남깁니다.
- `#배포-승인` 없는 콘텐츠는 발행하지 않습니다.

마지막 줄이 핵심입니다.

발행 담당자는 글을 잘 쓰는 사람이 아닙니다. 승인된 것을 정확히 배포하는 사람입니다. 그래서 Gutenberg는 초안을 마음대로 고치거나, 승인 없는 글을 라이브로 보내면 안 됩니다.

이 규칙이 없으면 AI 직원은 친절해지려고 선을 넘습니다. 선을 넘는 친절은 운영에서 위험입니다.

---

## 프로필 설명은 짧고 판별 가능해야 합니다

좋은 description은 멋진 문장이 아닙니다. 라우팅 가능한 문장입니다.

| 나쁜 설명 | 문제 |
|---|---|
| "똑똑한 AI 직원" | 어떤 일을 맡길지 알 수 없습니다 |
| "개발과 기획과 마케팅을 다 잘함" | 역할이 겹칩니다 |
| "콘텐츠 담당" | 작성인지 검수인지 발행인지 모호합니다 |

좋은 설명은 이렇게 씁니다.

| 좋은 설명 | 이유 |
|---|---|
| "Writes Korean blog drafts from approved briefs; does not publish." | 초안 담당임이 분명합니다 |
| "Reviews code changes and reports blocking risks; does not implement." | 리뷰어 경계가 분명합니다 |
| "Publishes approved content to blog and social channels; logs URLs." | 발행 담당임이 분명합니다 |

Hermes를 팀처럼 쓰려면 각 프로필이 잘하는 일을 쓰는 것보다, 하지 말아야 할 일을 같이 적는 편이 낫습니다.

---

## 작게 나누고, 충돌이 보이면 다시 합칩니다

프로필은 많을수록 좋은 것이 아닙니다.

너무 적으면 역할이 섞입니다. 너무 많으면 조율 비용이 커집니다. 처음에는 3명으로 시작하고, 반복적으로 충돌하는 책임이 보일 때만 나누는 편이 낫습니다.

제가 쓰는 기준은 하나입니다.

같은 에이전트에게 반복해서 "이번에는 그 역할 말고 이 역할로 해줘"라고 말하고 있다면, 프로필을 나눌 때입니다.

그 말이 반복된다는 것은 역할이 이미 분리되어 있다는 뜻입니다. 다만 시스템에 아직 반영되지 않았을 뿐입니다.

> 다음 편: [Hermes Agent 운영 노트 3: 칸반과 크론으로 자동화를 끊기지 않게 만들기](tech-hermes-operations-03-automation.md)
