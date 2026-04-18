import { Link, useLocation } from 'react-router-dom'
import { FileText, Globe, ChevronDown, Check } from 'lucide-react'
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
  // Method 1: Official doGTranslate function
  if (typeof window.doGTranslate === 'function') {
    window.doGTranslate(`en|${langCode}`)
    return
  }
  // Method 2: combo select
  const select = document.querySelector('.goog-te-combo')
  if (select) {
    select.value = langCode
    select.dispatchEvent(new Event('change'))
    return
  }
  // Method 3: cookie fallback
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

      {/* Trigger */}
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

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: '216px', background: '#fff', borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 40px rgba(0,0,0,0.13)',
          overflow: 'hidden', animation: 'navLangDrop 0.15s ease',
        }}>
          {/* Search */}
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

          {/* List */}
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

          {/* Footer */}
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

// ── NavBar ────────────────────────────────────────────────
export default function NavBar() {
  const location = useLocation()

  const navLinks = [
    { to: '/blog',    label: 'Blog'    },
    { to: '/about',   label: 'About'   },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">

      {/* Hidden Google Translate mount — DO NOT REMOVE */}
      <div id="google_translate_element" style={{ display: 'none' }} />

      <div className="flex items-center justify-between px-4 h-14 max-w-4xl mx-auto">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <FileText size={16} className="text-white" />
          </div>
          <span className="font-bold text-slate-800 text-base tracking-tight">
            ResumeForge
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-1 sm:gap-3">

          {/* Nav Links */}
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors hidden sm:inline-block ${
                location.pathname === link.to
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}>
              {link.label}
            </Link>
          ))}

          {/* 🌐 Language Selector */}
          <LanguageSelector />

          {/* CTA */}
          <Link to="/"
            className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold whitespace-nowrap">
            Build My Resume →
          </Link>
        </div>
      </div>
    </header>
  )
}