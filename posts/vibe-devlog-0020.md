---
title: "vibe 개발일지 #20 - Skill Testing과 Harness Engineering (10개 커밋)"
date: "2026-03-05"
category: "dev-log"
description: "스킬 테스팅 프레임워크, Harness Engineering 원칙, skills.sh 자동 설치"
tags: ["vibe", "개발일지", "skill testing", "harness engineering", "PR #26"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #20 - Skill Testing과 Harness Engineering (10개 커밋)

**작업 기간**: 2026-03-04 ~ 2026-03-05

## 📝 이번 기간 작업 내용

### 스킬 품질 인프라 구축 (10개 커밋)

| 커밋 | 내용 |
|------|------|
| `feat: add skill testing framework (eval, benchmark, classifier)` | **스킬 테스팅!** |
| `chore: update pnpm-lock.yaml after dependency rebuild` | 의존성 정리 |
| `Merge pull request #26` | PR #26 병합 |
| `feat: Harness Engineering 원칙 적용 — CLAUDE.md 최적화 + 3 스킬` | **Harness Engineering** |
| `feat: show CLI installation status (codex/gemini) in vibe status` | CLI 상태 표시 |
| `feat: auto-install skills.sh packages during init/update` | skills.sh 자동 설치 |
| `docs: rewrite README — streamline structure and add skills.sh section` | README 재작성 |

## 💡 작업 하이라이트

**Skill Testing Framework**

스킬이 올바르게 트리거되는지 테스트하는 프레임워크를 만들었습니다:

- **eval**: 스킬이 주어진 입력에 올바르게 반응하는지 검증
- **benchmark**: 스킬 실행 시간과 토큰 사용량 측정
- **classifier**: 입력 문장이 어떤 스킬을 트리거해야 하는지 판별
- **description optimizer**: 스킬 설명문 최적화 제안

```
"vibe init" → skill-classifier → vibe.run? vibe.spec? → 정답: 없음 (CLI 명령)
"새 기능 만들자" → skill-classifier → vibe.spec ✓
```

**Harness Engineering 원칙**

Agent = Model + Harness라는 공식을 적용했습니다. CLAUDE.md를 하네스의 핵심 설정 파일로 재정의하고, Phase Isolation(단계 간 격리) 원칙을 도입:

- Phase 1(계획)의 결과물만 Phase 2(구현)에 전달
- 각 Phase는 독립적으로 실행 가능
- 실패 시 해당 Phase만 재실행

**skills.sh 자동 설치**

`vibe init` / `vibe update` 시 skills.sh에 정의된 패키지를 자동 설치합니다. 별도 수동 설치가 필요 없어졌습니다.

## 📊 개발 현황

- **버전**: v2.7.10 → v2.7.12
- **핵심**: 스킬 테스팅, Harness Engineering, skills.sh 자동화
- **PR**: #26 병합 (skill testing framework)

---

**다음 개발일지**: vibe-devlog-0021 (다음 10개 커밋 후)
