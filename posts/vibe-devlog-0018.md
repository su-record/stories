---
title: "vibe 개발일지 #18 - v2.7 탄생과 대청소 (10개 커밋)"
date: "2026-02-19"
category: "dev-log"
description: "v2.7 시작, 훅 스크립트 10개 삭제(-1,764줄), GPT OAuth 제거, Codex CLI 전환"
tags: ["vibe", "개발일지", "v2.7", "Codex CLI", "리팩토링"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #18 - v2.7 탄생과 대청소 (10개 커밋)

**작업 기간**: 2026-02-19

## 📝 이번 기간 작업 내용

### v2.7 대청소 (10개 커밋)

v2.4 이후 한 달간의 공백을 깨고, v2.7의 첫 커밋이 올라왔습니다. 그런데 첫 작업이 기능 추가가 아니라 **대청소**였습니다.

| 커밋 | 내용 |
|------|------|
| `initial commit` | v2.7 시작점 설정 |
| `chore: 불필요한 훅 스크립트 10개 삭제 (-1,764줄)` | **-1,764줄!** |
| `refactor: post-edit.js grep spawn → fs.readFileSync (63→31줄)` | spawn 제거 |
| `fix: postinstall {{VIBE_PATH}} 템플릿 치환 누락 수정` | 템플릿 버그 수정 |
| `refactor: GPT OAuth 제거, CLI 기반 호출 전환` | **OAuth → CLI** |
| `feat: Codex CLI credential 자동 감지 + ast-grep optional dep` | Codex CLI 통합 |

## 💡 작업 하이라이트

**훅 스크립트 대청소 (-1,764줄)**

v2.4까지 쌓여온 훅 스크립트 중 실제로 사용되지 않는 10개를 한번에 삭제했습니다. 1,764줄이 사라졌지만 기능은 하나도 빠지지 않았습니다. 복잡도만 줄었습니다.

**GPT OAuth → CLI 전환**

GPT 연동에 OAuth 플로우를 사용하던 방식을 완전히 제거하고, `codex exec` / `gemini -p` 같은 CLI 기반 호출로 전환했습니다. 인증 복잡도가 크게 줄어들었습니다:

```
Before: OAuth 토큰 발급 → 갱신 → API 호출
After:  codex exec "prompt" (CLI가 인증 처리)
```

**Codex CLI credential 자동 감지**

Codex CLI가 설치되어 있으면 자동으로 감지하고, `ast-grep`은 optional dependency로 전환하여 설치 실패 시에도 vibe가 정상 동작하도록 변경했습니다.

## 📊 개발 현황

- **버전**: v2.7.0 → v2.7.4
- **핵심**: 코드 정리(-1,764줄), OAuth 제거, CLI 전환
- **철학 전환**: 복잡한 인증 → CLI 위임

---

**다음 개발일지**: vibe-devlog-0019 (다음 10개 커밋 후)
