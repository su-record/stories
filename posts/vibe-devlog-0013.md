---
title: "vibe 개발일지 #13 - Dual Auth와 context7 플러그인 (10개 커밋)"
date: "2026-01-17"
category: "dev-log"
description: "OAuth + API Key 이중 인증, context7 플러그인 통합, SPEC 리뷰 자동화"
tags: ["vibe", "개발일지", "OAuth", "context7"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #13 - Dual Auth와 context7 플러그인 (10개 커밋)

**작업 기간**: 2026-01-17

## 📝 이번 기간 작업 내용

### Dual Auth 시스템과 context7 (10개 커밋)

**OAuth + API Key 이중 인증**으로 안정성을 높이고, context7 플러그인을 통합했습니다.

| 커밋 | 내용 |
|------|------|
| `feat: dual auth (OAuth + API Key) with auto-fallback` | **Dual Auth!** |
| `fix: use process.env for CLAUDE_PROJECT_DIR in hooks` | 환경변수 사용 |
| `fix: auto-matching hooks use orchestration with jsonMode:false` | 훅 수정 |
| `docs: add star request to README` | README 스타 요청 |
| `docs: add npm downloads badge to README` | 다운로드 배지 |
| `refactor: extract hook commands into separate script files` | 훅 스크립트 분리 |
| `refactor: add shared utils.js for hook scripts` | 공유 유틸 추가 |
| `refactor: update docs and help text for hook-based LLM routing` | 문서 업데이트 |
| `fix: install hooks/scripts to VIBE_PATH during update` | 설치 경로 수정 |
| `fix: auto-detect VIBE_PATH in hook scripts` | 경로 자동 감지 |

## 💡 작업 하이라이트

**Dual Auth (OAuth + API Key)**

OAuth 인증이 실패하면 자동으로 API Key로 폴백합니다:

```
OAuth 시도 → 실패 (Rate limit/만료) → API Key 폴백 → 성공
```

사용자 경험을 방해하지 않으면서 안정성을 확보했습니다.

**context7 플러그인**

최신 라이브러리 문서를 실시간으로 검색할 수 있는 context7 플러그인을 통합했습니다:

```
"React 19 use() 훅 검색해줘" → context7로 최신 문서 조회
```

**훅 스크립트 모듈화**

훅 명령어를 개별 스크립트 파일로 분리하여 유지보수성을 높였습니다:

```
hooks/scripts/
├── utils.js          # 공유 유틸리티
├── session-start.js  # 세션 시작
├── code-check.js     # 코드 체크
└── llm-orchestrate.js # LLM 오케스트레이션
```

## 📊 개발 현황

- **버전**: v2.4.28 → v2.4.50
- **인증**: OAuth + API Key Dual Auth
- **플러그인**: context7 통합
