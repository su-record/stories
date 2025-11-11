---
title: "Google for Startups Cloud Program 승인받기 - $2,000 크레딧 획득 여정"
date: "2025-11-10"
category: "story"
description: "fallingo의 Google for Startups Cloud Program 신청부터 승인까지. 웹사이트 검증 요청, fallingo.app/about.html 페이지 작성, 그리고 Start Tier $2,000 크레딧 승인까지의 실제 과정"
tags: ["google-cloud", "startup", "cloud-credits", "fallingo"]
author: "Su"
lang: "ko"
---

# Google for Startups Cloud Program 승인받기

fallingo를 개발하면서 Google Cloud Platform을 전폭적으로 사용하고 있었습니다. Cloud Run, Cloud SQL, Vision API, Gemini AI, Maps Platform... 인프라 비용이 생각보다 많이 지출되더군요. 그냥 테스트만 하는 중인데.

그때 생각난 것이 **Google for Startups Cloud Program**이었습니다.

## 신청 시작 (10월 27일)

Google for Startups Cloud Program 신청 페이지를 찾아 신청서를 작성했습니다.

**신청 양식 입력 항목:**<br />
- GCP Billing Account ID<br />
- Company Name<br />
- Company Website<br />
- Business Email (도메인 일치 필수)<br />
- Funding Level<br />
- Partnership (선택사항)

모두 입력하고 제출했습니다. 몇 시간 뒤, 첫 메일이 도착했습니다.

## 첫 번째 메일: 신청 접수 확인 (10월 27일)

```
Subject: Google for Startups Cloud Program을 신청해 주셔서 감사합니다
From: Google for Startups Cloud Program Team

신청이 접수되었습니다. 검토 후 연락드리겠습니다.
```

내용은 간단했습니다. **"접수됐으니 검토 중"**이라는 자동 응답 메일이었습니다.

## 두 번째 메일: 1차 조치 필요 (10월 30일)

3일 후, 문제가 발생했습니다.

**"웹사이트에 회사 정보가 충분하지 않습니다."**

자동 메일이었습니다. `fallingo.app`에는 랜딩 페이지만 있었으니까요.

하지만 백엔드는 이미 100% 완성되어 프로덕션에서 돌아가고 있었습니다.

## 첫 번째 회신: 기술 문서 제출 (10월 31일)

웹사이트는 없었지만, **API 문서는 있었습니다.**

메일에 이렇게 적었습니다:

- **백엔드 100% 완료**: 145개 API 엔드포인트, 17개 모듈<br />
- **프로덕션 배포 중**: GCP Cloud Run, Cloud SQL PostgreSQL + PostGIS<br />
- **API 문서 공개**: https://fallingo.app/api/docs (Swagger), https://fallingo.app/api/redoc (ReDoc)<br />
- **상세 문서 첨부**: fallingo_Project_Overview.pdf

**"실제로 돌아가는 시스템이 있습니다. 확인해보세요."**

이것으로 될 수는 없을까?

## 2차 조치 필요: Sašo의 답변 (11월 3일)

4일 후, Sašo로부터 답변이 왔습니다.

**"신청서를 신중하게 검토했습니다(After carefully reviewing your application)."**

전담 담당자가 직접 API 문서와 PDF를 검토했습니다. 하지만:

**"공개 정보가 충분하지 않습니다. 공개 웹사이트가 필요합니다."**

필요한 것:
- Business Description (무엇을 만드는가)<br />
- Team Information (누가 만드는가)<br />
- Product Details (현재 개발 단계, 스크린샷, 동영상, 데모)

**사람이 읽을 수 있는 웹페이지**가 필요했습니다.

## 위기: 공개 웹사이트 만들기 (11월 3일 ~ 11월 5일)

선택지는 두 가지였습니다.

1. 포기한다
2. 웹사이트를 만든다

당연히 2번을 선택했습니다.

어떻게 사이트를 만들어야 할 지 고민한 끝에 `about` 페이지를 만들었습니다.

**주요 구성:**<br />
- **Mission & Vision**: 가짜 리뷰 제거, 진정성 있는 미식 경험 공유<br />
- **Why fallingo?**: 3단계 검증 (GPS + Vision API + OCR), 11단계 게이미피케이션<br />
- **Core Features**: 위치 기반 피드, 티어 시스템, 실시간 메뉴 인식, 스마트 지도<br />
- **Technology Stack**: 100% Google Cloud Platform<br />
- **Gamification System**: Tier 1 → Tier 11<br />
- **API Documentation**: Swagger UI, ReDoc<br />
- **AI-First Development**: Claude, Cursor를 사용한 문서 주도 개발<br />
- **Current Status**: 백엔드 100% (99.3% 테스트 성공률) / 프론트엔드 60%

## 두 번째 회신: about 완성 (11월 5일)

새로 만든 `about`을 메일 내용에 포함하여 보냈습니다.

**"웹사이트를 업데이트했습니다: about"**

2인 스타트업이 만든 다수의 API 엔드포인트.
Google Cloud 크레딧이 있다면 인프라 비용 걱정 없이 제품에만 집중할 수 있습니다.

회신을 보내고 기다렸습니다.

## 승인 메일: Nancy (11월 7일 저녁 8시)

이틀 후, 메일이 왔습니다.

이번엔 또 어떤 조치사항이 왔을까? 또 조치하라 하면 앱을 스토어에 등록한 후에 회신해야겠다고 생각하며 메일을 확인했습니다.

보낸이가 Sašo가 아닌 Nancy였습니다.

**"My name is Nancy and I'm supporting Sašo with this request."**

Nancy와 Sašo가 함께 검토했습니다.

**"Fantastic news! Start Tier 승인되었습니다!"**

24-48시간 내에 크레딧이 반영됩니다.

**승인됐습니다!**

45분 후, Welcome 메일이 도착했습니다.

## Welcome Email (11월 7일 저녁 8시 46분)

**$2,000 USD Google Cloud 크레딧**<br />
**2년간 사용 가능**<br />
**Start Tier (Self-funded startup)**

**사용 가능한 서비스:**<br />
- Firebase and Google Cloud Platform Services (BigQuery, Cloud Run, etc.)<br />
- Select Google Cloud Offerings (Looker 등)

**추가 혜택:**<br />
- Google Cloud Skills Boost $200 크레딧 (온라인 코스, hands-on labs)<br />
- MongoDB Atlas $500 크레딧<br />
- Google Workspace 12개월 무료 (Business Plus)<br />
- Google Maps Platform $200 월간 무료 사용량<br />
- Google Cloud Startup Community 가입

## 실제로 얼마나 도움이 될까?

fallingo 월 지불 항목:
- Cloud Run (FastAPI)<br />
- Cloud SQL (PostgreSQL)<br />
- Cloud Memorystore (Redis)<br />
- Cloud Storage<br />
- Cloud Load Balancing<br />
- Vision API<br />
- Gemini AI<br />
- Scret Manager<br />
- FCM (Firebase Cloud Messaging)<br />
- Maps Platform (월 $200 무료 포함)

**초기 단계 (100명 활성 유저, 하루 3-5개 피드)**<br />
- 월 총 예상: **$65-85** (거의 고정 인프라 비용만)<br />
- $2,000으로 **약 24-30개월** 사용 가능

**성장 단계 (1,000명 활성 유저, 하루 30-50개 피드)**<br />
- 월 총 예상: **$150-220**<br />
- $2,000으로 **약 9-13개월** 사용 가능

초기 단계에서는 대부분의 API가 무료 tier 안에 들어가고, **인프라 고정 비용만 발생**합니다.

$2,000 크레딧으로 **최소 수개월 혹은 2년까지** 인프라 비용 걱정 없이 제품에만 집중할 수 있게 됐습니다.

## 신청 팁

Google for Startups Cloud Program 신청을 고려 중인 스타트업을 위한 조언입니다.

### 1. 공개 웹사이트는 필수

- 간단해도 괜찮습니다<br />
- **About 페이지 + 제품 설명 + 연락처**만 있어도 됩니다<br />
- 앱만 있다면 **fallingo.app/about.html** 같은 간단한 페이지라도 만드세요

### 2. 구체적인 정보 제공

Google이 확인하는 것:
- 실제로 운영 중인 스타트업인가?<br />
- 어떤 제품을 만드는가?<br />
- Google Cloud를 어떻게 사용할 것인가?

막연한 계획보다 **구체적인 사용 계획**이 중요합니다.

### 3. 빠른 응답

- 보통 2-3일 내 회신하세요<br />
- 추가 요청이 와도 당황하지 마세요 (정상 절차입니다)<br />
- 늦으면 신청이 자동 취소될 수 있습니다

### 4. Bootstrapped 스타트업도 가능

fallingo는:
- 2인 스타트업<br />
- 투자 없음 (Self-funded)<br />
- 아직 출시 전

이런 상태에서도 **Start Tier ($2,000 크레딧)** 승인을 받았습니다.

투자 유치 전이라도, 제대로 된 제품과 구체적인 계획이 있다면 충분합니다.

## 마치며

Google for Startups Cloud Program은 **초기 스타트업에게 정말 큰 도움**이 됩니다.

특히 AI, 지도, 인프라가 필요한 서비스라면 더욱 그렇습니다.

신청 과정에서 추가 요청이 와도, 웹사이트를 다시 만들어야 해도, 포기하지 말고 끝까지 대응하면 됩니다.

**나의 꿈은 구글이니까.**

구글이라는 회사에 들어갈 순 없지만, 구글의 기술로 내 앱을 만들 수 있다면 그것으로 충분합니다.

---

**참고 링크:**<br />
- [Google for Startups Cloud Program](https://cloud.google.com/startup)<br />
- [fallingo About Page](https://fallingo.app/about.html)
