---
title: "P1=0까지 반복하라 — 치명 결함 0이 될 때까지 도는 리뷰 루프"
date: "2026-07-07"
category: "tech"
description: "title: P1=0까지 반복하라: 치명 결함 0이 될 때까지 도는 리뷰 루프 date: 2026 07 07 category: methodology description: 코드 리뷰가 한 번의 승인으로 끝나면 P1 결함은 배포 뒤 장애로 이어질 수 있습니다. Cross Agen"
image: "/images/review-until-zero-critical-defects/01.png"
imageAlt: "승인이 아니라 P1=0이 종료 조건"
author: "Su Ham"
lang: "ko"
---

---
title: P1=0까지 반복하라: 치명 결함 0이 될 때까지 도는 리뷰 루프
date: 2026-07-07
category: methodology
description: 코드 리뷰가 한 번의 승인으로 끝나면 P1 결함은 배포 뒤 장애로 이어질 수 있습니다. Cross-Agent Code Review Queue 2026의 37개 Codex와 Claude 교차 리뷰 기록을 바탕으로 P1=0 루프의 종료 조건과 큐 설계를 정리합니다.
tags:
  - code-review
  - ai-agent
  - review-loop
  - quality-gate
author: "Su Ham"
lang: "ko"
---

## 한 번의 LGTM으로 결함이 사라지지는 않습니다

![승인이 아니라 P1=0이 종료 조건](/images/review-until-zero-critical-defects/01.png)
*승인≠종료*


P1 하나는 가벼운 결함이 아닙니다. 배포 뒤 사용자 환경에서 그대로 재현될 수 있는 미해결 위험입니다.

예전에 저도 비슷한 문제를 놓친 적이 있습니다. 리뷰 댓글 14개가 닫혔고, 마지막에는 LGTM이 달렸습니다. 그런데 인증 경계의 실패 케이스 하나가 남아 있었습니다. 테스트는 모두 통과했지만, 장애는 테스트가 덮지 못한 회색 영역에서 났습니다.

2026년 Q2 리포트에 언급된 Cross-Agent Code Review Queue 2026 데이터셋은 이 문제를 직접 다룹니다. 확인된 자료 기준으로 37개의 bilingual Codex↔Claude review transcripts와 queue metadata가 포함됩니다.

중요한 건 어떤 리뷰어가 봤느냐보다, 언제 리뷰를 끝낼 수 있느냐입니다.

| 항목 | 확인된 내용 |
|---|---|
| 대상 자료 | Cross-Agent Code Review Queue 2026 dataset |
| 포함 기록 | Codex↔Claude 양방향 리뷰 transcript 37개 |
| 결과 상태 | `new_signal`, `no_new_signal`, `failed` |
| 루프 방식 | P0/P1/P2 수정 뒤 residual risk가 닫힐 때까지 재리뷰 |
| 외부 인정 | Awesome-AI-Agents의 `multi-agent collaboration` 항목에 accepted |
| 미확인 정보 | 세부 순위, match score, key people, Q2 외 구체 날짜 |

여기서 `new_signal`은 새 위험을 발견했다는 뜻입니다. `no_new_signal`은 추가 위험이 없다는 뜻입니다. `failed`는 리뷰 작업 자체가 실패했다는 뜻입니다.

리뷰는 승인 도장을 찍는 일이 아닙니다. 남은 위험을 줄여 가는 큐 작업에 가깝습니다.

---

## P0/P1/P2는 우선순위가 아니라 반복 횟수를 정합니다

![새 위험 신호가 나오면 루프는 재오픈된다](/images/review-until-zero-critical-defects/02.png)
*재오픈 루프*


많은 팀이 P0, P1, P2를 단순 라벨처럼 씁니다. 그러면 부족합니다. 라벨은 큐의 행동을 바꿔야 합니다.

P0는 배포 중단입니다. P1은 배포 전에 0이 되어야 합니다. P2는 부채로 남길 수 있지만, 담당자와 만료일이 있어야 합니다.

| 등급 | 의미 | 큐 동작 | 종료 조건 |
|---|---|---|---|
| P0 | 즉시 장애, 데이터 손상, 권한 우회 | 릴리스 중단, 핫픽스 우선 | P0 = 0 |
| P1 | 릴리스 차단급 결함, 보안 경계 실패 | 수정 뒤 반드시 재리뷰 | P1 = 0 |
| P2 | 우회 가능한 품질 저하, 엣지 케이스 | 백로그 등록, 기한 지정 | 소유자와 만료일 존재 |

제가 쓰는 단순 분류 함수는 이렇습니다. 복잡한 점수표보다 팀 안에서 같은 기준을 쓰는 일이 먼저입니다.

```python
def classify_issue(issue):
    if issue.data_loss or issue.auth_bypass:
        return 'P0'

    if issue.blocks_release or issue.security_boundary:
        return 'P1'

    if issue.has_workaround and issue.owner:
        return 'P2'

    return 'P1'
```

마지막 줄이 중요합니다. 애매하면 P1입니다. 애매한 결함을 P2로 내리는 순간, 리뷰 루프는 품질 게이트가 아니라 합리화 문서가 됩니다.

예를 들어 결제 API에서 `coupon_id`가 비어 있을 때 500을 반환한다고 합시다. 내부 관리자만 쓰는 기능이면 P2일 수 있습니다. 외부 사용자가 요청을 만들 수 있고, 재시도로 중복 결제가 생긴다면 P1입니다.

같은 코드라도 어디에 노출되느냐에 따라 등급이 달라집니다. 그래서 재리뷰가 필요합니다.

---

## 루프는 리뷰어가 아니라 큐가 통제해야 합니다

![failed는 안전이 아니라 아직 못 본 상태](/images/review-until-zero-critical-defects/03.png)
*실패≠안전*


좋은 리뷰어 둘을 붙여도 큐가 없으면 같은 실패가 반복됩니다. 한 명은 수정을 확인합니다. 다른 한 명은 다른 위험을 찾습니다. 둘 다 맞을 수 있습니다.

Cross-Agent Code Review Queue 2026에서 흥미로운 지점도 여기에 있습니다. Codex와 Claude가 서로 다른 방향에서 리뷰하고, 그 결과를 큐 상태로 남깁니다. 수정이 들어오면 residual risk가 닫힐 때까지 다시 돕니다.

제가 권장하는 최소 큐는 네 칸이면 됩니다.

| 상태 | 설명 | 다음 행동 |
|---|---|---|
| `open` | 결함이 등록됨 | 담당자 지정 |
| `patched` | 수정 PR이 올라옴 | 다른 리뷰어가 재검토 |
| `reopened` | 새 신호가 발견됨 | 패치 재작성 |
| `closed` | P0/P1 잔여 위험 없음 | 배포 가능 |

YAML로 쓰면 더 분명합니다.

```yaml
review_loop:
  exit_condition:
    - P0 == 0
    - P1 == 0
  review_results:
    - new_signal
    - no_new_signal
    - failed
  on_new_signal:
    action: reopen
    require_patch: true
  on_no_new_signal:
    action: close_if_no_p0_p1
  on_failed:
    action: rerun_with_new_context
```

여기서 `failed`를 닫힌 상태로 처리하면 안 됩니다. 모델 호출이 실패했거나, diff를 제대로 읽지 못했거나, 컨텍스트가 잘렸을 수 있습니다. 이것은 무위험이 아닙니다. 아직 측정하지 못한 상태입니다.

루프의 주요 지표는 리뷰 댓글 수가 아닙니다. 닫힌 P1 수와 재오픈된 P1 수입니다.

| 지표 | 나쁜 해석 | 좋은 해석 |
|---|---|---|
| 리뷰 댓글 30개 | 꼼꼼했다 | 결함 밀도가 높았다 |
| 승인 2개 | 안전하다 | 승인자는 위험을 못 봤을 수 있다 |
| P1 0개 | 문제가 없다 | 현재 큐 기준 잔여 P1이 없다 |
| `failed` 0개 | 모델이 안정적이다 | 최소한 리뷰 작업은 완주했다 |

승인은 사건입니다. P1=0은 상태입니다.

---

## 24/7 에이전트가 코드를 쓰면 리뷰 루프도 계속 돌아야 합니다

Google Gemini Spark 같은 노코드 AI 자동화 도구는 자연어 지시로 업무를 돌립니다. 사용자가 자는 동안에도 백그라운드에서 작업할 수 있습니다. 그러면 산출물도 밤새 늘어납니다.

Unsloth와 Connect AI로 로컬 비즈니스 에이전트를 만들 수도 있습니다. 단기 기억과 장기 기억을 학습시키고, SLERP나 Task Arithmetic으로 모델을 병합할 수 있습니다. 사카나 AI 연구처럼 교배, 평가, 선택, 돌연변이로 병합 레시피를 찾는 흐름도 있습니다.

문제는 능력이 늘수록 결함도 자동화된다는 점입니다.

모델 병합은 추가 학습 없이 능력을 합칠 수 있습니다. 그렇다고 보안 경계 이해, 예외 처리, 비즈니스 규칙 준수까지 자동으로 보장되지는 않습니다. 새 모델은 새 리뷰 대상입니다.

그래서 에이전트 시대의 리뷰 루프는 사람 승인 중심으로는 부족합니다. 큐 중심으로 돌아가야 합니다.

```text
agent writes patch
  -> reviewer A finds P1
  -> agent patches
  -> reviewer B re-reviews
  -> new_signal found
  -> agent patches again
  -> no_new_signal
  -> P0 == 0 and P1 == 0
  -> close
```

이 흐름은 느려 보입니다. 실제로는 반대에 가깝습니다. 실패한 배포를 되돌리는 시간보다 P1 하나를 재리뷰하는 시간이 짧습니다. 장애 회의 60분을 줄이는 가장 싼 방법은 배포 전 큐에서 P1을 닫는 것입니다.

AI 리뷰어를 늘리는 것만으로는 부족합니다. `new_signal`을 다시 큐에 넣는 규칙이 있어야 합니다. `failed`를 성공처럼 취급하지 않는 규칙도 필요합니다.

---

## P1=0은 구호가 아니라 종료 조건입니다

P1=0 루프는 품질 문화 이야기가 아닙니다. 릴리스 조건을 숫자로 고정하는 방법입니다.

정리하면 네 가지입니다.

- P0는 즉시 중단합니다.
- P1은 배포 전 0이 될 때까지 반복합니다.
- P2는 소유자와 만료일 없이는 남기지 않습니다.
- `failed`는 무위험이 아니라 미측정으로 처리합니다.

Cross-Agent Code Review Queue 2026 데이터셋이 보여주는 값은 특정 모델의 승패가 아닙니다. Codex와 Claude를 교차시켜도 마지막 판단은 큐 상태에 남아야 한다는 점입니다.

리뷰 루프는 사람을 불신하는 장치가 아닙니다. 한 번의 승인으로 닫히지 않는 위험을 닫힐 때까지 추적하는 장치입니다. 승인 개수보다 남은 P1 개수가 릴리스 위험을 더 정확히 말합니다.

---

이전: [멀티 에이전트 리뷰 큐 설계](./multi-agent-review-queue)

다음: [P2를 부채로 남기는 기준](./p2-risk-backlog)