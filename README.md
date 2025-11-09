# Stories - Fallingo Blog

> React 19 기반 마크다운 블로그 시스템

[![Deploy to GitHub Pages](https://github.com/su-record/stories/actions/workflows/deploy.yml/badge.svg)](https://github.com/su-record/stories/actions/workflows/deploy.yml)

**Live**: https://su-record.github.io/stories/

## ✨ Features

- 📝 **Markdown-based**: `/posts` 디렉토리의 마크다운 파일이 블로그 포스트로 자동 변환
- ⚡ **Fast & Lightweight**: React 19 + Vite 5, 코드 스플리팅으로 ~190KB
- 📱 **Infinite Scroll**: Intersection Observer로 10개씩 자동 로딩
- 💬 **Giscus Comments**: GitHub Discussions 기반 댓글 시스템
- 🔍 **SEO Optimized**: React 19 네이티브 메타데이터 지원
- 🚀 **Auto Deploy**: GitHub Actions로 main 푸시 시 자동 배포

## 🛠 Tech Stack

- **React 19.0.0** - Native metadata support
- **Vite 5** - Build tool with code-splitting
- **react-markdown 9.0.1** - Markdown rendering
- **@giscus/react 3.0.0** - Comments system
- **GitHub Actions** - CI/CD

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development (http://localhost:5173/stories/)
npm run dev

# Build
npm run prebuild  # Generate posts-index.json
npm run build     # Build for production

# Preview production build
npm run preview
```

## 📝 Writing Posts

### 1. Create Markdown File

새 포스트는 `/posts` 디렉토리에 마크다운 파일로 작성:

```markdown
---
title: "Post Title"
date: "2025-11-09"
category: "dev-log"
description: "SEO description (150-160 characters)"
tags: ["tag1", "tag2"]
author: "Su Ham"
lang: "ko"
---

# Your Content Here

Write your post content in **markdown**.
```

### 2. Categories

- **methodology**: AI 개발 방법론
- **dev-log**: Fallingo 주간 개발일지
- **tech**: 기술 심화 포스트
- **story**: 스토리/에세이

### 3. Deploy

```bash
git add posts/your-post.md
git commit -m "Add new post"
git push origin main

# GitHub Actions will automatically deploy in 2-3 minutes
```

## 📂 Project Structure

```
stories/
├── posts/                    # 📝 Blog posts (markdown)
│   ├── 01-ai-*.md
│   ├── fallingo-week-*.md
│   └── tech-*.md
├── src/
│   ├── components/
│   │   ├── Layout.jsx        # Main layout
│   │   ├── PostList.jsx      # Infinite scroll list
│   │   ├── PostView.jsx      # Post view + comments
│   │   └── NotFound.jsx      # 404 page
│   ├── utils/
│   │   ├── postLoader.js     # Post loading logic
│   │   └── markdown.js       # Markdown config
│   └── App.jsx               # Router setup
├── scripts/
│   └── generate-posts-index.js  # Build-time indexing
└── public/
    └── posts-index.json      # Generated post index
```

## 🎯 Key Features

### Build-time Post Indexing

Browser에서 Node.js API를 사용할 수 없는 문제 해결:

```javascript
// scripts/generate-posts-index.js
// 빌드 타임에 모든 마크다운 파싱 → posts-index.json 생성
// 런타임에는 JSON만 로드하여 빠른 성능
```

### Infinite Scroll

```javascript
// Intersection Observer로 10개씩 자동 로딩
// 스크롤 끝에 도달하면 자동으로 다음 포스트 로드
```

### Code Splitting

```javascript
// React.lazy + Suspense로 라우트별 코드 분할
// react-vendor: 33KB
// markdown-vendor: 191KB
// Total: ~190KB (from 506KB)
```

## 📊 Performance

| Metric | Value |
|--------|-------|
| **Bundle Size** | ~190KB (code-split) |
| **First Load** | react-vendor (33KB) + markdown-vendor (191KB) |
| **Posts per Page** | 10 (infinite scroll) |
| **Build Time** | ~10s |

## 🔧 Configuration

### Vite Config

```javascript
// vite.config.js
export default {
  base: '/stories/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'markdown-vendor': ['react-markdown', 'gray-matter']
        }
      }
    }
  }
}
```

### Giscus Comments

```javascript
// src/components/PostView.jsx
<Giscus
  repo="su-record/stories"
  repoId="R_kgDONWfbCw"
  category="General"
  mapping="pathname"
  theme="preferred_color_scheme"
  lang="ko"
/>
```

## 📦 Deployment

GitHub Actions workflow automatically:

1. Generates `posts-index.json` (`npm run prebuild`)
2. Builds React app (`npm run build`)
3. Deploys to GitHub Pages

**Deploy URL**: https://su-record.github.io/stories/

## 📖 Blog Content

### Current Posts (26)

- **AI 개발 방법론** (5 posts): AI 기반 개발 프로세스
- **Fallingo 주간 개발일지** (14 posts): 2025.05 ~ 2025.11
- **기술 심화** (5 posts): hi-ai MCP, Redis 최적화
- **스토리** (2 posts): Google Dream, Google for Startups

## 🤝 Contributing

1. Fork this repository
2. Create new branch (`git checkout -b feature/amazing-post`)
3. Add your post in `/posts` directory
4. Commit (`git commit -m 'Add amazing post'`)
5. Push (`git push origin feature/amazing-post`)
6. Open Pull Request

## 📄 License

MIT

## 🙏 Acknowledgments

이 블로그는 **AI (Claude)와의 협업**으로 개발되었습니다.

- React 19 + Vite 5 설정
- Build-time post indexing 아키텍처
- Infinite scroll 구현
- 26개 블로그 포스트 작성

---

**Made with ❤️ by Su Ham & Claude AI**
