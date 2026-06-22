import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

function writePost(postsDir, name, frontmatter, body = 'Body content') {
  const filePath = path.join(postsDir, name)
  fs.writeFileSync(filePath, `---\n${frontmatter}\n---\n\n${body}\n`)
  return filePath
}

function runValidator(postsDir) {
  return spawnSync(
    process.execPath,
    [path.resolve('scripts/validate-posts.js'), postsDir],
    { encoding: 'utf8' }
  )
}

test('post validator reports requested pre-publish violations', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'post-validation-'))

  writePost(
    dir,
    'bad.md',
    `title: "Bad"
date: "2026-06-01"
category: "invalid"
description: "short"
image: "/images/example.jpg"
tags: ["insight"]
draft: false
approved: true`,
    'TODO: finish this post'
  )

  const result = runValidator(dir)

  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /invalid category/)
  assert.match(result.stderr, /description is too short/)
  assert.match(result.stderr, /shorter than 150 characters/)
  assert.match(result.stderr, /imageAlt is required/)
  assert.match(result.stderr, /TODO placeholder/)
  assert.match(result.stderr, /missing #배포-승인/)
})

test('post validator accepts approved insight gate and draft insight briefs', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'post-validation-ok-'))

  writePost(
    dir,
    'approved.md',
    `title: "Approved"
date: "2026-06-01"
category: "insight"
description: "This approved insight description is intentionally long enough to satisfy the one hundred fifty character publication gate before a brief can enter the public post index safely."
tags: ["insight", "#배포-승인"]
image: "/images/example.jpg"
imageAlt: "Image alt text"
draft: false
approved: true`
  )
  writePost(
    dir,
    'draft.md',
    `title: "Draft"
date: "2026-06-01"
category: "insight"
description: "Draft brief intentionally waits for a final human approval."
tags: ["insight", "card-news", "vibe-coding"]
draft: true
approved: false`
  )

  const result = runValidator(dir)

  assert.equal(result.status, 0, result.stderr)
})

test('post validator accepts optional tech series fields', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'post-validation-series-'))

  writePost(
    dir,
    'tech-hermes.md',
    `title: "Hermes 운영 노트"
date: "2026-06-01"
category: "tech"
description: "Hermes operations note with explicit series metadata."
tags: ["hermes", "operations"]
draft: true
approved: false
series: "Hermes 운영 노트"
seriesOrder: 1`
  )

  const result = runValidator(dir)

  assert.equal(result.status, 0, result.stderr)
})
