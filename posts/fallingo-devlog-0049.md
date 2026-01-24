---
title: "fallingo 개발일지 - 84907de..c4ce123 (13개 커밋)"
date: "2026-01-24"
category: "dev-log"
description: "Google Firebase에서 Azure로 인프라를 전면 마이그레이션하고 CI/CD를 설정했습니다."
tags: ["fallingo", "개발일지", "Azure", "CI/CD", "마이그레이션"]
author: "Su"
lang: "ko"
---

안녕하세요, Fallingo 프로젝트 개발자 Su입니다. 👋

이번 주는 제가 10년 넘게 프론트엔드 개발을 하면서 겪어보지 못했던, 아주 도전적인 시간을 보냈습니다. 😅 핵심 기능 개발보다는 **인프라와 환경 설정**에 모든 리소스를 쏟아부었는데요.

지난 개발일지에서 잠깐 언급했듯이, 저희는 전략적으로 클라우드 환경을 재정비하는 과정을 거쳤습니다. Google for Startups Cloud Program 크레딧을 잘 사용했지만, 최근 AI 서비스 통합과 장기적인 안정성을 고려하여 백엔드/인프라 환경을 **Microsoft Azure**로 전면 마이그레이션하는 작업을 완료했습니다!

총 13개의 커밋이 있었지만, 실제로는 며칠 밤낮을 인프라 환경 설정 파일과 씨름한 결과물입니다. 😭

## 📝 이번 기간 작업 내용

이번 커밋들은 크게 세 가지 영역으로 그룹화할 수 있습니다. 90% 이상이 인프라 설정과 관련된 내용입니다.

### 1. 🚀 클라우드 환경 전면 마이그레이션 (7개 커밋)

이번 주 작업의 핵심입니다. Fallingo의 백엔드와 데이터베이스를 포함한 모든 서비스를 GCP/Firebase에서 Azure 환경으로 옮기는 작업이었습니다.

| 작업 내용 | 주요 커밋 | 설명 |
| :--- | :--- | :--- |
| **클라우드 전환 및 AI 통합** | `feat: Azure 클라우드 마이그레이션 - AI 서비스 통합` | FastAPI 백엔드 환경을 Azure Container Apps 환경에 맞게 조정하고, 앞으로 사용할 Azure AI 서비스와의 연동 환경을 구성했습니다. |
| **Firebase 데이터 마이그레이션** | `feat: Firebase 프로젝트 마이그레이션 (fallingo-d0a5e)` | 사용자 인증 및 기본적인 실시간 데이터 구조를 Firebase에서 분리하고, 새로운 PostgreSQL/Azure DB 환경에 맞춰 초기 마이그레이션을 진행했습니다. |
| **프론트엔드 브랜딩 변경** | `refactor: about.html GCP 브랜딩을 Azure로 변경` | 프론트엔드 정적 페이지 (`about.html`)의 클라우드 스폰서십 관련 브랜딩을 Azure로 변경했습니다. (물론 이 과정에서 문제가 발생해 곧바로 Revert 했습니다. T_T) |

사실 마이그레이션은 단순히 코드를 옮기는 것이 아니라, **클라우드 서비스의 철학 자체를 이해**하는 과정이었습니다. 특히 Azure의 환경 설정 방식이 익숙하지 않아서 많은 문서를 찾아보며 시간을 보냈습니다.

### 2. ⚙️ Azure CI/CD 파이프라인 구축 (4개 커밋)

인프라를 옮겼으니, 이제 빠르고 안정적인 배포 환경을 구축해야죠. Fallingo는 Flutter로 개발된 프론트엔드와 FastAPI로 개발된 백엔드가 분리되어 있습니다.

| 영역 | Azure 서비스 | 주요 커밋 |
| :--- | :--- | :--- |
| **프론트엔드 배포** | Azure Static Web Apps | `ci: add Azure Static Web Apps workflow file` |
| **백엔드 배포** | Azure Container Apps | `chore: Azure Container Apps 배포 워크플로우 업데이트` |

Azure GitHub Actions 워크플로우 파일을 새로 생성하고 테스트했습니다. 특히 Static Web Apps의 경우 프론트엔드 코드를 빌드하고 배포하는 과정이 상당히 깔끔해서 인상 깊었습니다. 이제 커밋만 하면 바로 테스트 환경에 배포되는 구조가 마련되어 다음 주부터는 개발 속도를 올릴 수 있을 것 같아요! 🥳

### 3. 🐛 개발 환경 의존성 수정 및 업데이트 (2개 커밋)

대규모 환경 마이그레이션 중에는 항상 의존성 문제가 따라옵니다.

1.  **Python 의존성 고통:**
    FastAPI 프로젝트의 Python 환경을 설정하는 과정에서 `isort` 버전 지정 문제로 인해 `poetry.lock` 파일이 제대로 동기화되지 않는 문제가 발생했습니다. (존재하지 않는 버전 5.14.0을 참조하고 있었더라고요.) 결국 5.13.0으로 강제 다운그레이드하고, `poetry lock --no-update` 옵션을 제거하면서 환경을 안정화했습니다. 백엔드 환경 설정에만 꽤 많은 시간을 썼습니다.

2.  **Flutter SDK 업데이트:**
    프론트엔드 환경을 깨끗하게 정리하기 위해 Flutter/Dart SDK를 최신 버전인 3.27.0/3.6.0으로 업그레이드했습니다. 마이그레이션 작업에 묻힐까 봐 미리미리 해두었습니다.

## 💡 작업 하이라이트: Azure로의 대전환

이번 기간의 가장 중요한 성과는 **클라우드 환경의 전략적 대전환**입니다.

사실 GCP 크레딧이 있었지만, 제가 학습 중인 AI 기반 개발 방식과 FastAPI 백엔드를 가장 효율적으로 운영할 수 있는 환경을 모색했습니다. 특히 Azure가 제공하는 **Cognitive Services 및 OpenAI 통합** 환경이 Fallingo가 목표로 하는 '위치 기반 AI 추천' 기능 구현에 결정적인 이점을 제공한다고 판단했습니다.

![Mermaid Diagram showing the new Azure Architecture](https://mermaid.live/svg/eyJjb2RlIjoiZGlhZ3JhbSB0YiB7XG4gICAgc3ViZ3JhcGggQ2xvdWQgTWlncmF0aW9uXG4gICAgICAgIEdDUl9PTEQoR0NQIC0tPiBBenVyZSkgLS0tPiBBenVyZV9ORVc7XG4gICAgZW5kXG5cbiAgICBTdWJzY3JpcHRpb24gLS0tPiBBWl9SZXBvO1xuICAgIFtGV0QgLSBBenVyZSBTdGF0aWMgV2ViIEFwcHNdIC0tPiBBWl9SZXBvO1xuICAgIFtCV0QgLSBBenVyZSBDb250YWluZXIgQXBwc10gLS0tPiBBWl9SZXBvO1xuICAgIFtCV0QgLSBBenVyZSBDb250YWluZXIgQXBwc10gLS0tPiBbQ0lDIHwgQWkgQ29nbml0aXZlIFNlcnZpY2VzfVxuICAgIEFaX1JlcG97QWxsb2NhdGlvbiBvZiBDSS9DRCBJbmZyYX07XG59IiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZX0)

이제 개발 서버와 프로덕션 배포 파이프라인이 모두 Azure 기반으로 구축되었기 때문에, 클라우드 환경 문제 없이 오직 기능 구현에만 집중할 수 있게 되었습니다.

## 📊 개발 현황

이번 마이그레이션 덕분에 Fallingo 프로젝트의 기반이 아주 단단해졌습니다.

| 영역 | 진행도 | 비고 |
| :--- | :--- | :--- |
| **백엔드 (FastAPI/DB)** | 60% | 핵심 API 구현 완료. AI 서비스 통합 환경 100% 완료. |
| **프론트엔드 (Flutter)** | 40% | UI 개발 진행 중. AI 연동을 위한 클라이언트 API 구조 정리. |
| **인프라/CI/CD** | 100% | Azure Static Web Apps, Container Apps 배포 완료. |

다음 주부터는 다시 **Flutter 프론트엔드 개발**에 집중할 예정입니다. 특히 위치 기반 데이터 처리와 사용자 경험을 개선하는 작업에 돌입하려고 합니다.

오랜만에 서버 인프라 깊숙이 들어가서 고생했지만, 클라우드 환경에 대한 이해도를 넓힐 수 있었던 귀중한 시간이었습니다. 다음 개발일지는 아마 눈에 보이는 새로운 기능들로 가득 차기를 바라봅니다! 😊

읽어주셔서 감사합니다! 다음 주에 또 만나요!