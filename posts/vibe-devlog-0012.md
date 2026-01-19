---
title: "vibe 개발일지 #12 - Hook 기반 GPT/Gemini 통합 (10개 커밋)"
date: "2026-01-16"
category: "dev-log"
description: "MCP 제거하고 Hook 기반 직접 API 호출로 전환, Windows 크로스 플랫폼"
tags: ["vibe", "개발일지", "Hooks", "크로스플랫폼"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #12 - Hook 기반 GPT/Gemini 통합 (10개 커밋)

**작업 기간**: 2026-01-16

## 📝 이번 기간 작업 내용

### MCP → Hook 기반 전환 (10개 커밋)

GPT/Gemini MCP 서버를 제거하고, **Hook 기반 직접 API 호출**로 전환했습니다. 훨씬 단순하고 안정적입니다.

| 커밋 | 내용 |
|------|------|
| `refactor: remove GPT/Gemini MCP, use Hook-based direct API calls` | **Hook 기반 전환!** |
| `fix: remove project-local settings.json during update` | 설정 정리 |
| `fix: show actual OAuth status in vibe status command` | 상태 표시 수정 |
| `fix: use daily sandbox endpoint first for Gemini API` | Gemini 엔드포인트 |
| `fix: update hooks to guide Claude for direct API calls instead of MCP` | 훅 가이드 |
| `fix: replace all echo with node -e for GPT/Gemini hooks` | Windows 호환 |
| `fix: use global npm path for GPT/Gemini hooks on Windows` | 전역 경로 |
| `fix: 모든 훅 Windows 전역 경로 지원` | Windows 지원 |
| `fix: separate GPT/Gemini hook matchers with negative lookahead` | 매처 분리 |
| `fix: cross-platform hook path resolution for Windows/macOS/Linux` | **크로스플랫폼!** |

## 💡 작업 하이라이트

**MCP에서 Hook으로**

MCP 서버 방식은 복잡하고 불안정했습니다. Hook 기반으로 전환하면서:

| Before (MCP) | After (Hook) |
|--------------|--------------|
| 별도 MCP 서버 프로세스 | 단일 프로세스 |
| JSON-RPC 통신 | 직접 API 호출 |
| 복잡한 등록/해제 | 훅 스크립트만 |

**크로스 플랫폼 경로 해결**

Windows, macOS, Linux 모두에서 동작하는 경로 해결 방식을 구현했습니다:

```javascript
// 크로스플랫폼 경로
const VIBE_PATH = process.env.APPDATA
  || path.join(os.homedir(), '.config');
```

Windows의 `%APPDATA%`와 Unix의 `~/.config`를 모두 지원합니다.

## 📊 개발 현황

- **버전**: v2.4.5 → v2.4.28
- **아키텍처**: MCP 서버 → Hook 기반
- **플랫폼**: Windows/macOS/Linux 크로스플랫폼
