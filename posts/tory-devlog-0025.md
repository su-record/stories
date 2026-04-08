---
title: "tory 개발일지 #25 - 데몬→Tauri 전환 완결 + CORS 우회 (10개 커밋)"
date: "2026-03-17"
category: "dev-log"
description: "프론트엔드에 남아 있던 데몬 참조를 전수 제거하고 tauriFetch로 전환했습니다. CORS 문제를 플러그인으로 우회하고 보안 취약점 패치도 적용했습니다."
tags: ["tory", "개발일지", "tauri", "cors", "security", "refactor", "fetch"]
author: "Su"
lang: "ko"
---

# tory 개발일지 #25 - 데몬→Tauri 전환 완결 + CORS 우회 (10개 커밋)

**작업 기간**: 2026-03-17

## 📝 이번 기간 작업 내용

### 데몬 참조 전수 제거 (3개 커밋)

프론트엔드 코드에 남아 있던 데몬 참조를 전부 걷어냈다. 이전 아키텍처에서는 별도 데몬 프로세스를 통해 백엔드와 통신했으나, Tauri invoke/listen 방식으로 전환이 완료된 이후에도 프론트엔드 일부에 잔여 참조가 남아 있었다. `daemon_request` 호출을 포함한 모든 데몬 의존 코드를 제거하고 미사용 변수도 함께 정리했다.

| 커밋 | 내용 |
|------|------|
| `fix: 프론트엔드 데몬 참조 제거 — Tauri invoke/listen 전환` | 데몬→Tauri 전환 |
| `fix(desktop): roster_status에서 미사용 변수 제거` | 미사용 변수 정리 |
| `fix(desktop): daemon_request 잔여 참조 전부 제거` | 잔여 참조 최종 제거 |

### CORS 우회 + tauriFetch 전환 (4개 커밋)

데스크톱 앱에서 서버로의 HTTP 요청이 CORS로 차단되는 문제를 해결했다. 브라우저 fetch 대신 `tauri-plugin-http` JS 바인딩을 설치하고 전체 서버 호출을 tauriFetch로 전환했다. `server.tory.my` 도메인을 허용 목록에 추가하고 capabilities도 정리했다. OAuth 서버 URL도 이 과정에서 `localhost:9200`에서 `server.tory.my`로 최종 정리됐다.

| 커밋 | 내용 |
|------|------|
| `fix(desktop): OAuth 서버 URL을 localhost:9200으로 수정` | OAuth URL 수정 |
| `fix(desktop): 서버 URL을 server.tory.my로 수정` | 서버 URL 최종 정리 |
| `fix(desktop): CORS 우회 — fetch → tauri-plugin-http + server.tory.my 허용` | CORS 우회 |
| `fix(desktop): @tauri-apps/plugin-http JS 바인딩 설치` | HTTP 플러그인 설치 |
| `fix(desktop): 전체 서버 호출 tauriFetch 전환 + capabilities 정리` | tauriFetch 전환 |

### 보안 패치 + 에이전트 규칙 문서화 (2개 커밋)

`quinn-proto` 0.11.13에서 RUSTSEC-2026-0037 취약점이 발견됐다. 0.11.14로 패치를 적용했다. OpenClaw 모범 사례를 반영한 `AGENTS.md` 심링크를 추가하고 멀티 에이전트 운영 규칙도 강화했다.

| 커밋 | 내용 |
|------|------|
| `fix(deps): quinn-proto 0.11.13 → 0.11.14 (RUSTSEC-2026-0037)` | 보안 취약점 패치 |
| `docs: OpenClaw 모범 사례 반영 — AGENTS.md 심링크 + 에이전트 규칙 강화` | 에이전트 문서화 |

## 💡 작업 하이라이트

**데몬 아키텍처의 완전한 종료**

데몬→Tauri 전환은 이전 기간에 백엔드 중심으로 완료됐다. 이번에는 프론트엔드 코드에 흩어진 잔여 참조를 끝까지 추적해 제거했다. `daemon_request`를 세 번에 걸쳐 점진적으로 소거한 것은 안전한 제거를 위한 선택이었다. 한 번에 전부 바꾸면 놓치는 경우가 생긴다. 커밋별로 범위를 좁히며 확인했다.

**CORS는 플러그인으로**

데스크톱 앱의 webview에서 외부 서버에 직접 fetch를 날리면 CORS 정책에 막힌다. `tauri-plugin-http`를 사용하면 Rust 레이어에서 요청을 대신 보내 이 제약을 우회할 수 있다. 서버 URL을 `server.tory.my`로 통일하는 작업과 함께 진행하면서 개발 환경과 프로덕션 환경의 URL 혼재 문제도 함께 해소됐다.

## 📊 개발 현황

- **커밋**: 10개
- **핵심**: 데몬 참조 전수 제거, tauriFetch 전환, CORS 우회, RUSTSEC-2026-0037 패치
