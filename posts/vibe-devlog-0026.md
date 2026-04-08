---
title: "vibe 개발일지 #26 - vibe.figma 대격변: 모듈 분리와 검증 루프 (10개 커밋)"
date: "2026-04-02"
category: "dev-log"
description: "3-tier 스킬 시스템, 8개 모듈 분리, 시각 검증 루프, 뷰포트별 빌드"
tags: ["vibe", "개발일지", "vibe.figma", "verification loop", "모듈화"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #26 - vibe.figma 대격변: 모듈 분리와 검증 루프 (10개 커밋)

**작업 기간**: 2026-04-02

## 📝 이번 기간 작업 내용

### 하루 만에 10번의 재설계 (10개 커밋)

| 커밋 | 내용 |
|------|------|
| `fix: add image asset extraction phase` | 이미지 추출 Phase |
| `remove: --component flag, auto-extract from filename` | 플래그 제거 |
| `enhance: add model routing hints to phases` | 모델 라우팅 힌트 |
| `enhance: add Codex parallel generation and review` | Codex 병렬 처리 |
| `feat: add Phase 9 visual verification loop` | **시각 검증 루프!** |
| `enhance: add 3-tier skill system to reduce context noise` | 3-tier 적용 |
| `redesign: interactive /vibe.figma with storyboard + design URL input` | **인터랙티브 재설계** |
| `fix: enforce image download gate before code generation` | 이미지 게이트 |
| `fix: use AskUserQuestion for URL input` | URL 입력 방식 |
| `feat: add --refine mode for post-generation quality improvement` | --refine 모드 |

## 💡 작업 하이라이트

**Visual Verification Loop (Phase 9)**

생성된 코드를 브라우저에서 렌더링하고, Figma 원본과 시각적으로 비교하는 검증 루프를 추가했습니다. 차이가 있으면 자동으로 코드를 수정하고 재검증합니다:

```
코드 생성 완료
    ↓
브라우저 렌더링 → 스크린샷 캡처
    ↓
Figma 원본과 비교
    ↓
차이 발견? → 코드 수정 → 재렌더링 → 재비교
    ↓
일치! → 완료
```

**인터랙티브 URL 입력 재설계**

기존의 단일 Figma URL 입력을 스토리보드 URL + 디자인 URL 분리 입력으로 변경했습니다. 스토리보드로 기능을 파악하고, 디자인에서 비주얼을 추출하는 2단계 접근:

```
1단계: 스토리보드 URL → 기능 정의 + 컴포넌트 구조
2단계: 디자인 URL → 스타일 + 에셋 추출
```

**Image Download Gate**

코드 생성 전에 반드시 이미지 에셋을 다운로드하도록 강제하는 게이트를 추가했습니다. placeholder 이미지 없이 실제 에셋으로 코드를 생성합니다.

## 📊 개발 현황

- **버전**: v2.8.5 → v2.8.12
- **핵심**: 시각 검증 루프, 인터랙티브 입력, 이미지 게이트
- **특이사항**: 하루에 7개 버전 릴리스 (v2.8.5→v2.8.12)

---

**다음 개발일지**: vibe-devlog-0027 (다음 10개 커밋 후)
