---
feature: about-metrics
stakes: production
status: approved
approvedAt: "2026-08-29"
---

# SPEC — About 지표 자동 갱신

## 문제

`src/components/About.jsx` 의 수치(LOC·커밋·라우트·모듈·다운로드)가 전부 하드코딩이다.
값이 낡는 것보다 나쁜 문제는 **집계 기준이 코드에 남지 않는다**는 것이다.
실제로 vibe LOC 이 68K → 63K 로 "줄어든" 사고가 났고, 원인은 코드 축소가 아니라
지난 집계가 빌드 산출물(`plugins/vibe/dist/*.d.ts`)을 포함했기 때문이었다.

## Done 의 정의

1. 모든 수치의 집계 규칙이 `scripts/collect-about-metrics.js` 에 코드로 고정된다.
2. `src/data/about-metrics.json` 이 단일 진실원이고, About.jsx 는 숫자를 하드코딩하지 않는다.
3. `npm run about:metrics` 한 번으로 로컬 레포 + npm 수치가 모두 갱신된다.
4. 워크스페이스에 레포가 없으면 그 항목만 건너뛰고 기존 JSON 값을 유지한다.
5. 주간 크론이 npm 다운로드 필드만 갱신한다 — 로컬 레포 기반 필드는 건드리지 않는다.

## 수용 기준

| # | 기준 | 검증 |
|---|---|---|
| AC-1 | 누적 다운로드는 게시일부터 오늘까지 전 구간을 합산한다 (point API 18개월 제한을 구간 분할로 우회) | `splitDownloadRanges` 단위 테스트 |
| AC-2 | 레포가 없으면 해당 키의 기존 값이 보존된다 | `mergeMetrics` 단위 테스트 |
| AC-3 | `--npm-only` 는 `repos` 를 절대 변경하지 않는다 | `mergeMetrics` 단위 테스트 |
| AC-4 | 표시 포맷(219K, 1,570+, 72K+)이 원시값에서 결정론적으로 나온다 | `src/utils/aboutMetrics.js` 단위 테스트 |
| AC-5 | `npm run build` 통과 · eslint 0 | 빌드 |

## 집계 규칙 (SSOT)

| 레포 | 지표 | 규칙 |
|---|---|---|
| tory | loc | `apps,services,packages` 하위 `.ts/.tsx`, `node_modules·dist·.expo` 제외 |
| tory | httpFunctions | `services/functions/src` 에서 `app.http('<name>'` 의 고유 name 수 |
| tory | domainModules | `services/functions/src/modules` 하위 디렉토리 수 |
| tory | migrations | `db/migrations/*.sql` 수 |
| tory | bicepModules / workflows / locales | `infra/bicep/modules/*.bicep` · `.github/workflows/*` · `apps/mobile/locales/*.json` |
| vibe | loc | `src,tests,scripts` 하위 `.ts/.tsx` (빌드 산출물 `plugins/` 제외 — 과거 오집계 지점) |
| vibe | skills / agents / languages / tests | `skills/*` 디렉토리 · `agents/**/*.md` · `languages/*.md` · `**/*.test.ts` |
| lgCms | loc / components / prismaModels | `apps,packages` `.ts/.tsx` · `packages/blocks/src/**/*.tsx` · `schema.prisma` 의 `^model` |
| fallingo | restOperations | **이 레포의** `public/fallingo-api/openapi.json` 오퍼레이션 수 — 카드가 링크하는 문서와 같은 값 |
| 공통 | commits / firstCommit / lastCommit / activeDays | `git rev-list --count HEAD` · `git log` |
| npm | totalDownloads | registry 의 `time.created` 부터 오늘까지 구간 분할 합산 |

## 범위 밖

- 브라우저 런타임 fetch — 이 페이지는 인쇄해 이력서로 나가므로 렌더 시점마다 숫자가 달라지면 안 된다.
- hi-ai 카드 수치 — 개발 중단된 레포라 새 기준으로 재측정하면 공개된 숫자만 흔들린다. npm 다운로드만 수집해 둔다.
