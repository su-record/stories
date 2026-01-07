---
title: "Vibe v1.0: AI가 스스로 품질을 챙기는 자동화 시대"
date: "2026-01-07"
category: "tech"
description: "Hooks 기반 자동 오케스트레이션, 멀티 LLM 협업, 세션 연속성, 팀 협업 설정 공유. Claude Code 네이티브로 동작하는 AI 코딩 프레임워크"
tags: ["vibe", "ai-coding", "claude-code", "hooks", "automation", "release", "v1.0"]
author: "Su"
lang: "ko"
---

# Vibe v1.0: AI가 스스로 품질을 챙기는 자동화 시대

## 1.0이 되었습니다

v0.4에서 2-Step 워크플로우로 단순화했습니다. v1.0에서는 한 단계 더 나아갑니다.

**개발자가 신경 쓸 필요 없이, AI가 알아서 품질을 챙깁니다.**

---

## Claude Code Hooks 기반 자동 오케스트레이션

v1.0의 핵심은 **Hooks**입니다.

### 자동으로 일어나는 일들

```
코드 작성 → 자동 품질 검사
  ├ PostToolUse: Write|Edit
  └ ".vibe/rules/quality/checklist.md 기준으로 검토하세요"

컨텍스트 85% → 자동 상태 저장
  ├ Notification: context_window_85
  └ "mcp__vibe__auto_save_context로 현재 상태 저장"

컨텍스트 95% → 세션 전환 준비
  ├ Notification: context_window_95
  └ "TodoWrite로 진행 상황 기록, 핵심 컨텍스트만 유지"

세션 종료 → 미완료 작업 기록
  ├ Stop: .*
  └ "TodoWrite로 미완료 작업 기록, 다음 세션 복원 안내"

새 세션 시작 → 이전 상태 복원
  ├ UserPromptSubmit: .*
  └ "mcp__vibe__start_session으로 이전 컨텍스트 복원"
```

개발자는 `/vibe.spec`과 `/vibe.run`만 실행합니다. 나머지는 AI가 알아서 합니다.

### Hooks 설정 예시

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [{
          "type": "prompt",
          "prompt": ".vibe/rules/quality/checklist.md 기준으로 검토하세요"
        }]
      }
    ],
    "Notification": [
      {
        "matcher": "context_window_85",
        "hooks": [{
          "type": "prompt",
          "prompt": "mcp__vibe__auto_save_context로 현재 상태 저장"
        }]
      }
    ]
  }
}
```

---

## 멀티 LLM 협업

Claude만 쓰지 않습니다. GPT와 Gemini도 함께 씁니다.

### 설정

```bash
vibe gpt <api-key>      # GPT 연동
vibe gemini <api-key>   # Gemini 연동
```

### 활용 시나리오

**GPT 5.2로 아키텍처 리뷰**

```
[Claude Code에서]
이 설계에 대해 GPT 관점에서 검토해줘

→ MCP 도구로 GPT API 호출
→ 다른 관점의 피드백 수집
→ Claude가 종합하여 결정
```

**Gemini 3로 UI/UX 조언**

```
[Claude Code에서]
이 UI 컴포넌트에 대해 Gemini 관점에서 개선점 알려줘

→ Gemini API 호출
→ 디자인 개선 제안 수집
→ Claude가 구현에 반영
```

Claude Code가 메인이지만, 다른 LLM의 강점을 활용합니다.

---

## 세션 연속성

AI와 대화하다가 컨텍스트가 끊기면 처음부터 다시 설명해야 했습니다.

v1.0에서는 자동으로 이어집니다.

### 동작 방식

**컨텍스트 85% 도달 시:**

```
⚠️ 컨텍스트 85% 도달 (선제적 압축 권고)
1) mcp__vibe__auto_save_context로 현재 상태 저장
2) 오래된 도구 출력은 요약으로 대체
3) 핵심 정보만 유지하면서 작업 계속
```

**세션 종료 시:**

```
세션 종료 전 체크리스트:
1) TodoWrite로 미완료 작업 기록
2) mcp__vibe__auto_save_context로 현재 상태 저장
3) 다음 세션 시작 시 복원 안내
```

**새 세션 시작 시:**

```
mcp__vibe__start_session 호출
→ 저장된 메모리 복원
→ 미완료 작업 확인
→ 이전 컨텍스트에서 이어서 작업
```

긴 작업도 끊김 없이 진행합니다.

---

## 팀 협업

혼자 쓸 때는 몰랐습니다. 팀원이 합류하면 문제가 생깁니다.

- "어떤 규칙으로 코딩해야 해?"
- "슬래시 커맨드가 뭐가 있어?"
- "설정 어떻게 해?"

### v1.0 해결책

```bash
git clone <repo>
npm install
# → .vibe/rules/, .claude/commands/ 자동 설치
# → hooks 자동 설정
# → 동일한 환경에서 바로 시작
```

팀 전체가 동일한 코딩 규칙, 동일한 품질 기준, 동일한 워크플로우로 작업합니다.

### 공유되는 것들

```
.vibe/rules/        # 코딩 규칙
.claude/commands/   # 슬래시 커맨드
.claude/agents/     # 서브에이전트
.claude/settings.local.json  # Hooks 설정
```

설정 파일이 git에 포함되어 있어서 별도 설정 없이 바로 시작합니다.

---

## v0.4 → v1.0 변경 요약

| 항목 | v0.4.x | v1.0.x |
|------|--------|--------|
| 품질 관리 | 수동 검토 | Hooks 자동 |
| 컨텍스트 관리 | 수동 저장 | 자동 저장/복원 |
| LLM | Claude만 | Claude + GPT + Gemini |
| 팀 협업 | 각자 설정 | git clone으로 동기화 |

---

## 설치 및 업데이트

### 신규 설치

```bash
npm install -g @su-record/vibe
vibe init
```

### 기존 사용자 업데이트

```bash
npm update -g @su-record/vibe
vibe update
```

---

## 실제 사용 흐름

```
1. /vibe.spec "로그인 기능"
   → 대화형 요구사항 수집
   → SPEC 문서 + BDD Feature 생성

2. /vibe.run "로그인 기능"
   → 코드 작성
   → [자동] 품질 검사 (Hooks)
   → [자동] 규칙 준수 확인

3. 작업 중 컨텍스트 85% 도달
   → [자동] 상태 저장

4. 세션 종료
   → [자동] 미완료 작업 기록

5. 다음 세션 시작
   → [자동] 이전 상태 복원
   → 끊김 없이 계속

6. /vibe.verify "로그인 기능"
   → Acceptance Criteria 검증
   → 품질 점수 확인
```

개발자가 하는 것: spec, run, verify
AI가 하는 것: 품질 검사, 컨텍스트 관리, 규칙 준수

---

## 마무리

v1.0의 핵심 메시지:

> **개발자는 "무엇을"에 집중하고, AI는 "어떻게"를 알아서 챙깁니다.**

Hooks 기반 자동화로 품질 관리의 부담을 줄이고, 세션 연속성으로 끊김 없는 작업을, 멀티 LLM 협업으로 다양한 관점을, 팀 협업 설정 공유로 일관된 개발 환경을 제공합니다.

---

> 이전 편: [Vibe v0.4: 2-Step 워크플로우로 단순화](tech-vibe-03.md)

**GitHub**: https://github.com/su-record/vibe
**NPM**: https://www.npmjs.com/package/@su-record/vibe
