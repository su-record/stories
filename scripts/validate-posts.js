import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { VALID_CATEGORIES } from '../src/utils/categories.js'

const APPROVAL_TAG = '#배포-승인'
const DEFAULT_POSTS_DIR = path.resolve('posts')
const MIN_DESCRIPTION_LENGTH = 10
const MIN_APPROVED_INSIGHT_DESCRIPTION_LENGTH = 150

function scanMarkdownFiles(postsDir) {
  return fs.readdirSync(postsDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => path.join(postsDir, file))
}

function validatePost(filePath) {
  const parsed = matter(fs.readFileSync(filePath, 'utf8'))
  return [
    ...validateFrontmatter(parsed.data),
    ...validatePublishContent(parsed),
    ...validateInsightGate(parsed.data),
  ].map((message) => `${filePath}: ${message}`)
}

function validateFrontmatter(frontmatter) {
  const errors = []
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : []
  if (!VALID_CATEGORIES.includes(frontmatter.category)) {
    errors.push('invalid category')
  }
  if (hasShortDescription(frontmatter.description)) {
    errors.push('description is too short')
  }
  if (hasShortApprovedInsightDescription(frontmatter, tags)) {
    errors.push('approved insight description is shorter than 150 characters')
  }
  if (frontmatter.image && !frontmatter.imageAlt) {
    errors.push('imageAlt is required when image exists')
  }
  return errors
}

function hasShortDescription(description) {
  return typeof description !== 'string'
    || description.trim().length < MIN_DESCRIPTION_LENGTH
}

function hasShortApprovedInsightDescription(frontmatter, tags) {
  if (!isApprovedInsightPost(frontmatter, tags)) {
    return false
  }
  if (typeof frontmatter.description !== 'string') {
    return true
  }
  return frontmatter.description.trim().length < MIN_APPROVED_INSIGHT_DESCRIPTION_LENGTH
}

function validatePublishContent(parsed) {
  if (parsed.data.draft === true) {
    return []
  }

  const raw = `${JSON.stringify(parsed.data)}\n${parsed.content}`
  return /(^|\s)TODO:/.test(raw) ? ['TODO placeholder remains'] : []
}

function validateInsightGate(frontmatter) {
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : []
  if (!isInsightPost(frontmatter, tags) || frontmatter.draft === true) {
    return []
  }

  if (frontmatter.approved === true && tags.includes(APPROVAL_TAG)) {
    return []
  }
  return ['insight approval gate violation: missing #배포-승인']
}

function isInsightPost(frontmatter, tags) {
  return frontmatter.category === 'insight' || tags.includes('insight')
}

function isApprovedInsightPost(frontmatter, tags) {
  return isInsightPost(frontmatter, tags) && frontmatter.draft !== true
}

function validatePosts(postsDir) {
  if (!fs.existsSync(postsDir)) {
    throw new Error(`Posts directory not found: ${postsDir}`)
  }

  return scanMarkdownFiles(postsDir).flatMap(validatePost)
}

function main() {
  try {
    const errors = validatePosts(path.resolve(process.argv[2] || DEFAULT_POSTS_DIR))
    if (errors.length > 0) {
      process.stderr.write(`${errors.join('\n')}\n`)
      process.exitCode = 1
      return
    }
    process.stdout.write('Posts validation passed\n')
  } catch (error) {
    process.stderr.write(`${error.message}\n`)
    process.exitCode = 1
  }
}

main()
