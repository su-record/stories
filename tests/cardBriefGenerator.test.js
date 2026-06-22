import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

function makeTempRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'card-brief-'))
  fs.mkdirSync(path.join(dir, 'posts'))
  fs.mkdirSync(path.join(dir, 'templates'))
  fs.copyFileSync(
    path.resolve('templates/card-news-insight.md'),
    path.join(dir, 'templates/card-news-insight.md')
  )
  return dir
}

test('generates Vibe Coding insight card brief drafts without approval tag', () => {
  const cwd = makeTempRepo()
  const result = spawnSync(
    process.execPath,
    [path.resolve('scripts/create-card-brief.js'), 'agent-loop'],
    { cwd, encoding: 'utf8' }
  )

  assert.equal(result.status, 0, result.stderr)

  const outputPath = path.join(cwd, 'posts/insight-vibe-coding-agent-loop.md')
  const output = fs.readFileSync(outputPath, 'utf8')

  assert.match(output, /draft: true/)
  assert.match(output, /approved: false/)
  assert.match(output, /date: "\d{4}-\d{2}-\d{2}"/)
  assert.match(output, /tags: \["insight", "card-news", "vibe-coding"\]/)
  assert.doesNotMatch(output, /"#배포-승인"/)

  const validation = spawnSync(
    process.execPath,
    [path.resolve('scripts/validate-posts.js'), path.join(cwd, 'posts')],
    { cwd, encoding: 'utf8' }
  )

  assert.equal(validation.status, 0, validation.stderr)
})
