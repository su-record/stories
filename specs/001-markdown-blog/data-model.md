# Data Model: Markdown to Blog Generator

**Feature**: 001-markdown-blog
**Date**: 2025-11-09
**Purpose**: Define data structures and entities for the blog system

## Overview

This is a static site with file-based content storage. No database required. Data models represent in-memory structures derived from markdown files and frontmatter.

---

## Core Entities

### 1. Post

Represents a single blog post parsed from a markdown file.

**Source**: Markdown file in `/posts` directory

**Fields**:

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `slug` | string | Yes | URL-friendly identifier | Derived from filename or frontmatter. Must be unique. Pattern: `[a-z0-9-]+` |
| `title` | string | Yes | Post title | From frontmatter. Max 200 chars |
| `date` | Date | Yes | Publication date | From frontmatter. Format: YYYY-MM-DD |
| `category` | string | Yes | Content category | From frontmatter. One of: methodology, dev-log, tech, story |
| `content` | string | Yes | Markdown content body | Everything after frontmatter separator |
| `description` | string | No | Short description/excerpt | From frontmatter or first 160 chars of content |
| `tags` | string[] | No | Post categorization tags | From frontmatter. Max 10 tags, each max 30 chars |
| `image` | string | No | Header image URL | From frontmatter. For social sharing preview |
| `author` | string | No | Post author name | From frontmatter. Defaults to site config |
| `lang` | string | No | Language code | From frontmatter. 'ko' or 'en'. Defaults to 'ko' |
| `filePath` | string | Yes | Source file path | Internal use. E.g., `/posts/my-post.md` |

**Example**:
```javascript
{
  slug: "ai-first-methodology",
  title: "AI-First 개발 방법론",
  date: new Date("2025-11-09"),
  category: "methodology",
  content: "# AI-First 개발 방법론\n\n기술을 몰라도...",
  description: "AI만으로 145개 API를 완성한 방법론",
  tags: ["ai", "methodology", "claude"],
  image: "/images/ai-first-cover.jpg",
  author: "Su Ham",
  lang: "ko",
  filePath: "/posts/ai-first-methodology.md"
}
```

**Relationships**:
- One Post → Many Comments (via Giscus, external)

---

### 2. PostMetadata

Lightweight version of Post for listing pages. Excludes heavy content field.

**Source**: Generated from Post entity

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slug` | string | Yes | URL-friendly identifier |
| `title` | string | Yes | Post title |
| `date` | Date | Yes | Publication date |
| `category` | string | Yes | Content category |
| `description` | string | No | Short description/excerpt |
| `tags` | string[] | No | Post categorization tags |
| `image` | string | No | Header image URL |
| `lang` | string | No | Language code ('ko' or 'en') |

**Purpose**: Used in post listing page to avoid loading full markdown content

**Example**:
```javascript
{
  slug: "getting-started",
  title: "Getting Started with React",
  date: new Date("2025-11-09"),
  description: "Learn how to get started with React",
  tags: ["react", "tutorial"]
}
```

---

### 3. PostIndex

Collection of all posts with metadata for navigation.

**Source**: Generated at build time from all markdown files

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `posts` | PostMetadata[] | Yes | Array of all post metadata |
| `totalCount` | number | Yes | Total number of posts |
| `lastUpdated` | Date | Yes | Build timestamp |

**Storage**: Generated as `public/posts-index.json` during build

**Example**:
```javascript
{
  posts: [
    { slug: "post-1", title: "Post 1", ... },
    { slug: "post-2", title: "Post 2", ... }
  ],
  totalCount: 2,
  lastUpdated: new Date("2025-11-09T10:30:00Z")
}
```

**Sorting**: Posts sorted by `date` descending (newest first)

---

### 4. Comment (External - Giscus)

Comments are managed by Giscus via GitHub Discussions. Not stored in our system.

**Source**: GitHub Discussions API via Giscus

**Fields** (read-only from Giscus):

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique comment ID from GitHub |
| `author` | object | GitHub user info (name, avatar) |
| `body` | string | Comment text (markdown) |
| `createdAt` | Date | Timestamp |
| `reactions` | object | Emoji reactions |
| `replies` | Comment[] | Nested replies |

**Note**: Our app only embeds Giscus component. All CRUD operations handled by Giscus.

---

## Derived Entities

### 5. Category

Represents a content category for organizing posts.

**Source**: Predefined taxonomy

**Fixed Values**:

| Value | Description | Example Posts |
|-------|-------------|---------------|
| `methodology` | AI-First development methodology | "AI-First 개발 방법론", "문서 주도 개발" |
| `dev-log` | Weekly development logs | "2025-11-Week1", "베타 준비 과정" |
| `tech` | Technical deep dives | "PostGIS 최적화", "Clean Architecture" |
| `story` | Personal journey and milestones | "47세의 첫 앱 개발", "Google 선정 스토리" |

**Purpose**: Primary content organization and navigation

**URL Pattern**: `/category/:categorySlug`

**Example**:
```javascript
{
  slug: "methodology",
  name: "Methodology",
  description: "AI-First 개발 방법론",
  postCount: 5
}
```

---

### 6. SEOMetadata

Meta tags and structured data for search engine optimization.

**Source**: Generated from Post frontmatter

**Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | SEO title (60 chars max) |
| `description` | string | Meta description (155 chars max) |
| `keywords` | string[] | SEO keywords from tags |
| `ogTitle` | string | Open Graph title |
| `ogDescription` | string | Open Graph description |
| `ogImage` | string | Open Graph image URL (1200x630px) |
| `ogUrl` | string | Canonical URL |
| `twitterCard` | string | Twitter card type ('summary_large_image') |
| `twitterTitle` | string | Twitter card title |
| `twitterDescription` | string | Twitter card description |
| `twitterImage` | string | Twitter card image URL |
| `canonical` | string | Canonical URL (primary source) |

**Purpose**: Social sharing previews and SEO

**Example**:
```javascript
{
  title: "AI-First 개발 방법론 | Fallingo Blog",
  description: "기술을 몰라도 AI만으로 145개 API를 완성한 방법론",
  keywords: ["ai", "개발", "방법론", "claude"],
  ogTitle: "AI-First 개발 방법론",
  ogDescription: "기술을 몰라도 AI만으로 145개 API를 완성한 방법론",
  ogImage: "https://fallingo.app/images/ai-first-cover.jpg",
  ogUrl: "https://fallingo.app/blog/posts/ai-first-methodology",
  twitterCard: "summary_large_image",
  twitterTitle: "AI-First 개발 방법론",
  twitterDescription: "기술을 몰라도 AI만으로 145개 API를 완성한 방법론",
  twitterImage: "https://fallingo.app/images/ai-first-cover.jpg",
  canonical: "https://fallingo.app/blog/posts/ai-first-methodology"
}
```

---

### 7. Tag

Represents a tag for filtering posts.

**Source**: Aggregated from all Post tags

**Fields**:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Tag name |
| `count` | number | Number of posts with this tag |
| `slug` | string | URL-friendly tag identifier |

**Purpose**: Tag cloud or filter sidebar

**Example**:
```javascript
{
  name: "React",
  count: 15,
  slug: "react"
}
```

---

## Data Flow

### Build Time

```
1. Scan /posts directory for *.md files
2. For each file:
   a. Read file content
   b. Parse frontmatter (gray-matter)
   c. Extract Post entity
   d. Validate required fields
   e. Generate PostMetadata
3. Aggregate all PostMetadata
4. Sort by date descending
5. Generate PostIndex
6. Write posts-index.json to public/
7. Copy markdown files to dist/ (optional, for dynamic loading)
```

### Runtime (Browser)

```
1. App loads → Fetch posts-index.json
2. PostList component renders from PostIndex
3. User clicks post → Navigate to /posts/:slug
4. PostView component:
   a. Fetch /posts/:slug.md (or load from bundled data)
   b. Parse markdown → HTML (react-markdown)
   c. Render post
   d. Mount Giscus component (loads comments)
```

---

## State Transitions

### Post Lifecycle

```
[Markdown File Created]
      ↓
[Build Process] → Post entity created
      ↓
[Added to PostIndex]
      ↓
[Deployed to GitHub Pages]
      ↓
[User Visits] → Post rendered
      ↓
[User Comments] → Giscus stores in GitHub Discussions
```

**Modifications**:
- Edit markdown file → Rebuild → Redeploy (full cycle)
- Comments updated live via Giscus (no rebuild needed)

---

## Validation Rules

### Post Entity

```javascript
const postSchema = {
  slug: /^[a-z0-9-]+$/,           // lowercase, numbers, hyphens only
  title: { minLength: 1, maxLength: 200 },
  date: { format: 'YYYY-MM-DD', notFuture: true },
  description: { maxLength: 300 },
  tags: { maxItems: 10, each: { maxLength: 30 } },
  content: { minLength: 1 }
}
```

**Enforcement**: Validate during build process, fail build on invalid posts

---

## Storage Format

### Markdown File Structure

```markdown
---
title: "Getting Started with React"
date: "2025-11-09"
slug: "getting-started"  # optional
tags: ["react", "tutorial"]
description: "Learn React basics"
author: "Grove"  # optional
---

# Post Content

Your markdown content here...
```

### Generated PostIndex (posts-index.json)

```json
{
  "posts": [
    {
      "slug": "getting-started",
      "title": "Getting Started with React",
      "date": "2025-11-09T00:00:00.000Z",
      "description": "Learn React basics",
      "tags": ["react", "tutorial"]
    }
  ],
  "totalCount": 1,
  "lastUpdated": "2025-11-09T10:30:00.000Z"
}
```

---

## Indexing Strategy

**Primary Index**: `posts-index.json` sorted by date

**Search**: Client-side filtering by:
- Title (text search)
- Tags (exact match)
- Date range

**Performance**: For 50 posts (~100KB JSON), client-side filtering is sufficient. For 500+ posts, consider pagination or search service.

---

## Error Handling

### Invalid Post

**Scenario**: Markdown file missing required frontmatter fields

**Behavior**: Build fails with error message indicating file and missing field

**Example**:
```
Error: Invalid post at /posts/my-post.md
Missing required field: title
```

### Duplicate Slug

**Scenario**: Two posts with same slug

**Behavior**: Build fails with error listing conflicting files

**Example**:
```
Error: Duplicate slug "getting-started"
Files: /posts/getting-started.md, /posts/2025-11-09-getting-started.md
```

### Malformed Markdown

**Scenario**: Invalid frontmatter YAML syntax

**Behavior**: Build fails with parse error

**Example**:
```
Error: Failed to parse frontmatter in /posts/my-post.md
YAML syntax error at line 3
```

---

## Future Enhancements

*Not in scope for initial implementation, but noted for future:*

1. **Categories**: Hierarchical taxonomy beyond flat tags
2. **Series**: Group related posts into series
3. **Draft Status**: `published: false` frontmatter field
4. **Scheduled Posts**: Future-dated posts hidden until publish date
5. **Related Posts**: Automatic suggestions based on tags
6. **Search Index**: Full-text search with lunr.js or similar

---

## Summary

This data model supports a simple, file-based blog system with:
- Clear entity definitions
- Validation rules
- Build-time index generation
- External comment storage via Giscus
- Scalability to 50+ posts

All entities are derived from markdown files, no database required.
