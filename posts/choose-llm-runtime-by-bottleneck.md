---
title: "Ollama·llama.cpp·vLLM, 이름 대신 병목으로 고르는 기준"
date: "2026-07-29"
category: "tech"
description: "Ollama 다음 선택은 속도 순위가 아니라 병목에서 결정됩니다. 로컬 실행 편의, GGUF 제어, 다중 사용자 처리량을 같은 HTTP 요청과 유효한 컨텍스트 조건으로 비교합니다."
image: "/images/choose-llm-runtime-by-bottleneck/01.png"
imageAlt: "세 도구는 서로 다른 문제 층위를 해결한다"
author: "Su Ham"
lang: "ko"
---

Ollama 다음에 무엇을 써야 할까요? 답은 더 빠르다고 알려진 엔진이 아니라, 지금 막힌 지점에 있습니다. 모델 설치와 반복 실행이 번거롭다면 Ollama가 여전히 좋은 답입니다. GGUF와 하드웨어 설정을 직접 다뤄야 한다면 llama.cpp, 여러 사용자의 요청을 한 GPU 서버에서 처리해야 한다면 vLLM을 검토할 차례입니다.

개인용 맥북의 채팅과 20명이 호출하는 사내 API는 같은 순위표로 고를 수 없습니다. 이 글은 세 도구를 승자 한 명으로 줄이지 않고, 메모리·모델 형식·동시성·운영 비용이라는 병목 기준으로 비교합니다. 기능은 2026년 7월 29일 확인한 공식 문서를 기준으로 했습니다.

## 세 도구는 같은 문제를 풀지 않습니다

![세 도구는 서로 다른 문제 층위를 해결한다](/images/choose-llm-runtime-by-bottleneck/01.png)
*세 도구, 세 역할*

Ollama는 모델을 내려받고 로컬에서 반복 실행하는 경험을 묶은 도구입니다. `ollama run`은 사람이 대화하는 CLI이고, 서버 벤치마크에는 백그라운드 Ollama 서비스의 HTTP API를 사용해야 합니다. Ollama는 OpenAI 호환 `/v1/chat/completions`도 제공합니다.

llama.cpp는 GGUF 모델을 CPU와 여러 GPU 백엔드에서 실행하는 C/C++ 추론 구현입니다. 세밀한 양자화와 오프로딩 제어가 강점이며, `llama-server`는 OpenAI 호환 채팅 API와 병렬 디코딩·continuous batching을 지원합니다. 따라서 llama.cpp를 무조건 단일 요청용이라고 부르는 것도 정확하지 않습니다.

vLLM은 처리량 중심의 GPU 서빙 엔진입니다. OpenAI 호환 HTTP 서버, PagedAttention, continuous batching을 제공하므로 동시 요청이 늘어날 때 우선 평가할 후보입니다. 다만 특정 영상에서 나온 ‘9배’는 그 모델·양자화·하드웨어·요청 조건의 결과이지 보편적인 배속이 아닙니다.

| 기준 | Ollama | llama.cpp | vLLM |
|---|---|---|---|
| 먼저 해결하는 문제 | 쉬운 모델 관리와 로컬 실행 | GGUF·양자화·하드웨어 제어 | GPU 서버의 동시 요청 처리 |
| 대표 아티팩트 | Ollama 모델·가져온 GGUF | GGUF | Hugging Face 계열 체크포인트 |
| 잘 맞는 환경 | 개인 PC·개발 워크스테이션 | CPU·소비자 GPU·Apple Silicon | 주로 Linux GPU 서버 |
| 서버 진입점 | 실행 중인 Ollama 서비스 | `llama-server` | `vllm serve` |
| 공통 비교 API | `/v1/chat/completions` | `/v1/chat/completions` | `/v1/chat/completions` |
| 선택 신호 | 설치·업데이트 비용 | 메모리 적합성과 조정 범위 | 동시성에서의 p95와 처리량 |

## 메모리와 아티팩트로 먼저 거릅니다

![메모리와 모델 형식으로 거른 뒤 실제 동시성으로 선택한다](/images/choose-llm-runtime-by-bottleneck/02.png)
*먼저 거르고 부하*

8B 모델의 4비트 가중치는 단순 계산으로 약 4GB지만, 실제 실행에는 메타데이터·런타임 버퍼·KV 캐시가 더 필요합니다. 70B의 4비트 가중치는 약 35GB이므로 32GB 통합 메모리 장비에는 가중치만으로도 들어가지 않습니다. 엔진 교체가 이 물리 한계를 없애지는 않습니다.

다음은 아티팩트입니다. 이미 검증된 GGUF가 있거나 Apple Silicon에서 실행한다면 Ollama와 llama.cpp가 자연스럽습니다. vLLM과 공정하게 비교하려면 같은 모델 계열과 리비전을 고정하되, 엔진마다 지원되는 양자화 형식이 다를 수 있음을 결과에 명시해야 합니다. 서로 다른 양자화를 썼다면 ‘동일 모델 엔진 비교’가 아니라 ‘배포 조합 비교’입니다.

마지막은 요청 구조입니다. 한 사람이 순차적으로 질문한다면 배칭의 이익은 제한적일 수 있습니다. 반대로 동시 요청이 16개이고 SLA가 있다면 단일 요청의 초당 토큰보다 p95 첫 토큰 지연, 총 처리량, 오류율이 중요합니다.

| 상황 | 먼저 검증할 후보 | 탈락 또는 전환 기준 |
|---|---|---|
| 처음 로컬 LLM을 쓰는 개인 | Ollama | 모델 옵션·메모리 제어가 부족함 |
| Apple Silicon·CPU·GGUF 중심 | llama.cpp, Ollama | 필요한 모델 형식이나 기능을 지원하지 않음 |
| 양자화·GPU 오프로딩을 직접 조절 | llama.cpp | 운영 자동화 비용이 이득보다 커짐 |
| 소비자 GPU 한 장의 개인 API | Ollama, llama.cpp | 실제 동시성에서 p95·처리량 목표 실패 |
| 여러 사용자가 쓰는 GPU API | vLLM | 지원 모델·VRAM·지연 목표를 충족하지 못함 |
| 다중 GPU와 처리량 확장이 필요 | vLLM | 배포 복잡도와 비용이 SLA 이득보다 큼 |

## 세 서버에 같은 HTTP 요청을 보냅니다

![동일 조건에서 평균보다 p95 지연과 오류를 측정한다](/images/choose-llm-runtime-by-bottleneck/03.png)
*꼬리지연까지 측정*

먼저 엔진 버전, 모델 ID와 리비전, 양자화, GPU·드라이버를 기록합니다. 모델 이름만 같고 양자화나 채팅 템플릿이 다르면 결과가 달라집니다.

```bash
ollama --version
git -C llama.cpp rev-parse HEAD
python -c 'import vllm; print(vllm.__version__)'
nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv
```

컨텍스트는 입력과 최대 출력의 합보다 커야 합니다. 8,192 컨텍스트 비교라면 예를 들어 512+128, 4,096+256, 7,680+256 토큰처럼 모든 작업을 한도 안에 둡니다. 16,384토큰 입력의 긴 요약이 실제 요구사항이라면 세 서버 모두 16,384보다 큰 동일 컨텍스트로 다시 띄우고, 모델 자체의 지원 한도도 확인해야 합니다.

Ollama의 OpenAI 호환 API에서는 요청마다 컨텍스트 크기를 지정할 수 없으므로 `Modelfile`의 `PARAMETER num_ctx`로 벤치마크용 모델을 먼저 만듭니다.

```text
FROM MODEL_NAME
PARAMETER num_ctx 8192
```

```bash
ollama create bench-model -f ./Modelfile
llama-server -m ./model.gguf -c 8192 --alias bench-model --host 127.0.0.1 --port 8080
vllm serve MODEL_ID --served-model-name bench-model --max-model-len 8192 --generation-config vllm --port 8000
```

Ollama 서비스는 기본 주소 `http://127.0.0.1:11434`에서 실행 중이어야 합니다. 이제 동일한 OpenAI 호환 요청을 세 주소에 보냅니다. `ollama run`은 이 부하 테스트에 사용하지 않습니다.

```bash
for base in http://127.0.0.1:11434/v1 http://127.0.0.1:8080/v1 http://127.0.0.1:8000/v1; do
  curl -sS "$base/chat/completions" \
    -H 'Content-Type: application/json' \
    -d '{"model":"bench-model","messages":[{"role":"user","content":"PROMPT"}],"temperature":0,"max_tokens":128,"stream":true}' >/dev/null
done
```

실제 측정은 셸 반복문이 아니라 동시성과 스트리밍 타임스탬프를 기록하는 부하 도구로 수행합니다. 짧은 채팅·문서 질의·한도 내 긴 요약 각각에 동시성 1·4·16을 적용하고, 워밍업과 본 측정 횟수를 미리 고정합니다. vLLM 전용 `vllm bench serve`를 쓸 수 있지만, 세 엔진 비교에서는 같은 클라이언트·데이터셋·요청 속도를 유지해야 합니다.

| 지표 | 무엇을 드러내나 | 예시 통과선 |
|---|---|---|
| p95 TTFT | 첫 토큰까지의 꼬리 지연 | 내부 SLA에 맞춤 |
| p95 ITL | 스트리밍 중 토큰 간 지연 | 대화 체감 기준에 맞춤 |
| 출력 토큰/초 | 전체 서버 처리량 | 목표 피크 이상 |
| 오류율 | OOM·429·타임아웃 | 허용 예산 이하 |
| 최대 메모리 | 헤드룸과 OOM 위험 | 장비별 예산 이하 |
| 콜드 스타트 | 재시작 후 복구 시간 | 운영 목표 이하 |

통과선은 보편적인 숫자가 아니라 제품 요구사항이어야 합니다. 온도, 최대 출력, 스트리밍, 채팅 템플릿, 프롬프트 토큰 수를 고정하고 응답 품질도 함께 평가합니다. 빠르지만 품질 기준을 통과하지 못한 양자화는 후보에서 제외합니다.

## 환경별 결론과 최종 결정 기준

M2 Pro 32GB에서 한 사람이 7B 또는 14B GGUF를 오프라인으로 쓴다면 Ollama와 llama.cpp부터 비교합니다. 설치·모델 관리·앱 연동의 반복 비용을 줄이는 것이 병목이면 Ollama를 유지합니다. GPU 레이어, 양자화, 컨텍스트와 메모리 사용을 직접 조절해야 한다면 llama.cpp로 내려갑니다.

RTX 4090 24GB 한 장으로 개인용 코딩 도구를 만든다면 vLLM이 자동으로 정답은 아닙니다. 동시성이 1에 가깝다면 세 후보의 TTFT, 생성 속도, VRAM 헤드룸을 같은 요청으로 재고 가장 단순하게 목표를 통과하는 구성을 택합니다. 팀원이 늘어 대기열이 생기거나 동시성에서 p95가 무너지면 그때 vLLM을 우선 검증합니다.

20명이 호출하는 사내 API처럼 피크 동시성과 SLA가 있다면 vLLM부터 부하 테스트합니다. 다만 모델 지원, 필요한 양자화, 운영 환경이 맞지 않으면 llama-server도 같은 API 조건에서 비교합니다. ‘vLLM이 빠르다’는 명제가 아니라 ‘우리 피크 부하에서 목표 처리량과 p95를 가장 낮은 운영 비용으로 통과한다’가 결정 근거입니다.

최종 결정은 네 단계면 충분합니다.

1. 모델 품질과 라이선스를 먼저 통과시킵니다.
2. 모델 아티팩트와 메모리 한도로 실행 불가능한 후보를 제외합니다.
3. 실제 프롬프트와 피크 동시성으로 p95·처리량·오류율을 측정합니다.
4. 설치, 업데이트, 관측, 장애 복구까지 포함한 운영 비용이 가장 낮은 후보를 선택합니다.

따라서 Ollama 다음은 정해진 승급 코스가 아닙니다. 편의가 병목이면 Ollama에 남고, 로컬 제어가 병목이면 llama.cpp로, 동시 요청 처리가 병목이면 vLLM으로 갑니다. 엔진 이름보다 병목이 먼저입니다.

## 확인한 공식 문서

- [Ollama OpenAI 호환 API와 컨텍스트 설정](https://docs.ollama.com/api/openai-compatibility)
- [llama.cpp HTTP 서버와 OpenAI 호환 엔드포인트](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md)
- [vLLM OpenAI 호환 서버](https://docs.vllm.ai/en/latest/serving/online_serving/openai_compatible_server/)
- [vLLM 온라인 서빙 벤치마크](https://docs.vllm.ai/en/latest/api/vllm/benchmarks/serve/)