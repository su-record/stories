---
title: "Cron으로 스스로 일하기"
date: "2026-07-20"
category: "tech"
description: "시작은 단순했습니다. 매일 오전 8시에 누르던 버튼 하나를 없앴습니다.  수동 버튼 하나가 하루를 갉아먹습니다 처음에는 일정 확인이 3분이면 끝난다고 생각했습니다. 아니었습니다. 캘린더를 열고, 할 일 목록을 보고, 어제 남긴 메모를 다시 읽었습니다. Slack이나 Telegr"
image: "/images/automating-tasks-with-cron/01.png"
imageAlt: "다섯 칸으로 시간 정하고 뒤에 명령 붙이기"
author: "Su Ham"
lang: "ko"
---

시작은 단순했습니다. 매일 오전 8시에 누르던 버튼 하나를 없앴습니다.

## 수동 버튼 하나가 하루를 갉아먹습니다

![다섯 칸으로 시간 정하고 뒤에 명령 붙이기](/images/automating-tasks-with-cron/01.png)
*다섯칸시간*


처음에는 일정 확인이 3분이면 끝난다고 생각했습니다. 아니었습니다.

캘린더를 열고, 할 일 목록을 보고, 어제 남긴 메모를 다시 읽었습니다. Slack이나 Telegram 알림까지 확인하면 금방 7분이 지났습니다.

평일 기준으로 주 5회입니다. 7분씩 5번이면 35분입니다. 한 달이면 약 2시간 20분입니다.

문제는 시간만이 아니었습니다. 매번 같은 순서로 같은 데이터를 보고 있었습니다. 굳이 사람이 할 일이 아니었습니다.

cron은 이런 반복에 잘 맞습니다. 정해진 시간에 명령이나 스크립트를 자동으로 실행합니다.

리눅스 서버가 켜져 있으면 cron은 매일, 매주, 매월 같은 일을 다시 실행합니다.

---

## Cron 문법은 다섯 칸이면 끝납니다

![터미널에서 되던 명령도 cron에서는 환경이 달라 실패할 수 있음](/images/automating-tasks-with-cron/02.png)
*환경이다름*


cron의 기본 형식은 짧습니다. 다섯 칸으로 시간을 정하고, 뒤에 실행할 명령을 붙입니다.

```cron
분 시 일 월 요일 실행할_명령
```

각 칸은 숫자와 별표로 표현합니다. 별표는 모든 값을 뜻합니다.

| 표현 | 의미 | 사용 예시 |
|---|---:|---|
| `0 8 * * *` | 매일 08:00 | 오전 브리핑 생성 |
| `*/10 * * * *` | 10분마다 | 서비스 상태 확인 |
| `0 9 * * 1-5` | 평일 09:00 | 업무 시작 알림 |
| `30 23 * * 0` | 일요일 23:30 | 주간 리포트 생성 |
| `0 1 1 * *` | 매월 1일 01:00 | 월간 정산 파일 생성 |

설정은 `crontab -e`로 엽니다. 저장하면 cron 데몬이 읽고 실행합니다.

```bash
crontab -e
crontab -l
```

처음부터 복잡한 자동화를 만들 필요는 없습니다. 한 줄이면 충분합니다.

```cron
0 8 * * 1-5 /home/su/bin/morning-brief.sh >> /home/su/logs/morning.log 2>&1
```

이 줄은 평일 오전 8시에 스크립트를 실행합니다. 결과와 에러는 같은 로그 파일에 남깁니다.

---

## 08:00 브리핑을 cron으로 돌렸습니다

![로그와 flock 잠금으로 중복 실행과 실종 실패 막기](/images/automating-tasks-with-cron/03.png)
*잠그고남김*


가장 먼저 만든 자동화는 오전 브리핑이었습니다. 입력은 캘린더, 할 일, 전날 메모였습니다.

출력은 하나였습니다. Telegram으로 오늘 볼 내용을 보내는 짧은 메시지였습니다.

```bash
#!/usr/bin/env bash
set -euo pipefail

BASE=/home/su/automation
OUT=$BASE/out/morning-$(date +%F).md

cd $BASE
python3 make_brief.py --calendar today --todo open > $OUT
curl -s -X POST https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage -d chat_id=$TELEGRAM_CHAT_ID --data-urlencode text@$OUT
```

cron에는 이렇게 등록했습니다.

```cron
0 8 * * 1-5 /usr/bin/flock -n /tmp/morning-brief.lock /home/su/automation/morning-brief.sh >> /home/su/logs/morning-brief.log 2>&1
```

여기서 중요한 부분은 `flock`입니다. 이전 작업이 끝나지 않았는데 다음 작업이 다시 뜨는 일을 막습니다.

자동화가 한 번만 실행될 때는 별문제가 없어 보입니다. 네트워크가 느려지면 달라집니다.

Telegram API 응답이 지연되고, 스크립트가 5분 넘게 잡힐 수 있습니다. 중복 실행이 생기면 같은 보고서를 두 번 보내게 됩니다.

그래서 cron 작업에는 세 가지를 같이 넣었습니다.

| 기준 | 이유 | 예시 |
|---|---|---|
| 로그 저장 | 실패 원인을 나중에 봅니다 | `>> job.log 2>&1` |
| 중복 방지 | 같은 작업이 겹치지 않습니다 | `flock -n lockfile` |
| 절대 경로 | cron의 환경 변수를 믿지 않습니다 | `/usr/bin/python3` |

이 정도만 넣어도 자동화는 장난감에서 도구가 됩니다.

---

## 운영에서 깨지는 지점은 정해져 있습니다

cron은 단순합니다. 실패도 단순한 곳에서 납니다.

가장 흔한 실수는 터미널에서 되던 명령이 cron에서는 안 되는 경우입니다. 환경이 다르기 때문입니다.

| 증상 | 원인 | 처리 |
|---|---|---|
| 명령을 못 찾음 | `PATH`가 다름 | 실행 파일 절대 경로 사용 |
| 날짜가 어긋남 | 서버 타임존 불일치 | `timedatectl`로 확인 |
| 로그가 없음 | 출력 리다이렉션 누락 | `2>&1`까지 기록 |
| 두 번 실행됨 | 이전 작업 미종료 | `flock`으로 잠금 |
| 알림이 안 옴 | 토큰 환경 변수 누락 | `.env`를 명시적으로 로드 |

cron에서 환경 변수를 쓰려면 명시적으로 읽는 편이 낫습니다.

```bash
set -a
. /home/su/automation/.env
set +a
```

서버 시간도 확인해야 합니다. 오전 8시 작업이 UTC 기준으로 돌면 한국 시간 오후 5시에 실행됩니다.

```bash
timedatectl
sudo timedatectl set-timezone Asia/Seoul
```

자동화의 품질은 성공했을 때보다 실패했을 때 드러납니다. 로그가 없으면 실패가 아니라 실종입니다.

---

## 에이전트 자동화의 바닥은 스케줄입니다

2026년 7월 18일 Moonshot AI는 Kimi K3를 공개했습니다. 2.8조 매개변수, 100만 토큰 컨텍스트를 내세웠습니다.

모델 크기는 계속 커집니다. 하지만 매일 오전 8시에 실행되지 않으면 업무는 줄지 않습니다.

Hermes Agent 같은 개인 AI 비서 실험도 결국 Telegram, 이메일, Slack, 로컬 파일, cron을 묶습니다.

AI가 내용을 만들고, cron이 시간을 잡습니다. 둘은 역할이 다릅니다.

예를 들어 매일 18시에 리서치를 실행하고 결과를 Telegram으로 보낼 수 있습니다.

```cron
0 18 * * * /usr/bin/flock -n /tmp/research.lock /home/su/agents/research-digest.sh >> /home/su/logs/research.log 2>&1
```

주기적 체크리스트도 같은 방식입니다. 특정 시점에 실행하고, 결과를 파일이나 Slack으로 보냅니다.

```cron
*/30 9-18 * * 1-5 /home/su/automation/check-open-tasks.sh >> /home/su/logs/tasks.log 2>&1
```

내 기준은 이렇습니다.

| 자동화 후보 | cron에 올릴 기준 |
|---|---|
| 매일 같은 시간에 확인함 | 바로 올립니다 |
| 사람이 판단하지 않아도 됨 | 바로 올립니다 |
| 실패해도 로그로 복구 가능함 | 올립니다 |
| 실행 시간이 매번 30분 넘게 흔들림 | 잠금과 알림을 먼저 넣습니다 |
| 돈이 결제되거나 삭제가 일어남 | 수동 승인 단계를 남깁니다 |

Cron은 똑똑하지 않습니다. 대신 같은 시간에 같은 일을 합니다.

반복 업무에는 그 정도의 성실함만으로도 꽤 도움이 됐습니다.

---

이전 편: [Shell Script로 반복 명령 묶기](/stories/shell-script-repeatable-work)

다음 편: [Webhook으로 외부 이벤트 받기](/stories/webhook-event-automation)