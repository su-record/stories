---
title: "vibe 개발일지 #27 - vibe.figma 8파일→3파일 전면 재설계 (10개 커밋)"
date: "2026-04-03"
category: "dev-log"
description: "8개 모듈→3파일 679줄 압축, 스크린샷 중심 설계, CSS art 금지, 모바일 퍼스트"
tags: ["vibe", "개발일지", "vibe.figma", "리팩토링", "모바일 퍼스트"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #27 - vibe.figma 8파일→3파일 전면 재설계 (10개 커밋)

**작업 기간**: 2026-04-03

## 📝 이번 기간 작업 내용

### 과감한 구조 단순화 (10개 커밋)

| 커밋 | 내용 |
|------|------|
| `refactor: vibe-figma 스킬 전면 리팩토링 — 스크린샷 중심 설계` | **스크린샷 중심** |
| `fix: placeholder 금지 + 이미지 미확보 시 진행 차단` | HARD RULE |
| `fix: 텍스트 스타일 전수 적용 + 스타일 외부 파일 강제` | 스타일 분리 강제 |
| `fix: 참조 코드의 Figma 토큰 값을 직접 사용` | 토큰 직접 참조 |
| `fix: CSS art 금지 HARD RULE` | **CSS art 금지!** |
| `refactor: Step B 디자인 작업 전면 단순화 (552줄 → 235줄)` | -317줄 |
| `refactor: vibe-figma 8파일 2000줄 → 3파일 679줄` | **-1,321줄!** |
| `fix: 반응형(데스크탑)을 Phase 2에 통합, Phase 3→4 제거` | Phase 통합 |
| `fix: 모바일 퍼스트 강제 — 모바일 먼저 받고 추가 URL 반복` | **모바일 퍼스트** |
| `fix: 첫 URL 질문을 "베이스 디자인(모바일)"로 명확화` | UX 개선 |

## 💡 작업 하이라이트

**8파일 2,000줄 → 3파일 679줄**

#25~#26에서 만든 8개의 모듈화된 스킬 파일을 다시 3개로 통합했습니다. 과도한 모듈화가 오히려 컨텍스트 분산을 일으켜 AI의 이해도를 떨어뜨렸기 때문입니다:

```
Before (8파일, 2,000줄):
  vibe-figma-analyze.md, vibe-figma-frame.md,
  vibe-figma-design.md, vibe-figma-verify.md,
  vibe-figma-refine.md, vibe-figma-responsive.md,
  vibe-figma-tokens.md, vibe-figma-assets.md

After (3파일, 679줄):
  vibe.figma.md (메인 오케스트레이터)
  vibe.figma.extract.md (추출)
  vibe.figma.convert.md (변환)
```

**CSS Art 금지 HARD RULE**

AI가 이미지를 CSS로 재현하려는 습관을 발견했습니다. 그라데이션, 그림자, 도형을 CSS로 그리는 대신 이미지 에셋을 사용하도록 강제하는 HARD RULE을 추가:

```
❌ CSS로 로고 그리기 (box-shadow 10겹...)
❌ CSS로 일러스트 재현 (clip-path + gradient)
✅ 이미지 에셋 다운로드 → <img> 태그
```

**모바일 퍼스트 강제**

첫 번째 디자인 URL을 반드시 모바일(최소 뷰포트)로 받고, 추가 브레이크포인트는 반복 입력으로 받는 방식으로 변경했습니다:

```
1. "베이스 디자인(모바일) URL을 입력해주세요"
2. "추가 브레이크포인트 URL? (없으면 '없음')"
3. "추가 브레이크포인트 URL? (없으면 '없음')"
...
```

## 📊 개발 현황

- **버전**: v2.8.17 → v2.8.24
- **핵심**: 3파일 구조, CSS art 금지, 모바일 퍼스트
- **교훈**: 과도한 모듈화보다 응집도 높은 소수 파일이 AI에게 유리

---

**다음 개발일지**: vibe-devlog-0028 (다음 10개 커밋 후)
