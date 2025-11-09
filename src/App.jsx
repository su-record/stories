import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

// Lazy load route components for code-splitting
const PostList = lazy(() => import('./components/PostList'))
const PostView = lazy(() => import('./components/PostView'))
const NotFound = lazy(() => import('./components/NotFound'))

function App() {
  return (
    <Router basename="/stories">
      <Layout>
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/category/:category" element={<PostList />} />
            <Route path="/posts/:slug" element={<PostView />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  )
}

export default App
