---
title: "tory 개발일지 #18 - 결제 + Ollama + macOS 배포 (10개 커밋)"
date: "2026-03-10"
category: "dev-log"
description: "Paddle Billing 결제 연동, Ollama 로컬 LLM 자동 감지, macOS 코드 서명 및 공증까지 기록합니다."
tags: ["tory", "개발일지", "paddle", "ollama", "macos", "code-signing", "billing", "local-llm"]
author: "Su"
lang: "ko"
---

# tory 개발일지 #18 - 결제 + Ollama + macOS 배포 (10개 커밋)

**작업 기간**: 2026-03-09 ~ 2026-03-10

## 📝 이번 기간 작업 내용

### 코드 리뷰 반영 + GNB + 약관 개편 (3개 커밋)

전날 코드 리뷰에서 나온 P1/P2 이슈를 수정하고 README를 전면 개편했다. 웹앱에 GNB(Global Navigation Bar)를 추가했다. Azure SWA 배포 설정도 함께 수정했다. 약관과 정책 페이지를 개편하고, youtube.ts에 불필요하게 남아있던 `ts-expect-error` 디렉티브를 제거했다.

| 커밋 | 내용 |
|------|------|
| `fix: 코드 리뷰 P1/P2 이슈 수정 + README 전면 개편` | P1/P2 수정 + README 개편 |
| `feat: 웹앱 GNB 추가 + SWA 배포 수정 + 약관/정책 개편` | GNB + 약관/정책 |
| `fix: youtube.ts 불필요한 ts-expect-error 디렉티브 제거` | ts-expect-error 제거 |

### Paddle Billing 결제 연동 (2개 커밋)

Paddle Billing을 결제 수단으로 연동했다. 서버에 webhook 엔드포인트를 구현하고 웹앱에 checkout 플로우를 추가했다. Paddle은 VAT 처리와 결제 대행을 모두 담당한다. 도메인 리뷰 피드백을 반영해 Paddle 설정도 보완했다.

결제 연동은 수동 검토가 필수인 영역이다. webhook 수신 → 구독 상태 업데이트 → 티어 변경 흐름이 정확히 동작하는지 반드시 확인해야 한다.

| 커밋 | 내용 |
|------|------|
| `fix: Paddle 도메인 리뷰 피드백 반영` | Paddle 설정 보완 |
| `feat: Paddle Billing 결제 연동 (서버 webhook + 웹 checkout)` | Paddle webhook + checkout |

### Codex CLI + Ollama 자동 감지 (4개 커밋)

Codex CLI 호출 함수를 추가했다. fast mode를 지원하며 Closed Loop에서 코딩 작업에 활용한다. Ollama 자동 감지는 두 단계로 나뉜다. 먼저 로컬에서 실행 중인 Ollama를 자동으로 감지하고, 감지된 모델을 프로바이더에 매핑한다. 외부 API 키 없이 오픈소스 모델을 바로 사용할 수 있게 된다.

외부 공유용 서비스 소개 문서도 이 기간에 작성했다.

| 커밋 | 내용 |
|------|------|
| `feat: Codex CLI 호출 함수 추가 (fast mode 지원)` | Codex CLI fast mode |
| `feat: Ollama 자동 감지 + 외부 공유용 서비스 소개 문서` | Ollama 감지 + 소개 문서 |
| `feat: Ollama 오픈소스 모델 자동 감지 + 프로바이더 매핑` | Ollama 모델 프로바이더 매핑 |

### macOS 코드 서명 + 공증 + 빌드 스크립트 (2개 커밋)

macOS 배포를 위한 코드 서명과 Apple 공증(notarization) 설정을 완료했다. Tauri 업데이터 서명도 함께 설정했다. 공증 없이는 macOS Gatekeeper가 앱 실행을 차단한다. tauri-action에서 사용할 tauri 빌드 스크립트도 추가했다.

| 커밋 | 내용 |
|------|------|
| `feat: macOS 코드 서명 + 공증 + Tauri 업데이터 서명 설정` | macOS 서명 + 공증 |
| `fix: tauri-action용 tauri 스크립트 추가` | tauri 빌드 스크립트 |

## 💡 작업 하이라이트

**Ollama 자동 감지로 진입 장벽 낮추기**

외부 LLM API를 사용하려면 API 키가 필요하다. Ollama 자동 감지는 이 장벽을 없앤다. 로컬에 Ollama가 실행 중이면 Tory가 자동으로 감지하고 사용 가능한 모델 목록을 보여준다. API 키 설정 없이 오픈소스 모델로 바로 시작할 수 있다.

**macOS 배포 체인 완성**

코드 서명 → 공증 → Tauri 업데이터 서명까지 macOS 배포에 필요한 모든 단계를 설정했다. 공증은 Apple 서버에 앱을 제출해 악성 코드 여부를 확인받는 과정이다. 이 설정 없이는 사용자가 앱을 열 때마다 경고를 받거나 아예 실행이 차단된다. CI에서 자동으로 이 과정을 거치도록 구성했다.

## 📊 개발 현황

- **커밋**: 10개
- **핵심**: Paddle Billing webhook + checkout, Ollama 자동 감지, Codex CLI, macOS 코드 서명 + 공증, 웹앱 GNB
