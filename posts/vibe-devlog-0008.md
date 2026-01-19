---
title: "vibe 개발일지 #8 - v2.1.0 복합 엔지니어링 기능 (10개 커밋)"
date: "2026-01-11"
category: "dev-log"
description: "스택 인식 리뷰어, Windows 호환성, libuv 핸들 충돌 해결"
tags: ["vibe", "개발일지", "v2.1.0", "Windows"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #8 - v2.1.0 복합 엔지니어링 기능 (10개 커밋)

**작업 기간**: 2026-01-11

## 📝 이번 기간 작업 내용

### 복합 엔지니어링 기능과 Windows 호환성 (10개 커밋)

**v2.1.0**에서 스택 인식 리뷰어 선택 기능을 추가하고, Windows 호환성 문제를 대폭 개선했습니다.

| 커밋 | 내용 |
|------|------|
| `feat: v2.1.0 - add compound engineering features` | **v2.1.0!** |
| `fix: research timing - run after requirements confirmed` | 리서치 타이밍 수정 |
| `refactor: convert command/agent descriptions to English` | 영어 전환 |
| `fix: refine hook matchers to reduce false positives` | 훅 매처 개선 |
| `docs: update README for v2.1.0 features` | 문서 업데이트 |
| `feat: add stack-aware reviewer selection in /vibe.review` | **스택 인식 리뷰어!** |
| `refactor: CLI를 동작 중심 명령어 체계로 변경` | CLI 개선 |
| `fix: OAuth 서버 종료 시 libuv 핸들 충돌 해결` | **libuv 버그 수정** |
| `fix: Windows에서 claude CLI 경로 자동 탐지` | Windows 경로 |
| `fix: Windows 호환성 개선 및 MCP 등록 안정화` | Windows 안정화 |

## 💡 작업 하이라이트

**스택 인식 리뷰어**

프로젝트의 기술 스택을 감지하여 적절한 리뷰어를 자동 선택합니다:

| 감지된 스택 | 선택되는 리뷰어 |
|------------|---------------|
| React | react-reviewer |
| TypeScript | typescript-reviewer |
| Python | python-reviewer |
| Rails | rails-reviewer |

**libuv 핸들 충돌 해결**

Windows에서 OAuth 서버 종료 시 발생하는 libuv 핸들 충돌을 해결했습니다. Node.js의 비동기 이벤트 루프와 HTTP 서버 종료 타이밍 문제였습니다.

```javascript
// Before: 서버 즉시 종료 → 크래시
server.close();

// After: 연결 정리 후 종료
server.close(() => process.exit(0));
```

## 📊 개발 현황

- **버전**: v2.0.0 → v2.1.0
- **핵심**: 스택 인식 리뷰어, Windows 호환성
- **버그 수정**: libuv 핸들 충돌, Windows 경로 문제
