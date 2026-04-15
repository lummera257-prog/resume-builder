import { useResume } from '../context/ResumeContext'
import ClassicTemplate from '../templates/ClassicTemplate'
import ModernTemplate from '../templates/ModernTemplate'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { useState } from 'react'

export default function PreviewPanel() {
  const { resume } = useResume()
  const [scale, setScale] = useState(0.85)

  const Template = resume.settings.template === 'prism' ? ModernTemplate : ClassicTemplate

  const zoomIn  = () => setScale(s => Math.min(s + 0.08, 1.2))
  const zoomOut = () => setScale(s => Math.max(s - 0.08, 0.5))
  const reset   = () => setScale(0.85)

  return (
    <div className="h-full flex flex-col bg-slate-100">

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Live Preview
          </span>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {resume.settings.template === 'prism' ? '✨ Modern' : '📄 Classic'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <ZoomOut size={14} />
          </button>

          <button
            onClick={reset}
            className="px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-lg min-w-[42px]"
          >
            {Math.round(scale * 100)}%
          </button>

          <button
            onClick={zoomIn}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <ZoomIn size={14} />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-y-auto flex justify-center items-start py-6 px-4">

        <div className="w-full max-w-3xl flex justify-center">
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              width: '210mm',
              flexShrink: 0,
              marginBottom: `calc((${scale} - 1) * 297mm)`
            }}
          >
            <div className="bg-white shadow-2xl rounded-lg overflow-hidden ring-1 ring-slate-900/10">
              <Template resume={resume} />
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}