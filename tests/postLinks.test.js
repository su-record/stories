import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizePostHref } from '../src/utils/postLinks.js'

test('normalizes markdown post filenames to router post paths', () => {
  assert.equal(
    normalizePostHref('tech-hermes-operations-02-profiles.md'),
    '/posts/tech-hermes-operations-02-profiles'
  )
  assert.equal(
    normalizePostHref('./tech-hermes-operations-03-automation.md'),
    '/posts/tech-hermes-operations-03-automation'
  )
  assert.equal(
    normalizePostHref('/stories/posts/oracle-hermes-guide.md'),
    '/posts/oracle-hermes-guide'
  )
})

test('preserves post anchors while normalizing markdown links', () => {
  assert.equal(
    normalizePostHref('tech-vibe-01.md#github'),
    '/posts/tech-vibe-01#github'
  )
})

test('leaves external and non-post links untouched', () => {
  assert.equal(normalizePostHref('https://github.com/su-record/stories'), null)
  assert.equal(normalizePostHref('#section'), null)
  assert.equal(normalizePostHref('/images/blog/card.png'), null)
})
