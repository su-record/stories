import { createPostEntity, createPostMetadata } from './markdown.js'

/**
 * Load all posts from markdown files (build-time only)
 * This function is used by the build script to generate posts-index.json
 * @param {Array<{path: string, content: string}>} markdownFiles - Array of markdown files
 * @returns {Array<object>} Array of Post entities
 */
export function loadAllPosts(markdownFiles) {
  const posts = []
  const slugs = new Set()

  for (const file of markdownFiles) {
    try {
      const post = createPostEntity(file.content, file.path)

      // Check for duplicate slugs
      if (slugs.has(post.slug)) {
        throw new Error(`Duplicate slug "${post.slug}" found at ${file.path}`)
      }
      slugs.add(post.slug)

      posts.push(post)
    } catch (error) {
      console.error(`Error loading post from ${file.path}:`, error.message)
      throw error // Fail build on invalid posts
    }
  }

  return posts
}

/**
 * Generate PostIndex from posts
 * @param {Array<object>} posts - Array of Post entities
 * @returns {object} PostIndex entity
 */
export function generatePostIndex(posts) {
  // Sort by date descending (newest first)
  const sortedPosts = [...posts].sort((a, b) => b.date - a.date)

  // Convert to PostMetadata (remove heavy content field)
  const postMetadata = sortedPosts.map(createPostMetadata)

  return {
    posts: postMetadata,
    totalCount: postMetadata.length,
    lastUpdated: new Date(),
  }
}

/**
 * Load posts-index.json from public directory (runtime)
 * @returns {Promise<object>} PostIndex entity
 */
export async function loadPostIndex() {
  // Add build timestamp for cache busting
  const buildTime = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : Date.now()
  const response = await fetch(`/stories/posts-index.json?v=${buildTime}`)
  if (!response.ok) {
    throw new Error('Failed to load posts index')
  }
  const data = await response.json()

  // Convert date strings back to Date objects
  data.posts = data.posts.map((post) => ({
    ...post,
    date: new Date(post.date),
  }))
  data.lastUpdated = new Date(data.lastUpdated)

  return data
}

/**
 * Load a single post by slug (runtime)
 * @param {string} slug - Post slug
 * @returns {Promise<object>} Post entity
 */
export async function loadPost(slug) {
  // Load from pre-built index instead of parsing markdown at runtime
  // Add build timestamp for cache busting
  const buildTime = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : Date.now()
  const response = await fetch(`/stories/posts-index.json?v=${buildTime}`)
  if (!response.ok) {
    throw new Error('Failed to load posts index')
  }
  const data = await response.json()

  const post = data.fullPosts?.find(p => p.slug === slug)
  if (!post) {
    throw new Error(`Post not found: ${slug}`)
  }

  // Convert date string back to Date object
  return {
    ...post,
    date: new Date(post.date)
  }
}

/**
 * Filter posts by category
 * @param {Array<object>} posts - Array of PostMetadata
 * @param {string} category - Category to filter by
 * @returns {Array<object>} Filtered posts
 */
export function filterByCategory(posts, category) {
  return posts.filter((post) => post.category === category)
}

/**
 * Filter posts by tag
 * @param {Array<object>} posts - Array of PostMetadata
 * @param {string} tag - Tag to filter by
 * @returns {Array<object>} Filtered posts
 */
export function filterByTag(posts, tag) {
  return posts.filter((post) => post.tags.includes(tag))
}

/**
 * Search posts by title
 * @param {Array<object>} posts - Array of PostMetadata
 * @param {string} query - Search query
 * @returns {Array<object>} Matching posts
 */
export function searchPosts(posts, query) {
  const lowerQuery = query.toLowerCase()
  return posts.filter((post) =>
    post.title.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Detect series info from slug
 * @param {string} slug - Post slug
 * @returns {object|null} Series info {name, order} or null
 */
function detectSeries(slug) {
  // AI methodology series: 01-ai-*, 02-ai-*, etc.
  const aiMethodMatch = slug.match(/^(\d+)-ai-/)
  if (aiMethodMatch) {
    return {
      name: 'ai-methodology',
      order: parseInt(aiMethodMatch[1], 10)
    }
  }

  // Fallingo devlog series: fallingo-devlog-0001, fallingo-devlog-0002, etc.
  const devlogMatch = slug.match(/^fallingo-devlog-(\d+)/)
  if (devlogMatch) {
    return {
      name: 'fallingo-devlog',
      order: parseInt(devlogMatch[1], 10)
    }
  }

  // Hi-AI series: tech-hi-ai-* or tech-01-hi-ai-*
  if (slug.includes('hi-ai')) {
    // Extract version or order
    const versionMatch = slug.match(/v(\d+)\.(\d+)\.(\d+)/)
    if (versionMatch) {
      // Convert version to order: v1.0.4 -> 1, v1.1.0 -> 2, v1.2.0 -> 3
      const major = parseInt(versionMatch[1], 10)
      const minor = parseInt(versionMatch[2], 10)
      const patch = parseInt(versionMatch[3], 10)
      return {
        name: 'hi-ai',
        order: minor > 0 ? minor + 1 : 1 // v1.0.x -> 1, v1.1.0 -> 2, v1.2.0 -> 3
      }
    }
    // tech-01-hi-ai-mcp
    const numberMatch = slug.match(/tech-(\d+)-hi-ai/)
    if (numberMatch) {
      return {
        name: 'hi-ai',
        order: parseInt(numberMatch[1], 10)
      }
    }
  }

  return null
}

/**
 * Get next and previous posts in a series
 * @param {string} currentSlug - Current post slug
 * @param {Array<object>} allPosts - All posts from index
 * @returns {object} {next: Post|null, previous: Post|null}
 */
export async function getSeriesNavigation(currentSlug) {
  const seriesInfo = detectSeries(currentSlug)
  if (!seriesInfo) {
    return { next: null, previous: null }
  }

  // Load all posts
  const buildTime = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : Date.now()
  const response = await fetch(`/stories/posts-index.json?v=${buildTime}`)
  if (!response.ok) {
    return { next: null, previous: null }
  }
  const data = await response.json()

  // Find all posts in the same series
  const seriesPosts = data.fullPosts
    .map(post => ({
      ...post,
      seriesInfo: detectSeries(post.slug)
    }))
    .filter(post => post.seriesInfo?.name === seriesInfo.name)
    .sort((a, b) => a.seriesInfo.order - b.seriesInfo.order)

  const currentIndex = seriesPosts.findIndex(p => p.slug === currentSlug)
  if (currentIndex === -1) {
    return { next: null, previous: null }
  }

  return {
    previous: currentIndex > 0 ? seriesPosts[currentIndex - 1] : null,
    next: currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null
  }
}
