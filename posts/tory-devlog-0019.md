---
title: "tory 개발일지 #19 - 릴리스 워크플로우 + AI 에이전트 (10개 커밋)"
date: "2026-03-12"
category: "dev-log"
description: "Windows 빌드 자동화 재구축, CLI-Anything으로 로컬 소프트웨어 AI 제어, Claude Code 에이전트 세팅까지 이틀간의 작업을 기록합니다."
tags: ["tory", "개발일지", "release", "ci-cd", "cli-anything", "claude-code", "tauri", "ux"]
author: "Su"
lang: "ko"
---

# tory 개발일지 #19 - 릴리스 워크플로우 + AI 에이전트 (10개 커밋)

**작업 기간**: 2026-03-11 ~ 2026-03-12

## 📝 이번 기간 작업 내용

### 릴리스 워크플로우 재구축 (4개 커밋)

Windows 빌드 파이프라인에서 `.nsis.zip` 파일 탐색이 실패하는 문제가 있었다. PowerShell의 `-Filter`는 단순 와일드카드만 지원하기 때문에 복합 확장자인 `.nsis.zip`을 찾지 못했다. `-Include`로 변경해 문제를 해결했다.

릴리스 워크플로우 전체를 visee 방식으로 재작성했다. 그 과정에서 tauri-action이 제거됐는데, `.nsis.zip` 생성에 tauri-action이 필요하다는 것을 확인하고 Windows 빌드에 한해 복원했다. bundle targets에 app을 추가하고 identifier `.app` 충돌도 함께 수정했다.

| 커밋 | 내용 |
|------|------|
| `fix: bundle targets에 app 추가 + identifier .app 충돌 수정` | 번들 타겟 및 식별자 수정 |
| `fix: PowerShell -Filter를 -Include로 변경하여 .nsis.zip 파일 탐색 수정` | Windows 빌드 아티팩트 탐색 수정 |
| `refactor: visee 방식으로 릴리스 워크플로우 전면 재작성` | 릴리스 워크플로우 전면 재작성 |
| `fix: Windows 빌드에 tauri-action 복원 (.nsis.zip 생성 필요)` | Windows 빌드 tauri-action 복원 |

### CLI-Anything + Claude Code 에이전트 세팅 (2개 커밋)

CLI-Anything은 로컬 데스크톱 소프트웨어를 AI 에이전트가 직접 제어할 수 있게 하는 통합 기능이다. Tory가 사용자 대신 CLI를 통해 소프트웨어를 조작한다. 에디터, 빌드 도구, 버전 관리 등 커맨드라인으로 접근할 수 있는 모든 것이 대상이다.

Claude Code를 AI 에이전트로 활용하기 위한 세팅을 구성했다. 커스텀 Skills, MCP(Model Context Protocol) 서버, Hooks를 추가했다. Tory 프로젝트 컨텍스트에 맞는 에이전트 행동 규칙과 도구 접근 권한을 정의했다.

| 커밋 | 내용 |
|------|------|
| `feat: CLI-Anything 통합 — 로컬 데스크톱 소프트웨어 AI 에이전트 제어` | CLI 기반 소프트웨어 자율 제어 |
| `feat: Claude Code AI 에이전트 세팅 — 커스텀 Skills, MCP, Hooks 추가` | 에이전트 환경 구성 |

### 데스크톱 UX 개선 (2개 커밋)

채팅앱의 드래그 동작, 캔버스 자동 배치, 글라스 API 키 안내 문구를 수정했다. 데스크톱 앱의 CORS 설정, 창 이동, 캔버스 레이아웃, Live 버튼 동작도 함께 개선했다.

| 커밋 | 내용 |
|------|------|
| `fix: 채팅앱 드래그/캔버스 자동배치/글라스 API키 안내 수정` | 채팅 UI 버그 수정 |
| `fix: 데스크톱 앱 UX 개선 — CORS, 창 이동, 캔버스, Live 버튼` | 데스크톱 UX 전반 개선 |

### PR 머지 및 충돌 해결 (2개 커밋)

Claude Code 에이전트 세팅 PR을 머지하고, main 브랜치와의 `ChatToolbar.tsx` 충돌을 해결했다.

| 커밋 | 내용 |
|------|------|
| `Merge pull request #14 from su-record/claude/setup-ai-agents-cDU1k` | AI 에이전트 세팅 PR 머지 |
| `merge: main 브랜치 충돌 해결 (ChatToolbar.tsx)` | 브랜치 충돌 해결 |

## 💡 작업 하이라이트

**릴리스 파이프라인의 레이어 문제**

Windows 빌드 자동화는 생각보다 까다롭다. `.nsis.zip`이라는 복합 확장자는 PowerShell의 기본 파일 필터를 통과하지 못한다. visee 방식으로 워크플로우를 재작성하면서 tauri-action을 제거했는데, 바로 이 `.nsis.zip` 생성 때문에 Windows에 한해 복원해야 했다. 빌드 도구 의존성이 예상치 못한 곳에 숨어 있었다.

**CLI-Anything: 에이전트가 소프트웨어를 직접 다루다**

CLI-Anything은 Tory의 자율 실행 범위를 로컬 소프트웨어로 확장한다. 사용자가 "파일 빌드해줘"라고 말하면 Tory가 직접 빌드 명령을 실행한다. Claude Code 에이전트 세팅과 결합하면 코드 작성부터 빌드, 버전 관리까지 자율적으로 처리할 수 있는 기반이 된다.

## 📊 개발 현황

- **커밋**: 10개
- **핵심**: Windows 빌드 자동화 수정, CLI-Anything 통합, Claude Code 에이전트 세팅, 데스크톱 UX 개선
