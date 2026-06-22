import fs from 'fs'
import path from 'path'

const TEMPLATE_PATH = path.resolve('templates/card-news-insight.md')
const POSTS_DIR = path.resolve('posts')

function toTopicSlug(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function buildDraft(template, topic) {
  const title = `TODO: Vibe Coding 카드 브리프 - ${topic}`
  const date = new Date().toISOString().slice(0, 10)
  return template
    .replaceAll('TODO: 카드 브리프 제목', title)
    .replace('date: "YYYY-MM-DD"', `date: "${date}"`)
    .replace('tags: ["insight", "card-news"]', 'tags: ["insight", "card-news", "vibe-coding"]')
    .replace('`tags`에 `"#배포-승인"` 추가', 'approval tag is added manually')
}

function writeDraft(topic) {
  const topicSlug = toTopicSlug(topic)
  if (!topicSlug) {
    throw new Error('Topic is required')
  }

  const outputPath = path.join(POSTS_DIR, `insight-vibe-coding-${topicSlug}.md`)
  if (fs.existsSync(outputPath)) {
    throw new Error(`Draft already exists: ${outputPath}`)
  }

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8')
  fs.mkdirSync(POSTS_DIR, { recursive: true })
  fs.writeFileSync(outputPath, buildDraft(template, topicSlug))
  return outputPath
}

function main() {
  try {
    const outputPath = writeDraft(process.argv[2] || '')
    process.stdout.write(`Created ${outputPath}\n`)
  } catch (error) {
    process.stderr.write(`${error.message}\n`)
    process.exitCode = 1
  }
}

main()
