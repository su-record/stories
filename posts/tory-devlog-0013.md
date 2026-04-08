---
title: "tory 개발일지 #13 - 배포 인프라 완성 + 미디어 기능 (10개 커밋)"
date: "2026-03-08"
category: "dev-log"
description: "Azure 배포 파이프라인 완성, YouTube 영상 분석, 로컬 영상 자동 편집, Tauri 자동 업데이트까지 기록합니다."
tags: ["tory", "개발일지", "azure", "ci-cd", "youtube", "video-editing", "tauri-updater"]
author: "Su"
lang: "ko"
---

# tory 개발일지 #13 - 배포 인프라 완성 + 미디어 기능 (10개 커밋)

**작업 기간**: 2026-03-07 ~ 2026-03-08

## 📝 이번 기간 작업 내용

### Azure 배포 파이프라인 완성 (5개 커밋)

Azure Static Web Apps 배포 인증 방식을 OIDC로 통일했다. 기존 방식과 충돌하던 `core` 변수 이름 문제를 수정하고, 워크플로우 파일명을 SWA가 기대하는 형식으로 맞췄다. 데스크톱 릴리스 빌드가 완료되면 Azure Blob Storage에 자동 업로드하는 단계도 추가했다. 웹 다운로드 버튼에 Blob Storage URL을 연결해 사용자가 직접 최신 빌드를 받아갈 수 있게 됐다.

랜딩 페이지에서 `GPT-4o`로 표기하던 모델명을 `GPT`로 변경했다. 특정 버전명을 마케팅 문구에 노출하면 모델 업데이트마다 페이지를 수정해야 하는 문제가 있었다.

| 커밋 | 내용 |
|------|------|
| `ci: OIDC 인증 추가 — Azure SWA 배포 인증 방식 일치` | SWA OIDC 인증 통합 |
| `fix(ci): OIDC 토큰 스크립트에서 core 변수 충돌 수정` | OIDC 스크립트 변수 충돌 해소 |
| `ci: 워크플로우 파일명을 Azure SWA 기대 파일명으로 변경` | 워크플로우 파일명 정규화 |
| `ci: 데스크톱 릴리스 빌드 후 Azure Blob Storage 업로드 추가` | 빌드 아티팩트 자동 업로드 |
| `fix: 랜딩 페이지 모델명 GPT-4o → GPT로 변경` | 랜딩 모델명 일반화 |

### YouTube 분석 + 영상 편집 + 자동 업데이트 (5개 커밋)

YouTube 영상 분석 기능을 추가했다. 자막을 추출한 뒤 다중 LLM 회의를 통해 영상 내용을 분석한다. 긴 영상의 핵심을 빠르게 파악하거나 내용에 대해 여러 관점의 평가를 받을 때 유용하다.

로컬 영상 자동 편집 기능은 FFmpeg, STT, LLM을 조합한다. STT로 영상의 음성을 텍스트로 변환하고, LLM이 편집 계획을 생성한 뒤, FFmpeg으로 실제 편집을 수행한다. Tauri 자동 업데이트는 `tauri-plugin-updater`를 적용해 앱 내에서 새 버전을 감지하고 설치할 수 있게 했다. DesignDocReview의 `STAGE_LABELS`에 누락된 파이프라인 스테이지도 이 기간에 보충했다.

| 커밋 | 내용 |
|------|------|
| `feat: YouTube 영상 분석 기능 추가 (자막 추출 + 다중 LLM 회의 분석)` | YouTube 자막 기반 LLM 분석 |
| `feat: Tauri 2 자동 업데이트 기능 추가 (tauri-plugin-updater)` | 앱 내 자동 업데이트 |
| `feat: 로컬 영상 자동 편집 기능 추가 (FFmpeg + STT + LLM 편집 계획)` | FFmpeg+STT+LLM 영상 편집 파이프라인 |
| `feat: 다운로드 버튼에 Azure Blob Storage URL 연결` | 다운로드 링크 Blob Storage 연결 |
| `fix: DesignDocReview STAGE_LABELS에 누락된 파이프라인 스테이지 추가` | 스테이지 레이블 누락 보완 |

## 💡 작업 하이라이트

**Azure 배포 파이프라인 완전 자동화**

OIDC 인증 도입으로 CI 시크릿 관리가 단순해졌다. 서비스 주체 자격증명 대신 워크플로우 실행 시 단기 토큰을 발급받는 방식이라 키 로테이션 부담이 없다. 빌드 → Blob Storage 업로드 → 다운로드 버튼 연결까지 릴리스 파이프라인이 하나의 흐름으로 이어졌다.

**FFmpeg + STT + LLM 편집 파이프라인**

영상 편집 자동화는 단순 트리밍이 아니라 의미 기반 편집이다. STT 결과에서 의미 단위를 파악하고, LLM이 어느 구간을 남기고 제거할지 계획을 세운다. FFmpeg이 그 계획을 실행한다. 세 도구를 직렬로 연결하는 파이프라인 설계가 이 기능의 핵심이다.

## 📊 개발 현황

- **커밋**: 10개
- **핵심**: Azure OIDC 배포 자동화, YouTube 분석, FFmpeg 영상 편집, Tauri 자동 업데이트
