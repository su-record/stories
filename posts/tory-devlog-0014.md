---
title: "tory 개발일지 #14 - 미디어 폭풍 + Closed Loop (10개 커밋)"
date: "2026-03-08"
category: "dev-log"
description: "실시간 자막, 발표 보조, 사진 편집, Canvas 미디어 모드, Closed Loop 검증 시스템까지 하루에 쏟아진 기능들을 기록합니다."
tags: ["tory", "개발일지", "closed-loop", "subtitle", "presentation", "photo-edit", "canvas", "ssot"]
author: "Su"
lang: "ko"
---

# tory 개발일지 #14 - 미디어 폭풍 + Closed Loop (10개 커밋)

**작업 기간**: 2026-03-08

## 📝 이번 기간 작업 내용

### 실시간 자막 + 발표 보조 (2개 커밋)

실시간 자막/번역 기능은 Gemini Live TEXT 모달리티를 사용한다. 음성 입력을 실시간으로 받아 자막을 생성하고 Glass 오버레이로 화면에 표시한다. 외국어 콘텐츠를 보거나 회의 중 실시간 요약이 필요할 때 쓸 수 있다.

프레젠테이션 자동 발표 기능도 같은 Glass 오버레이 위에서 동작한다. 슬라이드 내용을 Live text로 전송하면 발표 스크립트를 실시간으로 제안받는다. 발표자는 화면을 보면서 자연스럽게 진행할 수 있다.

| 커밋 | 내용 |
|------|------|
| `feat: 실시간 자막/번역 기능 추가 (Gemini Live TEXT 모달리티 + Glass 오버레이)` | 실시간 자막 Glass HUD |
| `feat: 프레젠테이션 자동 발표 기능 추가 (Glass 오버레이 + Live text 전송)` | 발표 보조 Glass HUD |

### 사진 편집 + Canvas 미디어 확장 (3개 커밋)

사진 편집 기능은 image-edit API를 호출하고 Canvas에서 원본과 결과를 나란히 비교한다. 입력 텍스트로 편집 의도를 분류해 적절한 편집 모드를 선택한다.

Canvas를 미디어 허브로 확장했다. 영상 미리보기, 튜터 모드, 미디어 전용 UI를 Canvas 내에서 통합 제공한다. 영상 편집 UX도 개선해 진행률 실시간 갱신, 파일 열기, 유효성 검증을 추가했다.

| 커밋 | 내용 |
|------|------|
| `feat: 영상 편집 UX 개선 (진행률 실시간 갱신, 파일 열기, 유효성 검증)` | 영상 편집 진행률 및 검증 |
| `feat: 사진 편집 기능 추가 (image-edit API + Canvas 비교 뷰 + intent 분류)` | Canvas 사진 편집 |
| `feat: Canvas 미디어 모드 확장 (영상 미리보기, 튜터, 미디어 모드 UI)` | Canvas 미디어 허브 통합 |

### 모델 설정 SSOT 일원화 + 프로필 동적 해결 (2개 커밋)

`packages/shared`에서 daemon이 모델 설정을 파생받는 구조로 SSOT를 일원화했다. 이전에는 shared와 daemon 양쪽에 모델 관련 설정이 분산돼 있었다. 회의 프로필은 환경 키를 통일하고 런타임에 동적으로 해결한다.

| 커밋 | 내용 |
|------|------|
| `refactor: 모델 설정 SSOT 일원화 (shared → daemon 파생)` | 모델 설정 단일 소스 |
| `refactor: 회의 프로필 동적 해결 + env key 통일` | 프로필 env key 통일 |

### Closed Loop 검증 시스템 + 서버 동기화 (3개 커밋)

Closed Loop에 검증 시스템을 추가했다. plan → execute → verify 사이클에서 verify 단계가 강화됐다. README도 시스템 전반을 설명하는 수준으로 크게 확장했다.

회의 결과와 Closed Loop 데이터를 서버에 동기화한다. Free 티어 사용자도 데이터가 서버에 저장되며, dev 환경에서는 updater가 동작하지 않도록 guard를 추가했다. CLAUDE.md, README, Tory.md 문서를 최신화하고 vibe spec을 추가했다.

| 커밋 | 내용 |
|------|------|
| `feat: Closed Loop 검증 시스템 + README 대폭 확장` | Closed Loop verify 강화 |
| `feat: 회의 + Closed Loop 데이터 서버 동기화 + updater dev guard` | 서버 동기화 + dev guard |
| `chore: CLAUDE.md/README/Tory.md 업데이트 + vibe spec 추가` | 문서 최신화 |

## 💡 작업 하이라이트

**하루에 10개 기능 커밋**

이 기간의 커밋 10개가 전부 2026-03-08 하루에 집중됐다. 미디어 관련 기능 5개(영상 편집 UX, 자막, 발표, 사진 편집, Canvas)와 인프라 개선 5개(SSOT, 프로필, Closed Loop, 동기화, 문서)가 동시에 진행됐다. 기능 폭발이 일어난 날이다.

**Closed Loop plan-execute-verify 완성**

Closed Loop의 세 단계가 이 기간에 완결됐다. plan은 작업을 분해하고, execute는 도구를 호출해 실행하며, verify는 결과가 목표를 충족하는지 검증한다. 검증 실패 시 루프를 재시작한다. 자율 실행 에이전트의 핵심 안전 장치다.

## 📊 개발 현황

- **커밋**: 10개
- **핵심**: 실시간 자막, 발표 보조, 사진 편집, Canvas 미디어, Closed Loop 검증, 서버 동기화
