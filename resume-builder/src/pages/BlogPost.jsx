import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'
import Footer from '../components/Footer'

export default function BlogPost() {
  const { slug } = useParams()
  const post = blogPosts.find(p => p.slug === slug)

  useEffect(() => {
    if (!post) return

    // Meta Title
    document.title = `${post.title} | ResumeForge Blog`

    // Meta Description
    let m = document.querySelector('meta[name="description"]')
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
    m.content = post.description

    // Canonical
    let c = document.querySelector('link[rel="canonical"]')
    if (!c) { c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c) }
    c.href = `https://freeresumeforgebuilder.com/blog/${post.slug}`

    // Article Schema
    let s = document.querySelector('script[data-blog-schema]')
    if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.setAttribute('data-blog-schema', '1'); document.head.appendChild(s) }
    s.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.description,
      "datePublished": post.date,
      "dateModified": post.date,
      "author": { "@type": "Organization", "name": "ResumeForge" },
      "publisher": {
        "@type": "Organization",
        "name": "ResumeForge",
        "logo": { "@type": "ImageObject", "url": "https://freeresumeforgebuilder.com/favicon.png" }
      },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `https://freeresumeforgebuilder.com/blog/${post.slug}` },
      "url": `https://freeresumeforgebuilder.com/blog/${post.slug}`,
      "keywords": post.category + ", resume tips, ATS resume, free resume builder"
    })

    return () => {
      if (s && s.parentNode) s.parentNode.removeChild(s)
    }
  }, [post])

  if (!post) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#334155', marginBottom: '16px' }}>Post Not Found</h1>
        <Link to="/blog" style={{ color: '#2563eb', textDecoration: 'none' }}>← Back to Blog</Link>
      </div>
    )
  }

  const related = blogPosts.filter(p => p.slug !== slug).slice(0, 3)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px' }}>R</div>
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>ResumeForge</span>
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/blog" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px' }}>← Blog</Link>
            <Link to="/" style={{ background: '#2563eb', color: '#fff', padding: '6px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>
              Build Resume →
            </Link>
          </nav>
        </div>
      </header>

      {/* Article */}
      <article style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 16px', width: '100%', boxSizing: 'border-box' }}>

        {/* Category + Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
            {post.category}
          </span>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>{post.readTime}</span>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: '#0f172a', marginBottom: '16px', lineHeight: 1.3 }}>
          {post.title}
        </h1>

        {/* Description */}
        <p style={{ fontSize: '1.05rem', color: '#64748b', marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #e2e8f0', lineHeight: 1.7 }}>
          {post.description}
        </p>

        {/* Content */}
        <MarkdownContent content={post.content} />

        {/* Internal Links */}
        <div style={{ background: '#f0f4ff', borderRadius: '12px', padding: '20px', margin: '32px 0' }}>
          <p style={{ fontWeight: 700, color: '#1e3a5f', margin: '0 0 12px', fontSize: '14px' }}>📌 Also Read</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { to: '/free-resume-builder', label: '🚀 Free Resume Builder' },
              { to: '/ats-resume-builder', label: '🎯 ATS Resume Builder' },
              { to: '/resume-templates', label: '🎨 Resume Templates' },
              { to: '/resume-for-freshers', label: '🎓 Resume for Freshers' },
              { to: '/how-to-make-a-resume', label: '📝 How to Make a Resume' },
            ].map((l, i) => (
              <Link key={i} to={l.to} style={{ background: '#fff', border: '1px solid #2563eb', color: '#2563eb', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', textDecoration: 'none', fontWeight: 500 }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Box */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', borderRadius: '16px', padding: '32px', textAlign: 'center', marginTop: '32px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, margin: '0 0 8px' }}>
            Build Your Free ATS Resume Now
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: '0 0 20px' }}>
            No account needed. 6 templates. Download PDF in minutes.
          </p>
          <Link to="/" style={{ background: '#fff', color: '#2563eb', padding: '12px 28px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', display: 'inline-block' }}>
            🚀 Start Building Free
          </Link>
        </div>
      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 16px 48px', width: '100%', boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Related Articles</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {related.map(r => (
              <Link key={r.slug} to={`/blog/${r.slug}`} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', textDecoration: 'none', display: 'block', transition: 'box-shadow 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600, background: '#eff6ff', padding: '2px 8px', borderRadius: '20px' }}>{r.category}</span>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: '8px 0 4px', lineHeight: 1.4 }}>{r.title}</h3>
                <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>Read → </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

function MarkdownContent({ content }) {
  const lines = content.trim().split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 700, color: '#0f172a', marginTop: '32px', marginBottom: '12px' }}>
          {line.replace('## ', '')}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a5f', marginTop: '20px', marginBottom: '8px' }}>
          {line.replace('### ', '')}
        </h3>
      )
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listItems.push(
          <li key={i} style={{ color: '#475569', lineHeight: 1.7, marginBottom: '4px' }}>
            {renderInline(lines[i].replace(/^[-*] /, ''))}
          </li>
        )
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ paddingLeft: '20px', marginBottom: '16px' }}>
          {listItems}
        </ul>
      )
      continue
    } else if (/^\d+\. /.test(line)) {
      const listItems = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        listItems.push(
          <li key={i} style={{ color: '#475569', lineHeight: 1.7, marginBottom: '4px' }}>
            {renderInline(lines[i].replace(/^\d+\. /, ''))}
          </li>
        )
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} style={{ paddingLeft: '20px', marginBottom: '16px' }}>
          {listItems}
        </ol>
      )
      continue
    } else if (line.trim() === '') {
      // skip
    } else {
      elements.push(
        <p key={i} style={{ color: '#475569', marginBottom: '12px', lineHeight: 1.8, fontSize: '15px' }}>
          {renderInline(line)}
        </p>
      )
    }
    i++
  }

  return <div>{elements}</div>
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, j) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={j} style={{ fontWeight: 700, color: '#0f172a' }}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}