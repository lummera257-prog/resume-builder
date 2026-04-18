import { useResume } from '../context/ResumeContext'
import { exportToPDF } from '../utils/pdfExport'
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Download, FileText, RotateCcw, Sparkles,
  Eye, EyeOff, Globe, ChevronDown, Check
} from 'lucide-react'

// ── All supported languages ───────────────────────────────
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

// ── Trigger Google Translate programmatically ─────────────
function triggerGoogleTranslate(langCode) {
  const select = document.querySelector('.goog-te-combo')
  if (!select) return
  select.value = langCode
  select.dispatchEvent(new Event('change'))
}

// ── Language Selector Component ───────────────────────────
function LanguageSelector() {
  const [open, setOpen]         = useState(false)
  const [selected, setSelected] = useState(LANGUAGES[0])
  const [search, setSearch]     = useState('')
  const dropdownRef             = useRef(null)
  const searchRef               = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Focus search when dropdown opens
  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50)
    } else {
      setSearch('')
    }
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
    <div ref={dropdownRef} style={{ position: 'relative', zIndex: 100 }}>

      {/* ── Trigger Button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display:        'flex',
          alignItems:     'center',
          gap:            '5px',
          height:         '32px',
          padding:        '0 10px 0 8px',
          borderRadius:   '8px',
          border:         `1px solid ${open ? '#93c5fd' : '#e2e8f0'}`,
          background:     open ? '#eff6ff' : '#fff',
          cursor:         'pointer',
          fontSize:       '12.5px',
          fontWeight:     500,
          color:          '#374151',
          whiteSpace:     'nowrap',
          boxShadow:      open ? '0 0 0 3px rgba(37,99,235,0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
          outline:        'none',
          transition:     'all 0.15s ease',
          userSelect:     'none',
        }}
      >
        <Globe size={13} color={open ? '#2563eb' : '#6b7280'} strokeWidth={2} />
        <span style={{ fontSize: '15px', lineHeight: 1 }}>{selected.flag}</span>
        {/* Label — hidden on small screens */}
        <span style={{
          color:    open ? '#1d4ed8' : '#374151',
          fontSize: '12.5px',
          display:  'none',
        }}
          className="hidden md:inline"
        >
          {selected.label}
        </span>
        <ChevronDown
          size={11}
          color={open ? '#2563eb' : '#9ca3af'}
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }}
        />
      </button>

      {/* ── Dropdown Panel ── */}
      {open && (
        <div style={{
          position:     'absolute',
          top:          'calc(100% + 8px)',
          right:        0,
          width:        '216px',
          background:   '#fff',
          borderRadius: '12px',
          border:       '1px solid #e5e7eb',
          boxShadow:    '0 10px 40px rgba(0,0,0,0.13)',
          overflow:     'hidden',
          animation:    'langDropDown 0.15s ease',
        }}>

          {/* Search bar */}
          <div style={{ padding: '10px 10px 8px', borderBottom: '1px solid #f1f5f9' }}>
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search language..."
              style={{
                width:        '100%',
                padding:      '6px 10px',
                borderRadius: '7px',
                border:       '1px solid #e5e7eb',
                fontSize:     '12px',
                color:        '#374151',
                outline:      'none',
                boxSizing:    'border-box',
                background:   '#f8fafc',
                fontFamily:   'inherit',
                transition:   'border-color 0.15s',
              }}
              onFocus={e  => (e.target.style.borderColor = '#93c5fd')}
              onBlur={e   => (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>

          {/* Language list */}
          <ul style={{
            listStyle:  'none',
            margin:     0,
            padding:    '6px',
            maxHeight:  '224px',
            overflowY:  'auto',
            scrollbarWidth: 'thin',
          }}>
            {filtered.length === 0 && (
              <li style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
                No languages found
              </li>
            )}
            {filtered.map(lang => {
              const active = lang.code === selected.code
              return (
                <li key={lang.code}>
                  <button
                    onClick={() => handleSelect(lang)}
                    style={{
                      width:        '100%',
                      display:      'flex',
                      alignItems:   'center',
                      gap:          '10px',
                      padding:      '7px 10px',
                      borderRadius: '7px',
                      border:       'none',
                      background:   active ? '#eff6ff' : 'transparent',
                      cursor:       'pointer',
                      fontSize:     '13px',
                      color:        active ? '#1d4ed8' : '#374151',
                      fontWeight:   active ? 600 : 400,
                      textAlign:    'left',
                      transition:   'background 0.1s',
                      fontFamily:   'inherit',
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
            padding:      '7px 12px',
            borderTop:    '1px solid #f1f5f9',
            fontSize:     '11px',
            color:        '#9ca3af',
            textAlign:    'center',
          }}>
            {LANGUAGES.length} languages • Powered by Google
          </div>
        </div>
      )}

      {/* Animation keyframe */}
      <style>{`
        @keyframes langDropDown {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)  scale(1);    }
        }
      `}</style>
    </div>
  )
}

// ── Main Header ────────────────────────────────────────────
export default function Header({ previewVisible, setPreviewVisible }) {
  const { resume, resetResume, loadSample } = useResume()
  const [exporting,    setExporting]    = useState(false)
  const [showConfirm,  setShowConfirm]  = useState(false)

  const handleExport = async () => {
    setExporting(true)
    await exportToPDF('resume-preview', resume.personalInfo.name || 'Resume')
    setExporting(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">

      {/* Hidden Google Translate mount point — DO NOT REMOVE */}
      <div id="google_translate_element" style={{ display: 'none' }} />

      <div className="flex items-center gap-3 px-4 h-14 max-w-screen-2xl mx-auto">

        {/* ── Logo ── */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <FileText size={16} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-slate-900 text-base">ResumeForge</span>
            <span className="ml-1.5 text-xs text-slate-500 hidden md:inline">
              Free Resume Builder
            </span>
          </div>
        </div>

        {/* ── Nav links ── */}
        <div className="hidden md:flex items-center gap-1 ml-2">
          <Link to="/blog"
            className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            Blog
          </Link>
          <Link to="/about"
            className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            About
          </Link>
          <Link to="/contact"
            className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            Contact
          </Link>
        </div>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-2">

          {/* 🌐 Language Selector — just before Sample */}
          <LanguageSelector />

          {/* Divider */}
          <div style={{ width: '1px', height: '20px', background: '#e2e8f0', margin: '0 2px' }} />

          {/* Sample */}
          <button
            onClick={loadSample}
            className="hidden sm:flex items-center gap-1 text-xs px-3 py-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Sparkles size={13} />
            <span className="hidden md:inline">Sample</span>
          </button>

          {/* Reset */}
          {showConfirm ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-500 hidden sm:inline">Clear?</span>
              <button
                onClick={() => { resetResume(); setShowConfirm(false) }}
                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >Yes</button>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-xs px-2 py-1 bg-slate-200 rounded hover:bg-slate-300 transition-colors"
              >No</button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="hidden sm:flex items-center gap-1 text-xs px-3 py-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw size={13} />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}

          {/* Toggle preview — mobile only */}
          <button
            onClick={() => setPreviewVisible(v => !v)}
            className="md:hidden flex items-center gap-1 text-xs px-3 py-1.5 bg-slate-100 rounded-lg"
          >
            {previewVisible ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{previewVisible ? 'Form' : 'Preview'}</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1 text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 transition-colors"
          >
            <Download size={14} className={exporting ? 'animate-bounce' : ''} />
            {exporting ? 'Generating…' : 'Download'}
          </button>
        </div>

      </div>
    </header>
  )
}