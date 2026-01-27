---
title: "fallingo 개발일지 - b290c59..3806c7b (10개 커밋)"
date: "2026-01-27"
category: "dev-log"
description: "iOS Google Sign-In 통합 및 Firebase 인증 구조 변경 작업"
tags: ["fallingo", "개발일지", "Firebase", "iOS", "OAuth", "Flutter"]
author: "Su"
lang: "ko"
---

안녕하세요, Fallingo 프로젝트를 개발하고 있는 Su입니다.

프론트엔드 경력이 10년이 넘지만, Flutter로 모바일 앱 환경을 구축하는 것은 여전히 새롭고 재미있는 도전의 연속이네요. 특히 최근 AI 기반 개발 환경에 적응하면서 FastAPI와 Flutter를 함께 다루다 보니, 하루하루가 학습입니다. 📚

이번 주 커밋 내역을 보니, 1월 27일 하루 동안 인증(Authentication) 관련 작업에 모든 시간을 쏟아부었음을 알 수 있었습니다. 특히 iOS Google Sign-In 설정 때문에 눈물을 머금고 씨름했던 기억이 납니다. 😵‍💫

이번 기간 동안 진행했던 10개의 커밋 내역을 기반으로 개발 일지를 공유합니다.

---

## 📝 이번 기간 작업 내용

이번 커밋들은 크게 **인증 구조 리팩토링**과 **iOS Google Sign-In 통합**의 두 가지 영역으로 나눌 수 있습니다. 총 10개의 커밋 중, 7개가 iOS OAuth 설정에 집중되었습니다.

### 1. 인증 시스템 개편 및 보안 강화 (3개 커밋)

클라우드 환경을 관리하는 방식에 대해 고민이 많았습니다. Google for Startups Cloud Program에 선정되어 GCP 크레딧을 잘 활용하고 있지만, 모바일 앱 인증만큼은 Firebase Auth를 통일된 창구로 사용하는 것이 관리 측면에서 효율적이라는 결론을 내렸습니다.

| 커밋 메시지 요약 | 변경 내용 |
| :--- | :--- |
| `refactor: GCP 참조를 Firebase Auth로 변경` | 인증 로직을 Firebase 기반으로 통합하여 백엔드/프론트엔드 연동 단순화. |
| `refactor: external/gcp → external/google 폴더 이름 변경` | 코드 베이스 내에서 GCP를 넘어선 광범위한 Google 서비스 활용을 고려한 명칭 통일. |
| `fix: 비로그인 상태에서 알림 API 호출 방지` | 인증 구조 변경 후 발견된 보안 취약점 수정. (가장 기본적인 문제였는데 놓칠 뻔했습니다 😅) |

**주요 성과:** 인증 시스템을 Firebase Auth 중심으로 개편함으로써, 모바일 환경에서 ID 토큰을 관리하고 검증하는 과정이 훨씬 간결해졌습니다.

### 2. iOS Google Sign-In 통합 고군분투 (7개 커밋)

Flutter 앱에 Google Sign-In을 통합하는 과정에서, Android는 비교적 순조로웠으나 iOS 환경, 특히 백엔드 API 서버와 통신하기 위한 토큰 발행 과정에서 끊임없이 문제가 발생했습니다.

모바일 클라이언트에서 Google 로그인을 수행하고 얻은 `serverClientId`를 FastAPI 백엔드에서 검증해야 하는데, 이 ID를 무엇으로 설정해야 할지 Xcode와 Flutter 설정 사이에서 계속 헤매야 했습니다.

| 커밋 메시지 요약 | 문제 해결 과정 |
| :--- | :--- |
| `fix: iOS Google OAuth 클라이언트 ID 추가` | 기본 설정 파일에 ID 누락 수정. |
| `fix: GoogleService-Info.plist를 Runner 그룹으로 이동` | Xcode 빌드 환경에서 설정 파일을 찾지 못하는 문제 해결. |
| `fix: iOS Google Sign-In 및 API 엔드포인트 수정` | 프론트엔드/백엔드 연동 시 토큰 전송 방식 조정. |
| `fix: iOS Google Sign-In serverClientId를 Web 클라이언트 ID로 통일` | ❌ 실패. Web ID를 사용했으나 토큰이 유효하지 않음. |
| `fix: iOS Google Sign-In serverClientId를 iOS 클라이언트 ID로 명시 설정` | ❌ 실패. iOS ID를 사용했으나 여전히 백엔드에서 토큰 검증 오류 발생. |
| `fix: iOS Google Sign-In serverClientId 제거` | ✅ 해결. **결론적으로, Flutter 패키지에서 요구하는 설정이 아니었거나, 다른 설정과 충돌하면서 오류를 일으켰습니다.** 제거하니 작동하기 시작했습니다. |

**반복된 Fix의 교훈:**
OAuth 설정은 1mm의 오차도 허용하지 않는 영역입니다. 특히 Flutter + iOS + Backend ID Token Validation이라는 3중 구조에서는, 공식 문서가 때로는 현재 사용 중인 라이브러리 버전과 맞지 않아 혼란을 줄 때가 많습니다. 이번처럼 여러 클라이언트 ID를 시도하고 제거하는 과정을 통해, 무엇이 핵심 설정이고 무엇이 불필요한 설정인지 몸으로 배웠습니다. 😭

---

## 💡 작업 하이라이트

### 1. Firebase Auth를 통한 클라우드 전략 표준화

가장 의미 있는 결정은 GCP의 인증 시스템을 직접 핸들링하는 대신, Firebase Auth로 프론트엔드(Flutter) 인증을 완전히 위임한 것입니다.

Google for Startups Cloud 크레딧을 받았지만, 개발 속도와 안정성을 고려했을 때, 전문적인 인증 서비스인 Firebase Auth를 사용하는 것이 초기 스타트업 단계에서는 훨씬 유리합니다. 이를 통해 제가 핵심 비즈니스 로직(위치 기반 음식 공유) 개발에 집중할 수 있는 환경을 만들었습니다. ✨

### 2. 크로스 플랫폼 인증 설정의 미묘한 차이 극복

iOS Sign-In 오류는 많은 개발자들이 겪는 고통이죠.

| 플랫폼 | Client ID 요구 사항 | 결과 |
| :--- | :--- | :--- |
| **Android** | `webClientId` (백엔드 서버 ID) 사용 필수 | 설정이 비교적 직관적이었음. |
| **iOS** | `serverClientId` (백엔드 서버 ID) 설정 불필요/제거 | 설정이 매우 까다로웠으며, 최종적으로 `serverClientId`를 제거해야 정상 작동함. |

이 미묘한 차이 때문에 하루를 통으로 썼지만, 덕분에 Flutter/Firebase/iOS 환경에서 Google ID 토큰 플로우를 완벽하게 이해할 수 있었습니다. 혹시 비슷한 문제로 고통받는 개발자분이 계시다면, "필요 없는 설정을 넣지 않는 것"이 해답일 수 있다는 점을 꼭 공유하고 싶습니다.

---

## 📊 개발 현황

현재 Fallingo는 핵심 사용자 흐름(인증, 위치 기반 데이터 접근, 포스팅)을 구현하는 단계에 있습니다. 인증 구조가 안정화되었으니, 이제 지도 기반 UI와 포스팅 로직 개발에 집중할 수 있게 되었습니다.

*   **백엔드 (FastAPI/PostgreSQL):** 사용자 및 인증 관련 API는 100% 완료되었습니다. 피드 및 관계 관련 API 구현률 60%
*   **프론트엔드 (Flutter):** 크로스 플랫폼 인증 (Google, Apple) 통합 완료. 메인 지도 뷰 UI 70% 진행 중.

2025년 12월 베타 런칭 목표를 위해 순항 중입니다. 다음 개발 일지에서는 멋진 UI 화면이나, 아니면 또 다른 인프라 지옥(?)에 빠진 이야기를 들고 찾아오겠습니다.

읽어주셔서 감사합니다! 😊