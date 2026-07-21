---
title: "Webhooks: 외부 사건이 일을 시작하게 만드는 방식"
date: "2026-07-21"
category: "tech"
description: "버튼을 누르지 않았는데 작업이 시작됩니다 자동화는 예약 작업만으로 끝나지 않습니다. 외부에서 생긴 일이 내부 작업을 바로 깨울 때 차이가 납니다. 결제가 끝납니다. 고객이 피드백을 남깁니다. SAP LeanIX 자동화가 AUTOMATION_TRIGGERED 이벤트를 보냅니다. "
image: "/images/webhooks-trigger-external-events/01.png"
imageAlt: "폴링은 계속 묻고, 웹훅은 사건이 생길 때 밀어준다"
author: "Su Ham"
lang: "ko"
---

## 버튼을 누르지 않았는데 작업이 시작됩니다

![폴링은 계속 묻고, 웹훅은 사건이 생길 때 밀어준다](/images/webhooks-trigger-external-events/01.png)
*사건이먼저*


자동화는 예약 작업만으로 끝나지 않습니다. 외부에서 생긴 일이 내부 작업을 바로 깨울 때 차이가 납니다.

결제가 끝납니다. 고객이 피드백을 남깁니다. SAP LeanIX 자동화가 AUTOMATION_TRIGGERED 이벤트를 보냅니다. 그때 사람이 관리자 화면에 들어가 버튼을 누르고 있다면 이미 한 박자 늦습니다.

웹훅은 이 간격을 줄입니다. 외부 시스템이 HTTPS 엔드포인트로 이벤트 데이터를 보내고, 내 시스템은 그 요청을 받아 검증한 뒤 큐에 넣고 작업을 시작합니다.

폴링과 비교하면 차이가 분명합니다.

| 방식 | 동작 | 1시간에 주문 1,000개 확인 | 문제 |
|---|---|---:|---|
| 폴링 | 1분마다 상태를 물어봅니다 | 60,000회 요청 | 대부분 빈 응답입니다 |
| 웹훅 | 사건이 생길 때 POST를 받습니다 | 실제 이벤트 수만큼 | 수신 실패를 설계해야 합니다 |

1분마다 주문 1,000개를 확인하면 한 시간에 60,000번 요청합니다. 실제 결제가 40건이라면 59,960번은 할 일이 없는 요청입니다.

웹훅은 반대로 움직입니다. 사건이 먼저 생기고, 작업은 그 뒤에 따라옵니다.

---

## 웹훅은 HTTP POST 한 번이 아니라 계약입니다

![웹훅 수신부는 일을 끝내는 곳이 아니라 검증 후 큐에 넘기는 관문이다](/images/webhooks-trigger-external-events/02.png)
*검증후큐*


웹훅을 단순한 POST 요청으로 보면 놓치는 게 많습니다. 핵심은 요청 자체보다 약속된 규칙입니다.

누가 보내는지, 어떤 이벤트를 보내는지, 실패하면 몇 번 재시도하는지, 같은 이벤트가 두 번 오면 어떻게 처리할지 정해야 합니다. 이 질문들이 비어 있으면 장애로 이어집니다.

기본 흐름은 짧습니다.

| 단계 | 해야 할 일 | 이유 |
|---|---|---|
| 1 | 원문 body 수신 | 서명 검증에 필요합니다 |
| 2 | HMAC 또는 서명 검증 | 위조 요청을 막습니다 |
| 3 | event_id 저장 | 중복 처리를 막습니다 |
| 4 | 큐에 작업 등록 | 응답 지연을 줄입니다 |
| 5 | 200 응답 | 발신자의 재시도를 제어합니다 |

수신 엔드포인트는 일을 끝내는 곳이 아닙니다. 일을 안전하게 넘기는 곳입니다.

```js
import crypto from 'node:crypto';
import express from 'express';

const app = express();
app.use(express.raw({ type: 'application/json' }));

app.post('/webhooks/payment', async (req, res) => {
  const signature = req.header('x-signature') || '';
  const expected = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(req.body)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return res.sendStatus(401);
  }

  const event = JSON.parse(req.body.toString());

  await queue.add('payment.received', {
    id: event.id,
    orderId: event.data.order_id,
    amount: event.data.amount
  });

  res.sendStatus(200);
});
```

여기서 중요한 건 큐입니다. 결제 확인, 메일 발송, 재고 차감까지 엔드포인트에서 처리하면 타임아웃이 날 수 있습니다.

저는 웹훅 응답 목표를 3초 아래로 둡니다. 검증하고, 저장하고, 큐에 넣은 뒤 바로 끝냅니다.

---

## 제품마다 이름은 달라도 패턴은 같습니다

![재시도로 같은 이벤트가 다시 올 수 있으니 event_id로 한 번만 처리해야 한다](/images/webhooks-trigger-external-events/03.png)
*한번만처리*


2026년 7월 21일 기준으로 확인한 사례들은 같은 방향을 보여줍니다. 외부 사건이 내부 작업을 시작합니다.

| 제품 | 웹훅이 시작하는 일 | 실제 의미 |
|---|---|---|
| Odoo 19.0 | 외부 이벤트로 데이터베이스 작업 자동화 | 주문, 재고, 고객 상태 변경을 즉시 반영합니다 |
| Azure Automation | HTTP 요청으로 Runbook 시작 | 서버 점검, 계정 정리, 배포 작업을 외부에서 깨웁니다 |
| SAP LeanIX | AUTOMATION_TRIGGERED 이벤트 전송 | 아키텍처 변경을 외부 워크플로우와 연결합니다 |
| Palantir Foundry | Data Connection Webhooks 구성 | 입력 파라미터와 결과물을 작업 본문에 묶습니다 |
| ABC User Feedback, Xsolla | Slack, Discord, 자체 서버 알림 | 고객 행동을 운영 채널로 바로 보냅니다 |

공통점은 단순합니다. 시스템이 기다리지 않는다는 점입니다.

사용자가 피드백을 남기면 Discord에 알림이 갑니다. 결제가 완료되면 ERP 주문 상태가 바뀝니다. 클라우드 경고가 발생하면 Runbook이 실행됩니다.

관리자 화면을 새로고침하던 시간은 줄어듭니다. 대신 수신 안정성, 보안, 재처리 설계가 비용으로 붙습니다.

---

## 실패는 대부분 수신 이후에 납니다

웹훅이 한 번만 온다고 생각하면 위험합니다. 대부분의 발신자는 실패하면 다시 보냅니다.

네트워크가 끊길 수 있습니다. 내 서버가 500을 낼 수도 있습니다. 200 응답은 보냈지만 내부 작업이 실패하는 경우도 있습니다.

그래서 event_id를 기준으로 멱등성을 만들어야 합니다. 같은 사건은 한 번만 처리되어야 합니다.

```sql
create table webhook_events (
  event_id text primary key,
  received_at timestamptz not null default now(),
  status text not null,
  payload jsonb not null
);
```

이 테이블 하나만 있어도 사고가 줄어듭니다. 같은 결제로 포인트가 두 번 지급되는 일을 막을 수 있습니다.

실무 체크리스트는 짧습니다.

| 항목 | 하지 않으면 생기는 일 |
|---|---|
| 서명 검증 | 누구나 결제 완료 이벤트를 위조합니다 |
| event_id 저장 | 같은 이벤트가 두 번 처리됩니다 |
| 큐 사용 | 외부 요청이 내부 작업 시간에 묶입니다 |
| 원문 payload 보관 | 장애 분석 때 증거가 없습니다 |
| 재처리 버튼 | 운영자가 DB를 직접 만지게 됩니다 |
| 실패 이벤트 격리 | 독성 이벤트 하나가 전체 큐를 막습니다 |

웹훅 운영에서 로그는 빼면 안 됩니다. 최소한 event_id, event_type, status, latency_ms, retry_count는 남겨야 합니다.

장애가 났을 때 확인할 질문은 정해져 있습니다. 받았는가. 검증했는가. 저장했는가. 큐에 들어갔는가. 워커가 끝냈는가.

---

## 웹훅은 자동화의 경계선입니다

웹훅을 붙인다고 일이 저절로 빨라지지는 않습니다. 사람이 누르던 시작 버튼이 외부 사건으로 바뀌는 것입니다.

그 뒤는 설계의 영역입니다. 인증, 멱등성, 큐, 재시도, 관측 가능성이 필요합니다.

처음부터 크게 만들 필요는 없습니다. 결제 완료 하나, 고객 피드백 하나, 배포 알림 하나면 충분합니다.

사건이 생긴 뒤 사람이 확인할 때까지 기다리고 있다면, 그 지점이 웹훅을 둘 자리입니다.