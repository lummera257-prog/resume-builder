import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'
import Footer from '../components/Footer'
import { FileText, Globe, ChevronDown, Check } from 'lucide-react'

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
        style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          height: '32px', padding: '0 10px 0 8px', borderRadius: '8px',
          border: `1px solid ${open ? '#93c5fd' : '#e2e8f0'}`,
          background: open ? '#eff6ff' : '#fff', cursor: 'pointer',
          fontWeight: 500, color: '#374151', whiteSpace: 'nowrap',
          boxShadow: open ? '0 0 0 3px rgba(37,99,235,0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
          outline: 'none', transition: 'all 0.15s ease', userSelect: 'none',
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

export default function Blog() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <title>Resume Tips & Career Blog 2026 — ResumeForge</title>

      {/* Header — matches main Header.jsx */}
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
            <Link to="/blog"    className="text-sm text-blue-600 font-semibold px-3 py-1.5 rounded-lg bg-blue-50">Blog</Link>
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