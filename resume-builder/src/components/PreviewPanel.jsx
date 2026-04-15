import { useResume } from '../context/ResumeContext'
import ClassicTemplate from '../templates/ClassicTemplate'
import ModernTemplate from '../templates/ModernTemplate'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { useState } from 'react'

export default function PreviewPanel() {
  const { resume } = useResume()
  const [scale, setScale] = useState(0.82)

  const Template = resume.settings.template === 'prism' ? ModernTemplate : ClassicTemplate

  const zoomIn  = () => setScale(s => Math.min(s + 0.05, 1.3))
  const zoomOut = () => setScale(s => Math.max(s - 0.05, 0.4))
  const reset   = () => setScale(0.82)

  return (
    <div className="h-full flex flex-col">

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Live Preview
          </span>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {resume.settings.template === 'prism' ? '✨ Modern' : '📄 Classic'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={zoomOut} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500">
            <ZoomOut size={14} />
          </button>
          <button onClick={reset} className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-lg min-w-[42px] font-medium">
            {Math.round(scale * 100)}%
          </button>
          <button onClick={zoomIn} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500">
            <ZoomIn size={14} />
          </button>
        </div>
      </div>

      {/* Resume Sheet */}
      <div className="flex-1 overflow-y-auto flex justify-center py-6 px-3 bg-slate-100">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            width: '210mm',
            flexShrink: 0,
            marginBottom: `calc((${scale} - 1) * 900px)`
          }}
        >
          <div className="bg-white shadow-2xl ring-1 ring-slate-900/10 rounded-sm overflow-hidden">
            <Template resume={resume} />
          </div>
        </div>
      </div>

    </div>
  )
}