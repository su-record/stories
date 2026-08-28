#!/usr/bin/env node
/**
 * About 페이지 지표 수집기.
 *
 * About.jsx 의 수치는 이 레포 밖 — 그것도 로컬에만 있는 레포에서 나온다.
 * 그래서 CI 는 레포 기반 수치를 측정할 수 없고, 로컬에서 이 스크립트를 돌려
 * src/data/about-metrics.json 을 갱신한 뒤 커밋하는 것이 정본 경로다.
 *
 * 이 파일의 목적은 자동화보다 **집계 기준의 고정**이다. 규칙이 코드에 없으면
 * 다음에 잴 때 다른 자를 쓰게 되고, 숫자가 조용히 어긋난다.
 *
 * 사용법:
 *   npm run about:metrics              # 로컬 레포 + npm 전부 갱신
 *   npm run about:metrics -- --npm-only # npm 다운로드만 갱신 (CI 크론용)
 *
 * 워크스페이스 위치는 ABOUT_METRICS_WORKSPACE 로 덮어쓸 수 있다 (기본: 레포의 상위 디렉토리).
 */

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT = path.join(REPO_ROOT, 'src/data/about-metrics.json')
const WORKSPACE = process.env.ABOUT_METRICS_WORKSPACE || path.resolve(REPO_ROOT, '..')

const CODE_EXCLUDES = ['node_modules', 'dist', '.next', '.expo', '.dart_tool', 'build', 'coverage']
const NPM_PACKAGES = ['@su-record/vibe', '@su-record/hi-ai']

/** npm point API 가 받아 주는 최대 구간(18개월)보다 짧게 잡는다. */
const MAX_RANGE_DAYS = 500

// ---------------------------------------------------------------- 측정 프리미티브

function walkFiles(root, filter) {
  if (!fs.existsSync(root)) return []
  const entries = fs.readdirSync(root, { recursive: true, withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if (!entry.isFile()) continue
    const full = path.join(entry.parentPath ?? entry.path, entry.name)
    const rel = path.relative(root, full).split(path.sep)
    if (rel.some((segment) => CODE_EXCLUDES.includes(segment))) continue
    if (filter(full)) files.push(full)
  }
  return files
}

const byExt = (...exts) => (file) => exts.includes(path.extname(file))

/** `wc -l` 과 같은 정의 — 개행 문자 수. 다른 도구로 검산이 되도록 맞춘다. */
function countLines(roots, filter) {
  let total = 0
  for (const root of roots) {
    for (const file of walkFiles(root, filter)) {
      const lines = fs.readFileSync(file, 'utf8').split('\n')
      total += lines[lines.length - 1] === '' ? lines.length - 1 : lines.length
    }
  }
  return total
}

function countFiles(root, filter) {
  return walkFiles(root, filter).length
}

/** 하위 디렉토리를 세지 않는다 — tory 의 `_archived_v1` 처럼 보관본이 섞이는 곳에 쓴다. */
function countFilesShallow(root, filter) {
  if (!fs.existsSync(root)) return 0
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && filter(entry.name)).length
}

function countDirs(root) {
  if (!fs.existsSync(root)) return 0
  return fs.readdirSync(root, { withFileTypes: true }).filter((e) => e.isDirectory()).length
}

function uniqueMatches(roots, filter, pattern) {
  const found = new Set()
  for (const root of roots) {
    for (const file of walkFiles(root, filter)) {
      for (const match of fs.readFileSync(file, 'utf8').matchAll(pattern)) found.add(match[1])
    }
  }
  return found.size
}

function git(dir, args) {
  return execFileSync('git', args, { cwd: dir, encoding: 'utf8' }).trim()
}

function gitHistory(dir) {
  const commits = Number(git(dir, ['rev-list', '--count', 'HEAD']))
  const dates = git(dir, ['log', '--format=%ad', '--date=short']).split('\n')
  const lastCommit = dates[0]
  const firstCommit = dates[dates.length - 1]
  const span = Date.parse(lastCommit) - Date.parse(firstCommit)
  return { commits, firstCommit, lastCommit, activeDays: Math.round(span / 86400000) + 1 }
}

// ---------------------------------------------------------------- 레포별 집계 규칙

function collectTory(dir) {
  const functionsSrc = path.join(dir, 'services/functions/src')
  const codeRoots = ['apps', 'services', 'packages'].map((d) => path.join(dir, d))
  return {
    ...gitHistory(dir),
    loc: countLines(codeRoots, byExt('.ts', '.tsx')),
    httpFunctions: uniqueMatches([functionsSrc], byExt('.ts'), /app\.http\('([^']+)'/g),
    domainModules: countDirs(path.join(functionsSrc, 'modules')),
    migrations: countFilesShallow(path.join(dir, 'db/migrations'), byExt('.sql')),
    bicepModules: countFiles(path.join(dir, 'infra/bicep/modules'), byExt('.bicep')),
    workflows: countFiles(path.join(dir, '.github/workflows'), byExt('.yml', '.yaml')),
    locales: countFiles(path.join(dir, 'apps/mobile/locales'), byExt('.json')),
    workspaces: ['apps', 'services', 'packages'].reduce((n, d) => n + countDirs(path.join(dir, d)), 0)
  }
}

function collectVibe(dir) {
  // plugins/ 는 마켓플레이스 배포용 빌드 산출물이다. 과거 집계가 여기를 삼켜
  // LOC 이 8K 부풀었으므로 소스 디렉토리만 센다.
  const codeRoots = ['src', 'tests', 'scripts'].map((d) => path.join(dir, d))
  return {
    ...gitHistory(dir),
    version: JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).version,
    loc: countLines(codeRoots, byExt('.ts', '.tsx')),
    skills: countDirs(path.join(dir, 'skills')),
    agents: countFiles(path.join(dir, 'agents'), byExt('.md')),
    languages: countFiles(path.join(dir, 'languages'), byExt('.md')),
    tests: countFiles(path.join(dir, 'src'), (f) => f.endsWith('.test.ts')) +
      countFiles(path.join(dir, 'tests'), (f) => f.endsWith('.test.ts'))
  }
}

function collectLgCms(dir) {
  const schema = fs.readFileSync(path.join(dir, 'packages/db/prisma/schema.prisma'), 'utf8')
  return {
    ...gitHistory(dir),
    loc: countLines(['apps', 'packages'].map((d) => path.join(dir, d)), byExt('.ts', '.tsx')),
    components: countFiles(path.join(dir, 'packages/blocks/src'), byExt('.tsx')),
    prismaModels: (schema.match(/^model /gm) || []).length,
    workspaces: countDirs(path.join(dir, 'apps')) + countDirs(path.join(dir, 'packages')),
    locales: 4
  }
}

function collectFallingo(dir) {
  // REST 오퍼레이션 수는 로컬 레포가 아니라 카드가 링크하는 공개 문서에서 센다 —
  // 독자가 클릭해서 직접 셀 수 있는 값과 페이지의 숫자가 어긋나면 안 된다.
  const spec = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'public/fallingo-api/openapi.json'), 'utf8'))
  const methods = ['get', 'post', 'put', 'patch', 'delete']
  const operations = Object.values(spec.paths || {}).reduce(
    (n, ops) => n + Object.keys(ops).filter((m) => methods.includes(m)).length,
    0
  )
  return {
    ...gitHistory(dir),
    restOperations: operations,
    restPaths: Object.keys(spec.paths || {}).length,
    loc: countLines([path.join(dir, 'frontend'), path.join(dir, 'backend')], byExt('.dart', '.py'))
  }
}

const COLLECTORS = {
  tory: { dir: 'tory', collect: collectTory },
  vibe: { dir: 'vibe', collect: collectVibe },
  lgCms: { dir: 'lg_display_cms', collect: collectLgCms },
  fallingo: { dir: 'fallingo', collect: collectFallingo }
}

// ---------------------------------------------------------------- npm 다운로드

const toDay = (date) => date.toISOString().slice(0, 10)

/** npm 은 UTC 로 집계하지만, 생성 일자는 사람이 읽는 값이라 로컬 날짜로 적는다. */
const localDay = () => new Date().toLocaleDateString('en-CA')

/**
 * npm point API 는 한 번에 18개월까지만 받는다. 게시일부터 오늘까지를
 * MAX_RANGE_DAYS 이하 구간으로 잘라 돌려준다 — 패키지가 오래될수록 구간이 늘어난다.
 */
export function splitDownloadRanges(createdISO, endISO) {
  const ranges = []
  let cursor = new Date(createdISO.slice(0, 10))
  const end = new Date(endISO.slice(0, 10))
  while (cursor <= end) {
    const chunkEnd = new Date(cursor)
    chunkEnd.setUTCDate(chunkEnd.getUTCDate() + MAX_RANGE_DAYS)
    const stop = chunkEnd < end ? chunkEnd : end
    ranges.push(`${toDay(cursor)}:${toDay(stop)}`)
    cursor = new Date(stop)
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return ranges
}

async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} — ${url}`)
  return response.json()
}

async function collectNpm(pkg, today) {
  const encoded = pkg.replace('/', '%2F')
  const registry = await fetchJson(`https://registry.npmjs.org/${encoded}`)
  const ranges = splitDownloadRanges(registry.time.created, today)
  let totalDownloads = 0
  for (const range of ranges) {
    const point = await fetchJson(`https://api.npmjs.org/downloads/point/${range}/${pkg}`)
    totalDownloads += point.downloads
  }
  const lastMonth = await fetchJson(`https://api.npmjs.org/downloads/point/last-month/${pkg}`)
  return { totalDownloads, lastMonth: lastMonth.downloads, since: registry.time.created.slice(0, 10) }
}

// ---------------------------------------------------------------- 병합 · 실행

/**
 * 측정하지 못한 항목은 기존 값을 그대로 남긴다. 레포가 없는 머신에서 돌려도
 * 공개된 숫자가 사라지지 않아야 하고, --npm-only 는 repos 를 건드리면 안 된다.
 */
export function mergeMetrics(previous, next) {
  return {
    generatedAt: next.generatedAt ?? previous.generatedAt,
    npm: { ...previous.npm, ...next.npm },
    repos: { ...previous.repos, ...next.repos }
  }
}

function readPrevious() {
  if (!fs.existsSync(OUTPUT)) return { npm: {}, repos: {} }
  return JSON.parse(fs.readFileSync(OUTPUT, 'utf8'))
}

function collectRepos() {
  const repos = {}
  for (const [key, { dir, collect }] of Object.entries(COLLECTORS)) {
    const full = path.join(WORKSPACE, dir)
    if (!fs.existsSync(full)) {
      console.log(`  - ${key}: 레포 없음 (${full}) — 기존 값 유지`)
      continue
    }
    repos[key] = collect(full)
    console.log(`  + ${key}: ${JSON.stringify(repos[key])}`)
  }
  return repos
}

async function collectAllNpm(today) {
  const npm = {}
  for (const pkg of NPM_PACKAGES) {
    npm[pkg] = await collectNpm(pkg, today)
    console.log(`  + ${pkg}: ${npm[pkg].totalDownloads.toLocaleString()} 누적`)
  }
  return npm
}

async function main() {
  const npmOnly = process.argv.includes('--npm-only')
  const today = toDay(new Date())

  console.log(npmOnly ? 'npm 다운로드만 갱신합니다.' : `워크스페이스: ${WORKSPACE}`)
  const next = { generatedAt: localDay(), npm: await collectAllNpm(today) }
  if (!npmOnly) next.repos = collectRepos()

  const merged = mergeMetrics(readPrevious(), next)
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
  fs.writeFileSync(OUTPUT, `${JSON.stringify(merged, null, 2)}\n`)
  console.log(`\n${path.relative(REPO_ROOT, OUTPUT)} 갱신 완료 (${merged.generatedAt})`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message)
    process.exit(1)
  })
}
