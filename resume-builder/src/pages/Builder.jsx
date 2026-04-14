import { useState } from 'react'
import Header from '../components/Header'
import FormPanel from '../components/FormPanel'
import PreviewPanel from '../components/PreviewPanel'

export default function Builder() {
  const [previewVisible, setPreviewVisible] = useState(false)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100">
      <Header previewVisible={previewVisible} setPreviewVisible={setPreviewVisible} />

      {/* Two-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Form Panel — always visible on desktop, toggled on mobile */}
        <div className={`
          w-full lg:w-[420px] xl:w-[460px] flex-shrink-0
          bg-slate-50 border-r border-slate-200
          overflow-hidden transition-all duration-300
          ${previewVisible ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'}
        `}>
          <FormPanel />
        </div>

        {/* Preview Panel — always visible on desktop, toggled on mobile */}
        <div className={`
          flex-1 overflow-hidden
          ${previewVisible ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'}
        `}>
          <PreviewPanel />
        </div>
      </div>

      {/* Footer bar */}
      <div className="h-7 bg-white border-t border-slate-200 flex items-center justify-between px-4 flex-shrink-0">
        <span className="text-[11px] text-slate-400">
          💾 Auto-saved to browser · No account needed · 100% Free
        </span>
        <span className="text-[11px] text-slate-400 hidden sm:block">
          Built with ❤️ — ResumeForge
        </span>
      </div>
    </div>
  )
}
