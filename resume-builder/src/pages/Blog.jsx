import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'
import Footer from '../components/Footer'

export default function Blog() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <title>Resume Tips & Career Blog 2026 — ResumeForge</title>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">R</div>
            <span className="font-bold text-slate-900">ResumeForge</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/blog" className="text-blue-600 font-semibold">Blog</Link>
            <Link to="/about" className="text-slate-600 hover:text-slate-900">About</Link>
            <Link to="/contact" className="text-slate-600 hover:text-slate-900">Contact</Link>
            <Link to="/" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 font-semibold">
              Build Resume →
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-blue-600 text-white py-14 px-4 text-center">
        <h1 className="text-3xl font-bold mb-3">Resume Tips & Career Blog</h1>
        <p className="text-blue-100 text-base max-w-xl mx-auto">
          Expert advice on writing resumes, passing ATS systems, and landing your dream job in 2026.
        </p>
      </div>

      {/* Posts Grid */}
      <div className="max-w-5xl mx-auto px-4 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {post.category}
                </span>
                <span className="text-xs text-slate-300 font-bold">
                  #{String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h2 className="text-sm font-bold text-slate-800 mb-2 flex-1 leading-snug">
                {post.title}
              </h2>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                {post.description}
              </p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
                <span className="text-xs text-slate-400">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </span>
                <span className="text-xs font-semibold text-blue-600">{post.readTime} →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 text-white py-10 px-4 text-center mt-auto">
        <h2 className="text-xl font-bold mb-2">Ready to Build Your Resume?</h2>
        <p className="text-blue-100 text-sm mb-4">Free, ATS-friendly, no account needed.</p>
        <Link to="/" className="inline-block bg-white text-blue-600 font-bold px-6 py-2.5 rounded-lg hover:bg-blue-50">
          🚀 Build My Resume Free
        </Link>
      </div>

      <Footer />
    </div>
  )
}