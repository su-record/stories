# Quickstart Guide: Markdown to Blog Generator

**Feature**: 001-markdown-blog
**Last Updated**: 2025-11-09

---

## Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account
- Text editor (VS Code recommended)

---

## Project Setup

### 1. Clone Repository

```bash
git clone https://github.com/username/stories.git
cd stories
```

### 2. Install Dependencies

```bash
npm install
```

Expected dependencies:
- `react` (^18.0.0)
- `react-dom` (^18.0.0)
- `react-router-dom` (^6.0.0)
- `react-markdown` (^9.0.0)
- `gray-matter` (^4.0.0)
- `@giscus/react` (^3.0.0)
- `vite` (^5.0.0)

### 3. Environment Configuration

Create `.env` file in project root:

```bash
# .env
VITE_GISCUS_REPO=username/stories
VITE_GISCUS_REPO_ID=R_xxxxxxxxxxxxx
VITE_GISCUS_CATEGORY_ID=DIC_xxxxxxxxxxxxx
```

**Get Giscus IDs**:
1. Visit https://giscus.app
2. Enter your repository name
3. Enable GitHub Discussions in repo settings
4. Install Giscus app: https://github.com/apps/giscus
5. Copy the generated `repoId` and `categoryId`

---

## Development

### Start Dev Server

```bash
npm run dev
```

Open http://localhost:5173 in browser

**Hot Reload**: Changes auto-reload in browser

---

## Creating Blog Posts

### 1. Create Markdown File

Create file in `/posts` directory:

```bash
# From project root
touch posts/my-first-post.md
```

### 2. Add Frontmatter & Content

Edit `posts/my-first-post.md`:

```markdown
---
title: "My First Blog Post"
date: "2025-11-09"
description: "This is my first post on the new blog"
tags: ["intro", "blog"]
---

# Welcome!

This is the content of my first blog post.

## Features

- Markdown support
- Syntax highlighting
- Comments via Giscus
```

### 3. View Post

1. Dev server auto-detects new file
2. Rebuilds post index
3. Post appears on homepage: http://localhost:5173
4. Click post to view: http://localhost:5173/posts/my-first-post

---

## Project Structure

```
stories/
├── posts/                      # Your markdown files go here
│   └── my-first-post.md
│
├── src/
│   ├── components/
│   │   ├── PostList.jsx       # Homepage post listing
│   │   ├── PostView.jsx       # Individual post view
│   │   ├── Comments.jsx       # Giscus comments
│   │   └── Layout.jsx         # Site header/footer
│   │
│   ├── utils/
│   │   ├── markdown.js        # Markdown parsing
│   │   └── postLoader.js      # Load posts at build time
│   │
│   ├── App.jsx                # Main app component
│   └── main.jsx               # Entry point
│
├── public/
│   └── posts-index.json       # Generated post index (auto-created)
│
├── .env                       # Environment variables (not committed)
├── package.json
└── vite.config.js
```

---

## Build & Deploy

### Build for Production

```bash
npm run build
```

Output in `dist/` directory

### Deploy to GitHub Pages

Deployment happens automatically via GitHub Actions when you push to `main` branch.

**Workflow file**: `.github/workflows/deploy.yml`

```yaml
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
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Deploy Process**:
1. Push to main: `git push origin main`
2. GitHub Actions runs build
3. Deploys to `gh-pages` branch
4. Site live at: `https://username.github.io/stories/`

### Enable GitHub Pages

1. Go to repository Settings
2. Pages section
3. Source: `gh-pages` branch
4. Save

---

## Testing

### Run Tests

```bash
npm test
```

### Test Coverage

```bash
npm run test:coverage
```

### Lint Code

```bash
npm run lint
```

---

## Common Tasks

### Add a New Post

```bash
# 1. Create file
touch posts/new-post-title.md

# 2. Edit file with frontmatter
# 3. Save
# 4. View in browser (dev server auto-reloads)
```

### Update Existing Post

```bash
# 1. Edit markdown file
# 2. Save
# 3. Changes auto-reload in dev server
# 4. Commit and push to deploy
```

### Delete a Post

```bash
# 1. Delete markdown file
rm posts/old-post.md

# 2. Build process auto-removes from index
# 3. Commit and push to deploy
```

### Change Site Configuration

Edit `vite.config.js` for build settings:

```javascript
export default defineConfig({
  base: '/stories/',  // GitHub Pages subdirectory
  // ... other config
});
```

---

## Troubleshooting

### Post Not Showing Up

**Problem**: Created post but not visible in list

**Solutions**:
1. Check frontmatter has required fields (`title`, `date`)
2. Verify file is in `/posts` directory
3. Check browser console for errors
4. Restart dev server: `Ctrl+C` then `npm run dev`

---

### Build Fails

**Problem**: `npm run build` errors

**Common Causes**:
1. Invalid frontmatter YAML syntax
2. Missing required frontmatter fields
3. Duplicate post slugs
4. Future-dated posts (if validation enabled)

**Solution**: Check error message, fix indicated file

---

### Comments Not Loading

**Problem**: Giscus comments section doesn't appear

**Solutions**:
1. Verify Discussions enabled in repo settings
2. Check Giscus app is installed
3. Confirm env variables are set correctly
4. Check browser console for errors
5. Verify repository is public

---

### GitHub Actions Deploy Failing

**Problem**: Push to main doesn't deploy

**Solutions**:
1. Check Actions tab in GitHub for error logs
2. Verify GitHub Pages is enabled
3. Check `gh-pages` branch exists
4. Confirm `GITHUB_TOKEN` has permissions

---

## Development Tips

### File Naming

Good post filenames:
- `getting-started.md` → slug: `getting-started`
- `react-hooks-guide.md` → slug: `react-hooks-guide`
- `2025-11-09-announcement.md` → slug: `2025-11-09-announcement`

Avoid:
- Spaces: `My Post.md` ❌
- Special chars: `Post!@#.md` ❌
- Uppercase: `MyPost.md` ❌ (use lowercase)

### Frontmatter Best Practices

Always include:
```yaml
---
title: "Descriptive Title"
date: "2025-11-09"
description: "SEO-friendly description"
tags: ["relevant", "tags"]
---
```

### Preview Before Deploying

1. Run `npm run build` locally
2. Run `npm run preview` to preview production build
3. Test at http://localhost:4173
4. If looks good, commit and push

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm test                 # Run tests
npm run lint             # Lint code

# Git workflow
git add posts/my-post.md       # Stage new post
git commit -m "Add new post"   # Commit
git push origin main           # Deploy
```

---

## Next Steps

1. **Customize Design**: Edit components in `src/components/`
2. **Add Features**: Implement search, tags filter, etc.
3. **SEO**: Add meta tags, sitemap
4. **Analytics**: Add Google Analytics or similar
5. **Custom Domain**: Configure in GitHub Pages settings

---

## Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [Giscus](https://giscus.app/)
- [GitHub Pages](https://pages.github.com/)

---

## Support

- **Issues**: Open issue on GitHub
- **Discussions**: Use GitHub Discussions tab
- **Docs**: See `/specs/001-markdown-blog/` directory

---

**Happy blogging! 🚀**
