import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'
import Footer from '../components/Footer'
import { FileText, Globe, ChevronDown, Check } from 'lucide-react'
import { useSEO } from '../utils/useSEO'

const LANGUAGES = [
  { code: 'en',    label: 'English',    flag: '🇺🇸' },
  { code: 'hi',    label: 'Hindi',      flag: '🇮🇳' },
  { code: 'es',    label: 'Spanish',    flag: '🇪🇸' },
  { code: 'fr',    label: 'French',     flag: '🇫🇷' },
  { code: 'de',    label: 'German',     flag: '🇩🇪' },
  { code: 'zh-CN', label: 'Chinese',    flag: '🇨🇳' },
  { code: 'ar',    label: 'Arabic',     flag: '🇸🇦' },
  { code: 'pt',    label: 'Portuguese', flag: '🇧🇷' },
  { code: 'ru',    label: 'Russian',    flag: '🇷🇺' },
  { code: 'ja',    label: 'Japanese',   flag: '🇯🇵' },
  { code: 'ko',    label: 'Korean',     flag: '🇰🇷' },
  { code: 'it',    label: 'Italian',    flag: '🇮🇹' },
  { code: 'tr',    label: 'Turkish',    flag: '🇹🇷' },
  { code: 'nl',    label: 'Dutch',      flag: '🇳🇱' },
  { code: 'pl',    label: 'Polish',     flag: '🇵🇱' },
  { code: 'bn',    label: 'Bengali',    flag: '🇧🇩' },
  { code: 'ur',    label: 'Urdu',       flag: '🇵🇰' },
  { code: 'id',    label: 'Indonesian', flag: '🇮🇩' },
  { code: 'vi',    label: 'Vietnamese', flag: '🇻🇳' },
  { code: 'th',    label: 'Thai',       flag: '🇹🇭' },
]

function triggerGoogleTranslate(langCode) {
  if (typeof window.doGTranslate === 'function') {
    window.doGTranslate(`en|${langCode}`)
    return
  }
  const select = document.querySelector('.goog-te-combo')
  if (select) {
    select.value = langCode
    select.dispatchEvent(new Event('change'))
    return
  }
  const hostname = window.location.hostname
  document.cookie = `googtrans=/en/${langCode};path=/;domain=${hostname}`
  document.cookie = `googtrans=/en/${langCode};path=/`
  window.location.reload()
}

function LanguageSelector() {
  const [open, setOpen]         = useState(false)
  const [selected, setSelected] = useState(LANGUAGES[0])
  const [search, setSearch]     = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const dropdownRef             = useRef(null)
  const searchRef               = useRef(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50)
    else setSearch('')
  }, [open])

  const filtered = LANGUAGES.filter(l =>
    l.label.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (lang) => {
    setSelected(lang)
    setOpen(false)
    triggerGoogleTranslate(lang.code)
  }

  const dropdownStyle = isMobile ? {
    position: 'fixed', top: '60px', left: '8px', right: '8px', width: 'auto',
    maxHeight: '70vh', background: '#fff', borderRadius: '14px',
    border: '1px solid #e5e7eb', boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
    overflow: 'hidden', animation: 'langDropDown 0.15s ease', zIndex: 9999,
  } : {
    position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '216px',
    background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb',
    boxShadow: '0 10px 40px rgba(0,0,0,0.13)', overflow: 'hidden',
    animation: 'langDropDown 0.15s ease', zIndex: 9999,
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative', zIndex: 100 }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={`Language: ${selected.label}`}
        style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          height: '32px', padding: '0 10px 0 8px', borderRadius: '8px',
          border: `1px solid ${open ? '#93c5fd' : '#e2e8f0'}`,
          background: open ? '#eff6ff' : '#fff', cursor: 'pointer',
          fontWeight: 500, color: '#374151', whiteSpace: 'nowrap',
          boxShadow: open ? '0 0 0 3px rgba(37,99,235,0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
          transition: 'all 0.15s ease', userSelect: 'none',
        }}
      >
        <Globe size={13} color={open ? '#2563eb' : '#6b7280'} strokeWidth={2} />
        <span style={{ fontSize: '15px', lineHeight: 1 }}>{selected.flag}</span>
        <span className="hidden md:inline" style={{ fontSize: '12.5px', color: open ? '#1d4ed8' : '#374151' }}>
          {selected.label}
        </span>
        <ChevronDown size={11} color={open ? '#2563eb' : '#9ca3af'}
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }} />
      </button>

      {open && isMobile && (
        <div onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 9998 }} />
      )}

      {open && (
        <div style={dropdownStyle}>
          {isMobile && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
              <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: '#e5e7eb' }} />
            </div>
          )}
          <div style={{ padding: '10px 10px 8px', borderBottom: '1px solid #f1f5f9' }}>
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search language..."
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '8px',
                border: '1px solid #e5e7eb', fontSize: '13px', color: '#374151',
                outline: 'none', boxSizing: 'border-box', background: '#f8fafc', fontFamily: 'inherit',
              }}
              onFocus={e => (e.target.style.borderColor = '#93c5fd')}
              onBlur={e  => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>
          <ul style={{
            listStyle: 'none', margin: 0, padding: '6px',
            maxHeight: isMobile ? '50vh' : '224px', overflowY: 'auto', scrollbarWidth: 'thin',
          }}>
            {filtered.length === 0 && (
              <li style={{ padding: '16px', textAlign: 'center', fontSize: '13px', color: '#9ca3af' }}>No results</li>
            )}
            {filtered.map(lang => {
              const active = lang.code === selected.code
              return (
                <li key={lang.code}>
                  <button
                    onClick={() => handleSelect(lang)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                      padding: isMobile ? '10px 12px' : '7px 10px',
                      borderRadius: '8px', border: 'none',
                      background: active ? '#eff6ff' : 'transparent',
                      cursor: 'pointer', fontSize: isMobile ? '14px' : '13px',
                      color: active ? '#1d4ed8' : '#374151',
                      fontWeight: active ? 600 : 400,
                      textAlign: 'left', transition: 'background 0.1s', fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f8fafc' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0 }}>{lang.flag}</span>
                    <span style={{ flex: 1 }}>{lang.label}</span>
                    {active && <Check size={14} color="#2563eb" strokeWidth={2.5} />}
                  </button>
                </li>
              )
            })}
          </ul>
          <div style={{ padding: '8px 14px', borderTop: '1px solid #f1f5f9', fontSize: '11px', color: '#9ca3af', textAlign: 'center' }}>
            {LANGUAGES.length} languages • Powered by Google
          </div>
        </div>
      )}

      <style>{`
        @keyframes langDropDown {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = blogPosts.find(p => p.slug === slug)

  useSEO({
    title: post ? `${post.title} | ResumeForge Blog` : 'Post Not Found | ResumeForge Blog',
    description: post?.description,
    path: post ? `/blog/${post.slug}` : '/blog',
    ogType: 'article',
  })

  useEffect(() => {
    if (!post) return

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

      {/* Header — exactly like main Header.jsx */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div id="google_translate_element" style={{ display: 'none' }} />
        <div className="flex items-center gap-3 px-4 h-14 max-w-screen-2xl mx-auto">

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <FileText size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-slate-900 text-base">ResumeForge</span>
              <span className="ml-1.5 text-xs text-slate-500 hidden md:inline">Free Resume Builder</span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1 ml-2">
            <Link to="/blog"    className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">Blog</Link>
            <Link to="/about"   className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">About</Link>
            <Link to="/contact" className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">Contact</Link>
          </div>

          <div className="flex-1" />

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <div style={{ width: '1px', height: '20px', background: '#e2e8f0', margin: '0 2px' }} />
            <Link to="/"
              style={{ textDecoration: 'none', fontWeight: 600 }}
              className="flex items-center gap-1 text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Build My Resume →
            </Link>
          </div>
        </div>
      </header>

      {/* Article */}
      <article style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 16px', width: '100%', boxSizing: 'border-box' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
            {post.category}
          </span>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>{post.readTime}</span>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: '#0f172a', marginBottom: '16px', lineHeight: 1.3 }}>
          {post.title}
        </h1>

        <p style={{ fontSize: '1.05rem', color: '#64748b', marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #e2e8f0', lineHeight: 1.7 }}>
          {post.description}
        </p>

        <MarkdownContent content={post.content} />

        <div style={{ background: '#f0f4ff', borderRadius: '12px', padding: '20px', margin: '32px 0' }}>
          <p style={{ fontWeight: 700, color: '#1e3a5f', margin: '0 0 12px', fontSize: '14px' }}>📌 Also Read</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { to: '/free-resume-builder',  label: '🚀 Free Resume Builder' },
              { to: '/ats-resume-builder',   label: '🎯 ATS Resume Builder' },
              { to: '/resume-templates',     label: '🎨 Resume Templates' },
              { to: '/resume-for-freshers',  label: '🎓 Resume for Freshers' },
              { to: '/how-to-make-a-resume', label: '📝 How to Make a Resume' },
            ].map((l, i) => (
              <Link key={i} to={l.to} style={{ background: '#fff', border: '1px solid #2563eb', color: '#2563eb', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', textDecoration: 'none', fontWeight: 500 }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

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
              <Link key={r.slug} to={`/blog/${r.slug}`}
                style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', textDecoration: 'none', display: 'block', transition: 'box-shadow 0.2s' }}
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
      elements.push(<ul key={`ul-${i}`} style={{ paddingLeft: '20px', marginBottom: '16px' }}>{listItems}</ul>)
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
      elements.push(<ol key={`ol-${i}`} style={{ paddingLeft: '20px', marginBottom: '16px' }}>{listItems}</ol>)
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