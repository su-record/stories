---
title: "vibe 개발일지 #30 - 트리 기반 Figma 변환과 Kombai 도전 (10개 커밋)"
date: "2026-04-07"
category: "dev-log"
description: "Kombai 수준 Figma→코드 변환, 스크린샷→트리 기반 전환, Puppeteer 브라우저 검증"
tags: ["vibe", "개발일지", "vibe.figma", "Kombai", "트리 기반", "Puppeteer"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #30 - 트리 기반 Figma 변환과 Kombai 도전 (10개 커밋)

**작업 기간**: 2026-04-06 ~ 2026-04-07

## 📝 이번 기간 작업 내용

### Kombai 수준을 향해 (10개 커밋)

| 커밋 | 내용 |
|------|------|
| `fix: postinstall 스킬 복사를 항상 덮어쓰기로 변경` | 설치 안정화 |
| `feat: _tokens.scss primitive/semantic 구조화` | 토큰 구조화 |
| `feat: figma-extract render 커맨드 — HTML+SCSS+이미지+스크린샷 일괄` | **render 커맨드** |
| `refactor: vibe.figma를 시각 기반 퍼즐 조립 방식으로 리빌드` | 퍼즐 조립 |
| `feat: browser UI 검증 인프라 — Puppeteer + CDP 기반` | **Puppeteer 검증** |
| `feat: figma-kombai-level 4개 Phase 구현` | **Kombai 수준!** |
| `Merge branch 'feature/figma-kombai-level'` | 브랜치 병합 |
| `refactor: vibe.figma 철학 전환 — 스크린샷 기반 추정 → 트리 기반 구조적 매핑` | **패러다임 전환** |
| `refactor: 실증 기반 스킬 정리 — 이미지 노드 렌더링 + Phase 1 파일 생성 제거` | 실증 기반 정리 |
| `feat: vibe.figma Phase 5 공통화 + 브레이크포인트별 폴더 구조` | 멀티 BP 구조 |

## 💡 작업 하이라이트

**스크린샷 → 트리 기반 패러다임 전환**

vibe.figma의 가장 큰 철학적 전환이 일어났습니다. 스크린샷을 보고 코드를 "추정"하는 방식에서, Figma 트리 구조를 직접 읽어 "구조적으로 매핑"하는 방식으로 변경:

```
Before (스크린샷 기반):
  스크린샷 캡처 → AI가 레이아웃 추정 → 코드 생성
  (추정 오류 多, 중첩 구조 놓침)

After (트리 기반):
  Figma Node Tree 파싱 → 구조적 매핑 → 코드 생성
  (정확한 구조, 계층 보존)
```

**Kombai 수준 도전**

Kombai(상용 Figma-to-Code 서비스)와 동등한 품질을 목표로 4개 Phase를 구현했습니다:

1. **Tree Extraction**: Figma REST API로 노드 트리 추출
2. **Structural Mapping**: 노드 → HTML 요소 매핑
3. **Style Resolution**: Figma 토큰 → CSS/SCSS 변환
4. **Code Generation**: 최종 코드 생성 + 검증

**Puppeteer + CDP 브라우저 검증**

생성된 코드를 실제 브라우저에서 렌더링하고 검증하는 인프라를 구축했습니다. Chrome DevTools Protocol(CDP)을 통해 스크린샷 캡처, DOM 검사, 레이아웃 비교를 자동화합니다.

## 📊 개발 현황

- **버전**: v2.8.33 → v2.8.40
- **핵심**: 트리 기반 전환, Kombai 수준 구현, Puppeteer 검증
- **PR**: #31 병합 (Kombai level exploration)

---

**다음 개발일지**: vibe-devlog-0031 (다음 10개 커밋 후)
