# Tasks: Markdown to Blog Generator

**Input**: Design documents from `/specs/001-markdown-blog/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are not required for this feature (focus on rapid MVP delivery)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

All paths are relative to repository root:
- React source: `src/`
- Markdown content: `posts/`
- Build output: `dist/` (generated)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic React + Vite structure

- [ ] T001 Initialize Node.js project with package.json
- [ ] T002 Install React 19, Vite 5, and core dependencies (react-router-dom, react-markdown, gray-matter, @giscus/react)
- [ ] T003 [P] Create Vite config file at vite.config.js with GitHub Pages base path
- [ ] T004 [P] Create index.html entry point
- [ ] T005 [P] Setup ESLint and Prettier configurations
- [ ] T006 Create basic project structure (src/, posts/, public/ directories)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Create main application entry point at src/main.jsx
- [ ] T008 [P] Create App component with React Router setup in src/App.jsx
- [ ] T009 [P] Create Layout component with header and footer in src/components/Layout.jsx
- [ ] T010 Create markdown utilities for parsing frontmatter in src/utils/markdown.js
- [ ] T011 Create post loader utility for scanning markdown files in src/utils/postLoader.js
- [ ] T012 Create build script to generate posts-index.json at build time
- [ ] T013 Add example markdown post in posts/example-post.md with all required frontmatter fields
- [ ] T014 Configure React Router routes for homepage and post pages

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and Publish Blog Post (Priority: P1) 🎯 MVP

**Goal**: Content creators can add markdown files and see them as HTML blog posts on GitHub Pages

**Independent Test**: Add a markdown file to posts/, commit and push, verify it appears as HTML on deployed site

### Implementation for User Story 1

- [ ] T015 [P] [US1] Create PostView component for rendering individual posts in src/components/PostView.jsx
- [ ] T016 [P] [US1] Implement markdown-to-HTML rendering logic in PostView using react-markdown
- [ ] T017 [US1] Add route for /posts/:slug in App.jsx linking to PostView
- [ ] T018 [US1] Implement dynamic post loading from markdown files in PostView
- [ ] T019 [US1] Add error handling for missing or invalid markdown files
- [ ] T020 [US1] Create GitHub Actions workflow file at .github/workflows/deploy.yml
- [ ] T021 [US1] Configure GitHub Actions to build Vite app and deploy to gh-pages branch
- [ ] T022 [US1] Test deployment: add test post, commit, verify GitHub Action runs and deploys

**Checkpoint**: At this point, User Story 1 should be fully functional - markdown files become published blog posts

---

## Phase 4: User Story 2 - Update Existing Blog Posts (Priority: P2)

**Goal**: Editing markdown files automatically updates the published posts

**Independent Test**: Edit an existing markdown file, commit, verify changes appear on deployed site

### Implementation for User Story 2

- [ ] T023 [US2] Verify PostView component reloads content on route change
- [ ] T024 [US2] Ensure build process regenerates posts-index.json on file changes
- [ ] T025 [US2] Test update workflow: edit existing post, commit, verify redeployment

**Checkpoint**: At this point, both creating and updating posts work independently

---

## Phase 5: User Story 3 - View Blog Post List (Priority: P2)

**Goal**: Readers can see a homepage listing all blog posts

**Independent Test**: Visit homepage and see list of all posts with titles, dates, descriptions

### Implementation for User Story 3

- [ ] T026 [P] [US3] Create PostList component in src/components/PostList.jsx
- [ ] T027 [US3] Implement posts-index.json loading in PostList component
- [ ] T028 [US3] Display posts sorted by date (newest first) in PostList
- [ ] T029 [US3] Add links from PostList to individual PostView pages
- [ ] T030 [US3] Add homepage route (/) in App.jsx rendering PostList
- [ ] T031 [US3] Style PostList with post cards showing title, date, description, tags

**Checkpoint**: Homepage now shows all posts, clicking navigates to individual posts

---

## Phase 6: User Story 4 - Organize Posts by Category (Priority: P2)

**Goal**: Posts are organized into categories (methodology, dev-log, tech, story) with filtering

**Independent Test**: Add posts with different categories, verify category filter works

### Implementation for User Story 4

- [ ] T032 [P] [US4] Create CategoryFilter component in src/components/CategoryFilter.jsx
- [ ] T033 [US4] Add category validation to markdown utility (only allow: methodology, dev-log, tech, story)
- [ ] T034 [US4] Implement category filtering logic in PostList component
- [ ] T035 [US4] Add category routes (/category/:categorySlug) in App.jsx
- [ ] T036 [US4] Display category badge on each post card in PostList
- [ ] T037 [US4] Show active category in CategoryFilter UI

**Checkpoint**: Category navigation and filtering now works

---

## Phase 7: User Story 5 - SEO and Social Sharing (Priority: P2)

**Goal**: Posts have proper SEO meta tags and social sharing previews using React 19's native metadata

**Independent Test**: Share post URL on Twitter/LinkedIn, verify preview shows correct title, description, image

### Implementation for User Story 5

- [ ] T038 [P] [US5] Add SEO meta tags to PostView component using React 19's native <title> and <meta> tags
- [ ] T039 [P] [US5] Generate Open Graph meta tags (og:title, og:description, og:image, og:url) in PostView
- [ ] T040 [P] [US5] Generate Twitter Card meta tags in PostView
- [ ] T041 [US5] Add canonical URL meta tag pointing to fallingo.app/blog
- [ ] T042 [US5] Generate JSON-LD structured data for blog posts
- [ ] T043 [US5] Create SEO utility functions in src/utils/seo.js for generating meta tag values
- [ ] T044 [US5] Add default og:image for posts without custom images
- [ ] T045 [US5] Test social sharing: verify Twitter Card Validator and Facebook Sharing Debugger show correct previews

**Checkpoint**: SEO and social sharing fully functional

---

## Phase 8: User Story 6 - Comment on Blog Posts (Priority: P3)

**Goal**: Readers can comment on posts using Giscus (GitHub Discussions)

**Independent Test**: Visit a post, add a comment via GitHub auth, verify it persists

### Implementation for User Story 6

- [ ] T046 [US6] Enable GitHub Discussions on repository
- [ ] T047 [US6] Install Giscus GitHub App on repository
- [ ] T048 [US6] Get Giscus configuration (repo ID, category ID) from https://giscus.app
- [ ] T049 [P] [US6] Create Comments component in src/components/Comments.jsx
- [ ] T050 [US6] Integrate Giscus React component in Comments.jsx with repository configuration
- [ ] T051 [US6] Add Comments component to PostView at bottom of each post
- [ ] T052 [US6] Create .env file with Giscus environment variables (VITE_GISCUS_REPO_ID, VITE_GISCUS_CATEGORY_ID)
- [ ] T053 [US6] Test commenting: visit post, sign in with GitHub, add comment, verify it appears

**Checkpoint**: All user stories complete - full blog functionality working

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T054 [P] Add Google Analytics 4 integration in index.html
- [ ] T055 [P] Create sitemap.xml generator during build process
- [ ] T056 [P] Add 404 page component in src/components/NotFound.jsx
- [ ] T057 [P] Add loading states to PostView and PostList components
- [ ] T058 Optimize images: add responsive image support for post headers
- [ ] T059 [P] Add syntax highlighting for code blocks in markdown (using react-syntax-highlighter)
- [ ] T060 [P] Create README.md with setup and deployment instructions
- [ ] T061 Test full workflow per quickstart.md: create post, deploy, verify on GitHub Pages
- [ ] T062 Performance audit: verify initial page load <2s, post rendering <500ms

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - Can proceed in parallel (if multiple developers)
  - Or sequentially in priority order (P1 → P2 → P2 → P2 → P3)
- **Polish (Phase 9)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational - Enhances US1 but independently testable
- **User Story 3 (P2)**: Can start after Foundational - Independent, but makes most sense after US1
- **User Story 4 (P2)**: Can start after Foundational - Extends US3 but independently testable
- **User Story 5 (P2)**: Can start after Foundational - Enhances US1 but independently testable
- **User Story 6 (P3)**: Can start after Foundational - Extends US1 but independently testable

### Within Each User Story

- Build script/utilities before components that use them
- Components before routes that render them
- Core implementation before GitHub Actions deployment
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002-T005)
- All Foundational tasks marked [P] can run in parallel (T008-T009)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Within each story, tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# These can be launched together:
Task T015: "Create PostView component in src/components/PostView.jsx"
Task T016: "Implement markdown-to-HTML rendering logic in PostView"

# Then sequentially:
Task T017: "Add route for /posts/:slug in App.jsx" (needs T015, T016)
Task T018: "Implement dynamic post loading" (needs T015-T017)
```

---

## Parallel Example: Foundational Phase

```bash
# These can be launched together:
Task T008: "Create App component in src/App.jsx"
Task T009: "Create Layout component in src/components/Layout.jsx"

# Then:
Task T010: "Create markdown utilities in src/utils/markdown.js"
Task T011: "Create post loader in src/utils/postLoader.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T014) - CRITICAL
3. Complete Phase 3: User Story 1 (T015-T022)
4. **STOP and VALIDATE**: Add a real blog post, deploy, verify on GitHub Pages
5. Demo/review before adding more features

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Deploy/Demo (MVP! 🎯)
3. Add User Story 2 → Deploy/Demo (updates work)
4. Add User Story 3 → Deploy/Demo (homepage listing)
5. Add User Story 4 → Deploy/Demo (category filtering)
6. Add User Story 5 → Deploy/Demo (SEO optimized)
7. Add User Story 6 → Deploy/Demo (comments enabled)
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (core publishing)
   - Developer B: User Story 3 (post list)
   - Developer C: User Story 5 (SEO)
3. Then:
   - Developer A: User Story 2 (updates)
   - Developer B: User Story 4 (categories)
   - Developer C: User Story 6 (comments)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- React 19's native metadata support eliminates need for react-helmet-async
- Giscus handles all comment storage via GitHub Discussions (no backend needed)
- Build process must regenerate posts-index.json on every build
- Test GitHub Actions deployment early (T022) to catch issues

---

## Task Count Summary

- **Total Tasks**: 62
- **Setup**: 6 tasks
- **Foundational**: 8 tasks (blocks all stories)
- **User Story 1**: 8 tasks (MVP)
- **User Story 2**: 3 tasks
- **User Story 3**: 6 tasks
- **User Story 4**: 6 tasks
- **User Story 5**: 8 tasks
- **User Story 6**: 8 tasks
- **Polish**: 9 tasks

**Parallel Opportunities**: 18 tasks marked [P] can run in parallel

**Suggested MVP Scope**: Phases 1-3 (22 tasks) = Basic blog with deployment

**Full Feature Set**: All 62 tasks = Complete blog with categories, SEO, comments
