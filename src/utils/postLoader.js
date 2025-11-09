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
