---
title: "함수는 50줄 안으로: AI도 사람도 고치기 쉬운 코드의 기준"
date: "2026-07-08"
category: "tech"
description: "title: 함수는 50줄 안으로: AI도 사람도 고치기 쉬운 코드의 기준 date: 2026 07 08 category: tech description: 함수를 50줄 안으로 유지하는 기준을 AI 코딩 시대의 리뷰 비용과 연결해 설명합니다. 90줄 함수를 4개로 나눈 흐름, "
image: "/images/short-functions-easy-maintenance/01.png"
imageAlt: "50줄은 법이 아니라 리뷰 비용 경고선"
author: "Su Ham"
lang: "ko"
---

---
title: 함수는 50줄 안으로: AI도 사람도 고치기 쉬운 코드의 기준
date: 2026-07-08
category: tech
description: 함수를 50줄 안으로 유지하는 기준을 AI 코딩 시대의 리뷰 비용과 연결해 설명합니다. 90줄 함수를 4개로 나눈 흐름, 테스트 리팩터링 사례, AI에게 맡길 때 필요한 코드 경계를 코드와 표로 정리했습니다.
tags: [refactoring, clean-code, ai-coding, testing]
author: 'Su Ham'
lang: ko
---

## 90줄 함수는 버그보다 먼저 리뷰 시간을 먹습니다

![50줄은 법이 아니라 리뷰 비용 경고선](/images/short-functions-easy-maintenance/01.png)
*50줄 경고*


처음에는 함수 하나가 편했습니다. 데이터 조회, 계산, 저장, 알림까지 한눈에 보였으니까요.
문제는 두 번째 수정부터였습니다. 한 줄을 고치려면 90줄을 다시 읽어야 했습니다.

50줄은 법이 아닙니다. 경고선에 가깝습니다.
이 선을 넘으면 함수가 한 가지 일을 한다는 믿음이 흔들립니다.

임남규님의 글에서 함수뿐 아니라 클래스와 파일도 50줄 이하로 작게 유지하라는 기준을 봤습니다.
저는 이 기준을 코드 리뷰에 바로 적용했습니다. 변화는 꽤 분명했습니다.
리뷰어의 질문이 함수 전체를 향하지 않고, 특정 함수 이름으로 좁혀졌습니다.

| 길이 | 리뷰어가 보는 것 | 자주 생기는 문제 |
|---|---|---|
| 10~20줄 | 입력과 출력 | 이름이 나쁘면 의도가 흐립니다 |
| 30~50줄 | 한 가지 흐름 | 분기 하나 정도는 감당합니다 |
| 50줄 초과 | 여러 흐름 | 수정 범위가 함수 전체로 번집니다 |
| 80줄 초과 | 숨은 규칙 | 테스트가 있어도 읽기 어렵습니다 |

AI 코딩에서도 다르지 않습니다. AI가 만든 코드는 돌아갈 수 있습니다.
하지만 사람이 검토할 수 없다면 운영 코드로 보기 어렵습니다.

---

## 긴 함수에서 버그가 숨는 방식

![긴 함수는 여러 변경 이유가 뒤섞여 버그가 숨는다](/images/short-functions-easy-maintenance/02.png)
*엉킨 책임*


아래 코드는 줄인 예입니다. 실제 함수는 87줄이었습니다.
리포트 발행 함수였지만, 안에는 조회, 필터링, 계산, 저장, 알림이 뒤섞여 있었습니다.

```ts
async function publishReport(input: ReportInput) {
  const rows = await loadRows(input.range)
  const paid = rows.filter(row => row.status === 'paid')
  const canceled = rows.filter(row => row.status === 'canceled')

  const totalPaid = paid.reduce((sum, row) => sum + row.amount, 0)
  const totalCanceled = canceled.reduce((sum, row) => sum + row.amount, 0)
  const netAmount = totalPaid - totalCanceled

  if (netAmount < 0) {
    await saveAuditLog(input.range, netAmount)
  }

  const file = await saveCsv({
    range: input.range,
    paidCount: paid.length,
    canceledCount: canceled.length,
    netAmount,
  })

  if (input.notify) {
    await sendSlack({
      channel: input.channel,
      file,
      netAmount,
    })
  }

  return file
}
```

이 함수의 문제는 길이만이 아니었습니다.
한 함수 안에 변경 이유가 5개나 있었습니다.

| 변경 이유 | 실제 수정 요청 |
|---|---|
| 조회 조건 | 지난달 데이터도 포함해 주세요 |
| 결제 계산 | 취소 금액은 수수료를 제외해 주세요 |
| 감사 로그 | 음수일 때만 남기지 말아 주세요 |
| CSV 저장 | 컬럼 순서를 바꿔 주세요 |
| 알림 | 슬랙 메시지에 링크를 넣어 주세요 |

요청이 하나 들어올 때마다 함수 전체를 다시 읽었습니다.
AI에게 맡겨도 비슷했습니다. 알림 문구만 바꾸라고 했는데 계산 분기를 건드렸습니다.
AI 성능만의 문제는 아니었습니다. 수정할 경계가 코드에 없었습니다.

---

## 50줄 안으로 자르면 수정 경계가 생깁니다

![함수를 나누면 사람과 AI가 고칠 경계가 보인다](/images/short-functions-easy-maintenance/03.png)
*수정 경계*


같은 코드를 4개 함수로 나누면 리뷰 방식이 달라집니다.
각 함수는 50줄 안에 있고, 함수명만 읽어도 어디를 고쳐야 할지 보입니다.

```ts
async function publishReport(input: ReportInput) {
  const rows = await loadRows(input.range)
  const summary = buildPaymentSummary(rows)
  const file = await saveReportFile(input.range, summary)

  await writeAuditIfNeeded(input.range, summary)
  await notifyIfNeeded(input, file, summary)

  return file
}

function buildPaymentSummary(rows: PaymentRow[]) {
  const paid = rows.filter(row => row.status === 'paid')
  const canceled = rows.filter(row => row.status === 'canceled')

  return {
    paidCount: paid.length,
    canceledCount: canceled.length,
    totalPaid: sumAmount(paid),
    totalCanceled: sumAmount(canceled),
    netAmount: sumAmount(paid) - sumAmount(canceled),
  }
}

function sumAmount(rows: PaymentRow[]) {
  return rows.reduce((sum, row) => sum + row.amount, 0)
}
```

수수료 계산을 바꾸려면 `buildPaymentSummary`만 보면 됩니다.
슬랙 메시지를 바꾸는 일은 `notifyIfNeeded` 안에서 끝납니다.

제가 쓰는 기준은 아래처럼 단순합니다.

| 신호 | 자르는 방법 |
|---|---|
| 주석이 목차처럼 붙습니다 | 주석 단위로 함수 추출합니다 |
| if 안에 if가 다시 나옵니다 | 가드 절이나 판별 함수로 뺍니다 |
| 변수 10개 이상이 살아 있습니다 | 중간 결과 객체를 만듭니다 |
| 테스트 이름으로 설명이 안 됩니다 | 시나리오를 더 작게 나눕니다 |
| AI에게 부분 수정 지시가 어렵습니다 | 수정 대상 함수를 먼저 분리합니다 |

작게 자른 함수는 거창한 추상화가 아닙니다. 위치 표시입니다.
어디를 고쳐야 하는지 코드가 먼저 말하게 만드는 작업입니다.

---

## 테스트 함수도 50줄을 넘기면 설명서가 됩니다

운영 코드만 길어지는 건 아닙니다. 테스트 함수도 쉽게 길어집니다.
결제 테스트 하나가 63줄이었고, assertion이 7개였습니다.
실패 메시지는 하나였지만 원인은 세 갈래였습니다.

처음 테스트는 이런 모양이었습니다.

```ts
test('refund policy', async () => {
  const order = await createPaidOrder()
  await cancelOrder(order.id)
  await requestRefund(order.id)
  const refund = await getRefund(order.id)
  const log = await getRefundLog(order.id)
  const coupon = await getCoupon(order.couponId)

  expect(refund.amount).toBe(9000)
  expect(refund.fee).toBe(1000)
  expect(log.type).toBe('refund_requested')
  expect(coupon.status).toBe('restored')
})
```

이 테스트를 3개로 나눴습니다. 각각 21줄, 18줄, 24줄이었습니다.
실패했을 때 확인할 파일은 같았지만, 확인할 이유는 달라졌습니다.

| 분리 후 테스트 | 확인하는 것 |
|---|---|
| 환불 금액을 계산합니다 | 금액과 수수료 |
| 환불 로그를 남깁니다 | 이벤트 타입과 시간 |
| 쿠폰을 복구합니다 | 쿠폰 상태 |

테스트가 짧아지면 실패 메시지가 문서처럼 읽힙니다.
긴 테스트는 모든 것을 검증하는 척하지만, 실제로는 원인을 숨깁니다.

---

## AI에게 맡길수록 함수는 더 작아야 합니다

AI 에이전트는 긴 파일도 읽습니다. 하지만 읽는 것과 안전하게 고치는 것은 다릅니다.
특히 백그라운드에서 24시간 자동화 작업을 돌리는 구조라면 기준이 더 필요합니다.

나쁜 지시는 보통 이렇게 시작합니다.

```text
이 리포트 발행 로직에서 취소 금액 계산을 고쳐줘.
```

좋은 지시는 수정 경계를 포함합니다.

```text
buildPaymentSummary 함수에서 canceled 금액 계산만 바꿔줘.
notifyIfNeeded, saveReportFile, writeAuditIfNeeded는 수정하지 마.
```

함수가 작으면 프롬프트도 작아집니다.
검토할 diff도 작아지고, 되돌릴 범위도 작아집니다.

50줄을 넘겼다고 곧장 실패는 아닙니다.
다만 그 함수는 이제 설명을 요구합니다. 설명이 길어진다면 함수보다 책임이 너무 큰 겁니다.

---

이전 글: [작은 PR이 리뷰 시간을 줄인다](/stories/small-pr-review)
다음 글: [테스트 이름은 실패 메시지다](/stories/test-name-failure-message)