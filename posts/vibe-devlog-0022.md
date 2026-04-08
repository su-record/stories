---
title: "vibe 개발일지 #22 - 수렴 규칙과 Progressive Disclosure (10개 커밋)"
date: "2026-03-20"
category: "dev-log"
description: "File Reading Policy, Closed Loop E2E, 과잉 진단 방지, Progressive Disclosure"
tags: ["vibe", "개발일지", "수렴 규칙", "progressive disclosure", "E2E"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #22 - 수렴 규칙과 Progressive Disclosure (10개 커밋)

**작업 기간**: 2026-03-06 ~ 2026-03-20

## 📝 이번 기간 작업 내용

### 품질 게이트 강화 (10개 커밋)

| 커밋 | 내용 |
|------|------|
| `Merge pull request #27` | PR #27 병합 |
| `feat: Add File Reading Policy guardrail to 5 core skills` | **파일 읽기 정책** |
| `feat: Closed Loop E2E 검증 설계 적용` | E2E 검증 루프 |
| `refactor: rename gpt-spark to gpt-codex and remove /vibe.voice` | voice 기능 제거 |
| `fix: clean up outdated references across assets` | 잔여 참조 정리 |
| `fix: 과잉 진단 방지 — 수렴 규칙 전 커맨드 일괄 적용` | **과잉 진단 방지** |
| `feat: SPEC-first gate + convert all doc additions to English` | SPEC 우선 게이트 |
| `refactor: optimize sub-agent usage across commands for token efficiency` | 토큰 절약 |
| `fix: remove unimplemented Google Apps from vibe status` | 미구현 제거 |
| `refactor: consolidate skills for progressive disclosure` | **Progressive Disclosure** |

## 💡 작업 하이라이트

**File Reading Policy**

AI가 코드를 수정하기 전에 반드시 파일을 읽도록 강제하는 가드레일을 5개 핵심 스킬에 적용했습니다. "읽지 않고 수정"하는 실수를 원천 차단:

```
❌ Edit file → (파일 내용 모름) → 잘못된 수정
✅ Read file → 내용 확인 → Edit file → 정확한 수정
```

**과잉 진단 방지 (Convergence Principle)**

리뷰 에이전트가 같은 문제를 반복 지적하거나, P3급 이슈를 끝없이 찾아내는 "과잉 진단" 문제를 해결했습니다. 수렴 규칙을 모든 커맨드에 일괄 적용:

- Round 1: P1+P2+P3
- Round 2: P1+P2만
- Round 3+: P1만
- 이전과 동일한 결과 → 즉시 종료

**Progressive Disclosure (Claude Code 팀 영감)**

Claude Code 팀의 스킬 관리 방식에서 영감을 받아, 스킬을 3단계로 분류했습니다. 사용자가 처음부터 45개 스킬에 압도되지 않도록:

```
Tier 1 (core):     항상 활성 — 9개
Tier 2 (standard): 프로젝트별 — ~21개
Tier 3 (optional): 명시적 호출만 — ~4개
```

## 📊 개발 현황

- **버전**: v2.7.13 → v2.7.17
- **핵심**: 파일 읽기 정책, 수렴 규칙, 3-tier 스킬 시스템
- **제거**: /vibe.voice 기능, Google Apps 미구현 항목

---

**다음 개발일지**: vibe-devlog-0023 (다음 10개 커밋 후)
