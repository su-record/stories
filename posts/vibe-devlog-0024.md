---
title: "vibe 개발일지 #24 - Dynamic Multi-LLM Routing과 v2.8 (10개 커밋)"
date: "2026-04-01"
category: "dev-log"
description: "Codex 플러그인 통합, 동적 모델 라우팅, PM 스킬 추가, v2.8 릴리스"
tags: ["vibe", "개발일지", "v2.8", "Codex plugin", "multi-LLM", "PM skills"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #24 - Dynamic Multi-LLM Routing과 v2.8 (10개 커밋)

**작업 기간**: 2026-03-31 ~ 2026-04-01

## 📝 이번 기간 작업 내용

### Codex 플러그인과 v2.8 릴리스 (10개 커밋)

| 커밋 | 내용 |
|------|------|
| `feat: migrate Codex integration to plugin system and rewrite README` | **플러그인 전환** |
| `feat: dynamic multi-LLM model routing based on availability` | **동적 라우팅!** |
| `feat: integrate Codex plugin commands into vibe workflow` | 워크플로우 통합 |
| `feat: add Codex plugin auto-detection and Stop hook review gate` | 자동 감지 |
| `docs: update README with Codex plugin workflow` | README 업데이트 |
| `fix: upgrade command fetches latest version from registry` | 업그레이드 수정 |
| `feat: add design steering skills, deep reference guides` | 디자인 스킬 |
| `feat: add PM skills (create-prd, prioritization, user-personas)` | **PM 스킬!** |
| `클로드 문서 작성 스킬` | docs 스킬 |
| `Merge branch 'feature/pm-skills-chaining'` | PM 브랜치 병합 |

## 💡 작업 하이라이트

**Dynamic Multi-LLM Model Routing**

Codex CLI와 Gemini CLI의 설치 여부를 런타임에 감지하고, 태스크 종류에 따라 자동으로 최적의 모델을 선택합니다:

```
태스크 입력
    ↓
┌─ Codex CLI 있음? ─── 코딩 태스크 → gpt-5.3-codex
│                  └── 추론 태스크 → gpt-5.4
├─ Gemini CLI 있음? ── 리뷰/분석 → gemini-3.1-pro
│                  └── 빠른 작업 → gemini-3.1-flash-lite
└─ 둘 다 없음 ──────── Claude 단독 모드
```

**PM Skills Chain**

개발자뿐 아니라 PM도 vibe를 쓸 수 있도록 PM 스킬 3종을 추가했습니다:

- **create-prd**: Jobs-to-be-Done 프레임워크 기반 PRD 생성
- **prioritization-frameworks**: RICE/ICE/MoSCoW 등 우선순위 프레임워크
- **user-personas**: 사용자 페르소나 자동 생성

스킬 체이닝으로 연결됩니다: `user-personas → create-prd → /vibe.spec`

**v2.8 릴리스**

v2.7의 22개 마이너 버전을 거쳐 v2.8로 메이저 업데이트. Codex 플러그인 시스템과 PM 스킬이 핵심입니다.

## 📊 개발 현황

- **버전**: v2.7.22 → v2.8.1
- **핵심**: 동적 모델 라우팅, PM 스킬, v2.8 릴리스
- **스킬 수**: ~45개 → ~48개

---

**다음 개발일지**: vibe-devlog-0025 (다음 10개 커밋 후)
