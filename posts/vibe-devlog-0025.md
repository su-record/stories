---
title: "vibe 개발일지 #25 - vibe.figma 탄생과 폭풍 진화 (10개 커밋)"
date: "2026-04-02"
category: "dev-log"
description: "Figma-to-Code 파이프라인 탄생, MCP 기반 추출, 반응형 디자인, SCSS 지원"
tags: ["vibe", "개발일지", "vibe.figma", "Figma", "design-to-code"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #25 - vibe.figma 탄생과 폭풍 진화 (10개 커밋)

**작업 기간**: 2026-04-01 ~ 2026-04-02

## 📝 이번 기간 작업 내용

### Figma-to-Code 파이프라인 (10개 커밋)

| 커밋 | 내용 |
|------|------|
| `feat: add figma-to-code command for design-to-code pipeline` | **vibe.figma 탄생!** |
| `fix: rename figma command to follow vibe.* naming convention` | 네이밍 통일 |
| `fix: integrate extract into /vibe.figma as single-step pipeline` | 단일 파이프라인 |
| `enhance: markup quality standards, style separation, standalone mode` | 품질 기준 |
| `Merge pull request #29` | PR #29 병합 |
| `enhance: vibe.figma responsive design, design skill integration, SCSS` | **반응형 + SCSS** |
| `docs: add Figma pipeline section to README` | README 업데이트 |
| `enhance: MCP-first extraction, CLI as fallback` | MCP 우선 추출 |
| `remove: CLI extract command, MCP plugin is the only path` | CLI 추출 제거 |
| `fix: output to project structure, rename --standalone to --new` | 출력 구조 정리 |

## 💡 작업 하이라이트

**vibe.figma의 탄생**

Figma 디자인을 프로덕션 코드로 변환하는 `/vibe.figma` 커맨드가 만들어졌습니다. 하루 만에 10번의 커밋을 거치며 급속도로 진화했습니다:

```
/vibe.figma [Figma URL]
    ↓
Phase 1: Figma에서 디자인 데이터 추출 (MCP 플러그인)
Phase 2: 스토리보드 분석 → 컴포넌트 구조 설계
Phase 3: HTML + SCSS 코드 생성
Phase 4: 반응형 디자인 적용
Phase 5: 이미지 에셋 추출
```

**MCP-First Architecture**

처음에는 CLI와 MCP 두 가지 추출 경로를 만들었다가, MCP 플러그인의 정확도가 훨씬 높아 CLI 추출을 완전히 제거했습니다. "두 개 만들고 하나 버리기" 전략:

```
v1: CLI extract + MCP extract (두 경로)
v2: MCP-first, CLI fallback
v3: MCP only (CLI 제거)
```

**SCSS + 반응형 지원**

스타일을 인라인이 아닌 외부 SCSS 파일로 분리하고, 모바일 퍼스트 반응형 디자인을 기본으로 적용했습니다. 디자인 스킬(design-teach 등)과 연동하여 브랜드 일관성도 유지합니다.

## 📊 개발 현황

- **버전**: v2.8.1 → v2.8.5
- **핵심**: vibe.figma 탄생, MCP 기반 추출, SCSS 반응형
- **PR**: #29 병합 (figma-to-code command)

---

**다음 개발일지**: vibe-devlog-0026 (다음 10개 커밋 후)
