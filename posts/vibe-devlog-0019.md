---
title: "vibe 개발일지 #19 - Karpathy 최적화와 Multi-CLI (10개 커밋)"
date: "2026-03-02"
category: "dev-log"
description: "Karpathy Guidelines 기반 17개 스킬 -2,980줄, capability 기반 스킬 설치, Multi-CLI 자동 감지"
tags: ["vibe", "개발일지", "Karpathy", "Multi-CLI", "capability"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #19 - Karpathy 최적화와 Multi-CLI (10개 커밋)

**작업 기간**: 2026-02-22 ~ 2026-03-02

## 📝 이번 기간 작업 내용

### Capability 시스템과 스킬 최적화 (10개 커밋)

| 커밋 | 내용 |
|------|------|
| `feat: 5-feature infra 강화 + capability 기반 스킬 자동 설치 파이프라인` | **capability 시스템** |
| `feat: 언어 룰 프로젝트 로컬 설치 + capabilities skip 안내 개선` | 언어 룰 로컬화 |
| `refactor: Karpathy Guidelines 기반 17개 스킬 파일 최적화 (-2,980줄)` | **-2,980줄!** |
| `feat: Multi-CLI 지원 (Codex CLI + Gemini CLI 자동 감지 및 설정)` | Multi-CLI |
| `feat: agents-md 스킬 글로벌 자동 설치 등록` | agents-md 등록 |

## 💡 작업 하이라이트

**Capability 기반 스킬 자동 설치**

프로젝트의 capability(테스트, CI, DB 등)를 감지해서 필요한 스킬만 자동으로 설치하는 파이프라인을 구축했습니다. 모든 스킬을 일괄 설치하던 방식에서, 프로젝트에 실제 필요한 것만 골라 설치하는 방식으로 전환:

```
vibe init
  → 스택 감지 (React, TypeScript, ...)
  → capability 감지 (test, CI, DB, ...)
  → 필요한 스킬만 자동 설치
```

**Karpathy Guidelines 기반 최적화 (-2,980줄)**

Andrej Karpathy의 "좋은 프롬프트는 짧다" 원칙을 스킬 파일에 적용했습니다. 17개 스킬 파일에서 중복, 과잉 설명, 불필요한 예시를 제거하여 2,980줄을 줄였습니다. 토큰 효율이 크게 개선되었습니다.

**Multi-CLI 자동 감지**

Codex CLI와 Gemini CLI를 동시에 지원합니다. 설치 여부를 자동 감지하고, 둘 다 있으면 태스크 종류에 따라 적절한 CLI를 선택합니다:

```
Codex CLI 감지 → 코딩 태스크에 활용
Gemini CLI 감지 → 리뷰/분석 태스크에 활용
둘 다 없으면 → Claude 단독 모드
```

## 📊 개발 현황

- **버전**: v2.7.5 → v2.7.10
- **핵심**: capability 기반 설치, -2,980줄 최적화, Multi-CLI
- **누적 삭감**: -4,744줄 (v2.7 시작 이후)

---

**다음 개발일지**: vibe-devlog-0020 (다음 10개 커밋 후)
