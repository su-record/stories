---
title: "tory 개발일지 #3 - 멀티 채널 소통과 네이티브 실행 엔진 고도화 (17개 커밋)"
date: "2026-04-10"
category: "dev-log"
description: "메신저 채널 연동 및 OS 네이티브 실행 엔진 구현"
tags: ["tory", "개발일지"]
author: "Su"
lang: "ko"
---

# tory 개발일지 #3 - 멀티 채널 소통과 네이티브 실행 엔진 고도화 (17개 커밋)

**작업 기간**: 2026-04-07 ~ 2026-04-10

## 📝 이번 기간 작업 내용

### 시스템 아키텍처 및 인프라 정교화 (5개 커밋)

OpenClaw 프로젝트와 Tory의 통합 설계 문서를 확정하고 아키텍처를 동기화했습니다. Tauri 2 기반의 데스크톱 환경에서 Rust 백엔드와 프론트엔드 간의 통신 안전성을 높이기 위해 Typed API 래퍼를 도입했습니다. 의존성 보안 취약점을 해결하고 린트 규칙을 강화하여 코드 품질을 관리했습니다.

| 커밋 | 내용 |
|------|------|
| `docs: OpenClaw + Tory 통합 설계 문서 추가` | 두 프로젝트의 인터페이스 및 데이터 흐름 정의 |
| `refactor: Tauri invoke 타입 래퍼 + 잔여 중복 정리` | 프론트엔드-백엔드 호출 타입 안정성 확보 |
| `refactor(desktop): raw invoke() 호출을 typed tauri-api 래퍼로 교체` | 런타임 에러 방지를 위한 인터페이스 추상화 |
| `chore(deps): cargo/pnpm audit 그린화` | 취약 의존성 버전 업데이트 및 보안 픽스 |
| `chore(lint): Biome import 정렬 + h2 a11y suppress` | 코드 스타일 자동화 및 접근성 린트 예외 처리 |

### 실행 엔진: OS 네이티브 제어 및 채널 확장 (6개 커밋)

Tory가 실제 비서로서 동작하기 위한 실행 엔진(Execution Engine)의 핵심 기능을 구현했습니다. 윈도우와 macOS 환경에서 각각 네이티브 API를 통해 UI를 직접 제어할 수 있는 접근성 엔진을 구축했습니다. 또한 슬랙과 카카오톡을 지원하여 사용자의 소통 창구를 확장했습니다.

| 커밋 | 내용 |
|------|------|
| `feat(accessibility): Windows UIA + SendInput 실제 구현` | 윈도우 환경 UI 자동화 및 입력 제어 로직 |
| `feat(accessibility): macOS AXUIElement + CGEvent 실제 구현` | 맥 환경 접근성 API 기반 제어 엔진 |
| `feat(channels): Slack 채널 추가 (Web API + Socket Mode)` | 슬랙 실시간 메시징 및 API 연동 |
| `feat(channels): KakaoTalk Windows PC 카톡 특이점 보강` | PC 카카오톡의 비표준 UI 구조 대응 로직 |
| `feat(channels): KakaoTalk 채널 추가 (연락처 이름 기반 송신)` | 주소록 기반 수신자 식별 및 메시지 전송 기능 |
| `refactor: 중복 코드 통합 — HTTP/SSRF 공유 모듈 + JSON 추출 통합` | 네트워크 요청 및 응답 파싱 로직 단일화 |

### 비서실장 핵심 기능 및 LLM 최적화 (6개 커밋)

사용자의 자연어 명령에서 의도를 추출하고 이를 실행 가능한 페이로드로 변환하는 메커니즘을 강화했습니다. P0~P3 단계의 미구현 기능을 대거 추가하며 시스템의 완성도를 높였습니다. 로컬 LLM 운영 원칙을 명문화하고 코드 생성 도구인 Codex CLI의 호출 방식을 정정했습니다.

| 커밋 | 내용 |
|------|------|
| `feat(secretary): SendMessage 인텐트 + 자연어 페이로드 추출기` | 자연어 명령을 정형 데이터로 변환하는 오케스트레이터 로직 |
| `feat: P0~P2 미구현 기능 일괄 추가` | 핵심 로드맵 기능 구현체 반영 |
| `feat: P2~P3 기능 추가 — 동영상편집 + SNS업로드 + 캔버스개선` | 미디어 처리 및 소셜 서비스 확장 기능 |
| `fix(llm): Codex CLI 호출 방식 수정 + 로컬 LLM 원칙 문서화` | 로컬 추론 엔진 운영 가이드 및 인터페이스 수정 |
| `Merge pull request #26 from su-record/claude/explore-bati-flow` | Bati Flow 탐색 및 워크플로우 통합 |
| `Merge pull request #27 from su-record/claude/merge-openclaw-tori` | OpenClaw 통합 브랜치 병합 |

## 💡 작업 하이라이트

**OS별 네이티브 접근성 도구 구현**

자율 AI 비서가 API를 지원하지 않는 레거시 앱이나 일반 데스크톱 앱을 제어하기 위해서는 OS 수준의 접근권한이 필요합니다. 이번 작업에서 Windows UI Automation(UIA)과 macOS의 AXUIElement를 활용한 실행 엔진을 구현했습니다. 이를 통해 Tory는 단순한 API 호출을 넘어, 화면상의 버튼을 클릭하거나 텍스트 상자에 입력하는 등 실제 사용자의 행동을 모사할 수 있습니다. 윈도우의 `SendInput`과 맥의 `CGEvent`를 연동하여 하드웨어 수준의 입력 이벤트 발생을 자동화했습니다.

**메신저 채널 확장 및 인텐트 추출 시스템**

비서 시스템의 소통 창구를 슬랙과 카카오톡으로 확장했습니다. 특히 카카오톡 윈도우 버전의 경우 표준 컨트롤을 사용하지 않는 특이점이 있어, 이를 처리하기 위한 보강 로직을 적용했습니다. 사용자가 "나중에 팀장님한테 오늘 회의록 좀 보내줘"라고 말하면, `SendMessage` 인텐트가 작동하여 주소록에서 대상을 식별하고 자연어 명령에서 실제 전송할 메시지 내용을 추출하는 페이로드 파서(Extractor)를 구축했습니다.

**시스템 안정성 및 보안 강화**

다수의 LLM Provider를 사용하는 프로젝트 특성상 발생할 수 있는 보안 취약점과 코드 중복 문제를 해결했습니다. SSRF(Server-Side Request Forgery) 방지를 위한 공유 네트워크 모듈을 구축하고, Tauri의 `invoke` 호출부를 타입 안정성이 보장된 래퍼로 교체했습니다. Biome을 도입하여 대규모 코드베이스에서의 린트와 포맷팅 효율을 극대화했습니다.

## 📊 개발 현황

- **커밋**: 17개 (2026-04-07 ~ 2026-04-10)
- **핵심 인프라**: Tauri 2 Typed API 적용, SSRF 방지 모듈 도입
- **지원 채널**: Slack (Socket Mode), KakaoTalk (PC UI Automation)
- **네이티브 제어**: Windows UIA, macOS Accessibility API 기반 실행 엔진 구현
- **기능 진척**: P0~P3 주요 기능(비디오 편집, SNS 업로드, 메시지 전송 등) 구현 완료 및 통합