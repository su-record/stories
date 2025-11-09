# Frontmatter Schema

**Purpose**: Define the YAML frontmatter structure for blog post markdown files

**Format**: YAML

---

## Schema Definition

```yaml
# Required Fields
title: string           # Post title (1-200 characters)
date: YYYY-MM-DD       # Publication date (ISO 8601 date format)
category: string        # Content category (one of: methodology, dev-log, tech, story)

# Optional Fields
slug: string           # URL-friendly identifier (lowercase, numbers, hyphens)
                       # If omitted, derived from filename
                       # Pattern: ^[a-z0-9-]+$
                       # Max length: 100 characters

description: string    # Short description/excerpt (max 300 characters)
                       # If omitted, uses first 160 chars of content

tags: [string]        # Array of categorization tags
                       # Max 10 tags, each max 30 characters
                       # Example: ["react", "tutorial", "beginner"]

image: string          # Header image URL for social sharing (1200x630px recommended)
                       # Example: "/images/post-header.jpg"

author: string         # Author name (max 100 characters)
                       # If omitted, uses site-wide default author

lang: string           # Language code ('ko' or 'en')
                       # If omitted, defaults to 'ko'
```

---

## Example: Minimal Frontmatter

```yaml
---
title: "AI-First 개발 방법론"
date: "2025-11-09"
category: "methodology"
---
```

---

## Example: Complete Frontmatter

```yaml
---
title: "기술을 몰라도 앱을 만들 수 있을까?"
date: "2025-11-09"
category: "story"
slug: "can-non-tech-build-app"
description: "47세, 비전공자가 AI만으로 145개 API를 완성한 6개월의 여정"
tags: ["ai-first", "개발", "fallingo", "google-startups"]
image: "/images/blog/story-cover.jpg"
author: "Su Ham"
lang: "ko"
---
```

---

## Example: English Post

```yaml
---
title: "AI-First Development Methodology"
date: "2025-11-09"
category: "methodology"
slug: "ai-first-methodology-en"
description: "How I built 145 APIs without knowing the tech stack"
tags: ["ai", "development", "methodology"]
image: "/images/blog/methodology-en.jpg"
author: "Su Ham"
lang: "en"
---
```

---

## Validation Rules

### title
- **Required**: Yes
- **Type**: String
- **Min Length**: 1 character
- **Max Length**: 200 characters
- **Example**: `"My First Blog Post"`

### date
- **Required**: Yes
- **Type**: String (date format)
- **Format**: `YYYY-MM-DD`
- **Validation**: Must be valid date, not in future
- **Example**: `"2025-11-09"`

### slug
- **Required**: No (auto-generated from filename if omitted)
- **Type**: String
- **Pattern**: `^[a-z0-9-]+$` (lowercase alphanumeric + hyphens only)
- **Min Length**: 1 character
- **Max Length**: 100 characters
- **Uniqueness**: Must be unique across all posts
- **Example**: `"getting-started"`
- **Auto-generation**: Filename `my-post.md` → slug `my-post`

### description
- **Required**: No (uses content excerpt if omitted)
- **Type**: String
- **Max Length**: 300 characters
- **Fallback**: First 160 characters of post content
- **Example**: `"A comprehensive guide to React hooks"`

### tags
- **Required**: No
- **Type**: Array of strings
- **Max Items**: 10
- **Item Max Length**: 30 characters each
- **Uniqueness**: Tags should be unique within array
- **Case**: Lowercase recommended for consistency
- **Example**: `["react", "javascript", "web-development"]`

### author
- **Required**: No (uses site default if omitted)
- **Type**: String
- **Max Length**: 100 characters
- **Example**: `"Jane Doe"`

---

## Error Handling

### Missing Required Field

**Invalid**:
```yaml
---
title: "My Post"
# Missing 'date' field
---
```

**Build Error**:
```
Error: Invalid post at /posts/my-post.md
Missing required field: date
```

---

### Invalid Date Format

**Invalid**:
```yaml
---
title: "My Post"
date: "11/09/2025"  # Wrong format
---
```

**Build Error**:
```
Error: Invalid post at /posts/my-post.md
Invalid date format. Expected YYYY-MM-DD, got "11/09/2025"
```

---

### Invalid Slug Pattern

**Invalid**:
```yaml
---
title: "My Post"
date: "2025-11-09"
slug: "My Post!"  # Contains uppercase and special characters
---
```

**Build Error**:
```
Error: Invalid post at /posts/my-post.md
Invalid slug "My Post!". Must match pattern: ^[a-z0-9-]+$
```

---

### Duplicate Slug

**Scenario**: Two posts with same slug

**File 1** (`/posts/intro.md`):
```yaml
---
title: "Introduction"
date: "2025-11-09"
slug: "intro"
---
```

**File 2** (`/posts/another-intro.md`):
```yaml
---
title: "Another Intro"
date: "2025-11-10"
slug: "intro"  # Same slug!
---
```

**Build Error**:
```
Error: Duplicate slug "intro"
Conflicting files:
  - /posts/intro.md
  - /posts/another-intro.md
```

---

## Best Practices

### 1. Always Include Description

While optional, including a description improves SEO and provides better preview text for post listings.

```yaml
description: "Learn the fundamentals of React in this beginner-friendly tutorial"
```

### 2. Use Lowercase Tags

For consistency and easier filtering:

✅ Good: `tags: ["react", "javascript"]`
❌ Avoid: `tags: ["React", "JavaScript"]`

### 3. Meaningful Slugs

Use descriptive slugs that reflect the content:

✅ Good: `slug: "react-hooks-tutorial"`
❌ Avoid: `slug: "post-1"`

### 4. Date Accuracy

Use the actual publication date, not future dates:

✅ Good: `date: "2025-11-09"` (today or past)
❌ Avoid: `date: "2026-01-01"` (future)

---

## Complete Example File

```markdown
---
title: "Building a Blog with React and Vite"
date: "2025-11-09"
slug: "react-vite-blog"
description: "Step-by-step guide to building a static blog using React, Vite, and GitHub Pages"
tags: ["react", "vite", "static-site", "tutorial"]
author: "Grove"
---

# Building a Blog with React and Vite

In this tutorial, we'll walk through creating a modern static blog...

## Prerequisites

Before we begin, make sure you have...

## Step 1: Setup

First, create a new Vite project...
```

---

## TypeScript Type Definitions

For TypeScript projects, here's the type definition:

```typescript
interface PostFrontmatter {
  // Required
  title: string;
  date: string; // YYYY-MM-DD format

  // Optional
  slug?: string;
  description?: string;
  tags?: string[];
  author?: string;
}
```

---

## Summary

- **Required**: `title`, `date`
- **Optional**: `slug`, `description`, `tags`, `author`
- **Validation**: Enforced at build time
- **Errors**: Build fails on invalid frontmatter
- **Defaults**: Slug from filename, description from content excerpt
