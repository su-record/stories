---
title: "Google for Startups Cloud Program 승인받기 - 신청부터 승인까지"
date: "2025-10-30"
category: "dev-log"
description: "Google for Startups Cloud Program 신청 과정과 웹사이트 인증, 그리고 승인까지의 여정. 최대 $350,000 크레딧 지원을 받기까지"
tags: ["fallingo", "google-for-startups", "google-cloud", "startup"]
author: "Su Ham"
lang: "ko"
---

# Google for Startups Cloud Program 승인받기

폴링고의 모든 기술 스택을 구글로 결정하고 나니, 당연히 클라우드 비용이 걱정됐다.

Cloud Run, Cloud SQL, Vision API, Maps Platform... 합치면 월 비용이 만만치 않을 터였다.

그때 발견한 게 **Google for Startups Cloud Program**이었다.

## Google for Startups Cloud Program이란?

스타트업을 위한 구글의 클라우드 크레딧 지원 프로그램이다.

**지원 내용:**
- 최대 $350,000 상당의 Google Cloud 및 Firebase 크레딧
- 2년간 사용 가능
- Cloud, Firebase, Maps Platform 포함
- 기술 지원 및 멘토링

**자격 요건:**
- 설립 10년 이내의 스타트업
- Series A 펀딩 이전
- Google Cloud를 처음 사용하거나 초기 단계
- 공개 웹사이트 보유

폴링고는 모든 조건에 부합했다. 신청하지 않을 이유가 없었다.

## 신청 과정

### 1단계: 초기 신청 (2025-10-27)

Google for Startups Cloud Program 신청 페이지에서 기본 정보를 입력했다.

**입력 항목:**
- 회사명: Sutory (폴링고 운영사)
- 웹사이트: https://fallingo.app
- 사업 분야: Social Media / Language Learning
- 예상 월 사용량
- 기술 스택

제출 후 몇 시간 뒤, 첫 이메일이 도착했다.

### 2단계: 웹사이트 인증 요청 (Email #1)

> **"Application received - website verification needed"**

웹사이트가 실제로 운영 중인지 확인하기 위한 절차였다.

**요구사항:**
- 공개된 웹사이트 필요
- 회사 정보가 명시된 About 페이지
- 연락처 정보

당시 폴링고는 Flutter 앱만 있고 웹사이트가 없었다. 그래서 급하게 `fallingo.app/about.html` 페이지를 만들었다.

```html
<!DOCTYPE html>
<html>
<head>
  <title>About Fallingo - Sutory</title>
</head>
<body>
  <h1>Fallingo</h1>
  <p>Social media platform for language learners</p>
  <p>Company: Sutory</p>
  <p>Contact: su@fallingo.app</p>
</body>
</html>
```

간단하지만 필요한 정보는 다 담았다. 제출했다.

### 3단계: 추가 정보 요청 (Email #2-6)

웹사이트 인증 후에도 이메일이 계속 왔다.

**Email #2:** 사업자 등록증 요청
**Email #3:** 예상 사용량 구체화 요청
**Email #4:** Cloud 사용 계획 설명
**Email #5:** Maps Platform 사용 목적
**Email #6:** Firebase 사용 범위

각 이메일마다 요청사항을 작성해서 회신했다. 솔직히 이 과정이 좀 길었다.

**"혹시 떨어지는 거 아냐?"**

불안했다. 매번 추가 요청이 올 때마다 탈락 통보가 아닐까 걱정됐다.

### 4단계: 승인! (Email #7)

그리고 드디어, 7번째 이메일:

> **"You're Approved for the Google for Startups Cloud Program"**

승인됐다.

순간 가슴이 뛰었다. 구글이 폴링고를 인정해준 느낌이었다.

**승인 내용:**
- $350,000 Google Cloud 크레딧
- 2년간 사용 가능
- Cloud, Firebase, Maps Platform 모두 포함
- 기술 지원 및 워크샵 참여 기회

## 실제로 얼마나 도움이 됐나?

승인 이후, 폴링고 인프라를 전부 Google Cloud로 구축했다.

**실제 사용 중인 서비스:**
- Cloud Run: FastAPI 백엔드 서버 ($50/월 예상)
- Cloud SQL: PostgreSQL 데이터베이스 ($100/월 예상)
- Cloud Storage: 이미지 저장 ($20/월 예상)
- Vision API: 이미지 분석 ($30/월 예상)
- Maps Platform: 지도 및 장소 검색 ($150/월 예상)
- Firebase Auth: 사용자 인증 (무료)

**월 예상 비용: $350**
**2년 총 예상 비용: $8,400**

$350,000 크레딧이 있으니, **당분간 인프라 비용 걱정 없이 개발에만 집중**할 수 있게 됐다.

## 신청 팁

Google for Startups Cloud Program 신청을 고려하는 스타트업들을 위한 팁:

**1. 공개 웹사이트는 필수**
- 간단해도 괜찮다
- About 페이지 + 연락처만 있어도 됨
- 앱만 있다면 랜딩 페이지라도 만들자

**2. 구체적인 사용 계획 작성**
- "Cloud Run으로 API 서버 운영"
- "Vision API로 이미지 분석 기능 구현"
- 막연한 계획보다 구체적인 게 좋다

**3. 추가 요청에 빠르게 응답**
- 보통 2-3일 내 회신
- 늦으면 신청이 취소될 수 있음

**4. 포기하지 말기**
- 추가 요청 여러 번 와도 정상임
- 나도 6번의 추가 요청을 받았음

## 프로그램 활용하기

승인 이후 제공되는 것들:

**크레딧 외 혜택:**
- Google Cloud 기술 지원
- 스타트업 워크샵 및 이벤트 초대
- Google for Startups Campus 네트워킹
- 멘토링 기회

폴링고는 크레딧뿐 아니라 **Google Cloud 아키텍처 설계에 대한 기술 지원**도 받을 수 있었다.

## 마치며

Google for Startups Cloud Program은 **초기 스타트업에게 정말 큰 도움**이 된다.

특히 AI, 지도, 인프라가 필요한 서비스라면 더욱 그렇다.

신청 과정이 길어도, 추가 요청이 여러 번 와도, 포기하지 말고 끝까지 응답하면 된다.

**나의 꿈은 구글이니까.**

구글이라는 회사에 들어갈 순 없지만, 구글의 기술로 내 앱을 만들 수 있다면 그것으로 충분하다.

---

**참고 링크:**
- [Google for Startups Cloud Program](https://cloud.google.com/startup)
- [신청 자격 요건](https://cloud.google.com/startup/eligibility)
