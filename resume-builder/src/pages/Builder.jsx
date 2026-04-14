import { useState } from 'react'
import Header from '../components/Header'
import FormPanel from '../components/FormPanel'
import PreviewPanel from '../components/PreviewPanel'

export default function Builder() {
  const [previewVisible, setPreviewVisible] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      
      {/* Hidden H1 for SEO */}
      <h1 className="sr-only">
        ResumeForge — Free ATS Resume Builder & CV Maker Online
      </h1>

      <Header previewVisible={previewVisible} setPreviewVisible={setPreviewVisible} />

      <div className="flex flex-1">
        
        <div className={`
          w-full lg:w-[420px] xl:w-[460px] flex-shrink-0
          bg-slate-50 border-r border-slate-200
          overflow-auto transition-all duration-300
          ${previewVisible ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'}
        `}>
          <FormPanel />
        </div>

        <div className={`
          flex-1 overflow-auto
          ${previewVisible ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'}
        `}>
          <PreviewPanel />
        </div>

      </div>

      {/* Bottom bar */}
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