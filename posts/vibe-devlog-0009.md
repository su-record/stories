---
title: "vibe 개발일지 #9 - .claude/vibe/ 구조와 ULTRAWORK 파이프라인 (10개 커밋)"
date: "2026-01-12"
category: "dev-log"
description: "디렉토리 구조 개편, 14개 프레임워크 언어 룰, 4개 핵심 커맨드로 정리"
tags: ["vibe", "개발일지", "v2.2.0", "리팩토링"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #9 - .claude/vibe/ 구조와 ULTRAWORK 파이프라인 (10개 커밋)

**작업 기간**: 2026-01-12

## 📝 이번 기간 작업 내용

### 대규모 구조 개편 (10개 커밋)

디렉토리 구조를 `.vibe/`에서 `.claude/vibe/`로 변경하고, 커맨드를 12개에서 4개로 통합했습니다.

| 커밋 | 내용 |
|------|------|
| `feat: v2.2.0 - ULTRAWORK Pipeline + Plugin Support` | **v2.2.0!** |
| `refactor: migrate .vibe/ to .claude/vibe/ structure` | 구조 변경 |
| `chore: cleanup legacy sutory CLI and unify MCP tool messages` | 레거시 정리 |
| `fix: use copyDirRecursive for nested agent directories` | 복사 로직 수정 |
| `refactor: move rules/ to root for consistency` | 규칙 위치 변경 |
| `refactor: move rules/templates to .claude/vibe/, hooks to root` | 최종 구조 |
| `refactor: consolidate 12 commands → 4 core commands` | **12개 → 4개** |
| `feat: v2.3.0 - 14개 프레임워크별 언어 룰 + 모노레포 지원` | **v2.3.0!** |
| `feat: add workflow choice (Plan Mode vs VIBE) after analyze/review` | 워크플로우 선택 |

## 💡 작업 하이라이트

**커맨드 통합**

12개의 산발적인 커맨드를 4개의 핵심 커맨드로 통합했습니다:

| Before (12개) | After (4개) |
|--------------|-------------|
| /vibe.spec, /vibe.analyze, /vibe.design... | `/vibe.spec` |
| /vibe.run, /vibe.implement, /vibe.build... | `/vibe.run` |
| /vibe.review, /vibe.check... | `/vibe.review` |
| /vibe.verify, /vibe.test... | `/vibe.verify` |

**14개 프레임워크 언어 룰**

각 프레임워크에 최적화된 코딩 규칙을 제공합니다:

```
TypeScript, JavaScript, Python, Go, Rust,
Java, Kotlin, Swift, Ruby/Rails, PHP,
C#, C++, React, Vue
```

**디렉토리 구조**

```
.claude/
├── vibe/
│   ├── specs/       # SPEC 문서
│   ├── features/    # BDD 시나리오
│   └── config.json  # 설정
```

## 📊 개발 현황

- **버전**: v2.1.0 → v2.3.1
- **커맨드**: 12개 → 4개
- **언어 룰**: 14개 프레임워크
