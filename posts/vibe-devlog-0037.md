---
title: "vibe 개발일지 #37 - Codex Proxy의 진화: 수동 설정에서 자동화로 (20개 커밋)"
date: "2026-04-11"
category: "dev-log"
description: "Codex Proxy의 API 전환 및 모델 매핑 자동화로 사용자 경험 고도화"
tags: ["vibe", "개발일지", "Codex", "AI-Harness"]
author: "Su"
lang: "ko"
---

# vibe 개발일지 #37 - Codex Proxy의 진화: 수동 설정에서 자동화로 (20개 커밋)

**작업 기간**: 2026-04-11

안녕하세요, vibe를 개발하고 있는 Su입니다. 

vibe는 "Easy vibe coding + Minimum quality guaranteed"를 지향하는 AI 코딩 하네스 도구입니다. 에이전트가 모델(뇌)이라면, vibe는 그 뇌가 올바른 도구와 규칙을 가지고 일을 할 수 있게 돕는 하네스(장구류) 역할을 하죠.

오늘은 하루 동안 무려 20개의 커밋을 몰아치며 진행했던, 특히 **Codex Proxy 시스템의 대대적인 개편** 과정을 공유하려 합니다.

## 📝 이번 기간 작업 내용

이번 작업은 주로 `vibe`가 Claude Code나 Codex CLI와 연동될 때 그 사이를 이어주는 **Codex Proxy**의 안정성과 사용성을 높이는 데 집중되었습니다.

### 1. Codex Proxy 엔진 고도화 및 자동화
가장 큰 변화는 사용자가 일일이 설정해야 했던 번거로움을 제거한 것입니다. 이제 `vibe`는 시스템의 상태를 스스로 감지합니다.
*   **API 전환**: 기존 ChatGPT Pro 방식에서 Codex Responses API로 전환하여 응답성을 개선했습니다.
*   **설정 자동화**: `setup` 과정에서 인증 정보나 모델을 수동으로 선택하던 로직을 자동 감지로 변경했습니다.
*   **권한 스킵**: `--dangerously-skip-permissions`를 기본 적용하여 개발 흐름이 끊기지 않게 했습니다.
*   **주요 커밋**: `feat(codex-proxy): ChatGPT Pro → Codex Responses API 전환`, `refactor(codex-proxy): setup 자동 감지로 전환`

### 2. 모델 슬롯 매핑 최적화
다양한 모델들을 적재적소에 배치하여 하네스의 효율을 극대화했습니다.
*   **슬롯 매핑**: Haiku 모델 요청을 `codex-spark`로 자동 매핑하여 가벼운 작업의 처리 속도를 높였습니다.
*   **최신성 유지**: `models_cache.json`에서 최신 모델 목록을 조회해 동적으로 선택하도록 구현했습니다.
*   **주요 커밋**: `fix(codex-proxy): 모델 슬롯 매핑 최적화 — Haiku에 codex-spark 배치`, `feat(codex-proxy): 기본 모델 자동 선택`

### 3. 인증 시스템 및 안정성 보강
예외 케이스에서도 `vibe`가 죽지 않고 동작하도록 방어 로직을 강화했습니다.
*   **JWT 폴백**: Codex CLI의 `auth.json`에 `expires_at` 필드가 없는 경우, JWT의 `exp` 클레임을 직접 파싱해 만료 여부를 확인합니다.
*   **타임아웃 추가**: 네트워크 지연 시 무한 대기를 방지하기 위해 API 타임아웃을 명시적으로 설정했습니다.
*   **주요 커밋**: `fix(gpt-auth): expires_at 없는 Codex CLI auth.json에서 JWT exp claim 폴백`, `fix(codex-proxy): API 타임아웃 추가`

### 4. 문서화 및 DX(Developer Experience) 개선
사용자가 새로운 기능을 바로 알 수 있도록 README와 안내 메시지를 다듬었습니다.
*   **문서 업데이트**: README에 Codex Proxy 섹션을 추가하고 모델 슬롯 매핑 테이블을 최신화(EN/KO)했습니다.
*   **안내 개선**: 셸 등록 후 다음 단계를 직관적으로 알 수 있도록 메시지를 개선했습니다.
*   **주요 커밋**: `docs: README Codex Proxy 섹션 추가 (EN/KO)`, `fix(codex-proxy): 셸 등록 후 안내 메시지 개선`

---

## 💡 작업 하이라이트

### "생각하지 않아도 되는 프록시" (Zero-Config Setup)
이전 버전까지는 `vibe codex setup`을 실행하면 "어떤 모델을 쓸 것인가?", "인증 토큰은 무엇인가?" 등 여러 질문에 답해야 했습니다. 하지만 10년 차 개발자로서 제가 생각하는 좋은 도구는 **'알아서 잘 딱 깔끔하고 센스 있게'** 동작하는 것입니다.

**Before**:
- 사용자가 직접 사용 가능한 모델 목록 확인 후 선택
- 인증 토큰 만료 시 수동 갱신 확인 필요
- 셸 등록 후 수동으로 설정값 입력

**After**:
- `models_cache.json` 기반 가용 모델 자동 매핑
- JWT 파싱을 통한 지능적 인증 상태 관리
- `vibe-codex` alias를 통한 원터치 실행

### 하네스의 철학: Haiku → codex-spark 매핑
vibe는 단순한 프록시가 아닙니다. "Minimum quality guaranteed"를 위해 모델의 특성에 맞는 하네스를 채워주는 것이 핵심입니다. 가벼운 문법 교정이나 단순 작업(Haiku급)은 그에 최적화된 `codex-spark` 슬롯으로 연결되도록 매핑 로직을 최적화했습니다. 이를 통해 비용은 낮추고 속도는 올리는 하네싱에 성공했습니다.

---

## 📊 개발 현황

*   **버전 변화**: `v2.9.7` → `v2.9.13` (단 하루 만에 7번의 마이너 업데이트)
*   **주요 수치**: 
    *   **자동화율**: Proxy 설정 단계 5단계 → 1단계로 단축
    *   **호환성**: Codex CLI 최신 스펙 및 구형 auth.json 동시 지원
    *   **문서**: 한/영 README 모델 매핑 테이블 100% 동기화

하루 동안 20번의 커밋을 하면서 깨달은 점은, **"개발자의 귀찮음은 사용자에게는 장벽이 된다"**는 것이었습니다. 내가 설정하기 귀찮다면 사용자도 마찬가지일 겁니다. 오늘 작업으로 vibe의 설치 문턱이 한 뼘 더 낮아진 것 같아 뿌듯하네요.

이제 `/vibe.spec`만 작성하세요. 실행(`run`)은 vibe가 가장 최적의 모델과 하네스를 통해 끝내(`Done`) 드릴 테니까요.

그럼, 다음 개발일지에서 만나요! 
Happy Vibe Coding! 🚀🌱