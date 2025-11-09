import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { loadAllPosts, generatePostIndex } from '../src/utils/postLoader.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const POSTS_DIR = path.join(__dirname, '../posts')
const OUTPUT_FILE = path.join(__dirname, '../public/posts-index.json')

/**
 * Scan posts directory for markdown files
 * @returns {Array<{path: string, content: string}>}
 */
function scanMarkdownFiles() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.warn(`Posts directory not found: ${POSTS_DIR}`)
    return []
  }

  const files = fs.readdirSync(POSTS_DIR)
  const markdownFiles = files
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const filePath = path.join(POSTS_DIR, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      return {
        path: `/posts/${file}`,
        content,
      }
    })

  return markdownFiles
}

/**
 * Main build script
 */
function main() {
  console.log('🔍 Scanning for markdown files...')
  const markdownFiles = scanMarkdownFiles()

  if (markdownFiles.length === 0) {
    console.warn('⚠️  No markdown files found. Creating empty index.')
    const emptyIndex = {
      posts: [],
      totalCount: 0,
      lastUpdated: new Date(),
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(emptyIndex, null, 2))
    console.log('✅ Empty posts-index.json created')
    return
  }

  console.log(`📝 Found ${markdownFiles.length} markdown file(s)`)

  try {
    console.log('⚙️  Loading and validating posts...')
    const posts = loadAllPosts(markdownFiles)

    console.log('📊 Generating post index...')
    const postIndex = generatePostIndex(posts)

    // Add full posts data for runtime loading (with content)
    postIndex.fullPosts = posts.map(post => ({
      ...post,
      date: post.date.toISOString()
    }))

    // Ensure public directory exists
    const publicDir = path.dirname(OUTPUT_FILE)
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    // Write posts-index.json
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(postIndex, null, 2))

    console.log(`✅ Successfully generated posts-index.json`)
    console.log(`   Total posts: ${postIndex.totalCount}`)
    console.log(`   Output: ${OUTPUT_FILE}`)
  } catch (error) {
    console.error('❌ Build failed:', error.message)
    process.exit(1)
  }
}

main()
