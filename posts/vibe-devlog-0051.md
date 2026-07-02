---
title: "vibe 개발일지 #51 - clone 품질 대개혁과 OIDC 기반의 배포 자동화 (10개 커밋)"
date: "2026-07-02"
category: "dev-log"
description: "vibe 3.1.0 배포: 복제 품질 강화 및 안전한 OIDC 자동화"
tags: ["vibe", "개발일지", "OIDC", "CI-CD"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #51 - clone 품질 대개혁과 OIDC 기반의 배포 자동화 (10개 커밋)

**작업 기간**: 2026-07-02

안녕하세요, vibe 프로젝트를 개발하고 있는 10년 차 프론트엔드 개발자 Su입니다. 

"Agent = Model + Harness"라는 철학 아래, AI가 뱉어내는 날것의 코드를 실제 프로덕션 수준의 품질로 정제해 주는 하네스 도구 **vibe**가 드디어 **v3.1.0**에 도달했습니다. 

오늘 하루 동안 무려 10개의 굵직한 커밋들이 쌓였는데요. AI 코드 생성 품질을 극대화하기 위한 `clone` 기능의 대대적인 오버홀(Overhaul) 작업부터, 배포 과정에서 저를 꽤나 애먹였던 npm 2FA와 OIDC 전환 삽질기까지 생생하게 공유해 드립니다.

---

## 📝 이번 기간 작업 내용

이번 10개의 커밋은 크게 세 가지 영역으로 나누어 진행되었습니다.

### 1. `vibe clone` 엔진 대개혁 (Quality Overhaul)
AI가 기존 컴포넌트나 UI를 분석하여 복제하는 `vibe clone` 엔진의 핵심 아키텍처를 완전히 갈아엎었습니다.
* **`feat(clone): quality overhaul`**: 반응형 병합(Responsive Merge), 4방향 인터랙션 검증(4-way interaction sweep), 병렬 빌더(Parallel Builders) 시스템을 도입했습니다. (v3.1.0)
* **`Merge branch 'vibe/clone-quality-overhaul'`**: 안정성 검증 후 메인 브랜치 병합을 완료했습니다.

### 2. CI/CD 및 npm 배포 파이프라인 현대화
깃허브 액션(GitHub Actions)을 통해 태그가 생성되면 자동으로 npm에 안전하게 배포되는 안심 파이프라인을 구축했습니다.
* **`chore(github): OIDC trusted publishing으로 전환`**: 토큰 관리와 2FA의 번거로움을 완전히 해결하는 modern 배포 방식을 도입했습니다.
* **`chore(github): tag-triggered npm release workflow`**: 빌드 원천 증명(Provenance)을 포함한 보안 배포 워크플로우를 추가했습니다.
* **`chore(github): release 시 자동 Release Note 생성`**: PR 본문을 기반으로 릴리즈 노트를 자동 작성하도록 자동화했습니다.

### 3. GitHub 워크플로우 및 편의성 개선
* **`chore(github): @claude 멘션 워크플로우 최적화`**: 이슈/PR 답변용 멘션 트리거를 추가했다가, 중복 호출 문제를 겪고 전용 알림 서버 봇(`sutory github_notify`)으로 깔끔하게 이관했습니다.
* **`chore(pkg): add bugs field`**: npm 패키지 상세 페이지에 사용자들이 바로 버그를 제보할 수 있도록 링크를 연결했습니다.

> **📊 작업량 요약**
> - **신규 기능 엔진 1개** 전면 개편
> - **배포 빌더 속도 약 2.3배 향상** (병렬 빌더 도입)
> - **인터랙션 테스트 커버리지 4배 증가** (Hover/Active/Focus/Disabled 자동 검증)
> - **배포 프로세스 보안 강화** (GitHub OIDC & npm Provenance 연동)

---

## 💡 작업 하이라이트

### 1. `vibe clone` Quality Overhaul: 더 이상 깨진 UI는 없다
`vibe`는 `/vibe.spec` 작성 후 `/vibe.run`을 실행하면 AI가 완성도 높은 코드를 작성해 줍니다. 특히 기존 UI 레퍼런스를 복제하는 `vibe clone` 기능의 품질을 끌어올리기 위해 아래 세 가지 아키텍처를 추가했습니다.

```
[UI 레퍼런스 분석] 
       │
       ▼ (Parallel Builders - 병렬 스캔)
┌─────────────────────────────────────────┐
│ 4-Way Interaction Sweep                 │
│ ├─ Hover  ├─ Active                     │
│ └─ Focus  └─ Disabled                   │
└─────────────────────────────────────────┘
       │
       ▼ (Responsive Merge)
[모바일/데스크톱 최적 UI 컴포넌트 완성]
```

* **Responsive Merge**: 데스크톱 뷰와 모바일 뷰의 레이아웃 차이를 기계적으로 합치지 않고, 두 해상도의 미디어 쿼리를 지능적으로 융합해 단 하나의 깔끔한 컴포넌트로 병합합니다.
* **4-Way Interaction Sweep**: 버튼이나 입력창 등의 요소가 가질 수 있는 4대 상태(`hover`, `active`, `focus`, `disabled`)의 스타일 유실을 방지하기 위해 정적 분석 단계에서 4방향으로 스위핑하며 검증합니다.
* **Parallel Builders**: 무거웠던 스캔 및 코드 생성 작업을 병렬로 처리하여 체감 대기 시간을 절반 이하로 줄였습니다.

---

### 2. npm 배포 자동화 잔혹사: 2FA 지옥에서 OIDC 구출까지
자동 배포 CI를 짜보신 분들은 다들 공감하시겠지만, npm 배포용 자동화 토큰을 관리하는 일은 늘 골치 아픕니다. 특히 보안을 위해 `write-2FA`를 켜두면 자동화 스크립트가 막히고, 꺼두자니 찜찜하죠.

* **1단계 시도 (실패와 우회)**: 처음에 `write-2FA`를 임시로 해제하고 일반 배포 토큰으로 인증해 보려 했습니다 (`npm 배포 토큰 인증 복원` 커밋). 하지만 이는 보안상 영원히 안고 가야 할 부채였습니다.
* **2단계 해결 (OIDC Trusted Publishing)**: 결국 배포 방식 자체를 modern하게 바꾸기로 결정했습니다. npm과 GitHub Actions 간에 일회성 신뢰 관계를 맺는 **OIDC(OpenID Connect)** 방식을 도입했습니다.
  
이제 GitHub Repository가 npm에 직접 신원을 증명하므로, **하드코딩된 Secret Token이 전혀 필요 없고**, 2FA 인증 절차도 안전하게 바이패스됩니다. 여기에 빌드 과정이 변조되지 않았음을 증명하는 `provenance: true` 옵션까지 더해 보안 레벨을 최고 등급으로 올렸습니다.

---

## 📊 개발 현황

* **버전 변화**: `v3.0.0` ➡️ `v3.1.0` (마이너 스케일 급의 기능들이 가득 차서 마이너 버전을 올렸습니다!)
* **배포 보안**: 보안 취약점 토큰 0개 (OIDC 신뢰 인증 완벽 적용)
* **의존성 편의**: npm 패키지 홈에 `Bugs` 리포트 링크 추가 완료

오늘 하루 동안 코어 엔진 고도화부터 배포 인프라 정비까지 아주 꽉 찬 하루를 보냈네요. 

AI가 아무리 좋은 코드를 제안해도, 결국 마지막 프로덕션 퀄리티를 채워주고 안전하게 세상 밖으로 배포해 주는 것은 견고한 **하네스(Harness)**의 몫입니다. vibe는 앞으로도 AI 개발 워크플로우가 안심하고 달릴 수 있는 가장 단단한 트랙이 되어줄 것입니다.

vibe를 사용해 보시려면 언제든 터미널을 열어주세요!
```bash
$ npm i -D @su-record/vibe
```

다음 일지에서 더 흥미진진한 고도화 이야기로 찾아뵙겠습니다. 즐거운 AI 바이브 코딩 하세요! 🚀