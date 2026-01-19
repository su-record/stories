---
title: "vibe 개발일지 #15 - Large SPEC 자동 분할과 크로스플랫폼 (10개 커밋)"
date: "2026-01-18"
category: "dev-log"
description: "대규모 SPEC 자동 분할, 언어 프리셋, 쉘 호환성 개선"
tags: ["vibe", "개발일지", "SPEC 분할", "크로스플랫폼"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #15 - Large SPEC 자동 분할과 크로스플랫폼 (10개 커밋)

**작업 기간**: 2026-01-18

## 📝 이번 기간 작업 내용

### Large SPEC 자동 분할 (10개 커밋)

대규모 SPEC을 자동으로 Phase별로 분할하는 기능을 추가했습니다.

| 커밋 | 내용 |
|------|------|
| `feat: large SPEC auto-split, multi-SPEC execution, research output rules` | **자동 분할!** |
| `fix: cross-platform shell compatibility for LLM orchestration` | 쉘 호환성 |
| `refactor: remove unused tools, add language presets, update hooks` | 정리 및 프리셋 |
| `fix: store API keys globally, fix OAuth filename collision` | API 키 전역 저장 |
| `feat: auto-split large SPEC without user confirmation` | 확인 없이 자동 분할 |
| `fix: add interrupt handling, enforce SPEC file paths, lint fixes` | 인터럽트 처리 |
| `fix: add 3-tier fallback for module resolution in utils.js` | 모듈 해결 |
| `refactor: modularize MemoryManager and add unit tests` | 메모리 매니저 리팩토링 |
| `fix: use cross-platform path resolution for LLM orchestration` | 경로 해결 |
| `feat: require Feature files to match SPEC phase structure` | Feature 파일 매칭 |

## 💡 작업 하이라이트

**Large SPEC 자동 분할**

5개 이상의 Phase나 15개 이상의 파일을 생성하는 대규모 SPEC은 자동으로 분할됩니다:

```
Large SPEC 감지
    ↓
.claude/vibe/specs/{feature}/
├── _index.md           # Master SPEC
├── phase-1-setup.md
├── phase-2-core.md
└── phase-3-ui.md

.claude/vibe/features/{feature}/
├── _index.feature      # Master Feature
├── phase-1-setup.feature
├── phase-2-core.feature
└── phase-3-ui.feature
```

**SPEC-Feature 매칭 강제**

모든 SPEC 파일은 반드시 대응하는 Feature 파일이 있어야 합니다. 이를 통해 BDD 검증이 누락되지 않습니다.

**3-Tier 모듈 해결**

utils.js에서 모듈을 찾을 때 3단계 폴백을 적용합니다:
1. 전역 설치 경로
2. npm 전역 경로
3. 현재 디렉토리

## 📊 개발 현황

- **버전**: v2.4.51
- **핵심**: Large SPEC 자동 분할, SPEC-Feature 매칭
- **안정성**: 3-tier 모듈 해결, 크로스플랫폼 경로
