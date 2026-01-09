# Stories - Fallingo Blog System

Last updated: 2025-11-09

## Project Overview

React 19 기반 마크다운 블로그 시스템. GitHub Pages로 배포되며 `/posts` 디렉토리의 마크다운 파일을 HTML로 변환하여 보여줍니다.

**Live URL**: https://su-record.github.io/stories/

## Tech Stack

### Core
- **React 19.0.0** - Native metadata support (no react-helmet-async)
- **Vite 5** - Build tool with code-splitting
- **React Router 6.22.0** - Client-side routing

### Markdown & Content
- **react-markdown 9.0.1** - Markdown to React rendering
- **gray-matter 4.0.3** - YAML frontmatter parsing (build-time only)
- **remark-gfm** - GitHub Flavored Markdown support

### Features
- **@giscus/react 3.0.0** - GitHub Discussions-based comments
- **Intersection Observer** - Infinite scroll pagination (10 posts/page)
- **React.lazy + Suspense** - Route-based code splitting

### Deployment
- **GitHub Actions** - Automatic deployment to GitHub Pages
- **Base path**: `/stories/`

## Project Structure

```
stories/
├── posts/                          # Markdown blog posts
│   ├── 01-ai-development-start.md
│   ├── fallingo-week-2025-*.md    # Weekly dev logs
│   └── tech-*.md                  # Technical posts
├── src/
│   ├── components/
│   │   ├── Layout.jsx             # Main layout with header/sidebar
│   │   ├── PostList.jsx           # Infinite scroll post list
│   │   ├── PostView.jsx           # Single post view + Giscus
│   │   └── NotFound.jsx           # 404 page
│   ├── utils/
│   │   ├── postLoader.js          # Load posts from pre-built index
│   │   └── markdown.js            # Markdown rendering config
│   ├── App.jsx                    # Router setup
│   └── main.jsx                   # Entry point
├── scripts/
│   └── generate-posts-index.js    # Build-time post indexing
├── public/
│   └── posts-index.json           # Pre-built post index (generated)
├── .github/workflows/
│   └── deploy.yml                 # GitHub Actions deployment
└── vite.config.js                 # Vite configuration
```

## Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:5173/stories/

# Build
npm run prebuild         # Generate posts-index.json
npm run build            # Build for production
npm run preview          # Preview production build

# Combined
npm run build:all        # prebuild + build
```

## Blog Post Format

모든 포스트는 `/posts` 디렉토리에 마크다운 파일로 작성합니다.

### Frontmatter Schema

```yaml
---
title: "Post Title"
date: "YYYY-MM-DD"
category: "methodology | dev-log | tech | story"
description: "SEO description (150-160 characters)"
tags: ["tag1", "tag2"]
author: "Su Ham"
lang: "ko"
---
```

### Categories

- **methodology**: AI 개발 방법론 시리즈
- **dev-log**: Fallingo 주간 개발일지 (제목 형식: `Fallingo 개발일지 - YYYY년 M월 N주차 (MM.DD ~ MM.DD)`)
- **tech**: 기술 심화 포스트
- **story**: 스토리/에세이

### 주간 개발일지 작성 규칙

1. **파일명**: `fallingo-week-YYYY-MM-DD.md` (주간 시작일)
2. **제목**: `Fallingo 개발일지 - YYYY년 M월 N주차 (MM.DD ~ MM.DD)`
3. **날짜**: 주간 **종료일** (예: 11.03 ~ 11.09 → date: "2025-11-09")
4. **카테고리**: `dev-log`

## Key Features

### 1. Build-time Post Indexing

**문제**: Browser에서 `gray-matter` 사용 불가 (Node.js Buffer API 필요)

**해결**: 빌드 타임에 모든 포스트를 파싱하여 `posts-index.json` 생성

```javascript
// scripts/generate-posts-index.js
const posts = await loadAllPosts();
const index = {
  posts: posts.map(p => ({ slug, title, date, category, ... })),
  fullPosts: posts  // 전체 내용 포함
};
fs.writeFileSync('public/posts-index.json', JSON.stringify(index));
```

### 2. Infinite Scroll

Intersection Observer로 10개씩 로딩:

```javascript
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && hasMore) {
    loadMore();
  }
}, { threshold: 0.1 });
```

### 3. Code Splitting

```javascript
// vite.config.js
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'markdown-vendor': ['react-markdown', 'gray-matter']
}

// App.jsx
const PostList = lazy(() => import('./components/PostList'));
const PostView = lazy(() => import('./components/PostView'));
```

**결과**: 506KB → ~190KB (react-vendor 33KB, markdown-vendor 191KB)

### 4. SEO Metadata

React 19 네이티브 메타데이터 지원:

```jsx
<title>{post.title} - Fallingo Blog</title>
<meta name="description" content={post.description} />
<meta property="og:title" content={post.title} />
<meta property="og:url" content={postUrl} />
```

### 5. Giscus Comments

```jsx
<Giscus
  repo="su-record/stories"
  repoId="R_kgDONWfbCw"
  category="General"
  categoryId="DIC_kwDONWfbC84ClL8g"
  mapping="pathname"
  theme="preferred_color_scheme"
  lang="ko"
/>
```

## Deployment

### GitHub Actions Workflow

`.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches: [main]

jobs:
  build:
    - npm run prebuild  # Generate posts-index.json
    - npm run build     # Vite build
    - Upload artifact

  deploy:
    - Deploy to GitHub Pages
```

**자동 배포**: main 브랜치에 푸시하면 2-3분 후 자동 배포됨

## Development Workflow

### 새 포스트 추가

```bash
# 1. 포스트 작성
echo "---
title: \"New Post\"
date: \"2025-11-10\"
category: \"dev-log\"
---

# Content
" > posts/new-post.md

# 2. 로컬 확인
npm run dev

# 3. 커밋 & 푸시
git add posts/new-post.md
git commit -m "Add new post"
git push origin main

# → GitHub Actions가 자동 배포
```

### 폴링고 레포에서 자동화 (예정)

폴링고 레포 (프라이빗)에서 주간 개발일지를 자동 생성하고 stories 레포로 푸시:

```bash
# 폴링고 레포에서
./scripts/generate-weekly-post.sh

# stories 레포로 푸시
git -C ../stories add posts/
git -C ../stories commit -m "Add weekly post"
git -C ../stories push
```

## Blog Content

### 현재 포스트 (26개)

**AI 개발 방법론 (5개)**
- 01-ai-development-start.md
- 02-ai-document-driven.md
- 02-1-mcp-development.md
- 03-ai-consistency-solution.md
- 04-speckit-completion.md

**Fallingo 주간 개발일지 (14개)**
- fallingo-week-2025-05-26.md ~ 2025-11-03.md
- FlavorPoint → Fallingo 전환 과정
- 7월 리셋 기간 포함

**기술 심화 (5개)**
- tech-01-hi-ai-mcp.md
- tech-hi-ai-v1.0.4-6.md (AST 기반 분석)
- tech-hi-ai-v1.1.0.md (시맨틱 코드 분석)
- tech-hi-ai-v1.2.0.md (UI Preview 시스템)
- fallingo-tech-01-redis-optimization.md (Redis 76% 성능 개선)

**스토리 (2개)**
- fallingo-01-google-dream.md (구글 기술 스택 결정 배경)
- fallingo-02-google-for-startups.md (Google for Startups 승인 과정)

### 작문 스타일

#### 문체 규칙
- **어체**: 평서체 (합니다/했습니다)
- **문장**: 짧게, 끊어쓰기
- **표현**: 직접적 ("틀렸습니다", "깨달음이 왔습니다", "문제는 그 다음입니다")
- **원칙**: Show don't tell, 구체적 수치, 감정적 진정성
- **금지**:
  - "다음 주 계획" 섹션 (주단위 계획이 아님)
  - 과도한 수식어, 장황한 설명
  - 이모지 (명시적 요청 없으면 사용 금지)

#### 구조 규칙
- 섹션 구분: `---`
- H1은 제목만, 본문은 H2부터 시작
- 코드 예시는 문제 상황 → 해결 순서로
- 표(table)로 비교/정리 적극 활용
- 이전/다음 편 링크: `> 이전 편: [제목](파일명.md)`

#### 카테고리별 구조

**methodology** (AI 개발 방법론):
```
경험/상황 → 문제 발견 → 시도와 실패 → 해결책 → 배운 점/결론
```
- 파일명: `XX-ai-{주제}.md` (XX는 시리즈 번호)
- 이전 편 링크 필수

**tech** (기술 심화 - vibe, hi-ai):
```
버전/배경 → 문제/커밋 히스토리 → 해결 과정 → 기능 설명 → 사용법 → 마무리
```
- 파일명: `tech-{프로젝트}-XX.md` 또는 `tech-{프로젝트}-{버전}.md`
- GitHub/NPM/Release 링크 포함

**dev-log** (주간 개발일지):
```
주간 요약 → 작업 내용 (기능별) → 다음 방향
```
- 파일명: `fallingo-week-YYYY-MM-DD.md` (주간 시작일)
- date는 주간 종료일

**story** (에세이):
```
자유 형식, 개인적 경험 중심
```

## Troubleshooting

### Buffer is not defined

**원인**: Browser에서 `gray-matter` 직접 사용 시도

**해결**: `generate-posts-index.js`로 빌드 타임에 파싱

### 날짜 정렬 이슈

**해결**: 주간 개발일지 date 필드를 주간 **종료일**로 설정

### Cache 문제

빌드 후 변경사항이 안 보이면:

```bash
npm run prebuild  # posts-index.json 재생성
```

## Performance

- **Bundle Size**: ~190KB (code-split)
- **First Load**: react-vendor (33KB) + markdown-vendor (191KB)
- **Lazy Routes**: PostList, PostView, NotFound
- **Cache**: Build-time post indexing으로 런타임 파싱 제거
- **Pagination**: 10 posts/page with infinite scroll

## References

- [React 19 Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [Giscus](https://giscus.app/)
- [GitHub Pages](https://pages.github.com/)

---

**Note**: 이 블로그는 AI (Claude)와의 협업으로 개발되었습니다.
