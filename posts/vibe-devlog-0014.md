---
title: "vibe 개발일지 #14 - SPEC 리뷰 자동화와 GPT 통합 (10개 커밋)"
date: "2026-01-17"
category: "dev-log"
description: "SPEC 자동 리뷰, GPT + Gemini 병렬 검증, 파일 첨부 지원"
tags: ["vibe", "개발일지", "SPEC 리뷰", "GPT"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #14 - SPEC 리뷰 자동화와 GPT 통합 (10개 커밋)

**작업 기간**: 2026-01-17

## 📝 이번 기간 작업 내용

### SPEC 자동 리뷰 시스템 (10개 커밋)

SPEC 작성 후 **GPT + Gemini 병렬 리뷰**가 자동으로 실행됩니다.

| 커밋 | 내용 |
|------|------|
| `feat: add SPEC review phase with auto-fix loop` | **SPEC 리뷰!** |
| `fix: add GPT option for SPEC review alongside Gemini` | GPT 옵션 추가 |
| `chore: prioritize GPT for SPEC review (better at requirements analysis)` | GPT 우선 |
| `feat: add file input detection for vibe.spec` | 파일 입력 감지 |
| `feat: support file attachment for vibe.spec input` | **파일 첨부!** |
| `refactor: store API keys in global config directory` | 전역 설정 |
| `refactor: clean up vibe help output` | 헬프 정리 |
| `feat: add self-learning with graph storage` | 자기 학습 (실험) |
| `feat: load learned patterns from graph on session start` | 패턴 로드 |
| `refactor: remove graph/learning feature from workflow` | 학습 기능 제거 |

## 💡 작업 하이라이트

**GPT + Gemini 병렬 SPEC 리뷰**

SPEC 작성이 완료되면 두 AI가 동시에 리뷰합니다:

```
SPEC 완성
    ↓
┌─────────────────────────────────┐
│   GPT Review    │  Gemini Review │  (병렬)
│   - 요구사항    │  - 최신 문서   │
│   - 아키텍처    │  - 베스트 프랙티스 │
└─────────────────────────────────┘
    ↓
피드백 병합 → SPEC 자동 수정
```

**파일 첨부 지원**

기존 문서나 이미지를 SPEC 입력으로 사용할 수 있습니다:

```bash
/vibe.spec "기능명" --file requirements.pdf
```

**자기 학습 실험 (제거됨)**

Graph 기반 자기 학습 기능을 실험했지만, 복잡성 대비 효용이 낮아 제거했습니다. 단순함을 유지하는 것이 더 중요했습니다.

## 📊 개발 현황

- **버전**: v2.4.50 (동일 날짜 다수 커밋)
- **핵심**: GPT + Gemini 병렬 리뷰, 파일 첨부
- **제거**: 자기 학습 기능 (복잡성 이유)
