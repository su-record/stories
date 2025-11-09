# SEO Metadata Schema

**Purpose**: Define SEO and social sharing meta tags structure for blog posts

**Use Case**: Generated dynamically for each post using React 19's native metadata support

---

## Required Meta Tags

### Basic SEO

```html
<title>{post.title} | Fallingo Blog</title>
<meta name="description" content="{post.description}" />
<meta name="keywords" content="{post.tags.join(', ')}" />
<link rel="canonical" href="https://fallingo.app/blog/posts/{post.slug}" />
```

---

## Open Graph Tags (Facebook, LinkedIn)

```html
<meta property="og:type" content="article" />
<meta property="og:title" content="{post.title}" />
<meta property="og:description" content="{post.description}" />
<meta property="og:image" content="{post.image || '/images/blog/default-og.jpg'}" />
<meta property="og:url" content="https://fallingo.app/blog/posts/{post.slug}" />
<meta property="og:site_name" content="Fallingo Blog" />
<meta property="article:published_time" content="{post.date.toISOString()}" />
<meta property="article:author" content="{post.author}" />
<meta property="article:section" content="{post.category}" />
<meta property="article:tag" content="{post.tags[0]}" />
```

---

## Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{post.title}" />
<meta name="twitter:description" content="{post.description}" />
<meta name="twitter:image" content="{post.image || '/images/blog/default-twitter.jpg'}" />
<meta name="twitter:creator" content="@fallingo_app" />
```

---

## JSON-LD Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{post.title}",
  "description": "{post.description}",
  "image": "{post.image}",
  "datePublished": "{post.date.toISOString()}",
  "dateModified": "{post.date.toISOString()}",
  "author": {
    "@type": "Person",
    "name": "{post.author}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Fallingo",
    "logo": {
      "@type": "ImageObject",
      "url": "https://fallingo.app/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://fallingo.app/blog/posts/{post.slug}"
  }
}
```

---

## React 19 Component Example

**React 19 allows `<title>` and `<meta>` tags anywhere in the component tree - no wrapper library needed!**

```jsx
// React 19: Native metadata support!
function PostView({ post }) {
  const siteUrl = 'https://fallingo.app/blog';
  const postUrl = `${siteUrl}/posts/${post.slug}`;
  const imageUrl = post.image || `${siteUrl}/images/default-og.jpg`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": imageUrl,
    "datePublished": post.date.toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Fallingo",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fallingo.app/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl
    }
  };

  return (
    <>
      {/* Basic Meta Tags - works in React 19! */}
      <title>{post.title} | Fallingo Blog</title>
      <meta name="description" content={post.description} />
      <meta name="keywords" content={post.tags.join(', ')} />
      <link rel="canonical" href={postUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={postUrl} />
      <meta property="og:site_name" content="Fallingo Blog" />
      <meta property="article:published_time" content={post.date.toISOString()} />
      <meta property="article:author" content={post.author} />
      <meta property="article:section" content={post.category} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content="@fallingo_app" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Post Content */}
      <article>
        <h1>{post.title}</h1>
        <div>{post.content}</div>
      </article>
    </>
  );
}
```

**Key Benefits of React 19**:
- ✅ No need for `react-helmet-async` or similar libraries
- ✅ Metadata tags work anywhere in component tree
- ✅ Simpler code, fewer dependencies
- ✅ Better performance (no wrapper components)

---

## Image Requirements

### Open Graph Image
- **Size**: 1200x630px (recommended)
- **Aspect Ratio**: 1.91:1
- **Max File Size**: 8MB
- **Format**: JPG or PNG

### Twitter Card Image
- **Size**: 1200x675px (recommended for summary_large_image)
- **Aspect Ratio**: 1.78:1 (16:9)
- **Max File Size**: 5MB
- **Format**: JPG, PNG, WEBP, GIF

---

## Canonical URL Strategy

**Purpose**: Prevent duplicate content penalties when cross-posting

**Rule**: Always point canonical to fallingo.app/blog

```html
<!-- On fallingo.app/blog -->
<link rel="canonical" href="https://fallingo.app/blog/posts/my-post" />

<!-- On Medium (set when posting) -->
<link rel="canonical" href="https://fallingo.app/blog/posts/my-post" />

<!-- On Dev.to (set when posting) -->
canonical_url: https://fallingo.app/blog/posts/my-post
```

---

## Cross-Posting Guidelines

### Medium
1. Publish on fallingo.app first
2. Import story to Medium
3. Set canonical URL to fallingo.app
4. Add link back to original at top of article

### LinkedIn Articles
1. Publish on fallingo.app first
2. Post summary on LinkedIn
3. Link to full article on fallingo.app
4. Do NOT republish full article (LinkedIn doesn't support canonical URLs well)

### Dev.to
1. Publish on fallingo.app first
2. Cross-post to Dev.to
3. Set `canonical_url` in frontmatter
4. Dev.to automatically adds canonical link tag

---

## Analytics Integration

### Google Analytics 4

Add to `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Track Custom Events

```javascript
// Track post views
gtag('event', 'view_post', {
  post_title: post.title,
  post_category: post.category,
  post_language: post.lang
});

// Track social shares
gtag('event', 'share', {
  method: 'Twitter',
  content_type: 'article',
  item_id: post.slug
});
```

---

## SEO Checklist

For each post, verify:

- [ ] Title is descriptive and <60 characters
- [ ] Description is compelling and <155 characters
- [ ] Image is 1200x630px with good preview
- [ ] Canonical URL is set correctly
- [ ] Keywords include relevant tags
- [ ] Structured data validates (test with Google Rich Results Test)
- [ ] Twitter Card preview looks good (test with Twitter Card Validator)
- [ ] OpenGraph preview looks good (test with Facebook Sharing Debugger)

---

## Testing Tools

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

---

## TypeScript Interface

```typescript
interface SEOMetadata {
  // Basic SEO
  title: string;                    // Max 60 chars
  description: string;               // Max 155 chars
  keywords: string[];
  canonical: string;

  // Open Graph
  ogType: 'article';
  ogTitle: string;
  ogDescription: string;
  ogImage: string;                   // 1200x630px
  ogUrl: string;
  ogSiteName: string;
  articlePublishedTime: string;      // ISO 8601
  articleAuthor: string;
  articleSection: string;            // category

  // Twitter Card
  twitterCard: 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;              // 1200x675px
  twitterCreator: string;            // @username

  // JSON-LD
  structuredData: {
    '@context': 'https://schema.org';
    '@type': 'BlogPosting';
    headline: string;
    description: string;
    image: string;
    datePublished: string;
    dateModified?: string;
    author: {
      '@type': 'Person';
      name: string;
    };
    publisher: {
      '@type': 'Organization';
      name: string;
      logo: {
        '@type': 'ImageObject';
        url: string;
      };
    };
    mainEntityOfPage: {
      '@type': 'WebPage';
      '@id': string;
    };
  };
}
```

---

## Summary

- **Canonical URL**: Always point to fallingo.app/blog
- **Images**: 1200x630px for OG, 1200x675px for Twitter
- **Cross-Posting**: Set canonical URL on all platforms
- **Testing**: Validate before publishing
- **Analytics**: Track views, shares, referrals
