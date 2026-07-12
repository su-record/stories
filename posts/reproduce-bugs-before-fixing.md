---
title: "버그는 재현 먼저 — 실패를 재현한 뒤에 고치는 디버깅 원칙"
date: "2026-07-12"
category: "tech"
description: "title: "버그는 재현 먼저: 실패를 재현한 뒤에 고치는 디버깅 원칙" date: 2026 07 12 category: methodology description: "버그를 고치기 전에 먼저 실패를 재현해야 합니다. 추측으로 코드를 바꾸지 않고 MRE, 로그, 이진 탐색으로"
image: "/images/reproduce-bugs-before-fixing/01.png"
imageAlt: "고치기 전에 실패를 먼저 재현한다"
author: "Su Ham"
lang: "ko"
---

---
title: "버그는 재현 먼저: 실패를 재현한 뒤에 고치는 디버깅 원칙"
date: 2026-07-12
category: methodology
description: "버그를 고치기 전에 먼저 실패를 재현해야 합니다. 추측으로 코드를 바꾸지 않고 MRE, 로그, 이진 탐색으로 원인을 좁히는 디버깅 원칙입니다."
tags: [debugging, bug, mre, engineering, methodology]
author: "Su Ham"
lang: "ko"
---

고치기 전에 재현하지 못한 버그는 대개 다시 돌아옵니다.

저도 이 순서를 여러 번 틀렸습니다. 에러 메시지만 보고 코드를 바꿨고, 로컬에서는 통과했습니다.

문제는 그다음이었습니다. 운영에서 같은 증상이 다시 나왔습니다. 제가 바꾼 코드는 원인이 아니었습니다.

---

## 버그 수정은 증명 문제입니다

![고치기 전에 실패를 먼저 재현한다](/images/reproduce-bugs-before-fixing/01.png)
*재현 먼저*


버그를 고친다는 건 두 가지를 증명하는 일입니다. 먼저 실패가 실제로 발생한다는 것을 확인해야 합니다.

그다음 같은 조건에서 실패가 사라졌는지 봅니다. 첫 번째 확인이 없으면 두 번째 확인도 의미가 없습니다.

제가 자주 본 실패 패턴은 아래와 같았습니다.

| 단계 | 잘못된 행동 | 결과 |
|---|---|---|
| 증상 확인 | 화면만 보고 원인을 짐작함 | 관련 없는 파일을 수정함 |
| 코드 변경 | 여러 줄을 한 번에 바꿈 | 어떤 변경이 효과였는지 모름 |
| 검증 | 성공 케이스만 다시 실행함 | 실패 조건이 그대로 남음 |
| 공유 | "아마 고쳤습니다"라고 말함 | 같은 버그가 다시 열림 |

"재현 먼저"는 느린 절차가 아닙니다. 추측으로 2시간을 날리는 일을 막아 줍니다.

버그 리포트에서 먼저 볼 것은 설명이 얼마나 긴지가 아닙니다. 재현 조건이 얼마나 정확한지입니다.

---

## 재현 조건은 버그의 좌표입니다

![재현 조건은 버그의 위치를 찍는 좌표다](/images/reproduce-bugs-before-fixing/02.png)
*버그 좌표*


재현 조건은 버그가 있는 위치를 가리키는 좌표입니다. 좌표가 흐리면 디버깅은 감으로 흘러갑니다.

최소한 아래 5가지는 모아야 합니다. 하나라도 빠지면 원인 범위가 갑자기 넓어집니다.

| 항목 | 예시 | 목적 |
|---|---|---|
| 증상 | 결제 버튼 클릭 후 500 응답 | 실패 형태 고정 |
| 조건 | Chrome 126, 로그인 사용자, 쿠폰 적용 | 환경 범위 축소 |
| 입력값 | couponId=SUMMER26, amount=0 | 데이터 의존성 확인 |
| 오류 | TypeError: cannot read property 'id' | 실패 지점 추적 |
| 기대값 | 결제 차단 후 안내 문구 노출 | 올바른 상태 정의 |

좋은 리포트는 감정을 줄이고 실험을 늘립니다. "가끔 안 됩니다"는 아직 디버깅 입력으로 쓰기 어렵습니다.

예를 들어 아래 정도면 출발할 수 있습니다. 짧지만 실패를 다시 만들 수 있습니다.

```text
1. Chrome 126에서 /checkout 접속
2. 로그인 계정 user-1842 사용
3. SUMMER26 쿠폰 적용
4. 수량을 0으로 변경
5. 결제 버튼 클릭

결과: POST /api/orders 500
콘솔: TypeError: Cannot read properties of undefined (reading 'id')
기대: 주문 생성 차단, "수량을 확인하세요" 문구 표시
```

여기까지 오면 질문이 달라집니다. 이제 "왜 안 되지"가 아니라 "5번에서 왜 500이 나는가"입니다.

---

## 최소 재현 예제는 원인을 잘라냅니다

![추측하지 말고 원인 범위를 반씩 좁힌다](/images/reproduce-bugs-before-fixing/03.png)
*반씩 좁히기*


재현에 성공했다고 바로 고치지는 않습니다. 먼저 실패를 가능한 작게 줄입니다.

MRE, 재현 가능한 최소 예제는 버그 주변의 노이즈를 걷어냅니다. 화면, 상태, 네트워크를 하나씩 덜어냅니다.

처음에는 전체 결제 플로우에서만 실패했습니다. 줄이고 나니 문제는 수량 검증 함수 하나였습니다.

```ts
type OrderInput = {
  quantity?: number;
  couponId?: string;
};

function buildOrder(input: OrderInput) {
  if (!input.quantity) {
    return { blocked: true };
  }

  return {
    quantity: input.quantity,
    coupon: input.couponId!.toLowerCase(),
  };
}

buildOrder({ quantity: 0 });
```

이 코드는 두 가지 문제를 숨깁니다. `0`을 없는 값처럼 처리하고, 쿠폰이 없는데도 강제로 접근합니다.

수정은 그다음입니다. 먼저 실패 테스트를 씁니다. 실패가 빨간색으로 보여야 합니다.

```ts
it("수량이 0이면 주문을 생성하지 않고 차단한다", () => {
  expect(buildOrder({ quantity: 0 })).toEqual({ blocked: true });
});

it("쿠폰이 없어도 주문 생성 로직은 예외를 던지지 않는다", () => {
  expect(() => buildOrder({ quantity: 1 })).not.toThrow();
});
```

테스트가 먼저 실패해야 합니다. 실패하지 않는 테스트는 버그를 붙잡지 못한 테스트입니다.

그 뒤 코드를 고칩니다. 한 번에 하나만 바꿉니다. 그래야 원인과 결과가 이어집니다.

```ts
function buildOrder(input: OrderInput) {
  if (input.quantity === undefined || input.quantity <= 0) {
    return { blocked: true };
  }

  return {
    quantity: input.quantity,
    coupon: input.couponId?.toLowerCase() ?? null,
  };
}
```

이제 같은 실패 조건을 다시 실행합니다. 테스트, 로컬 재현 절차, 가능하면 운영 로그 조건까지 확인합니다.

---

## 추측 대신 이진 탐색을 합니다

재현이 되면 디버깅은 수사가 아니라 실험이 됩니다. 가설을 세우고 하나씩 지웁니다.

코드가 20개 커밋 사이에서 깨졌다면 모든 파일을 읽을 필요가 없습니다. 중간 지점을 실행합니다.

```bash
git bisect start
git bisect bad HEAD
git bisect good v1.18.0
npm test -- checkout.spec.ts
```

20개 커밋을 하나씩 보면 20번 확인해야 합니다. 이진 탐색으로 보면 대략 5번이면 됩니다.

로그도 같은 방식입니다. 많이 찍는 것이 목표가 아닙니다. 경계 지점을 좁히는 것이 목표입니다.

| 가설 | 확인 방법 | 다음 행동 |
|---|---|---|
| 프론트 입력 오류 | 요청 payload 저장 | 값이 맞으면 서버로 이동 |
| API 검증 누락 | controller 직전 로그 | 통과하면 service로 이동 |
| DB 제약 충돌 | query와 constraint 확인 | 실패 쿼리만 분리 |
| 배포 환경 차이 | env diff 비교 | 설정값만 재현 |

무작정 코드를 바꾸면 실험이 깨집니다. 변수 두 개를 동시에 바꾸면 결과를 해석할 수 없습니다.

그래서 커밋도 작아야 합니다. "결제 버그 수정"보다 "quantity 0 검증 조건 수정"이 나중에 더 잘 살아남습니다.

---

## 협업에서는 재현 패키지를 넘깁니다

버그를 넘길 때는 의견보다 재료가 중요합니다. 받은 사람이 10분 안에 실패를 볼 수 있어야 합니다.

제가 선호하는 형식은 아래입니다. 길지 않지만 필요한 정보는 빠지지 않습니다.

```md
### 증상
쿠폰 없는 주문에서 결제 버튼 클릭 시 500 발생

### 재현 조건
- Chrome 126
- user-1842
- quantity=1
- couponId 없음

### 재현 절차
1. /checkout 접속
2. 상품 A 수량 1 선택
3. 쿠폰 입력 없이 결제 클릭

### 실제 결과
POST /api/orders 500
TypeError: Cannot read properties of undefined (reading 'toLowerCase')

### 기대 결과
주문 생성 성공, coupon=null 저장

### 확인한 것
- 프론트 payload에는 couponId 필드 없음
- service 단위 테스트에서 동일 예외 재현
- quantity 검증과는 별개 문제
```

이 정도면 담당자는 다시 묻지 않아도 됩니다. 질문 시간이 줄고, 수정이 더 빨리 시작됩니다.

버그 수정에서 중요한 것은 빠른 타이핑이 아닙니다. 실패를 같은 모습으로 다시 부르는 능력입니다.

재현이 없으면 수정은 주장입니다. 재현이 있으면 수정은 검증입니다.

---

이전 글: [테스트는 문서가 아니라 안전장치입니다](/stories/tests-are-safety-nets)  
다음 글: [로그는 많이 남기는 것이 아니라 경계에 남기는 것입니다](/stories/logging-at-boundaries)