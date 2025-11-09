import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import Giscus from '@giscus/react'
import { loadPost } from '../utils/postLoader'
import './PostView.css'

function PostView() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true)
        const postData = await loadPost(slug)
        setPost(postData)

        // Set document title
        document.title = `${postData.title} | Fallingo Blog`

        // Set meta tags for SEO (React 19 native support)
        updateMetaTags(postData)
      } catch (err) {
        setError(err.message)
        document.title = 'Post Not Found | Fallingo Blog'
        clearMetaTags()
      } finally {
        setLoading(false)
      }
    }

    fetchPost()

    // Cleanup meta tags on unmount
    return () => {
      clearMetaTags()
    }
  }, [slug])

  // Update meta tags for SEO
  function updateMetaTags(post) {
    const siteUrl = 'https://fallingo.app'
    const baseUrl = `${siteUrl}/blog`
    const postUrl = `${baseUrl}/posts/${post.slug}`

    // Description
    setMetaTag('name', 'description', post.description)
    setMetaTag('property', 'og:description', post.description)
    setMetaTag('name', 'twitter:description', post.description)

    // Title
    setMetaTag('property', 'og:title', post.title)
    setMetaTag('name', 'twitter:title', post.title)

    // URL
    setMetaTag('property', 'og:url', postUrl)
    setMetaTag('property', 'og:type', 'article')

    // Image
    if (post.image) {
      const imageUrl = post.image.startsWith('http')
        ? post.image
        : `${siteUrl}${post.image}`
      setMetaTag('property', 'og:image', imageUrl)
      setMetaTag('name', 'twitter:image', imageUrl)
      setMetaTag('name', 'twitter:card', 'summary_large_image')
    } else {
      setMetaTag('name', 'twitter:card', 'summary')
    }

    // Article metadata
    setMetaTag('property', 'article:published_time', post.date.toISOString())
    if (post.author) {
      setMetaTag('property', 'article:author', post.author)
    }
    if (post.tags && post.tags.length > 0) {
      post.tags.forEach((tag) => {
        addMetaTag('property', 'article:tag', tag)
      })
    }

    // Language
    setMetaTag('property', 'og:locale', post.lang === 'ko' ? 'ko_KR' : 'en_US')

    // Canonical URL (for cross-posting)
    setCanonicalLink(postUrl)
  }

  function setMetaTag(attribute, key, value) {
    let element = document.querySelector(`meta[${attribute}="${key}"]`)
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute(attribute, key)
      document.head.appendChild(element)
    }
    element.setAttribute('content', value)
  }

  function addMetaTag(attribute, key, value) {
    const element = document.createElement('meta')
    element.setAttribute(attribute, key)
    element.setAttribute('content', value)
    document.head.appendChild(element)
  }

  function setCanonicalLink(url) {
    let element = document.querySelector('link[rel="canonical"]')
    if (!element) {
      element = document.createElement('link')
      element.setAttribute('rel', 'canonical')
      document.head.appendChild(element)
    }
    element.setAttribute('href', url)
  }

  function clearMetaTags() {
    // Remove all SEO meta tags
    const metaTags = document.querySelectorAll(
      'meta[property^="og:"], meta[property^="article:"], meta[name^="twitter:"], meta[name="description"]'
    )
    metaTags.forEach((tag) => tag.remove())

    // Remove canonical link
    const canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.remove()
  }

  if (loading) {
    return <div className="loading">Loading post...</div>
  }

  if (error) {
    return (
      <div className="error">
        <h2>Post Not Found</h2>
        <p>{error}</p>
        <Link to="/">← Back to Home</Link>
      </div>
    )
  }

  return (
    <article className="post-view">
      <header className="post-header">
        <Link to="/" className="back-link">
          ← Back to Posts
        </Link>
        <h1>{post.title}</h1>
        <div className="post-meta">
          <time dateTime={post.date.toISOString()}>
            {post.date.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span className="category">{post.category}</span>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="tags">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="post-content">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      <footer className="post-footer">
        {post.author && (
          <p className="author">
            Written by <strong>{post.author}</strong>
          </p>
        )}
        <Link to="/" className="back-link">
          ← Back to Posts
        </Link>
      </footer>

      {/* Giscus Comments */}
      <div className="comments-section">
        <Giscus
          repo="su-record/stories"
          repoId="R_kgDONWfbCw"
          category="General"
          categoryId="DIC_kwDONWfbC84ClL8g"
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="preferred_color_scheme"
          lang="ko"
          loading="lazy"
        />
      </div>
    </article>
  )
}

export default PostView
