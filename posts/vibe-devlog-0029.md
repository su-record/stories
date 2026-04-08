---
title: "vibe 개발일지 #29 - Figma REST API 자체 도구와 MCP 탈출 (10개 커밋)"
date: "2026-04-06"
category: "dev-log"
description: "Figma REST API 자체 구현, MCP 플러그인 완전 대체, 스킬 네이밍 통일, 레거시 정리"
tags: ["vibe", "개발일지", "Figma REST API", "MCP 탈출", "vibe.figma"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #29 - Figma REST API 자체 도구와 MCP 탈출 (10개 커밋)

**작업 기간**: 2026-04-06

## 📝 이번 기간 작업 내용

### MCP에서 자체 도구로 (10개 커밋)

| 커밋 | 내용 |
|------|------|
| `refactor: vibe-figma Phase 2 단순화 — 직역/일반 모드 제거` | 모드 통합 |
| `feat: vibe-figma Phase 2에 클래스 매핑 테이블 추가` | 클래스 매핑 |
| `refactor: 스킬 네이밍 vibe- → vibe. 통일 + vibe.docs command` | **네이밍 통일** |
| `fix: postinstall에서 레거시 vibe-* 스킬 디렉토리 자동 정리` | 레거시 정리 |
| `feat: Figma REST API 기반 디자인 추출 도구 — MCP 플러그인 대체` | **자체 도구!** |
| `feat: vibe.figma 스킬 Phase 2를 자체 도구로 전환` | Phase 2 전환 |
| `chore: MCP 플러그인 참조 제거` | MCP 참조 정리 |
| `feat: Figma REST API 자체 도구로 MCP 플러그인 완전 대체` | **MCP 완전 대체** |
| `fix: 보안 강화 + 안정성 개선` | 보안 패치 |
| `feat: figma-extract hook script 추가` | Hook 연동 |

## 💡 작업 하이라이트

**Figma REST API 자체 도구**

MCP 플러그인에 의존하던 Figma 데이터 추출을 완전히 자체 도구(`src/infra/lib/figma/`)로 대체했습니다. MCP 플러그인의 불안정성(간헐적 연결 끊김, 버전 호환성 문제)을 근본적으로 해결:

```
Before:
  /vibe.figma → MCP 플러그인 → Figma API → 데이터
  (MCP 서버 필요, 연결 불안정)

After:
  /vibe.figma → src/infra/lib/figma/ → Figma API → 데이터
  (자체 도구, 안정적)
```

**스킬 네이밍 통일: vibe- → vibe.**

하이픈(`vibe-figma`)에서 닷(`vibe.figma`)으로 네이밍을 통일했습니다. postinstall에서 레거시 `vibe-*` 디렉토리를 자동 정리하여 기존 사용자도 깨끗하게 전환됩니다:

```
Before: vibe-figma, vibe-docs, vibe-spec
After:  vibe.figma, vibe.docs, vibe.spec
```

**3단계 MCP 탈출**

MCP 의존성 제거는 3커밋에 걸쳐 진행되었습니다:
1. Figma REST API 자체 도구 구현
2. Phase 2를 자체 도구로 전환
3. MCP 참조 완전 제거

외부 플러그인 의존성이 0이 되었습니다.

## 📊 개발 현황

- **버전**: v2.8.26 → v2.8.32
- **핵심**: Figma REST API 자체 구현, MCP 완전 대체, 네이밍 통일
- **의존성**: 외부 MCP 플러그인 0개

---

**다음 개발일지**: vibe-devlog-0030 (다음 10개 커밋 후)
