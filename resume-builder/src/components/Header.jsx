import { useResume } from '../context/ResumeContext'
import { exportToPDF } from '../utils/pdfExport'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, FileText, RotateCcw, Sparkles, Eye, EyeOff } from 'lucide-react'

export default function Header({ previewVisible, setPreviewVisible }) {
  const { resume, resetResume, loadSample } = useResume()
  const [exporting, setExporting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    await exportToPDF('resume-preview', resume.personalInfo.name || 'Resume')
    setExporting(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="flex items-center gap-3 px-4 h-14 max-w-screen-2xl mx-auto">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <FileText size={16} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-slate-900 text-base">ResumeForge</span>
            <span className="ml-1.5 text-xs text-slate-500 hidden md:inline">Free Resume Builder</span>
          </div>
        </div>

        {/* Nav */}
        <div className="hidden md:flex items-center gap-1 ml-2">
          <Link to="/blog" className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100">Blog</Link>
          <Link to="/about" className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100">About</Link>
          <Link to="/contact" className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100">Contact</Link>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button onClick={loadSample} className="hidden sm:flex items-center gap-1 text-xs px-3 py-1.5 bg-slate-100 rounded-lg hover:bg-slate-200">
            <Sparkles size={13} />
            <span className="hidden md:inline">Sample</span>
          </button>

          {showConfirm ? (
            <div className="flex items-center gap-1">
              <span className="text-xs">Clear?</span>
              <button onClick={() => { resetResume(); setShowConfirm(false) }} className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">Yes</button>
              <button onClick={() => setShowConfirm(false)} className="text-xs px-2 py-1 bg-slate-200 rounded">No</button>
            </div>
          ) : (
            <button onClick={() => setShowConfirm(true)} className="hidden sm:flex items-center gap-1 text-xs px-3 py-1.5 hover:bg-slate-100 rounded-lg">
              <RotateCcw size={13} />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}

          <button onClick={() => setPreviewVisible(v => !v)} className="md:hidden flex items-center gap-1 text-xs px-3 py-1.5 bg-slate-100 rounded-lg">
            {previewVisible ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{previewVisible ? 'Form' : 'Preview'}</span>
          </button>

          <button onClick={handleExport} disabled={exporting} className="flex items-center gap-1 text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70">
            <Download size={14} className={exporting ? 'animate-bounce' : ''} />
            {exporting ? 'Generating…' : 'Download'}
          </button>
        </div>
      </div>
    </header>
  )
}