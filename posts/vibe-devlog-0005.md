---
title: "vibe 개발일지 #5 - ULTRAWORK 모드와 훅 시스템 (10개 커밋)"
date: "2026-01-08"
category: "dev-log"
description: "ULTRAWORK 모드 도입, 훅 시스템 안정화"
tags: ["vibe", "개발일지", "ULTRAWORK", "hooks"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #5 - ULTRAWORK 모드와 훅 시스템 (10개 커밋)

**작업 기간**: 2026-01-08

## 📝 이번 기간 작업 내용

### ULTRAWORK 모드 도입 (10개 커밋)

최대 성능을 위한 **ULTRAWORK 모드**를 도입했습니다. 그리고 훅 시스템의 여러 안정성 이슈를 해결했습니다.

| 커밋 | 내용 |
|------|------|
| `feat: add ULTRAWORK mode for maximum performance` | **ULTRAWORK 모드!** |
| `refactor: convert AI instructions from Korean to English` | 영어 프롬프트 전환 |
| `feat: add ambiguity scan to /vibe.spec` | 모호성 스캔 기능 |
| `feat: add SessionStart hook for auto context restoration` | 세션 시작 훅 |
| `fix: gitignore .vibe/mcp/ instead of just node_modules` | gitignore 수정 |
| `fix: remove UserPromptSubmit hook (matcher not supported)` | 훅 호환성 수정 |
| `fix: disable hooks temporarily - causing Claude to freeze` | 훅 비활성화 |
| `fix: install hi-ai in .vibe/mcp/ instead of project root` | 설치 경로 변경 |
| `fix: add typescript dependency for hi-ai MCP runtime` | 의존성 추가 |
| `fix: add $ARGUMENTS to all slash commands` | 인자 전달 수정 |

## 💡 작업 하이라이트

**ULTRAWORK 모드**

`ultrawork` 또는 `ulw` 키워드를 추가하면 최대 성능 모드가 활성화됩니다:

```bash
/vibe.run "feature-name" ultrawork
```

- 병렬 서브에이전트 탐색 (3개 이상 동시)
- 페이즈 간 파이프라이닝 (대기 시간 제거)
- Boulder Loop (모든 페이즈 완료까지 자동 진행)
- 에러 시 자동 재시도 (최대 3회)

**훅 시스템의 교훈**

훅 시스템을 도입하면서 많은 안정성 이슈를 만났습니다. Claude가 멈추는 현상, matcher 미지원 등의 문제를 하나씩 해결하며 시스템을 안정화했습니다.

## 📊 개발 현황

- **버전**: v1.0.8 → v1.2.0
- **새 기능**: ULTRAWORK 모드, 모호성 스캔
- **안정화**: 훅 시스템 5개 이상 버그 수정
