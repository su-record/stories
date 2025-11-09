import matter from 'gray-matter'

/**
 * Parse markdown file content and extract frontmatter + content
 * @param {string} fileContent - Raw markdown file content
 * @returns {{ frontmatter: object, content: string }}
 */
export function parseMarkdown(fileContent) {
  const { data, content } = matter(fileContent)
  return {
    frontmatter: data,
    content: content.trim(),
  }
}

/**
 * Validate required frontmatter fields
 * @param {object} frontmatter - Parsed frontmatter object
 * @param {string} filePath - File path for error messages
 * @throws {Error} If required fields are missing
 */
export function validateFrontmatter(frontmatter, filePath) {
  const required = ['title', 'date', 'category']

  for (const field of required) {
    if (!frontmatter[field]) {
      throw new Error(
        `Invalid post at ${filePath}: Missing required field "${field}"`
      )
    }
  }

  // Validate category
  const validCategories = ['methodology', 'dev-log', 'tech', 'story']
  if (!validCategories.includes(frontmatter.category)) {
    throw new Error(
      `Invalid post at ${filePath}: category must be one of [${validCategories.join(', ')}]`
    )
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(frontmatter.date)) {
    throw new Error(
      `Invalid post at ${filePath}: date must be in YYYY-MM-DD format`
    )
  }
}

/**
 * Generate slug from filename or frontmatter
 * @param {string} filename - Markdown filename (e.g., "my-post.md")
 * @param {object} frontmatter - Parsed frontmatter
 * @returns {string} URL-friendly slug
 */
export function generateSlug(filename, frontmatter) {
  // Use frontmatter slug if provided
  if (frontmatter.slug) {
    return frontmatter.slug
  }

  // Otherwise derive from filename
  return filename.replace(/\.md$/, '')
}

/**
 * Create Post entity from markdown file
 * @param {string} fileContent - Raw markdown content
 * @param {string} filePath - File path (e.g., "/posts/my-post.md")
 * @returns {object} Post entity
 */
export function createPostEntity(fileContent, filePath) {
  const { frontmatter, content } = parseMarkdown(fileContent)
  validateFrontmatter(frontmatter, filePath)

  const filename = filePath.split('/').pop()
  const slug = generateSlug(filename, frontmatter)

  return {
    slug,
    title: frontmatter.title,
    date: new Date(frontmatter.date),
    category: frontmatter.category,
    content,
    description: frontmatter.description || content.substring(0, 160),
    tags: frontmatter.tags || [],
    image: frontmatter.image || null,
    author: frontmatter.author || null,
    lang: frontmatter.lang || 'ko',
    series: frontmatter.series || null,
    seriesOrder: frontmatter.seriesOrder || null,
    filePath,
  }
}

/**
 * Create PostMetadata (lightweight version without content)
 * @param {object} post - Full Post entity
 * @returns {object} PostMetadata entity
 */
export function createPostMetadata(post) {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    category: post.category,
    description: post.description,
    tags: post.tags,
    image: post.image,
    lang: post.lang,
    series: post.series,
    seriesOrder: post.seriesOrder,
  }
}
