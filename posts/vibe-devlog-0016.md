---
title: "vibe 개발일지 #16 - 반복적 SPEC 리뷰와 OS 언어 감지 (10개 커밋)"
date: "2026-01-19"
category: "dev-log"
description: "최대 3라운드 반복 리뷰, OS 언어 자동 감지, 한국어 응답 설정"
tags: ["vibe", "개발일지", "SPEC 리뷰", "다국어"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #16 - 반복적 SPEC 리뷰와 OS 언어 감지 (10개 커밋)

**작업 기간**: 2026-01-19

## 📝 이번 기간 작업 내용

### 반복적 SPEC 리뷰 (10개 커밋)

SPEC 품질을 높이기 위해 **최대 3라운드 반복 리뷰**를 도입했습니다.

| 커밋 | 내용 |
|------|------|
| `feat: add iterative SPEC review (default: max 3 rounds)` | **반복 리뷰!** |
| `feat: auto-detect OS language and add response language to CLAUDE.md` | OS 언어 감지 |
| `feat: add Korean response language setting to CLAUDE.md` | 한국어 응답 설정 |

## 💡 작업 하이라이트

**반복적 SPEC 리뷰 (Convergence Loop)**

GPT와 Gemini가 더 이상 개선점을 찾지 못할 때까지 리뷰를 반복합니다:

```
SPEC 초안
    ↓
┌─────────────────────────────────────────┐
│  Round 1: GPT + Gemini 병렬 리뷰        │
│           ↓                             │
│  피드백 적용 → SPEC 업데이트            │
│           ↓                             │
│  Round 2: 업데이트된 SPEC 재리뷰        │
│           ↓                             │
│  피드백 적용 → SPEC 업데이트            │
│           ↓                             │
│  Round 3: 최종 리뷰 (필요시)            │
└─────────────────────────────────────────┘
    ↓
수렴 체크:
  - 두 모델 모두 "주요 이슈 없음" → 완료
  - 이전 라운드와 동일한 피드백 → 완료
  - 최대 3라운드 도달 → 완료
```

**수렴 조건 (Convergence Criteria)**

- GPT와 Gemini 모두 P1/P2 이슈 없음
- 이전 라운드와 피드백이 동일 (새로운 개선점 없음)
- 최대 3라운드 완료

**OS 언어 자동 감지**

`vibe init` 또는 `vibe update` 실행 시 OS 언어를 감지하여 CLAUDE.md에 응답 언어를 설정합니다:

- 한국어 OS → 한국어로 응답
- 영어 OS → 영어로 응답

## 📊 개발 현황

- **버전**: v2.4.75 → v2.4.76
- **핵심**: 반복적 SPEC 리뷰 (max 3 rounds), OS 언어 감지
- **옵션**: `--quick` (단일 리뷰), 기본값 (반복 리뷰)
