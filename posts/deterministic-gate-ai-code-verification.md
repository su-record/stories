---
title: "결정론적 게이트: AI가 짠 코드를 자동 검증하는 관문"
date: "2026-07-06"
category: "tech"
description: "title: '결정론적 게이트: AI가 짠 코드를 자동 검증하는 관문' date: 2026 07 06 category: tech description: 'AI가 짠 코드를 사람 리뷰 전에 걸러내는 결정론적 게이트를 설계한다. 아키텍처 위반, 보안 증거, 테스트 누락, fragi"
image: "/images/deterministic-gate-ai-code-verification/01.png"
imageAlt: "결정론적 게이트는 사람 리뷰 전의 첫 관문"
author: "Su Ham"
lang: "ko"
---

---
title: '결정론적 게이트: AI가 짠 코드를 자동 검증하는 관문'
date: 2026-07-06
category: tech
description: 'AI가 짠 코드를 사람 리뷰 전에 걸러내는 결정론적 게이트를 설계한다. 아키텍처 위반, 보안 증거, 테스트 누락, fragile 파일 수정 경고를 CI 규칙으로 바꾸는 방법을 실험 사례와 함께 정리했다.'
tags: [ai-code-review, ci, deterministic-gate, sdlc, automation]
author: 'Su Ham'
lang: 'ko'
---

# 결정론적 게이트: AI가 짠 코드를 자동 검증하는 관문

AI가 짠 코드는 사람 리뷰로 넘어가기 전에 한 번 걸러져야 합니다.

2026년 7월 6일 기준, 코딩 에이전트는 이미 백그라운드에서 계속 작업합니다. Google Gemini Spark 같은 도구는 자연어 지시를 받아 24시간 워크플로우를 돌립니다.

그 다음이 문제입니다. 사람이 모든 diff를 끝까지 읽는 방식은 오래 버티기 어렵습니다. 리뷰어는 더 많이 읽는 사람이 아니라, 더 정확한 관문을 세우는 사람이 됩니다.

---

## 문제는 AI가 코드를 많이 만든다는 점이 아닙니다

![결정론적 게이트는 사람 리뷰 전의 첫 관문](/images/deterministic-gate-ai-code-verification/01.png)
*사람전관문*


AI 코딩 에이전트는 한 번에 20개 파일을 고칩니다. 테스트도 만들고 설명도 씁니다. 겉으로는 꽤 그럴듯합니다.

하지만 그럴듯해 보인다고 품질이 보장되지는 않습니다. 아키텍처 경계, 보안 예외, 소유권 규칙은 자연어 리뷰에서 자주 새어 나갑니다.

| 상황 | 사람이 놓치기 쉬운 것 | 게이트가 잡아야 할 것 |
|---|---|---|
| 결제 코드 수정 | domain이 infra를 직접 import | layer rule 위반 |
| 인증 로직 변경 | 테스트 이름만 추가 | assertion 없는 테스트 |
| 의존성 추가 | lockfile 변경을 대충 확인 | 신규 패키지 CVE |
| 오래된 파일 수정 | 과거 장애 파일 재편집 | fragile file 경고 |

저는 작은 실험 저장소에 먼저 붙여 봤습니다. AI가 만든 PR 10개를 대상으로 봤고, 평균 변경 파일은 18개였습니다.

사람이 먼저 읽을 때는 리뷰 코멘트가 평균 9.1개 나왔습니다. 게이트를 먼저 돌리자 사람이 확인할 항목은 실패 규칙 평균 2.4개로 줄었습니다.

---

## 결정론적 게이트는 LLM 리뷰가 아닙니다

![같은 입력에는 항상 같은 판정이 나오는 규칙 검사](/images/deterministic-gate-ai-code-verification/02.png)
*같은판정*


결정론적 게이트는 같은 입력에 항상 같은 출력을 냅니다. 모델의 컨디션 같은 변수가 없습니다. temperature도 없습니다. diff, AST, 의존성 그래프, 테스트 결과만 봅니다.

2026년에 나온 자료들을 봐도 방향은 비슷합니다. Mneme HQ는 AI 생성 diff의 아키텍처 위반을 merge 전에 잡는 CI governance를 설명했습니다.

scanaislop.com은 AI-written code를 sub-second deterministic check로 점수화합니다. 그 점수를 pull request quality gate로 씁니다.

| 출처 흐름 | 핵심 아이디어 | 내가 가져온 설계 원칙 |
|---|---|---|
| Mneme HQ, 2026-05 | merge 전 아키텍처 위반 차단 | layer rule은 자동 판정 |
| scanaislop.com | deterministic scoring | PR 점수는 증거 기반 |
| Code Radar | deterministic security evidence | 보안 예외는 로그 필요 |
| PROJECTMEM, 2026-06 | pre-action gate | fragile file 수정 전 경고 |
| AI-SDLC / CodeGPO | AI-specific gates | GitHub gate와 audit report |

순서가 중요합니다. LLM에게 “좋은 코드인지 봐줘”라고 묻기 전에, 기계적으로 틀린 것부터 제거합니다.

리뷰어의 판단은 마지막에 남겨둡니다. 루프 엔지니어링은 AI 빌더를 계속 돌리는 일이지만, 루프마다 판정 기준이 같아야 합니다.

---

## 게이트 규칙은 네 줄로 시작합니다

![실패 메시지는 AI와 사람이 다시 고치는 루프의 입력](/images/deterministic-gate-ai-code-verification/03.png)
*실패가이드*


처음부터 거대한 플랫폼을 만들 필요는 없습니다. 저는 네 가지 규칙으로 시작했습니다. 아키텍처, 테스트, 보안, 소유권입니다.

예시는 결제 도메인입니다. AI가 빠르게 고치려고 `domain/payment`에서 `infra/db`를 직접 import했습니다. 테스트는 통과했습니다. 설계는 깨졌습니다.

```yaml
rules:
  - id: architecture.layer_violation
    target: src/domain/**
    deny_imports:
      - src/infra/**
    severity: fail

  - id: test.assertion_required
    target: tests/**/*.spec.ts
    require_patterns:
      - expect(
      - assert.
    severity: fail

  - id: security.new_dependency
    target: package-lock.json
    require_evidence:
      - npm_audit
      - license_check
    severity: fail

  - id: ownership.fragile_file
    target:
      - src/payment/reconcile.ts
      - src/auth/session.ts
    require_reviewers:
      - platform-owner
    severity: warn
```

규칙 자체는 단순합니다. 그래서 좋습니다. 같은 diff에는 같은 결과가 나옵니다. 리뷰어가 피곤해도 결과는 바뀌지 않습니다.

| 규칙 | 입력 | 실패 조건 | 평균 실행 시간 |
|---|---|---|---|
| layer violation | import graph | 금지 경로 참조 | 0.8초 |
| assertion check | test diff | assertion 없음 | 0.2초 |
| dependency evidence | lockfile diff | audit 결과 없음 | 12초 |
| fragile file | changed files | owner 승인 없음 | 0.1초 |

보안은 특히 증거가 필요합니다. “문제없음”이라는 PR 설명은 증거가 아닙니다. audit 로그, SAST 결과, 예외 승인 ID가 있어야 합니다.

---

## CI에는 통과보다 실패 메시지가 더 중요합니다

게이트는 막기만 하면 반감을 삽니다. 실패 이유가 정확해야 다시 돌릴 수 있습니다. AI 에이전트도 같은 메시지를 보고 수정합니다.

GitHub Actions에서는 아래 정도로 시작할 수 있습니다. 핵심은 PR diff만 검사하고, 결과를 코멘트와 아티팩트로 남기는 것입니다.

```yaml
name: deterministic-gate

on: [pull_request]

jobs:
  gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run deterministic gate
        run: python tools/gate.py --diff origin/main...HEAD --policy policy.yml --report gate-report.md

      - name: Upload report
        uses: actions/upload-artifact@v4
        with:
          name: gate-report
          path: gate-report.md
```

실패 출력은 짧아야 합니다. AI에게도, 사람에게도 마찬가지입니다. 원인, 파일, 규칙, 수정 방향만 있으면 됩니다.

```text
FAIL architecture.layer_violation
file src/domain/payment/settlement.ts
rule domain must not import src/infra/db/client.ts
fix move db access behind PaymentRepository port

FAIL security.new_dependency
file package-lock.json
rule new dependency requires npm audit evidence
fix attach audit result or remove dependency
```

이 형식으로 바꾼 뒤 리뷰어가 처음 보는 화면이 달라졌습니다. 600줄 diff가 아니라 실패 규칙 2개가 먼저 보였습니다.

---

## 사람은 마지막 20%를 봐야 합니다

결정론적 게이트가 모든 리뷰를 대신하지는 않습니다. 그렇게 말하면 틀립니다. 게이트는 반복 가능한 80%를 먼저 자릅니다.

사람이 봐야 할 것은 여전히 남습니다. 도메인 언어가 맞는지, 사용자 경험을 망치지 않는지, 장기 유지보수 비용이 감당되는지 같은 것들입니다.

| 자동 게이트가 볼 것 | 사람이 볼 것 |
|---|---|
| import 경계 | 경계가 비즈니스에 맞는지 |
| 테스트 assertion 존재 | 테스트가 의미 있는 실패를 잡는지 |
| 보안 스캔 결과 | 위험을 받아들일 이유가 있는지 |
| owner 승인 여부 | 실제 책임자가 이해했는지 |
| fragile file 수정 | 지금 고쳐도 되는 타이밍인지 |

사카나 AI 연구처럼 교배, 평가, 선택, 돌연변이 루프가 자동화될수록 평가 기준은 더 중요해집니다. 코딩 에이전트도 같습니다.

AI 빌더가 코드를 만들고, 게이트가 증거를 요구합니다. 사람은 실패한 증거를 보고 규칙을 고칩니다. 실제 루프는 이렇게 돌아갑니다.

AI가 600줄을 만들면 사람은 600줄을 바로 읽지 않습니다. 먼저 실패한 규칙 3개를 봅니다.

---

이전 편: [AI 빌더와 인간 리뷰어의 루프 엔지니어링](./loop-engineering)

다음 편: [에이전트 워크플로우의 감사 로그 설계](./agent-audit-log)