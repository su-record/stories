const EXTERNAL_SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:/i
const POST_MARKDOWN_PATTERN = /^(?:\.\/|\/stories\/posts\/|\/posts\/|posts\/)?([^/#?]+)\.md([#?].*)?$/
const POST_ROUTE_PATTERN = /^(?:\/stories)?\/posts\/([^/#?]+)([#?].*)?$/

export function normalizePostHref(href) {
  if (!href || EXTERNAL_SCHEME_PATTERN.test(href) || href.startsWith('#')) {
    return null
  }

  const markdownMatch = href.match(POST_MARKDOWN_PATTERN)
  if (markdownMatch) {
    return buildPostPath(markdownMatch[1], markdownMatch[2])
  }

  const routeMatch = href.match(POST_ROUTE_PATTERN)
  if (routeMatch) {
    return buildPostPath(routeMatch[1], routeMatch[2])
  }

  return null
}

function buildPostPath(slug, suffix = '') {
  return `/posts/${slug}${suffix || ''}`
}
