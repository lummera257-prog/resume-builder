import { Link, useLocation } from 'react-router-dom'
import { FileText, Globe, ChevronDown, Check, Menu, X, Wrench, FileEdit, LogOut } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

// ── Languages ─────────────────────────────────────────────
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

// ── Google Translate Trigger ──────────────────────────────
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
  const host = window.location.hostname
  document.cookie = `googtrans=/en/${langCode};path=/;domain=${host}`
  document.cookie = `googtrans=/en/${langCode};path=/`
  window.location.reload()
}

// ── Language Selector ─────────────────────────────────────
function LanguageSelector() {
  const [open, setOpen]         = useState(false)
  const [selected, setSelected] = useState(LANGUAGES[0])
  const [search, setSearch]     = useState('')
  const ref                     = useRef(null)
  const searchRef               = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
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

  return (
    <div ref={ref} style={{ position: 'relative', zIndex: 100 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          height: '32px', padding: '0 10px 0 8px',
          borderRadius: '8px',
          border: `1px solid ${open ? '#93c5fd' : '#e2e8f0'}`,
          background: open ? '#eff6ff' : '#fff',
          cursor: 'pointer', fontWeight: 500, color: '#374151',
          whiteSpace: 'nowrap',
          boxShadow: open ? '0 0 0 3px rgba(37,99,235,0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
          outline: 'none', transition: 'all 0.15s ease',
        }}
      >
        <Globe size={13} color={open ? '#2563eb' : '#6b7280'} />
        <span style={{ fontSize: '15px', lineHeight: 1 }}>{selected.flag}</span>
        <span className="hidden md:inline"
          style={{ fontSize: '12.5px', color: open ? '#1d4ed8' : '#374151' }}>
          {selected.label}
        </span>
        <ChevronDown size={11} color={open ? '#2563eb' : '#9ca3af'}
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: '216px', background: '#fff', borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 40px rgba(0,0,0,0.13)',
          overflow: 'hidden', animation: 'navLangDrop 0.15s ease',
        }}>
          <div style={{ padding: '10px 10px 8px', borderBottom: '1px solid #f1f5f9' }}>
            <input ref={searchRef} value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search language..."
              style={{
                width: '100%', padding: '6px 10px', borderRadius: '7px',
                border: '1px solid #e5e7eb', fontSize: '12px', color: '#374151',
                outline: 'none', boxSizing: 'border-box', background: '#f8fafc',
                fontFamily: 'inherit', transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.target.style.borderColor = '#93c5fd')}
              onBlur={e  => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>

          <ul style={{
            listStyle: 'none', margin: 0, padding: '6px',
            maxHeight: '224px', overflowY: 'auto', scrollbarWidth: 'thin',
          }}>
            {filtered.length === 0 && (
              <li style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
                No results
              </li>
            )}
            {filtered.map(lang => {
              const active = lang.code === selected.code
              return (
                <li key={lang.code}>
                  <button onClick={() => handleSelect(lang)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '7px 10px', borderRadius: '7px', border: 'none',
                      background: active ? '#eff6ff' : 'transparent',
                      cursor: 'pointer', fontSize: '13px',
                      color: active ? '#1d4ed8' : '#374151',
                      fontWeight: active ? 600 : 400,
                      textAlign: 'left', transition: 'background 0.1s', fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f8fafc' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0 }}>{lang.flag}</span>
                    <span style={{ flex: 1 }}>{lang.label}</span>
                    {active && <Check size={13} color="#2563eb" strokeWidth={2.5} />}
                  </button>
                </li>
              )
            })}
          </ul>

          <div style={{
            padding: '7px 12px', borderTop: '1px solid #f1f5f9',
            fontSize: '11px', color: '#9ca3af', textAlign: 'center',
          }}>
            {LANGUAGES.length} languages • Powered by Google
          </div>
        </div>
      )}

      <style>{`
        @keyframes navLangDrop {
          from { opacity:0; transform:translateY(-8px) scale(0.97); }
          to   { opacity:1; transform:translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  )
}

// ── Tools Dropdown ──────────────────────────────────────────
function ToolsDropdown({ isMobile, closeMobileMenu }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (isMobile) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const handleEscape = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMobile])

  const tools = [
    { to: '/tools/ats-checker', label: 'ATS Resume Checker', desc: 'Scan and score your resume for ATS compatibility', icon: <Wrench size={16} className="text-blue-600" /> },
    { to: '/tools/cover-letter', label: 'Cover Letter Generator', desc: 'AI-generated, tailored cover letters instantly', icon: <FileEdit size={16} className="text-blue-600" /> },
    { to: '/tools/resignation-letter', label: 'Resignation Letter', desc: 'Professional resignation letter templates', icon: <LogOut size={16} className="text-blue-600" /> },
  ]

  if (isMobile) {
    return (
      <div className="flex flex-col gap-1 w-full">
        <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left text-sm font-medium px-3 py-2 text-slate-800 hover:bg-slate-50 rounded-lg">
          Tools
          <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div className="pl-4 flex flex-col gap-1 border-l-2 border-slate-100 ml-3">
            {tools.map(tool => (
              <Link key={tool.to} to={tool.to} onClick={closeMobileMenu} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50">
                <div className="mt-0.5">{tool.icon}</div>
                <div>
                  <div className="text-sm font-medium text-slate-800">{tool.label}</div>
                  <div className="text-xs text-slate-500">{tool.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={ref} className="relative inline-block text-left z-50">
      <button 
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center gap-1 focus:outline-none"
      >
        Tools
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div 
          onMouseLeave={() => setOpen(false)}
          className="absolute left-0 mt-1 w-72 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden transition-all duration-200 origin-top-left"
          style={{ animation: 'navLangDrop 0.15s ease' }}
        >
          <div className="py-2">
            {tools.map(tool => (
              <Link 
                key={tool.to} 
                to={tool.to} 
                className="group flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors outline-none focus:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                <div className="mt-0.5 p-1.5 bg-blue-50 rounded-md group-hover:bg-blue-100 transition-colors">
                  {tool.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {tool.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {tool.desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── NavBar ────────────────────────────────────────────────
export default function NavBar() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: '/blog',    label: 'Blog'    },
    { to: '/about',   label: 'About'   },
    { to: '/contact', label: 'Contact' },
  ]

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">

      {/* Hidden Google Translate mount — DO NOT REMOVE */}
      <div id="google_translate_element" style={{ display: 'none' }} />

      <div className="flex items-center justify-between px-4 h-14 max-w-6xl mx-auto">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <FileText size={16} className="text-white" />
          </div>
          <span className="font-bold text-slate-800 text-base tracking-tight">
            ResumeForge
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex flex-1 justify-center items-center gap-2 px-6">
          <ToolsDropdown isMobile={false} />
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                location.pathname === link.to
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* 🌐 Language Selector */}
          <LanguageSelector />

          {/* CTA Desktop */}
          <Link to="/builder"
            className="hidden sm:inline-flex text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold whitespace-nowrap items-center justify-center h-[32px]">
            Build My Resume →
          </Link>

          {/* Hamburger Menu Toggle */}
          <button 
            className="sm:hidden p-1 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden absolute top-14 left-0 w-full bg-white border-b border-slate-200 shadow-lg animate-fade-in flex flex-col p-4 gap-4 z-40">
          <ToolsDropdown isMobile={true} closeMobileMenu={() => setMobileMenuOpen(false)} />
          <div className="h-px bg-slate-100 w-full"></div>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                location.pathname === link.to
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-800 hover:bg-slate-50'
              }`}>
              {link.label}
            </Link>
          ))}
          <Link to="/builder"
            className="mt-2 text-sm bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center w-full">
            Build My Resume Free
          </Link>
        </div>
      )}
    </header>
  )
}