# Research: Markdown to Blog Generator

**Feature**: 001-markdown-blog
**Date**: 2025-11-09
**Purpose**: Technical research and decisions for React-based static blog with GitHub Pages deployment

## Technology Decisions

### 1. Frontend Framework: React 19 + Vite

**Decision**: Use React 19 with Vite 5+ as the build tool

**Rationale**:
- **React 19** (Dec 2024 stable release): Latest version with significant improvements
  - **Native metadata support**: `<title>`, `<meta>` tags work in any component (eliminates react-helmet-async!)
  - **React Compiler**: Automatic optimization, no manual useMemo/useCallback needed
  - **Actions**: Simplified form handling and async transitions
  - **ref as prop**: No more forwardRef boilerplate
  - **use() hook**: Better async data handling
- **Vite**: Fast build times, excellent developer experience, native ESM support
- **Static Export**: Vite can build to static HTML/CSS/JS for GitHub Pages
- **Ecosystem**: Full compatibility with React 19

**Alternatives Considered**:
- **Next.js**: More complex setup, requires `next export` for static sites, overkill for simple blog
- **Jekyll**: GitHub Pages native but Ruby-based, less flexible for custom UI
- **Gatsby**: React-based but heavier, more complex build process
- **Vue (existing)**: Could work but team prefers React for this project

**Implementation Notes**:
- Use Vite's static asset handling for markdown files
- Configure base path for GitHub Pages deployment
- Enable React Router for client-side routing
- Leverage React 19's built-in metadata APIs for SEO

---

### 2. Markdown Processing: react-markdown + gray-matter

**Decision**: Use `react-markdown` for rendering and `gray-matter` for frontmatter parsing

**Rationale**:
- **react-markdown**: Industry-standard React component for markdown rendering, supports GFM (GitHub Flavored Markdown)
- **gray-matter**: Parses YAML frontmatter for metadata (title, date, tags, etc.)
- **Security**: react-markdown is XSS-safe by default
- **Extensibility**: Supports plugins for syntax highlighting, custom components

**Alternatives Considered**:
- **marked + DOMPurify**: More manual work, need to sanitize HTML
- **remark/rehype ecosystem**: More powerful but more complex
- **MDX**: Allows JSX in markdown but adds complexity

**Implementation Notes**:
```javascript
// Example frontmatter structure
---
title: "My Blog Post"
date: "2025-11-09"
tags: ["react", "blog"]
---

# Post content here...
```

---

### 3. Comment System: Giscus

**Decision**: Use Giscus for comment functionality

**Rationale**:
- **GitHub Integration**: Uses GitHub Discussions, natural fit for GitHub Pages
- **Free & Open Source**: No costs, no ads
- **Privacy-Friendly**: No tracking, GDPR compliant
- **React Component**: Official `@giscus/react` package available
- **Moderation**: Uses GitHub's moderation tools
- **Authentication**: GitHub OAuth built-in

**Alternatives Considered**:
- **Utterances**: Uses GitHub Issues instead of Discussions, less suitable for conversations
- **Disqus**: Free tier has ads, privacy concerns
- **Cusdis**: Self-hosted, requires additional infrastructure

**Implementation Notes**:
- Requires enabling GitHub Discussions on repository
- Need to install Giscus app on GitHub repository
- Configure repository ID and category ID in component

---

### 4. Routing: React Router

**Decision**: Use React Router v6+ for client-side routing

**Rationale**:
- **Static Site Friendly**: Works with hash routing or browser routing
- **Type-Safe Routes**: Easy to define routes for post list and individual posts
- **URL Structure**: Can implement `/posts/:slug` pattern
- **Fallback**: 404 page handling

**Alternatives Considered**:
- **Manual routing**: Too basic, need to handle browser history
- **Wouter**: Lighter but less feature-rich
- **No routing**: Could use query params but poor UX

**Implementation Notes**:
- Use `createHashRouter` for GitHub Pages (no server-side routing)
- Route structure:
  - `/` → Post list
  - `/posts/:slug` → Individual post
  - `*` → 404 page

---

### 5. Build & Deployment: GitHub Actions

**Decision**: Use GitHub Actions workflow to build and deploy to GitHub Pages

**Rationale**:
- **Native Integration**: GitHub Actions + GitHub Pages = zero config
- **Automation**: Trigger on push to main branch
- **Free**: Included with GitHub
- **Simple**: Standard workflow for Vite apps

**Alternatives Considered**:
- **Netlify/Vercel**: External services, adds complexity
- **Manual deployment**: Error-prone, not automated
- **Jekyll (GitHub auto-build)**: Would require switching frameworks

**Implementation Notes**:
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
```

---

### 6. Styling: CSS Modules or Tailwind CSS

**Decision**: NEEDS USER CLARIFICATION

**Options**:
- **CSS Modules**: Scoped styles, no dependencies, full control
- **Tailwind CSS**: Utility-first, rapid development, larger bundle
- **Styled Components**: CSS-in-JS, runtime overhead
- **Plain CSS**: Simple but hard to maintain

**Recommendation**: CSS Modules for simplicity and performance, or Tailwind CSS if rapid UI development preferred

---

### 7. Post Metadata & Discovery

**Decision**: Use frontmatter for metadata, generate post index at build time

**Rationale**:
- **Frontmatter**: Standard in static site generators
- **Build-time Index**: Better performance than runtime scanning
- **Type Safety**: Can validate metadata structure

**Implementation Approach**:
1. Each markdown file has YAML frontmatter with: title, date, slug (optional), tags
2. Vite plugin or build script scans `/posts` directory
3. Generates `posts.json` index file
4. React app loads index to render post list
5. Individual posts loaded on-demand

**Metadata Schema**:
```yaml
---
title: string (required)
date: YYYY-MM-DD (required)
slug: string (optional, defaults to filename)
category: string (required, one of: methodology, dev-log, tech, story)
tags: string[] (optional)
description: string (optional, for SEO/preview)
image: string (optional, header image URL for social sharing)
author: string (optional, defaults to site config)
lang: string (optional, 'ko' or 'en', defaults to 'ko')
---
```

---

### 8. Performance Optimizations

**Decision**: Implement code splitting and lazy loading

**Strategies**:
- **React.lazy()**: Lazy load post view component
- **Dynamic Import**: Load markdown content on-demand
- **Image Optimization**: Use Vite's asset handling
- **Bundle Splitting**: Separate vendor chunks

**Implementation**:
```javascript
const PostView = lazy(() => import('./components/PostView'))
```

---

## Best Practices Research

### Markdown File Organization

**Pattern**: Filename-based slugs with optional frontmatter override

```
/posts/
  ├── getting-started.md        → /posts/getting-started
  ├── react-hooks-guide.md      → /posts/react-hooks-guide
  └── 2025-11-09-announcement.md → /posts/2025-11-09-announcement
```

**Benefits**:
- Clear, predictable URLs
- Easy to manage
- Optional date prefixes for chronological organization

---

### Error Handling

**Strategy**: Graceful degradation

1. **Missing Post**: 404 page with link back to post list
2. **Malformed Markdown**: Show error message, don't crash app
3. **Failed Comment Load**: Show fallback message
4. **Build Failures**: GitHub Actions should fail loudly with logs

---

### SEO Considerations

**Approach**: Comprehensive SEO strategy for cross-posting

**Meta Tags Strategy**:
- Use **React 19's native metadata support** (no react-helmet-async needed!)
- Generate `<title>`, `<meta description>`, keywords from frontmatter
- OpenGraph tags (og:title, og:description, og:image, og:url)
- Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
- Canonical URL pointing to fallingo.app/blog (primary source)
- Generate sitemap.xml during build (vite-plugin-sitemap)

**Cross-Posting Strategy**:
```
Primary: fallingo.app/blog/posts/my-post
         ↓ (canonical URL)
Medium: medium.com/@su/my-post (canonical: fallingo.app)
LinkedIn: linkedin.com/pulse/my-post (link back)
Dev.to: dev.to/su/my-post (canonical: fallingo.app)
```

**Implementation with React 19**:
```jsx
// React 19: metadata works anywhere in component tree!
function PostView({ post }) {
  return (
    <>
      <title>{post.title} | Fallingo Blog</title>
      <meta name="description" content={post.description} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.description} />
      <meta property="og:image" content={post.image} />
      <link rel="canonical" href={`https://fallingo.app/blog/posts/${post.slug}`} />

      <article>{/* post content */}</article>
    </>
  );
}
```

**Analytics**:
- Google Analytics 4 integration
- Track page views, time on page, bounce rate
- Monitor referral sources (Medium, LinkedIn, etc.)

---

### 9. Category System

**Decision**: Fixed category taxonomy with dedicated pages

**Categories**:
1. **methodology** - AI-First development methodology
2. **dev-log** - Weekly development logs
3. **tech** - Technical deep dives
4. **story** - Personal journey and milestones

**URL Structure**:
```
/                           → Homepage (all posts)
/category/methodology       → Methodology posts only
/category/dev-log          → Dev log posts only
/category/tech             → Tech posts only
/category/story            → Story posts only
/posts/:slug               → Individual post
```

**Navigation**:
- Category filter in header/sidebar
- Category badge on each post card
- Breadcrumbs on post pages

---

### 10. Internationalization (i18n)

**Decision**: Korean-first with manual English translations

**Approach**:
- Default language: Korean (`lang: 'ko'`)
- Some posts will be English (`lang: 'en'`)
- No automatic translation
- Language indicator in post metadata
- Filter by language if needed

**Implementation**:
```yaml
# Korean post
---
title: "AI-First 개발 방법론"
lang: ko
---

# English post
---
title: "AI-First Development Methodology"
lang: en
---
```

---

## Open Questions

None - all technical decisions finalized based on spec requirements and masterplan.

---

## Next Steps (Phase 1)

1. Define data model for Post entity
2. Create API contracts (if any external services needed)
3. Write quickstart guide for local development
4. Update agent context with chosen technologies
