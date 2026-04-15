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
    <header className="sticky top-0 z-50 bg-white border-b border-slate-300 shadow-sm">
      <div className="flex items-center gap-3 px-4 h-14 max-w-screen-2xl mx-auto">

        {/* Logo */}
        <div className="flex items-center gap-2 mr-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <FileText size={16} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-slate-900 text-base tracking-tight">
              ResumeForge
            </span>
            <span className="ml-1.5 text-xs text-slate-500 font-medium hidden md:inline">
              Free Resume Builder
            </span>
          </div>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/about"
            className="text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            Contact
          </Link>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">

          {/* Load Sample */}
          <button
            onClick={loadSample}
            className="btn-secondary hidden sm:inline-flex text-xs py-1.5 px-3"
          >
            <Sparkles size={13} />
            <span className="hidden md:inline">Load Sample</span>
          </button>

          {/* Reset */}
          {showConfirm ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-600 font-medium">Clear all?</span>
              <button
                onClick={() => { resetResume(); setShowConfirm(false) }}
                className="text-xs px-2 py-1 bg-red-100 text-red-700 font-semibold rounded hover:bg-red-200 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-xs px-2 py-1 bg-slate-200 text-slate-700 font-semibold rounded hover:bg-slate-300 transition-colors"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="btn-ghost hidden sm:inline-flex text-xs py-1.5 px-3"
            >
              <RotateCcw size={13} />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}

          {/* Toggle Preview on Mobile */}
          <button
            onClick={() => setPreviewVisible(v => !v)}
            className="btn-secondary lg:hidden text-xs py-1.5 px-3"
          >
            {previewVisible ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{previewVisible ? 'Form' : 'Preview'}</span>
          </button>

          {/* Download PDF */}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="btn-primary text-sm py-2 px-4 disabled:opacity-70"
          >
            <Download size={14} className={exporting ? 'animate-bounce' : ''} />
            {exporting ? 'Generating…' : 'Download PDF'}
          </button>
        </div>
      </div>
    </header>
  )
}