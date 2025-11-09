import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { loadPostIndex, filterByCategory } from '../utils/postLoader'
import './PostList.css'

const POSTS_PER_PAGE = 10

function PostList() {
  const { category } = useParams()
  const [allPosts, setAllPosts] = useState([])
  const [displayedPosts, setDisplayedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)

  const observerTarget = useRef(null)

  // Load all posts from index
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const postIndex = await loadPostIndex()
        const filteredPosts = category
          ? filterByCategory(postIndex.posts, category)
          : postIndex.posts
        setAllPosts(filteredPosts)
        setDisplayedPosts(filteredPosts.slice(0, POSTS_PER_PAGE))
        setHasMore(filteredPosts.length > POSTS_PER_PAGE)
        setPage(1)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [category])

  // Load more posts
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    setTimeout(() => {
      const nextPage = page + 1
      const start = 0
      const end = nextPage * POSTS_PER_PAGE
      const newDisplayedPosts = allPosts.slice(start, end)

      setDisplayedPosts(newDisplayedPosts)
      setPage(nextPage)
      setHasMore(end < allPosts.length)
      setLoadingMore(false)
    }, 300) // Simulate loading delay
  }, [allPosts, page, hasMore, loadingMore])

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [loadMore, hasMore, loadingMore])

  if (loading) {
    return <div className="loading">Loading posts...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="post-list">
      {category && <h2>Category: {category}</h2>}
      {allPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <>
          <div className="posts">
            {displayedPosts.map((post) => (
              <article key={post.slug} className="post-card">
                <Link to={`/posts/${post.slug}`}>
                  <h3>{post.title}</h3>
                  <time dateTime={post.date.toISOString()}>
                    {post.date.toLocaleDateString('ko-KR')}
                  </time>
                  {post.description && <p>{post.description}</p>}
                  {post.tags && post.tags.length > 0 && (
                    <div className="tags">
                      {post.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </article>
            ))}
          </div>

          {/* Intersection Observer Target */}
          {hasMore && (
            <div ref={observerTarget} className="observer-target">
              {loadingMore && <div className="loading-more">Loading more posts...</div>}
            </div>
          )}

          {/* End of list indicator */}
          {!hasMore && allPosts.length > POSTS_PER_PAGE && (
            <div className="end-message">
              You've reached the end of the list ({allPosts.length} posts)
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PostList
