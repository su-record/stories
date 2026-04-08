---
title: "tory 개발일지 #31 - SOUL 시스템 + ChatRoom 분리 (10개 커밋)"
date: "2026-03-25"
category: "dev-log"
description: "AI 프로필에 영문 정체성·가치관·경계선을 담은 SOUL 시스템을 도입했습니다. 채팅과 회의 엔진을 분리하고 일반 채팅 응답을 스트리밍으로 전환했습니다."
tags: ["tory", "개발일지", "soul", "chatroom", "meeting", "streaming", "secretary"]
author: "Su"
lang: "ko"
---

# tory 개발일지 #31 - SOUL 시스템 + ChatRoom 분리 (10개 커밋)

**작업 기간**: 2026-03-24 ~ 2026-03-25

## 📝 이번 기간 작업 내용

### 프로필 SOUL 시스템 도입 (1개 커밋)

각 AI 프로필에 `soul` 필드를 추가했다. 영문으로 작성된 정체성(identity), 가치관(values), 경계선(boundaries) 세 항목으로 구성된다. 한국어 프롬프트와 별개로 영문 SOUL이 LLM 호출 시 시스템 프롬프트에 주입되어 페르소나 일관성을 높인다. `packages/shared/src/profiles.json`이 SSOT이며 Rust `catalog.rs`와 TS `profiles.ts` 양쪽에서 소비한다.

| 커밋 | 내용 |
|------|------|
| `feat(shared,llm,meeting): 프로필 SOUL 시스템 추가 — 영문 정체성 + 가치관 + 경계선` | SOUL 필드 추가 및 LLM 주입 |

### ChatRoom 엔진 분리 + 엔진 분기 (3개 커밋)

기존에는 채팅과 회의가 같은 FreeformEngine을 사용했다. 일반 채팅에서 수렴 판정과 종합 단계가 불필요하게 실행되는 문제가 있었다. `ChatRoomEngine`을 신규 추가하고 Secretary에서 conversation type에 따라 엔진을 분기했다. `chat` 타입은 ChatRoomEngine, `meeting` 타입은 FreeformEngine으로 라우팅된다.

| 커밋 | 내용 |
|------|------|
| `feat(meeting): ChatRoomEngine 추가 — 상시 대화 채팅방 엔진 (수렴/종합 없음)` | ChatRoomEngine 신규 구현 |
| `feat(secretary): conversation type별 엔진 분기 — chat→ChatRoomEngine, meeting→FreeformEngine` | 엔진 분기 로직 |
| `Merge pull request #23 from su-record/feat/chatroom-meeting-separation` | PR 머지 |

### workspace_path 연동 + 프론트엔드 타입 확장 (2개 커밋)

`chat_send` 커맨드에 `workspace_path` 파라미터를 추가하고 `set_conversation_workspace` 커맨드를 신규 등록했다. 프론트엔드 `Conversation` 타입에는 `type(chat/meeting)`과 `workspacePath` 필드를 추가했다. 도구 실행 시 해당 conversation의 workspace 경로를 사용할 수 있게 됐다.

| 커밋 | 내용 |
|------|------|
| `feat(desktop): chat_send에 workspace_path 전달 + set_conversation_workspace 커맨드 추가` | 커맨드 확장 |
| `feat(desktop): Conversation에 type(chat/meeting) + workspacePath 프론트엔드 연동` | 프론트엔드 타입 연동 |

### ToolExecutor SharedWorkspace + 스트리밍 전환 + 버그 수정 (4개 커밋)

`ToolExecutor`의 workspace를 `SharedWorkspace(RwLock)`로 교체해 런타임에 경로 교체가 가능하도록 했다. 일반 채팅 응답을 `ask_one`에서 `stream_one`으로 전환해 스트리밍 방식으로 바꿨다. 이후 스트리밍 폴백 시 빈 응답이 전달되는 버그와 roster가 비었을 때 응답이 없는 버그를 연달아 수정했다.

| 커밋 | 내용 |
|------|------|
| `refactor(tools): ToolExecutor workspace를 SharedWorkspace(RwLock)로 변경 — 런타임 교체 가능` | workspace RwLock 전환 |
| `feat(secretary): 일반 채팅 응답을 스트리밍으로 변경 — ask_one → stream_one` | 스트리밍 전환 |
| `fix(desktop): 스트리밍 폴백 시 빈 응답 수정 — ToryResponse emit 복원` | 폴백 빈 응답 수정 |
| `fix(secretary): 빈 응답 방어 — roster 비었을 때 안내 + 응답 실패 시 에러 전달` | 방어 로직 추가 |

## 💡 작업 하이라이트

**SOUL: 페르소나를 코드로 고정하다**

AI 프로필의 `system_prompt`는 한국어 역할 기술이었다. 그런데 다국어 입력이 들어오거나 LLM이 프롬프트를 재해석할 때 페르소나가 흔들리는 경우가 있었다. 영문 SOUL을 별도 필드로 분리해 시스템 프롬프트 최상단에 고정하면 모델이 역할을 더 일관되게 유지한다. identity는 "나는 누구인가", values는 "무엇을 중시하는가", boundaries는 "무엇을 하지 않는가"로 구분했다. 간결한 영문 선언문 형태로 작성해 토큰 낭비를 줄였다.

**채팅과 회의는 다른 엔진이 필요하다**

FreeformEngine은 회의를 위해 설계됐다. 여러 AI가 발언하고 수렴 여부를 평가하며 종합 단계를 거친다. 일반 채팅에서 이 과정을 거치면 응답이 느리고 불필요한 오버헤드가 발생한다. ChatRoomEngine은 수렴 판정과 종합을 제거하고 단순 발언 순환만 남겼다. conversation type을 `chat`과 `meeting`으로 명시적으로 구분함으로써 향후 엔진 추가도 자연스럽게 확장할 수 있게 됐다.

## 📊 개발 현황

- **커밋**: 10개
- **핵심**: SOUL 시스템 도입, ChatRoomEngine 분리, chat/meeting 엔진 분기, 스트리밍 전환, workspace RwLock 교체
