---
title: "fallingo 개발일지 - 4bdffb4..b4a3453 (10개 커밋)"
date: "2026-01-27"
category: "dev-log"
description: "Flutter CI/CD 환경 안정화 및 백엔드 보안 취약점을 해결했습니다."
tags: ["fallingo", "개발일지", "flutter", "fastapi", "CI/CD", "xcodecloud"]
author: "Su"
lang: "ko"
---

안녕하세요, Fallingo 프로젝트를 개발하고 있는 Su입니다. 😃

프론트엔드 경력 10년이 넘지만, Flutter와 FastAPI로 새로운 도전을 시작한 지 얼마 되지 않아 매일이 배움의 연속입니다. 특히 이번 기간에는 CI/CD 환경 구축과 보안 취약점 해결에 많은 시간을 보냈습니다.

2026년 1월 27일에 몰아서 진행한 10개의 커밋 내역을 바탕으로, 이번 기간 동안 Fallingo에 어떤 일이 있었는지 정리해 보겠습니다.

---

## 📝 이번 기간 작업 내용

이번 커밋들은 대부분 개발 환경의 안정화와 코드 품질 향상에 집중되었습니다. 특히 Flutter 앱의 iOS 빌드 환경을 애플의 [Xcode Cloud](https://developer.apple.com/xcode-cloud/)와 연동하는 과정에서 많은 삽질이 있었습니다.

### 1. CI/CD 및 모바일 빌드 환경 안정화 (5개 버그 수정 🛠️)

Flutter 프로젝트를 Xcode Cloud에서 안정적으로 빌드하는 것이 가장 큰 도전이었습니다. 비밀 파일 처리와 빌드 스크립트 개선에 집중했습니다.

| 커밋 내용 | 설명 및 도전 과제 |
| :--- | :--- |
| `fix: GoogleService-Info.plist 경로 참조 수정` | CI 환경에서 Google 서비스 설정 파일이 제대로 로드되지 않아 빌드가 실패했습니다. 경로를 절대 경로 대신 상대 경로로 변경하며 해결했습니다. |
| `fix: Xcode Cloud에서 GoogleService-Info.plist 자동 생성` | 보안상의 이유로 `plist` 파일을 Git에 올릴 수 없어서, CI 파이프라인(`ci_post_clone.sh`)에서 해당 파일을 환경 변수 기반으로 자동으로 생성하도록 스크립트를 개선했습니다. Xcode Cloud 설정 지옥 🤯 |
| `fix: Xcode Cloud ci_post_clone.sh 스크립트 개선` | 자동 생성 스크립트의 권한 문제와 인코딩 문제를 반복적으로 디버깅하고 개선했습니다. |
| `fix: iOS 수출 규정 준수 설정 추가 (ITSAppUsesNonExemptEncryption)` | App Store Connect에 앱을 제출하기 위해 iOS 암호화(Encryption) 사용 관련 규정 준수 설정을 Info.plist에 추가했습니다. 이 부분이 누락되면 제출 시 경고가 발생합니다. |

### 2. 백엔드 보안 및 API 설정 (2개 버그 수정 🔒)

Fallingo 백엔드는 FastAPI로 구성되어 있습니다. 외부 라이브러리 보안 점검과 프로덕션 환경의 안전을 확보했습니다.

*   **`fix: python-multipart 보안 취약점 수정 (CVE-2026-24486)`**: 사용 중인 라이브러리에서 알려진 보안 취약점(`CVE-2026-24486`)이 발견되어 즉시 패치 버전을 적용했습니다. 보안은 절대 타협할 수 없는 부분이죠.
*   **`fix: Google OAuth 클라이언트 ID 수정 및 프로덕션 Swagger 비활성화`**: 개발 환경에서 사용하던 Google OAuth 클라이언트 ID를 프로덕션용으로 교체하고, 보안 강화를 위해 라이브 서버에서는 Swagger UI(API 문서)에 접근할 수 없도록 설정했습니다.

### 3. 프론트엔드 코드 품질 및 UI 개선 (2개 개선 ✨)

Flutter 코드의 초기 품질을 높이는 작업을 진행했습니다.

*   **`fix: Flutter 정적 분석 50개 이슈 수정`**: Dart 및 Flutter의 정적 분석 도구(Lint)를 돌렸더니 사소하지만 고쳐야 할 부분이 50개 정도 나왔습니다. 이 모든 이슈(예: 불필요한 `final` 제거, 권장되는 위젯 사용 등)를 수정하여 코드 베이스의 안정성을 높였습니다.
*   **`fix: 하단 네비게이션 바 overflow 수정 및 테마 색상 개선`**: 하단 네비게이션 바(BottomNavigationBar)에서 특정 조건에서 발생하는 화면 넘침(Overflow) 버그를 수정하고, 전체적인 Fallingo 테마 색상을 좀 더 따뜻하게 조정했습니다.

### 4. 문서화 및 개발 방법론 정리 (2개 문서 업데이트 📑)

최근 AI 기반 개발을 시도하면서 생성형 AI를 활용한 문서 작업 및 방법론 정리가 필수적이었습니다.

*   **`docs: CLAUDE.md 중복 콘텐츠 정리 (8,651줄 → 1,005줄)`**: AI 모델에 투입하는 프롬프트와 컨텍스트 관리를 위해 작성한 `CLAUDE.md` 파일이 너무 비대해져서 정리했습니다. 8천 줄이 넘는 중복된 컨텍스트를 제거하고 핵심 정보만 남겼더니, AI 응답 속도와 정확성이 눈에 띄게 개선되는 것을 확인했습니다.
*   **`docs: CLAUDE.md VIBE 프레임워크 문서 추가 및 constitution.md 업데이트`**: Fallingo 개발에 적용하는 AI 기반 개발 프레임워크인 **VIBE** (Vision, Intent, Behavior, Evaluation)에 대한 설명을 문서에 추가하고, 프로젝트의 기본 원칙을 담은 `constitution.md`도 업데이트했습니다.

---

## 💡 작업 하이라이트

### 1. Xcode Cloud와 GoogleService-Info.plist와의 사투 승리 🏆

CI/CD 설정은 항상 개발 초기에 가장 많은 시간을 잡아먹는 부분입니다. 특히 iOS 개발 환경은 비밀 파일(Secrets) 관리가 까다롭습니다. Fallingo는 Google Maps와 Firebase를 사용하기 때문에 `GoogleService-Info.plist`가 필수인데, 이 파일을 Git 저장소에 올릴 수는 없죠.

결국 Xcode Cloud의 빌드 환경 변수와 `ci_post_clone.sh` 쉘 스크립트를 활용해서 빌드 전에 필요한 파일을 동적으로 생성하는 방식을 확립했습니다. 이 과정에서 경로 참조 문제, 인코딩 문제, 권한 문제 등 여러 허들을 넘었습니다.

```bash
# ci_post_clone.sh (가상 스크립트 예시)
# 환경 변수로 저장된 base64 인코딩된 plist 내용을 디코딩하여 파일 생성
echo "$GOOGLE_SERVICE_PLIST_BASE64" | base64 --decode > Runner/GoogleService-Info.plist
```

이 방식이 안정화되면서 이제 커밋 푸시만으로도 자동 빌드가 성공적으로 돌아가게 되었어요. 정말 속이 후련합니다! 🍻

### 2. 방대한 AI 컨텍스트 파일 정리

저는 새로운 기술 스택(Flutter, FastAPI)을 빠르게 익히기 위해 AI를 매우 적극적으로 사용하고 있습니다. 그러다 보니 AI에게 프로젝트의 맥락을 설명하는 문서(`CLAUDE.md`)가 너무 길어졌고, 결국 AI도 혼란스러워하는 상황이 발생했습니다.

8천 줄이 넘는 문서에서 중복된 내용을 1천 줄로 줄여보니, 제가 원하는 코드 구조와 답변을 AI가 훨씬 더 명확하게 제공해 주더라고요. **"AI 개발도 결국 문서 관리이자 컨텍스트 관리다"**라는 것을 뼈저리게 배웠습니다.

---

## 📊 개발 현황

Fallingo 프로젝트는 현재 베타 런칭 목표(2025년 12월)를 향해 인프라와 핵심 기능을 동시에 다듬고 있습니다. 이번 기간 동안은 *기능 추가*보다는 *기반 다지기*에 집중했습니다.

| 영역 | 진행률 | 주요 작업 내용 |
| :--- | :--- | :--- |
| **백엔드 (FastAPI)** | 80% | 핵심 API 구현 완료, 보안 취약점 패치, 프로덕션 환경 분리 |
| **프론트엔드 (Flutter)** | 65% | 뼈대 구조 및 테마 설정 완료, 정적 분석을 통한 초기 품질 확보 |
| **인프라/DevOps** | 95% | Google Cloud Program 선정 후 초기 설정 완료, Xcode Cloud 연동 안정화 |

새로운 스택에 도전하면서 실패도 많았지만, 그만큼 견고하게 기반을 다질 수 있었습니다. 다음 일지에서는 위치 기반 서비스의 핵심인 지도 API 연동과 사용자 인증 모듈 개발 과정을 공유할 수 있기를 기대합니다!

긴 글 읽어주셔서 감사합니다. 다음 업데이트에서 뵙겠습니다! 👋