import test from 'node:test'
import assert from 'node:assert/strict'
import {
  filterByTopic,
  generatePostIndex,
  getSeriesInfo,
  getSeriesNavigation,
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

test('tech series frontmatter is parsed and preserved in metadata and full posts', () => {
  const content = `---
title: "Hermes 운영 노트"
date: "2026-06-01"
category: "tech"
description: "Hermes operations note with explicit series metadata."
tags: ["hermes", "operations"]
series: "Hermes 운영 노트"
seriesOrder: 7
---

Body content`

  const posts = loadAllPosts([{ path: '/posts/tech-hermes-ops-07.md', content }])
  const index = generatePostIndex(posts)

  assert.equal(posts[0].series, 'Hermes 운영 노트')
  assert.equal(posts[0].seriesOrder, 7)
  assert.equal(index.posts[0].series, 'Hermes 운영 노트')
  assert.equal(index.posts[0].seriesOrder, 7)
  assert.equal(posts.map((post) => ({
    ...post,
    date: post.date.toISOString(),
  }))[0].seriesOrder, 7)
})

test('explicit series frontmatter is preferred over slug fallback', () => {
  assert.deepEqual(
    getSeriesInfo({
      slug: 'tech-vibe-99',
      series: 'Hermes 운영 노트',
      seriesOrder: 3,
    }),
    {
      name: 'Hermes 운영 노트',
      order: 3,
    }
  )
})

test('series navigation prefers explicit frontmatter over slug fallback', async () => {
  const postsIndex = {
    fullPosts: [
      {
        slug: 'tech-vibe-01',
        title: 'Hermes 1',
        series: 'Hermes 운영 노트',
        seriesOrder: 1,
      },
      {
        slug: 'tech-vibe-02',
        title: 'Hermes 2',
        series: 'Hermes 운영 노트',
        seriesOrder: 2,
      },
      {
        slug: 'tech-vibe-03',
        title: 'Different Vibe',
      },
    ],
  }
  global.fetch = async () => ({
    ok: true,
    json: async () => postsIndex,
  })

  try {
    const navigation = await getSeriesNavigation('tech-vibe-02')

    assert.equal(navigation.previous.slug, 'tech-vibe-01')
    assert.equal(navigation.next, null)
  } finally {
    delete global.fetch
  }
})
