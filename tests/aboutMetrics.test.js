import test from 'node:test'
import assert from 'node:assert/strict'
import { splitDownloadRanges, mergeMetrics } from '../scripts/collect-about-metrics.js'
import { comma, k, kFloor, floorTo } from '../src/utils/aboutMetrics.js'

function dayCount(range) {
  const [from, to] = range.split(':').map((d) => new Date(d))
  return Math.round((to - from) / 86400000) + 1
}

test('splitDownloadRanges: 짧은 기간은 한 구간으로 남긴다', () => {
  assert.deepEqual(
    splitDownloadRanges('2026-08-01', '2026-08-20'),
    ['2026-08-01:2026-08-20']
  )
})

test('splitDownloadRanges: npm point API 상한을 넘는 기간을 분할한다', () => {
  const ranges = splitDownloadRanges('2025-11-17', '2026-08-29')
  assert.ok(ranges.length >= 1)
  for (const range of ranges) assert.ok(dayCount(range) <= 501, range)
})

test('splitDownloadRanges: 분할 구간이 겹치지도 비지도 않는다', () => {
  const ranges = splitDownloadRanges('2020-01-01', '2026-08-29')
  assert.ok(ranges.length > 1)
  assert.equal(ranges[0].split(':')[0], '2020-01-01')
  assert.equal(ranges[ranges.length - 1].split(':')[1], '2026-08-29')
  for (let i = 1; i < ranges.length; i += 1) {
    const prevEnd = new Date(ranges[i - 1].split(':')[1])
    const start = new Date(ranges[i].split(':')[0])
    assert.equal(start - prevEnd, 86400000, `${ranges[i - 1]} → ${ranges[i]}`)
  }
})

test('mergeMetrics: 이번에 측정하지 못한 레포는 이전 값을 유지한다', () => {
  const previous = { generatedAt: '2026-01-01', npm: {}, repos: { tory: { loc: 10 }, vibe: { loc: 20 } } }
  const next = { generatedAt: '2026-08-29', npm: {}, repos: { vibe: { loc: 25 } } }
  const merged = mergeMetrics(previous, next)
  assert.equal(merged.repos.tory.loc, 10)
  assert.equal(merged.repos.vibe.loc, 25)
})

test('mergeMetrics: npm 전용 실행은 repos 를 건드리지 않는다', () => {
  const previous = {
    generatedAt: '2026-01-01',
    npm: { '@su-record/vibe': { totalDownloads: 1 } },
    repos: { tory: { loc: 10 } }
  }
  const next = { generatedAt: '2026-08-29', npm: { '@su-record/vibe': { totalDownloads: 2 } } }
  const merged = mergeMetrics(previous, next)
  assert.deepEqual(merged.repos, previous.repos)
  assert.equal(merged.npm['@su-record/vibe'].totalDownloads, 2)
  assert.equal(merged.generatedAt, '2026-08-29')
})

test('포맷터: 표기가 결정론적이다', () => {
  assert.equal(comma(218604), '218,604')
  assert.equal(k(218604), '219K')
  assert.equal(k(63213), '63K')
  assert.equal(kFloor(72137), '72K+')
  assert.equal(floorTo(1574, 10), '1,570+')
  assert.equal(floorTo(42093, 1000), '42,000+')
})
