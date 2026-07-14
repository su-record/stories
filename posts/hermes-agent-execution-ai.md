---
title: "Hermes Agent란? 대답이 아니라 일을 끝내는 실행형 AI 동료"
date: "2026-07-14"
category: "tech"
description: "챗봇에게 세 번 물어보고, 결국 내가 브라우저를 열었다면 자동화라고 보기 어렵습니다. 2026년 AI 에이전트 논의는 모델 이름보다 작업이 어디까지 끝나는지에서 갈립니다.   Google Gemini Spark는 자연어 지시로 노코드 자동화를 만들고, 백그라운드에서 24시간 작"
image: "/images/hermes-agent-execution-ai/01.png"
imageAlt: "대답형은 문장, 실행형은 결과물을 남긴다"
author: "Su Ham"
lang: "ko"
---

챗봇에게 세 번 물어보고, 결국 내가 브라우저를 열었다면 자동화라고 보기 어렵습니다.

2026년 AI 에이전트 논의는 모델 이름보다 작업이 어디까지 끝나는지에서 갈립니다.  
Google Gemini Spark는 자연어 지시로 노코드 자동화를 만들고, 백그라운드에서 24시간 작업하는 방향을 잡았습니다.

OpenAI의 Sol 모델은 KingBench 3에서 수학과 에이전트 작업에 강점을 보였습니다.  
다만 웹 프론트엔드와 시각 구현에서는 Fable 5보다 낮다는 평가가 있었습니다.

문제는 그다음입니다. 모델이 똑똑해도 업무를 끝내는 구조가 없으면, 사용자는 다시 복사와 붙여넣기로 돌아갑니다.

---

## 대답형 AI가 멈추는 지점

![대답형은 문장, 실행형은 결과물을 남긴다](/images/hermes-agent-execution-ai/01.png)
*답말고완료*


대답형 AI는 문장을 만듭니다. 실행형 AI는 파일, 로그, 브라우저 상태, 커밋 같은 결과물을 남깁니다.  
Hermes Agent를 볼 때도 이 차이를 먼저 잡아야 합니다.

공개 자료 기준으로 Hermes Agent는 Nous Research의 open-source AI agent CLI로 알려져 있습니다.  
코딩, 리서치, 개발 작업에 쓰는 self-hosted autonomous AI agent입니다.

| 구분 | 대답형 챗봇 | Hermes Agent 같은 실행형 에이전트 |
|---|---|---|
| 입력 | 질문 1개 | 목표, 권한, 완료 조건 |
| 출력 | 답변 텍스트 | 파일 수정, 명령 실행, 브라우저 작업 |
| 기억 | 대화창 안의 맥락 | memory, skills, cross-session learning |
| 실행 환경 | 채팅 UI | desktop, CLI, terminal, dashboard, GitHub workflow |
| 위험 지점 | 틀린 답변 | 잘못된 실행, 잘못된 권한 사용 |

2026-07-14 기준으로 Hermes Agent의 공식 점수, 순위, 발표 날짜, 핵심 인물 정보는 확인되지 않았습니다.  
그래서 벤치마크 숫자로 설명하면 맞지 않습니다. 기능과 작업 구조로 보는 편이 낫습니다.

---

## Hermes Agent의 핵심은 기억과 스킬입니다

![memory와 skills는 반복 업무를 다음 실행에 재사용한다](/images/hermes-agent-execution-ai/02.png)
*기억된스킬*


Hermes Agent는 self-improving AI agent로 설명됩니다. 이 말을 너무 크게 해석할 필요는 없습니다.  
스스로 끝없이 똑똑해진다는 뜻이 아니라, 프로젝트를 학습하고 반복 작업을 reusable skills로 남긴다는 뜻에 가깝습니다.

매일 같은 리포트를 만든다고 해보겠습니다.  
첫날에는 폴더 구조, 데이터 위치, 리포트 형식, 검증 규칙을 알려줘야 합니다.

둘째 날부터는 상황이 달라집니다. Hermes Agent가 이전 세션에서 만든 스킬을 재사용할 수 있습니다.  
cross-session learning의 가치는 여기서 나옵니다. 매번 처음부터 설명하지 않아도 됩니다.

| 기능 | 의미 | 실제 업무 예시 |
|---|---|---|
| memory | 프로젝트 맥락 저장 | 리포트 템플릿, 금지 표현, 검증 기준 기억 |
| skills | 반복 절차 재사용 | 경쟁사 분석 표 생성, 테스트 실행, 요약 포맷 적용 |
| scheduling/cron | 정해진 시각 실행 | 매일 08시 뉴스 수집, 금요일 주간 보고서 생성 |
| browser control | 웹 작업 수행 | 가격 페이지 확인, 공지사항 수집, 폼 입력 전 준비 |
| terminal control | 로컬 명령 실행 | 테스트 실행, 빌드 확인, 로그 추출 |
| subagents | 작업 분할 | 기업별 리서치, 파일별 코드 리뷰, 항목별 검증 |

사용 환경도 넓습니다. desktop, CLI, terminal, dashboard, GitHub workflow, messaging channels, TUI, Electron desktop 형태가 언급됩니다.  
local과 cloud 실행을 모두 고려할 수 있고, hosted와 self-hosted 선택지도 있습니다.

---

## 사례: 3개 기업 분석을 한 줄로 세우지 않습니다

![실행형 에이전트는 권한 경계와 사람 승인문이 필요하다](/images/hermes-agent-execution-ai/03.png)
*승인문앞*


제가 AX 인재전쟁 해커톤 가이드를 만들 때 가장 먼저 버린 방식이 있습니다.  
메디테라피, 무신사, 마이리얼트립을 차례대로 분석하는 방식입니다.

순차 처리에는 병목이 생깁니다. 첫 기업 검색이 끝나야 둘째 기업으로 넘어갑니다.  
사람은 40분 뒤에야 전체 그림을 봅니다. 그때 빠진 항목을 발견하면 다시 처음으로 돌아가야 합니다.

Hermes Agent식 접근은 다릅니다. 기업별 subagent를 나누고, 같은 출력 스키마를 강제합니다.  
사람은 마지막 판단만 합니다. AI가 브라우저와 터미널에서 남긴 로그를 보고 검증합니다.

| 작업 | 순차 수동 설계 | Hermes Agent식 설계 |
|---|---:|---:|
| 3개 기업 기본 검색 | 20분 × 3개 = 60분 | subagent 3개 병렬, 20~30분 |
| 형식 통일 | 30분 | skill 재사용, 5~10분 |
| 누락 검토 | 30분 | 체크리스트 기반 human review, 20분 |
| 총 소요 기준 | 약 120분 | 약 45~60분 |

아래는 실제 문법이 아니라 개념 예시입니다. 핵심은 자연어 지시가 아니라 완료 조건입니다.

```yaml
workflow: competitor_daily_scan
schedule: '0 8 * * 1-5'
mission: AX 해커톤용 기업 분석 초안 생성

done_when:
  - 3개 기업이 같은 표 구조로 정리됨
  - 출처 URL이 각 주장마다 붙어 있음
  - 불확실한 내용은 추정으로 표시됨
  - 사람이 승인하기 전에는 게시하지 않음

subagents:
  - name: meditherapy_researcher
    task: 메디테라피 채용, 제품, 성장 신호 조사
  - name: musinsa_researcher
    task: 무신사 커머스, 브랜드, 채용 신호 조사
  - name: myrealtrip_researcher
    task: 마이리얼트립 여행 수요, 채용, 사업 변화 조사

skills:
  - normalize_company_brief
  - attach_source_urls
  - flag_uncertain_claims

human_gate:
  required_before:
    - publish
    - email_send
    - external_commit
```

이 구조에서 Hermes Agent의 장점은 답변 품질 하나에만 있지 않습니다.  
작업을 쪼개고, 같은 형식으로 모은 뒤, 다음 실행 때 그 절차를 다시 쓰는 데 있습니다.

---

## 맡기기 전에 권한 경계를 먼저 정합니다

Hermes Agent를 챗봇처럼 쓰면 실망하기 쉽습니다. 반대로 모든 권한을 열어두면 사고가 날 수 있습니다.  
브라우저 제어와 터미널 제어는 편하지만, 잘못된 클릭과 잘못된 명령도 실행할 수 있기 때문입니다.

그래서 먼저 네 가지를 정해야 합니다.

| 기준 | 질문 | 권장 시작점 |
|---|---|---|
| 완료 조건 | 무엇이 끝난 상태인가 | 파일명, 표 구조, 검증 규칙까지 명시 |
| 실행 권한 | 어디까지 해도 되는가 | 조회, 로컬 테스트, 초안 생성부터 허용 |
| 금지 작업 | 무엇은 절대 하면 안 되는가 | 결제, 게시, 외부 발송, 삭제 명령 차단 |
| 검토 지점 | 사람이 어디서 끊는가 | publish, email, commit 전 승인 |

민감한 소스코드와 내부 문서를 다룬다면 self-hosted와 local 실행을 먼저 검토해야 합니다.  
가벼운 리서치나 공개 웹 조사라면 hosted나 cloud 실행이 운영 부담을 줄일 수 있습니다.

AI 네이티브 업무의 핵심 역량은 프롬프트 문장력이 아닙니다.  
구조화, 병렬 처리, 적절한 human-in-the-loop입니다. Hermes Agent는 이 세 가지를 작업 안에 넣게 만드는 도구에 가깝습니다.

답을 잘하는 도구는 질문이 끝나면 멈춥니다.  
실행형 동료는 로그, 파일, 브라우저, 터미널 어딘가에 작업 흔적을 남깁니다.

---

[이전 글](/stories/ax-talent-war-hackathon-guide) · [다음 글](/stories/agent-workflow-human-in-the-loop)