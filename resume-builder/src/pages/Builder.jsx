import { useState } from 'react'
import Header from '../components/Header'
import FormPanel from '../components/FormPanel'
import PreviewPanel from '../components/PreviewPanel'
import Footer from '../components/Footer'

export default function Builder() {
  const [previewVisible, setPreviewVisible] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-slate-100">

      {/* Hidden H1 for SEO */}
      <h1 className="sr-only">
        ResumeForge — Free ATS Resume Builder & CV Maker Online
      </h1>

      <Header previewVisible={previewVisible} setPreviewVisible={setPreviewVisible} />

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — FORM (60%) */}
        <div className={`
          w-full md:w-3/5
          h-full overflow-y-auto
          bg-white border-r border-slate-300
          transition-all duration-300
          ${previewVisible ? 'hidden md:flex md:flex-col' : 'flex flex-col'}
        `}>
          <div className="max-w-xl mx-auto w-full p-4">
            <FormPanel />
          </div>
        </div>

        {/* RIGHT — PREVIEW (40%) */}
        <div className={`
          w-full md:w-2/5
          h-full overflow-y-auto bg-slate-100
          flex justify-center
          ${previewVisible ? 'flex flex-col' : 'hidden md:flex md:flex-col'}
        `}>
          <div className="w-full max-w-2xl p-4 md:p-6">
            <div className="bg-white shadow-lg rounded-xl">
              <PreviewPanel />
            </div>
          </div>
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