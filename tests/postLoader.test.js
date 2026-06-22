import test from 'node:test'
import assert from 'node:assert/strict'
import {
  filterByTopic,
  getSeriesInfo,
  loadAllPosts,
} from '../src/utils/postLoader.js'

function post(slug, tags = []) {
  return {
    slug,
    tags,
    title: slug,
    date: new Date('2026-06-01'),
    category: 'tech',
    description: 'Long enough description for test post filtering.',
  }
}

test('detects vibe-devlog and tech-vibe slugs as Vibe Coding series', () => {
  assert.deepEqual(getSeriesInfo('vibe-devlog-0030'), {
    name: 'vibe-coding',
    order: 30,
  })
  assert.deepEqual(getSeriesInfo('tech-vibe-02'), {
    name: 'vibe-coding',
    order: 2,
  })
})

test('topic vibe-coding includes tag matches and untagged Vibe series slugs', () => {
  const posts = [
    post('vibe-devlog-0030'),
    post('tech-vibe-02'),
    post('regular-vibe', ['vibe-coding']),
    post('fallingo-devlog-0001', ['vibe']),
  ]

  assert.deepEqual(
    filterByTopic(posts, 'vibe-coding').map((item) => item.slug),
    ['vibe-devlog-0030', 'tech-vibe-02', 'regular-vibe']
  )
})

test('loaded post metadata keeps Vibe Coding fallback discoverable', () => {
  const content = `---
title: "Vibe devlog"
date: "2026-06-01"
category: "dev-log"
description: "A focused Vibe Coding devlog entry for routing tests."
tags: ["vibe"]
---

Body content`

  const posts = loadAllPosts([{ path: '/posts/vibe-devlog-0030.md', content }])

  assert.equal(posts[0].series, 'vibe-coding')
})
