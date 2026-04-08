---
title: "vibe 개발일지 #31 - 리매핑 구조와 vw/clamp 반응형 (10개 커밋)"
date: "2026-04-08"
category: "dev-log"
description: "scaleFactor 제거→vw/clamp, 리매핑 구조, Context Hub 통합, Phase 넘버링 정리"
tags: ["vibe", "개발일지", "vibe.figma", "반응형", "리매핑", "Context Hub"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #31 - 리매핑 구조와 vw/clamp 반응형 (10개 커밋)

**작업 기간**: 2026-04-07 ~ 2026-04-08

## 📝 이번 기간 작업 내용

### 반응형 단위 혁신과 리매핑 (10개 커밋)

| 커밋 | 내용 |
|------|------|
| `refactor: scaleFactor 제거 → vw/clamp 반응형 단위 변환` | **vw/clamp 전환!** |
| `fix: scaleFactor 잔여 참조 제거 + rubrics/templates vw/clamp 전환` | 잔여 정리 |
| `chore: 병합 완료된 figma 서브 스킬 7개 삭제` | -7 스킬 파일 |
| `feat: Phase 3 순차 블록 빌딩 규칙 + 작업 폴더 명시` | 블록 빌딩 |
| `feat: add chub-usage skill for Context Hub API docs` | **Context Hub** |
| `feat: component-index 템플릿 — Figma 노드 ↔ 컴포넌트 매핑` | 컴포넌트 인덱스 |
| `feat: Phase 2.5 리매핑 구조 — 멀티 BP 통합 + CSS diff` | **리매핑!** |
| `refactor: Phase 넘버링 정리 + 스토리보드 URL 통합 입력` | Phase 정리 |
| `feat: 리매핑에 스토리보드 매칭 — 기능 정의로 노드 역할 확정` | 스토리보드 매칭 |
| `Merge pull request #32` | PR #32 병합 |

## 💡 작업 하이라이트

**scaleFactor 제거 → vw/clamp**

Figma의 절대 픽셀 값을 그대로 쓰되 `scaleFactor`로 보정하던 방식을 완전히 버렸습니다. 대신 `vw`와 `clamp()`를 사용한 본격적인 반응형 단위로 전환:

```
Before:
  width: calc(375px * scaleFactor);  // scaleFactor = 화면폭/디자인폭
  (JS 런타임 계산 필요, 깜빡임)

After:
  width: clamp(300px, 80vw, 500px);  // CSS만으로 반응형
  (JS 불필요, 자연스러운 스케일링)
```

**리매핑 구조 (Phase 2.5)**

멀티 브레이크포인트 디자인을 통합할 때, 각 BP의 Figma 노드를 하나의 컴포넌트에 매핑하는 "리매핑" 단계를 추가했습니다:

```
모바일 디자인 (375px):  [Header] [Card-m] [Footer]
데스크탑 디자인 (1440px): [Header-d] [Card-d] [Sidebar] [Footer-d]
    ↓ 리매핑
통합 컴포넌트:
  Header: 모바일 Header + 데스크탑 Header-d
  Card: 모바일 Card-m + 데스크탑 Card-d
  Sidebar: 데스크탑 only (모바일에서 숨김)
  Footer: 모바일 Footer + 데스크탑 Footer-d
```

**Context Hub (chub-usage) 스킬**

외부 API/SDK 문서를 실시간으로 참조하는 Context Hub 통합 스킬을 추가했습니다. Stripe, OpenAI 등의 최신 API 문서를 직접 조회하여 코드 생성에 활용합니다.

## 📊 개발 현황

- **버전**: v2.8.40 → v2.8.43
- **핵심**: vw/clamp 반응형, 리매핑 구조, Context Hub
- **PR**: #32 병합 (Context Hub integration)
- **정리**: 불필요한 figma 서브 스킬 7개 삭제

---

**다음 개발일지**: vibe-devlog-0032 (다음 10개 커밋 후)
