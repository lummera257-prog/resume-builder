import { useResume } from '../context/ResumeContext'
import ClassicTemplate from '../templates/ClassicTemplate'
import ModernTemplate from '../templates/ModernTemplate'
import MinimalTemplate from '../templates/MinimalTemplate'
import ElegantTemplate from '../templates/ElegantTemplate'
import ExecutiveTemplate from '../templates/ExecutiveTemplate'
import CreativeTemplate from '../templates/CreativeTemplate'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const TEMPLATES = {
  clarity:   ClassicTemplate,
  prism:     ModernTemplate,
  minimal:   MinimalTemplate,
  elegant:   ElegantTemplate,
  executive: ExecutiveTemplate,
  creative:  CreativeTemplate,
}

const TEMPLATE_LABELS = {
  clarity:   '📄 Classic',
  prism:     '✨ Modern',
  minimal:   '🪄 Minimal',
  elegant:   '💎 Elegant',
  executive: '🏆 Executive',
  creative:  '🎨 Creative',
}

export default function PreviewPanel() {
  const { resume } = useResume()
  const [scale, setScale] = useState(0.35)
  const templateRef = useRef(null)
  const [templateHeight, setTemplateHeight] = useState(1123)

  const Template = TEMPLATES[resume.settings.template] || ClassicTemplate
  const label    = TEMPLATE_LABELS[resume.settings.template] || '📄 Classic'

  // Measure actual rendered height every time template or resume changes
  useEffect(() => {
    if (templateRef.current) {
      setTemplateHeight(templateRef.current.scrollHeight)
    }
  }, [resume, resume.settings.template])

  const zoomIn  = () => setScale(s => Math.min(s + 0.07, 1.2))
  const zoomOut = () => setScale(s => Math.max(s - 0.07, 0.35))
  const reset   = () => setScale(0.35)

  // Correct margin = (scale - 1) * actualHeight in px
  const marginBottom = (scale - 1) * templateHeight

  return (
    <div className="h-full flex flex-col bg-slate-100">

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Preview</span>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{label}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={zoomOut} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" title="Zoom out">
            <ZoomOut size={14} />
          </button>
          <button onClick={reset} className="px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-lg transition-colors min-w-[42px]">
            {Math.round(scale * 100)}%
          </button>
          <button onClick={zoomIn} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" title="Zoom in">
            <ZoomIn size={14} />
          </button>
        </div>
      </div>

      {/* Scrollable preview area */}
      <div className="flex-1 overflow-auto py-6 px-4 flex justify-center">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            width: '210mm',
            flexShrink: 0,
            marginBottom: `${marginBottom}px`,
          }}
        >
          <div ref={templateRef} className="shadow-2xl ring-1 ring-slate-900/10">
            <Template resume={resume} />
          </div>
        </div>
      </div>

    </div>
  )
}