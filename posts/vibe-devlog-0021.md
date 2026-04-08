---
title: "vibe 개발일지 #21 - OAuth 전면 제거와 모델 업데이트 (10개 커밋)"
date: "2026-03-06"
category: "dev-log"
description: "GPT 5.4 전환, Gemini 3.1 업데이트, OAuth 완전 제거, PR #27 병합"
tags: ["vibe", "개발일지", "GPT 5.4", "Gemini 3.1", "OAuth 제거"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #21 - OAuth 전면 제거와 모델 업데이트 (10개 커밋)

**작업 기간**: 2026-03-05 ~ 2026-03-06

## 📝 이번 기간 작업 내용

### 모델 세대교체와 인증 단순화 (10개 커밋)

| 커밋 | 내용 |
|------|------|
| `update orchestration model from gpt-5.3-codex to gpt-5.4` | GPT 5.4 전환 |
| `split model usage: gpt-5.4 for reasoning, gpt-5.3-codex for coding` | 역할 분리 |
| `remove all legacy GPT models, unify on gpt-5.4/gpt-5.4-pro` | 레거시 정리 |
| `Revert "remove all legacy GPT models..."` | **롤백!** |
| `remove 5.2/5.1 legacy models, keep gpt-5.3-codex for coding` | 점진적 제거 |
| `update Gemini models: gemini-3-pro → gemini-3.1-pro` | Gemini 3.1 |
| `update Gemini Flash → 3.1 Flash-Lite, image → 3.1 Flash Image` | Flash 업데이트 |
| `fix: voice model should use registry keys, not raw model IDs` | 모델 ID 수정 |
| `remove Gemini OAuth (Antigravity/v1internal)` | **Gemini OAuth 제거** |
| `clean up remaining Antigravity/OAuth references` | 잔여 참조 정리 |

## 💡 작업 하이라이트

**GPT 5.4 전환과 롤백 에피소드**

GPT 5.3-codex에서 5.4로 전환하면서, 처음엔 모든 레거시 모델을 한번에 제거했습니다. 하지만 코딩 태스크에서 gpt-5.3-codex의 성능이 여전히 좋아서 **즉시 롤백** 후 점진적으로 5.2/5.1만 제거하는 방식으로 변경:

```
시도: gpt-5.4 통일 → 롤백!
결과: gpt-5.4 (추론) + gpt-5.3-codex (코딩) 이원 체제
```

**Gemini 3.1 세대 전환**

Gemini도 3.0에서 3.1로 일괄 업데이트했습니다:

| 용도 | Before | After |
|------|--------|-------|
| 추론 | gemini-3-pro-preview | gemini-3.1-pro-preview |
| 빠른 작업 | gemini-3-flash | 3.1-flash-lite |
| 이미지 | gemini-3-flash-image | 3.1-flash-image |

**OAuth 완전 제거**

#18에서 GPT OAuth를 제거했는데, 이번에 Gemini OAuth(Antigravity/v1internal)까지 완전히 제거했습니다. 이제 인증은 CLI + API Key 두 가지만 남았습니다:

```
Before: OAuth + CLI + API Key (3가지)
After:  CLI + API Key (2가지)
```

## 📊 개발 현황

- **버전**: v2.7.12 (모델 업데이트, 아직 릴리스 전)
- **핵심**: GPT 5.4/Gemini 3.1 전환, OAuth 완전 제거
- **PR**: #27 병합 (모델 업데이트 + OAuth 제거)

---

**다음 개발일지**: vibe-devlog-0022 (다음 10개 커밋 후)
