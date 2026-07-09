---
title: "any 금지의 힘: 타입 안전이 버그를 미리 잡는다"
date: "2026-07-09"
category: "tech"
description: "TypeScript에서 any를 금지했을 때 런타임 버그가 컴파일 에러로 바뀌는 과정을 실제 코드, unknown, 타입 가드, 검증 함수로 정리했습니다."
image: "/images/ban-any-type-safety/01.png"
imageAlt: "any는 버그를 없애지 않고 검사 우회로를 만든다"
tags: ["typescript", "type-safety", "frontend", "bug"]
author: "Su Ham"
lang: "ko"
---

`any` 하나는 버그 하나로 끝나지 않습니다. 타입 시스템 전체에 우회로를 뚫습니다.

## `any`는 버그를 지우지 않습니다. 숨깁니다

![any는 버그를 없애지 않고 검사 우회로를 만든다](/images/ban-any-type-safety/01.png)
*숨긴 버그*


주문 목록 화면에서 한 번 문제가 터진 적이 있습니다. API의 `total`이 숫자라고 믿고 그대로 렌더링했습니다.

그런데 어느 날 `total`이 `null`로 내려왔습니다. 화면은 빈 값 처리를 하지 못했고, 런타임 에러가 났습니다.

```ts
type Order = {
  id: string;
  status: "paid" | "cancelled";
  total: number;
};

async function renderOrder(id: string) {
  const data: any = await fetchOrder(id);

  return data.total.toLocaleString("ko-KR");
}
```

TypeScript는 아무 말도 하지 않았습니다. `data`가 `any`였기 때문입니다.

`any`는 “무슨 타입이든 된다”라기보다 “검사를 하지 않겠다”에 가깝습니다.

| 선택 | 컴파일러 반응 | 버그가 드러나는 시점 |
|---|---:|---:|
| `any` | 통과 | 사용자가 클릭한 뒤 |
| `unknown` | 확인 요구 | 코드 작성 중 |
| 명시 타입 | 불일치 차단 | PR 전 |
| 검증 함수 | 외부 입력 차단 | 데이터 경계 |

한 팀에서 처음 바꾼 규칙은 단순했습니다. 새 `any`를 추가하지 않는 것이었습니다.

처음에는 `any`가 143개 있었습니다. 2주 동안 31개로 줄였습니다. 같은 기간 주문과 폼 관련 QA 재오픈 버그는 7건에서 2건으로 줄었습니다.

특별한 방법은 아니었습니다. 버그가 사라진 게 아니라, 컴파일 에러로 더 일찍 드러났습니다.

---

## `unknown`은 귀찮게 해서 안전합니다

![unknown은 확인 전까지 값을 쓰지 못하게 막는다](/images/ban-any-type-safety/02.png)
*먼저 확인*


`any`를 없애면 가장 먼저 만나는 타입이 `unknown`입니다. 이름 그대로 아직 모르는 값입니다.

`unknown`은 바로 사용할 수 없습니다. 이 점이 좋습니다. 확인하기 전에는 쓰지 못하게 막아줍니다.

```ts
async function renderOrder(id: string) {
  const data: unknown = await fetchOrder(id);

  if (!isOrder(data)) {
    throw new Error("Invalid order payload");
  }

  return data.total.toLocaleString("ko-KR");
}
```

처음 보면 코드가 길어 보입니다. 실제로도 길어집니다.

다만 길어진 위치가 다릅니다. 실패가 생길 수 있는 API 경계에서 코드가 늘어납니다.

```ts
function isOrder(value: unknown): value is Order {
  if (typeof value !== "object" || value === null) return false;

  const v = value as Record<string, unknown>;

  return (
    typeof v.id === "string" &&
    (v.status === "paid" || v.status === "cancelled") &&
    typeof v.total === "number"
  );
}
```

이제 `total`이 `null`이면 렌더링까지 가지 않습니다. 검증 함수에서 멈춥니다.

타입 안전은 코드를 짧게 만드는 기술이 아닙니다. 잘못된 값이 멀리 가지 못하게 막는 기술입니다.

---

## 타입 가드는 경계에 둬야 합니다

![타입 가드는 외부 입력이 내부로 들어오는 경계에 둔다](/images/ban-any-type-safety/03.png)
*경계 검문*


타입 가드를 모든 함수 안에 넣기 시작하면 코드가 금방 지저분해집니다. 그래서 위치를 정해야 합니다.

나는 보통 네 군데를 경계로 봅니다.

| 경계 | 예시 | 처리 방식 |
|---|---|---|
| 서버 응답 | `fetch`, `axios` | `unknown`으로 받고 검증 |
| URL 입력 | query string, params | 문자열 변환 후 좁히기 |
| 브라우저 저장소 | `localStorage` | JSON 파싱 후 검증 |
| AI 생성 결과 | JSON 응답, 코드 생성물 | 스키마 검증 후 사용 |

내부 도메인으로 들어오기 전에 한 번 막는 식입니다.

```ts
type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

function parseOrder(value: unknown): ParseResult<Order> {
  if (!isOrder(value)) {
    return { ok: false, message: "Order payload shape mismatch" };
  }

  return { ok: true, data: value };
}
```

이 패턴은 폼, 결제, 권한 처리에서 특히 효과가 컸습니다.

결제 상태는 `paid`, `cancelled`, `pending` 중 하나여야 했는데, 한 번은 `success`가 들어왔습니다. `any`였다면 성공 화면까지 그대로 갔을 코드입니다.

타입 가드가 있으면 선택지는 둘뿐입니다. 허용된 상태로 바꾸거나, 에러로 멈춥니다.

---

## 설정으로 막지 않으면 다시 들어옵니다

리뷰 코멘트만으로는 부족했습니다. 바쁜 날에는 `as any`가 다시 들어왔습니다.

그래서 규칙을 코드에 넣었습니다. 사람의 의지에만 맡기지 않았습니다.

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

ESLint도 함께 걸었습니다.

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

예외는 필요합니다. 외부 라이브러리 타입이 깨져 있는 경우가 있습니다.

그럴 때도 `any`를 바로 쓰지는 않았습니다. 한곳에 격리했습니다.

| 상황 | 나쁜 처리 | 나은 처리 |
|---|---|---|
| 외부 SDK 타입 없음 | 서비스 코드 전체 `any` | 어댑터 한 파일에 격리 |
| 마이그레이션 중 | `eslint-disable` 남발 | TODO와 만료일 기록 |
| 테스트 더미 | 실제 타입 무시 | `Partial<T>`와 빌더 사용 |

예외는 한 줄이어야 합니다. 퍼지기 시작하면 더 이상 규칙이 아닙니다.

---

## AI가 코드를 많이 쓸수록 `any` 금지는 더 중요합니다

AI 에이전트가 코드를 병렬로 고치면 생산량은 늘어납니다. 검증되지 않은 코드도 같이 늘어납니다.

특히 상태 관리와 API 연결부에서 `any`가 자주 생깁니다. Next.js 15와 Zustand를 붙일 때도 같은 문제가 납니다.

서버에서 받은 초기 상태를 `any`로 넘기면 클라이언트 스토어까지 타입 오염이 번집니다.

```ts
type UserState = {
  id: string;
  plan: "free" | "pro";
};

function createUserStore(initialState: UserState) {
  return createStore(() => initialState);
}
```

여기서 `initialState: any`로 바꾸면 편합니다. 대신 `plan: "enterprise"`도 통과합니다.

AI 네이티브 작업에서는 구조화 능력이 중요합니다. 프롬프트를 다듬기 전에 타입 경계를 먼저 정해야 합니다.

나는 AI가 만든 PR을 볼 때 세 가지를 먼저 봅니다.

| 리뷰 항목 | 확인 질문 |
|---|---|
| `any` 추가 | 정말 모르는 값인가, 귀찮아서 피한 값인가 |
| 외부 입력 | `unknown`으로 받고 좁혔는가 |
| 상태 전파 | 검증 전 데이터가 store까지 들어갔는가 |

인간 리뷰어의 역할은 코드를 대신 쓰는 것이 아닙니다. AI가 만든 결과물이 통과해도 되는지 판단하는 것입니다.

`any` 금지는 그 판단 기준을 기계가 먼저 적용하게 만듭니다.

---

## 정리: 컴파일 에러가 싼 버그입니다

`any`를 금지하면 처음에는 속도가 떨어집니다. 실제로 PR 하나가 20분 늦게 머문 적도 있었습니다.

하지만 그 20분은 브라우저 콘솔, QA 재현, 배포 롤백보다 쌉니다.

내 기준은 단순합니다.

- 외부에서 온 값은 `unknown`으로 받습니다.
- 도메인 내부로 들어오기 전에 검증합니다.
- 새 `any`는 ESLint에서 막습니다.
- 예외는 어댑터에 격리합니다.
- AI가 만든 코드일수록 타입 경계를 먼저 봅니다.

타입스크립트가 런타임 문제를 없애주지는 않습니다. 대신 런타임까지 가면 비싸지는 실수를 앞에서 멈춰줍니다.

요즘은 PR에서 `any`가 새로 추가됐는지 먼저 확인합니다.

---

이전: [런타임 검증은 왜 프론트엔드 책임인가](/stories/runtime-validation)

다음: [Next.js 15와 Zustand를 타입 안전하게 연결하기](/stories/nextjs15-zustand-type-safe)