import { useResume } from '../context/ResumeContext'
import { exportToPDF } from '../utils/pdfExport'
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Download, FileText, RotateCcw, Sparkles,
  Eye, EyeOff, Globe, ChevronDown, Check
} from 'lucide-react'

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
  const btnRef                  = useRef(null)
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

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const filtered = LANGUAGES.filter(l =>
    l.label.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (lang) => {
    setSelected(lang)
    setOpen(false)
    triggerGoogleTranslate(lang.code)
  }

  const dropdownStyle = isMobile ? {
    position: 'fixed', top: '60px', left: '8px', right: '8px',
    width: 'auto', maxHeight: '70vh', background: '#fff',
    borderRadius: '14px', border: '1px solid #e5e7eb',
    boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
    overflow: 'hidden', animation: 'langDropDown 0.15s ease', zIndex: 9999,
  } : {
    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
    width: '216px', background: '#fff', borderRadius: '12px',
    border: '1px solid #e5e7eb', boxShadow: '0 10px 40px rgba(0,0,0,0.13)',
    overflow: 'hidden', animation: 'langDropDown 0.15s ease', zIndex: 9999,
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative', zIndex: 100 }}>

      <button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        aria-label={`Change language. Currently: ${selected.label}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          height: '32px', padding: '0 10px 0 8px', borderRadius: '8px',
          border: `1px solid ${open ? '#93c5fd' : '#e2e8f0'}`,
          background: open ? '#eff6ff' : '#fff',
          cursor: 'pointer', fontWeight: 500, color: '#374151',
          whiteSpace: 'nowrap',
          boxShadow: open ? '0 0 0 3px rgba(37,99,235,0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
          outline: 'none', transition: 'all 0.15s ease', userSelect: 'none',
        }}
      >
        <Globe size={13} color={open ? '#2563eb' : '#6b7280'} strokeWidth={2} aria-hidden="true" />
        <span style={{ fontSize: '15px', lineHeight: 1 }} aria-hidden="true">{selected.flag}</span>
        <span className="hidden md:inline"
          style={{ fontSize: '12.5px', color: open ? '#1d4ed8' : '#374151' }}>
          {selected.label}
        </span>
        <ChevronDown size={11} color={open ? '#2563eb' : '#9ca3af'} aria-hidden="true"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }} />
      </button>

      {open && isMobile && (
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 9998 }}
        />
      )}

      {open && (
        <div style={dropdownStyle} role="dialog" aria-label="Select language">

          {isMobile && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
              <div aria-hidden="true"
                style={{ width: '36px', height: '4px', borderRadius: '2px', background: '#e5e7eb' }} />
            </div>
          )}

          <div style={{ padding: '10px 10px 8px', borderBottom: '1px solid #f1f5f9' }}>
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search language..."
              aria-label="Search language"
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '8px',
                border: '1px solid #e5e7eb', fontSize: '13px', color: '#1f2937',
                outline: 'none', boxSizing: 'border-box', background: '#f8fafc',
                fontFamily: 'inherit',
              }}
              onFocus={e => (e.target.style.borderColor = '#93c5fd')}
              onBlur={e  => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>

          <ul
            role="listbox"
            aria-label="Available languages"
            style={{
              listStyle: 'none', margin: 0, padding: '6px',
              maxHeight: isMobile ? '50vh' : '224px',
              overflowY: 'auto', scrollbarWidth: 'thin',
            }}
          >
            {filtered.length === 0 && (
              <li style={{ padding: '16px', textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>
                No results
              </li>
            )}
            {filtered.map(lang => {
              const active = lang.code === selected.code
              return (
                <li key={lang.code} role="option" aria-selected={active}>
                  <button
                    onClick={() => handleSelect(lang)}
                    aria-label={`Select ${lang.label}`}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                      padding: isMobile ? '10px 12px' : '7px 10px',
                      borderRadius: '8px', border: 'none',
                      background: active ? '#eff6ff' : 'transparent',
                      cursor: 'pointer',
                      fontSize: isMobile ? '14px' : '13px',
                      color: active ? '#1d4ed8' : '#1f2937',
                      fontWeight: active ? 600 : 400,
                      textAlign: 'left', transition: 'background 0.1s', fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f1f5f9' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span aria-hidden="true" style={{ fontSize: '18px', lineHeight: 1, flexShrink: 0 }}>
                      {lang.flag}
                    </span>
                    <span style={{ flex: 1 }}>{lang.label}</span>
                    {active && <Check size={14} color="#1d4ed8" strokeWidth={2.5} aria-hidden="true" />}
                  </button>
                </li>
              )
            })}
          </ul>

          <div aria-hidden="true" style={{
            padding: '8px 14px', borderTop: '1px solid #f1f5f9',
            fontSize: '11px', color: '#6b7280', textAlign: 'center',
          }}>
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

export default function Header({ previewVisible, setPreviewVisible }) {
  const { resume, resetResume, loadSample } = useResume()
  const [exporting,   setExporting]   = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    await exportToPDF('resume-preview', resume.personalInfo.name || 'Resume')
    setExporting(false)
  }

  return (
    <>
      {/* Skip link — screen readers ke liye */}
      
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1 focus:bg-blue-600 focus:text-white focus:rounded"
      >
        Skip to main content
      </a>

      <header role="banner" className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div id="google_translate_element" style={{ display: 'none' }} aria-hidden="true" />

        <div className="flex items-center gap-3 px-4 h-14 max-w-screen-2xl mx-auto">

          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center"
              aria-hidden="true"
            >
              <FileText size={16} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-slate-900 text-base">ResumeForge</span>
              <span className="ml-1.5 text-xs text-slate-600 hidden md:inline">
                Free Resume Builder
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1 ml-2">
            <Link to="/blog"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              Blog
            </Link>
            <Link to="/about"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              About
            </Link>
            <Link to="/contact"
              className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex-1" />

          {/* Right Actions */}
          <div className="flex items-center gap-2" role="toolbar" aria-label="Builder actions">

            <LanguageSelector />

            <div
              style={{ width: '1px', height: '20px', background: '#e2e8f0', margin: '0 2px' }}
              aria-hidden="true"
            />

            {/* Sample */}
            <button
              onClick={loadSample}
              aria-label="Load sample resume data"
              className="hidden sm:flex items-center gap-1 text-xs px-3 py-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-slate-700 font-medium"
            >
              <Sparkles size={13} aria-hidden="true" />
              <span className="hidden md:inline">Sample</span>
            </button>

            {/* Reset */}
            {showConfirm ? (
              <div className="flex items-center gap-1" role="group" aria-label="Confirm reset">
                <span className="text-xs text-slate-600 hidden sm:inline">Clear all?</span>
                <button
                  onClick={() => { resetResume(); setShowConfirm(false) }}
                  aria-label="Confirm clear resume"
                  className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors font-medium"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  aria-label="Cancel clear resume"
                  className="text-xs px-2 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                aria-label="Reset resume — clear all data"
                className="hidden sm:flex items-center gap-1 text-xs px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-700"
              >
                <RotateCcw size={13} aria-hidden="true" />
                <span className="hidden md:inline">Reset</span>
              </button>
            )}

            {/* Preview Toggle */}
            <button
              onClick={() => setPreviewVisible(v => !v)}
              aria-label={previewVisible ? 'Switch to edit form' : 'Switch to resume preview'}
              aria-pressed={previewVisible}
              className="md:hidden flex items-center gap-1 text-xs px-3 py-1.5 bg-slate-100 rounded-lg text-slate-700 font-medium"
            >
              {previewVisible
                ? <EyeOff size={13} aria-hidden="true" />
                : <Eye size={13} aria-hidden="true" />
              }
              <span>{previewVisible ? 'Form' : 'Preview'}</span>
            </button>

            {/* Download */}
            <button
              onClick={handleExport}
              disabled={exporting}
              aria-label={exporting ? 'Generating PDF, please wait' : 'Download resume as PDF'}
              aria-busy={exporting}
              className="flex items-center gap-1 text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 transition-colors font-medium"
            >
              <Download size={14} className={exporting ? 'animate-bounce' : ''} aria-hidden="true" />
              {exporting ? 'Generating…' : 'Download'}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}