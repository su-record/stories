---
title: "도구가 핵심이다: 터미널·파일·웹·브라우저로 실제 세계에 닿는 에이전트"
date: "2026-07-15"
category: "tech"
description: "모델만 바꾸면 에이전트가 똑똑해진다는 말은 절반쯤만 맞습니다. 중요한 건 그다음입니다. 답을 낸 뒤에 무엇을 할 수 있느냐. 파일을 읽고, 명령을 실행하고, 웹을 확인하고, 브라우저에서 결과를 봐야 합니다.  에이전트는 말이 아니라 접촉면으로 평가됩니다 챗봇은 문장을 돌려줍니다"
image: "/images/tools-power-real-world-agents/01.png"
imageAlt: "챗봇은 말하고, 에이전트는 상태를 바꾼다"
author: "Su Ham"
lang: "ko"
---

모델만 바꾸면 에이전트가 똑똑해진다는 말은 절반쯤만 맞습니다.

중요한 건 그다음입니다. 답을 낸 뒤에 무엇을 할 수 있느냐. 파일을 읽고, 명령을 실행하고, 웹을 확인하고, 브라우저에서 결과를 봐야 합니다.

---

## 에이전트는 말이 아니라 접촉면으로 평가됩니다

![챗봇은 말하고, 에이전트는 상태를 바꾼다](/images/tools-power-real-world-agents/01.png)
*상태변화*


챗봇은 문장을 돌려줍니다. 에이전트는 상태를 바꿉니다. 둘의 차이는 꽤 큽니다.

보고서를 쓰는 일만 봐도 그렇습니다. 검색 결과를 요약하는 것과, 원문을 저장하고 CSV를 만들고 PR까지 여는 것은 전혀 다른 작업입니다. 뒤쪽으로 갈수록 실패할 곳도 늘어납니다.

제가 에이전트 설계를 볼 때 먼저 세는 것은 파라미터가 아닙니다. 접촉면 4개입니다.

| 도구 | 실제로 닿는 대상 | 실패 예시 | 필요한 검증 |
|---|---|---|---|
| terminal | 로컬 명령, 테스트, 빌드 | 명령 실패, 권한 오류 | exit code, stderr |
| file | 문서, 캐시, 산출물 | 덮어쓰기, 경로 착각 | diff, hash, schema |
| web | 검색, API, 원문 수집 | 오래된 검색 결과 | source date, URL |
| browser | 렌더링된 화면, 클릭, 폼 | DOM 변경, 로그인 만료 | screenshot, selector |

Managed Hermes Agent 스택 설명도 비슷한 방향을 가리킵니다. terminal, browser, file, web, code-execution이 기본으로 들어갑니다.

그 위에 MCP, memory, channels, automations, approvals, model routing이 붙습니다. 이름은 많지만 목적은 하나입니다. 모델을 실제 세계에 안전하게 연결하는 것.

---

## 도구가 없으면 에이전트는 확인할 수 없습니다

![web·browser·file·terminal이 증거를 남기는 실행 루프](/images/tools-power-real-world-agents/02.png)
*증거루프*


OpenAI Sol은 KingBench 3에서 복잡한 수학과 에이전트 기반 작업에서 높은 성능을 보였습니다. 다만 웹 프론트엔드와 비주얼 구현에서는 Fable 5보다 약했습니다.

이 대목이 중요합니다. 추론 점수가 높아도 화면을 제대로 보지 못하면 작업은 깨집니다.

가격 모니터링 에이전트를 예로 들어보겠습니다. 목표는 매일 오전 9시에 경쟁사 5곳의 가격 페이지를 확인하고, 변경분을 Markdown으로 남기는 일입니다.

여기서 필요한 건 문장 생성이 아닙니다.

1. web으로 후보 URL 8개를 찾습니다.
2. browser로 실제 렌더링 가격을 확인합니다.
3. file에 전날 스냅샷과 오늘 스냅샷을 저장합니다.
4. terminal에서 diff 스크립트를 실행합니다.
5. 승인 후 Slack이나 PR로 결과를 보냅니다.

작게 쓰면 이런 루프입니다.

```ts
type Tool = 'web' | 'browser' | 'file' | 'terminal';

async function priceWatch(goal: string) {
  const urls = await web.search(goal);
  await file.write('runs/2026-07-15/urls.json', urls);

  const page = await browser.open(urls[0].url);
  await file.write('runs/2026-07-15/page.html', page.html);

  const diff = await terminal.exec('python scripts/diff_price.py');
  return diff.exitCode === 0 ? diff.stdout : diff.stderr;
}
```

모델은 계획을 세웁니다. 도구는 증거를 남깁니다. 증거가 없으면 운영하기 어렵습니다.

---

## CLI, Skills, MCP는 경쟁이 아니라 비용 구조입니다

![도구를 붙이면 승인과 책임도 함께 붙는다](/images/tools-power-real-world-agents/03.png)
*승인문턱*


박재홍의 글은 CLI, Skills, MCP를 경쟁 관계로 보지 않습니다. 외부 도구를 연결하는 선택지와 트레이드오프로 봅니다.

맞는 관점입니다. 모든 도구를 MCP로 감싸면 보기에는 깔끔합니다. 하지만 간단한 grep 하나에는 CLI가 더 싸고 빠릅니다.

반대로 사내 결재 시스템처럼 인증과 권한이 복잡한 곳은 MCP가 낫습니다. 도구 스키마와 권한 경계를 명시할 수 있기 때문입니다.

| 연결 방식 | 잘 맞는 작업 | 장점 | 비용 |
|---|---|---|---|
| CLI | 테스트, 빌드, 변환 | 빠르고 단순함 | 환경 의존성 큼 |
| Skills | 반복 업무 패턴 | 설명과 절차를 묶음 | 범위가 흐려질 수 있음 |
| MCP | 외부 시스템 연동 | 스키마와 권한 분리 | 서버 관리 필요 |
| Browser | 사람용 웹 조작 | 실제 화면 확인 | 느리고 깨지기 쉬움 |

Google Gemini Spark 같은 노코드 자동화도 같은 지점을 겨냥합니다. 자연어로 워크플로우를 지시하고, 사용자가 자는 동안에도 백그라운드에서 작업합니다.

모델이 혼자 일한다는 뜻은 아닙니다. 예약 실행, 파일 저장, 웹 접근, 승인 단계가 함께 묶였다는 뜻입니다.

---

## 평가는 답변 점수가 아니라 실행 로그에서 시작됩니다

Hermes Agent Repository Wiki는 exact-match와 partial-match score 같은 자동 채점 지표를 언급합니다. 에이전트를 평가할 때 중요한 방향입니다.

에이전트는 그럴듯하게 설명하는 것보다 결과물 검증이 먼저입니다. 파일명이 맞는지, 숫자가 맞는지, 화면 상태가 맞는지 봐야 합니다.

| 지표 | 확인 대상 | 예시 |
|---|---|---|
| exact-match | 완전 일치 | total_price가 129000인지 확인 |
| partial-match | 부분 포함 | 변경 사유 문단에 환불 정책 포함 |
| exit code | 실행 성공 | 테스트 명령이 0으로 종료 |
| artifact diff | 산출물 변화 | report.md 변경 줄 14개 확인 |
| screenshot check | 화면 상태 | 결제 버튼이 비활성인지 확인 |

Reactive Agents도 이 흐름에 가깝습니다. TypeScript 기반으로 tool use, typed events, web search, file read, code execution을 제공합니다.

durable runs와 execution phases도 중요합니다. 중간에 브라우저가 죽더라도 어느 단계에서 실패했는지 남아 있어야 합니다.

모델 라우팅은 여기서 의미가 생깁니다. GPT-5.6 라인업처럼 Sol, Terra, Luna 역할이 나뉘면 작업별로 비용을 조절할 수 있습니다.

복잡한 추론은 Sol에 보냅니다. 일상적인 분류는 Terra로 처리합니다. 짧은 정규화 작업은 Luna로 충분합니다.

---

## 도구를 붙이면 책임도 같이 붙습니다

도구는 능력만 늘리지 않습니다. 사고가 날 면적도 함께 늘립니다.

terminal은 파일을 지울 수 있습니다. browser는 잘못된 폼을 제출할 수 있습니다. web은 오래된 정보를 가져올 수 있습니다.

그래서 approvals가 필요합니다. 읽기 작업은 자동화해도 됩니다. 쓰기 작업과 외부 전송은 한 번 멈춰야 합니다.

제가 보는 최소 안전선은 4개입니다.

- 읽기와 쓰기 권한을 분리합니다.
- 실행 전 계획과 실행 후 로그를 모두 저장합니다.
- 외부 전송 전에는 사람 승인을 둡니다.
- 실패한 단계부터 재시작할 수 있게 run id를 남깁니다.

운영에서는 길게 말하는지보다, 무엇에 닿았고 무엇을 남겼는지가 더 자주 문제를 가릅니다.

---

[← 이전 편: 컨텍스트는 기억이 아니라 계약입니다](/stories/context-is-contract)  
[다음 편: 에이전트 평가는 로그에서 시작합니다 →](/stories/agent-evaluation-starts-with-logs)