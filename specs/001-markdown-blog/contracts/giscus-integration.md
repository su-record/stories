# Giscus Integration Contract

**Purpose**: Define the contract for integrating Giscus comment system into blog posts

**External Service**: [Giscus](https://giscus.app/)

---

## Overview

Giscus is a comment system powered by GitHub Discussions. It provides a React component that embeds discussion threads on blog posts.

---

## Prerequisites

### 1. GitHub Repository Setup

Required repository configuration:

- ✅ Repository must be **public**
- ✅ GitHub Discussions must be **enabled**
- ✅ Giscus app must be **installed** on the repository

**Enable Discussions**:
1. Go to repository Settings
2. Scroll to "Features"
3. Check "Discussions"

**Install Giscus App**:
1. Visit https://github.com/apps/giscus
2. Click "Install"
3. Select the stories repository

---

### 2. Giscus Configuration

Required configuration values (obtained from https://giscus.app):

```javascript
{
  repo: "username/stories",              // GitHub repository
  repoId: "R_xxxxxxxxxxxxx",             // Repository ID
  category: "Announcements",             // Discussion category
  categoryId: "DIC_xxxxxxxxxxxxx",       // Category ID
  mapping: "pathname",                    // How to map posts to discussions
  reactionsEnabled: "1",                  // Enable reactions
  emitMetadata: "0",                      // Emit discussion metadata
  inputPosition: "bottom",                // Comment input position
  theme: "light",                         // Theme (light/dark/auto)
  lang: "ko"                              // Language (ko for Korean)
}
```

**Getting Configuration Values**:
1. Visit https://giscus.app
2. Enter repository name: `username/stories`
3. Select discussion category (create "Blog Comments" category recommended)
4. Copy generated configuration values

---

## React Component Integration

### Installation

```bash
npm install @giscus/react
```

### Component Usage

```jsx
import Giscus from '@giscus/react';

function Comments() {
  return (
    <Giscus
      repo="username/stories"
      repoId="R_xxxxxxxxxxxxx"
      category="Blog Comments"
      categoryId="DIC_xxxxxxxxxxxxx"
      mapping="pathname"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="light"
      lang="ko"
    />
  );
}
```

---

## Component Props Contract

### Required Props

| Prop | Type | Description | Example |
|------|------|-------------|---------|
| `repo` | string | GitHub repository in format `owner/repo` | `"grove/stories"` |
| `repoId` | string | Repository ID from Giscus configuration | `"R_kgDOJxxxxxx"` |
| `category` | string | Discussion category name | `"Blog Comments"` |
| `categoryId` | string | Discussion category ID | `"DIC_kwDOJxxxxxx"` |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mapping` | string | `"pathname"` | How to map pages to discussions. Options: `"pathname"`, `"url"`, `"title"`, `"og:title"`, `"specific"`, `"number"` |
| `strict` | string | `"0"` | Use strict title matching |
| `reactionsEnabled` | string | `"1"` | Enable reactions on main post |
| `emitMetadata` | string | `"0"` | Emit discussion metadata events |
| `inputPosition` | string | `"bottom"` | Position of comment input box. Options: `"top"`, `"bottom"` |
| `theme` | string | `"light"` | Color theme. Options: `"light"`, `"dark"`, `"dark_dimmed"`, `"preferred_color_scheme"`, custom theme URL |
| `lang` | string | `"en"` | Interface language. Use `"ko"` for Korean |
| `loading` | string | `"lazy"` | Loading strategy. Options: `"lazy"`, `"eager"` |

---

## Mapping Strategy

**Chosen Strategy**: `mapping="pathname"`

**How it works**:
- Each blog post URL path (e.g., `/posts/my-post`) creates a unique discussion
- Discussion title auto-generated from post title
- Giscus automatically creates discussion on first comment

**Example**:
```
Blog Post URL: https://grove.github.io/stories/posts/getting-started
Discussion: Created in "Blog Comments" category
Title: "Comments: /posts/getting-started"
```

**Alternative Strategies**:
- `"url"`: Full URL (including domain)
- `"title"`: Page `<title>` tag
- `"og:title"`: Open Graph title meta tag

---

## Theme Integration

### Static Theme

```jsx
<Giscus theme="light" {...otherProps} />
```

### Dynamic Theme (Dark Mode Support)

```jsx
function Comments() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Detect user's color scheme preference
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(darkMode ? 'dark' : 'light');
  }, []);

  return <Giscus theme={theme} {...otherProps} />;
}
```

### Custom Theme

Use GitHub theme or custom CSS:

```jsx
<Giscus
  theme="https://yoursite.com/giscus-theme.css"
  {...otherProps}
/>
```

---

## Authentication Flow

Giscus handles all authentication automatically:

1. **Anonymous User**: Can read comments
2. **Wants to Comment**: Giscus shows "Sign in with GitHub" button
3. **OAuth Flow**: GitHub OAuth consent screen
4. **Authorized**: User can post comments
5. **Subsequent Visits**: Auto-authenticated via GitHub session

**No custom authentication required** - all handled by Giscus + GitHub.

---

## Data Storage

**Where Comments are Stored**: GitHub Discussions in the specified repository

**Data Structure** (GitHub Discussions):
```
Repository: grove/stories
Category: Blog Comments
Discussion per post:
  - Title: "Comments: /posts/my-post"
  - Body: Auto-generated by Giscus
  - Comments: User comments
  - Reactions: Emoji reactions
  - Replies: Nested comment threads
```

**Access Control**:
- Comments managed in GitHub Discussions tab
- Repository owner can moderate, delete, lock discussions
- GitHub spam detection applies automatically

---

## Moderation

**Comment Moderation Options**:

1. **GitHub UI**: Manage in repository Discussions tab
2. **Hide Comment**: Mark as spam or off-topic
3. **Delete Comment**: Permanently remove
4. **Lock Discussion**: Prevent new comments
5. **Pin Discussion**: Highlight important threads

**Automated Moderation**:
- GitHub's spam filter automatically hides spam
- Reactions instead of "+1" comments encouraged

---

## Error Handling

### Giscus Not Loading

**Scenario**: Giscus component fails to load

**Causes**:
- Repository is private
- Discussions not enabled
- Giscus app not installed
- Invalid configuration values

**Fallback UI**:
```jsx
function Comments() {
  const [error, setError] = useState(false);

  return (
    <div>
      {error ? (
        <p>Comments temporarily unavailable. Please try again later.</p>
      ) : (
        <Giscus {...config} onError={() => setError(true)} />
      )}
    </div>
  );
}
```

---

### Network Issues

**Scenario**: User offline or GitHub unavailable

**Behavior**: Giscus shows loading state, times out gracefully

**User Experience**: Comments section shows loading indicator

---

## Performance Considerations

### Lazy Loading

Load Giscus only when comments section is in viewport:

```jsx
import { lazy, Suspense } from 'react';

const Giscus = lazy(() => import('@giscus/react'));

function Comments() {
  return (
    <Suspense fallback={<div>Loading comments...</div>}>
      <Giscus {...config} loading="lazy" />
    </Suspense>
  );
}
```

### Script Loading

Giscus loads external scripts (~50KB):
- Main Giscus script
- GitHub OAuth integration

**Impact**: Minimal, loads asynchronously after page content

---

## Privacy & GDPR Compliance

**Data Collected by Giscus**:
- GitHub username (if authenticated)
- Comment text
- Timestamp
- User's GitHub avatar URL

**Data Controller**: GitHub (as Discussions host)

**User Rights**:
- View comments: No account needed
- Edit/delete own comments: Via GitHub
- Request data deletion: Via GitHub support

**Cookies**: Giscus/GitHub may use cookies for authentication

**Privacy Policy**: Link to GitHub's privacy policy recommended

---

## Testing

### Manual Testing Checklist

- [ ] Giscus component renders on post page
- [ ] "Sign in with GitHub" button appears for anonymous users
- [ ] OAuth flow completes successfully
- [ ] Authenticated users can post comments
- [ ] Comments persist and appear for other users
- [ ] Reactions work (thumbs up, heart, etc.)
- [ ] Reply functionality works
- [ ] Theme matches site design
- [ ] Mobile responsive
- [ ] Works with ad blockers
- [ ] Graceful degradation if Giscus unavailable

### Automated Testing

**Component Test**:
```jsx
import { render } from '@testing-library/react';
import Comments from './Comments';

test('renders Giscus component', () => {
  const { container } = render(<Comments />);
  expect(container.querySelector('.giscus')).toBeInTheDocument();
});
```

**Note**: Full integration testing requires live GitHub Discussions.

---

## Configuration Example

### Development Environment

```jsx
// src/config/giscus.js
export const giscusConfig = {
  repo: process.env.VITE_GISCUS_REPO || "grove/stories",
  repoId: process.env.VITE_GISCUS_REPO_ID,
  category: "Blog Comments",
  categoryId: process.env.VITE_GISCUS_CATEGORY_ID,
  mapping: "pathname",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  theme: "light",
  lang: "ko"
};
```

### Environment Variables

```bash
# .env
VITE_GISCUS_REPO=grove/stories
VITE_GISCUS_REPO_ID=R_xxxxxxxxxxxxx
VITE_GISCUS_CATEGORY_ID=DIC_xxxxxxxxxxxxx
```

---

## Complete Implementation Example

```jsx
// src/components/Comments.jsx
import Giscus from '@giscus/react';
import { giscusConfig } from '../config/giscus';

export default function Comments() {
  return (
    <div className="comments-section">
      <h2>Comments</h2>
      <Giscus {...giscusConfig} />
    </div>
  );
}
```

```jsx
// src/components/PostView.jsx
import Comments from './Comments';

export default function PostView({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />

      {/* Comments at bottom of post */}
      <Comments />
    </article>
  );
}
```

---

## Summary

- **Service**: Giscus (GitHub Discussions-based comments)
- **Package**: `@giscus/react`
- **Authentication**: GitHub OAuth (handled by Giscus)
- **Storage**: GitHub Discussions
- **Moderation**: Via GitHub Discussions UI
- **Privacy**: GitHub's privacy policy applies
- **Cost**: Free
- **Setup**: Enable Discussions, install Giscus app, configure component

**Next Steps**:
1. Enable GitHub Discussions on repository
2. Install Giscus app
3. Get configuration from https://giscus.app
4. Install `@giscus/react` package
5. Add Comments component to PostView
