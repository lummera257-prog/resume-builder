import { useState } from 'react'
import Header from '../components/Header'
import FormPanel from '../components/FormPanel'
import PreviewPanel from '../components/PreviewPanel'
import Footer from '../components/Footer'

export default function Builder() {
  const [previewVisible, setPreviewVisible] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">

      {/* Hidden H1 for SEO */}
      <h1 className="sr-only">
        ResumeForge — Free ATS Resume Builder & CV Maker Online
      </h1>

      <Header previewVisible={previewVisible} setPreviewVisible={setPreviewVisible} />

      <div className="flex flex-1 overflow-hidden">

        {/* Form Panel — Left Side (narrower) */}
        <div className={`
          w-full lg:w-[340px] xl:w-[380px] flex-shrink-0
          bg-white border-r border-slate-300
          overflow-y-auto transition-all duration-300
          ${previewVisible ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'}
        `}>
          <FormPanel />
        </div>

        {/* Preview Panel — Right Side (takes all remaining space) */}
        <div className={`
          flex-1 min-w-0 overflow-auto bg-slate-100
          ${previewVisible ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'}
        `}>
          <PreviewPanel />
        </div>

      </div>

      {/* Bottom Status Bar */}
      <div className="h-7 bg-white border-t border-slate-300 flex items-center justify-between px-4 flex-shrink-0">
        <span className="text-[11px] text-slate-500 font-medium">
          💾 Auto-saved · No account needed · 100% Free
        </span>
        <span className="text-[11px] text-slate-500 hidden sm:block">
          Built with ❤️ — ResumeForge
        </span>
      </div>

      <Footer />

    </div>
  )
}