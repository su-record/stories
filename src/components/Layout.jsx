import { Link } from 'react-router-dom'
import './Layout.css'

function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <h1>Fallingo Blog</h1>
          </Link>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/category/methodology">Methodology</Link>
            <Link to="/category/dev-log">Dev Log</Link>
            <Link to="/category/tech">Tech</Link>
            <Link to="/category/story">Story</Link>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Fallingo Blog. Built with React 19 & Vite.</p>
          <p>
            <a href="https://github.com/su-record" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            {' · '}
            <a href="https://fallingo.app" target="_blank" rel="noopener noreferrer">
              Fallingo App
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
