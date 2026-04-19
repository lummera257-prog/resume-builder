import { useResume } from '../context/ResumeContext'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { useState, useRef, useEffect, lazy, Suspense } from 'react'

const ClassicTemplate   = lazy(() => import('../templates/ClassicTemplate'))
const ModernTemplate    = lazy(() => import('../templates/ModernTemplate'))
const MinimalTemplate   = lazy(() => import('../templates/MinimalTemplate'))
const ElegantTemplate   = lazy(() => import('../templates/ElegantTemplate'))
const ExecutiveTemplate = lazy(() => import('../templates/ExecutiveTemplate'))
const CreativeTemplate  = lazy(() => import('../templates/CreativeTemplate'))

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
  const [scale, setScale] = useState(0.55)
  const templateRef  = useRef(null)
  const containerRef = useRef(null)
  const [templateHeight, setTemplateHeight] = useState(1123)

  const Template = TEMPLATES[resume.settings.template] || ClassicTemplate
  const label    = TEMPLATE_LABELS[resume.settings.template] || '📄 Classic'

  // Auto-scale to fit container width
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const A4_WIDTH = 794
        const padding = 32
        const newScale = Math.min((containerWidth - padding) / A4_WIDTH, 1.0)
        setScale(Math.max(newScale, 0.3))
      }
    }
    updateScale()
    const observer = new ResizeObserver(updateScale)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Measure actual template height
  useEffect(() => {
    const measure = () => {
      if (templateRef.current) {
        setTemplateHeight(templateRef.current.scrollHeight)
      }
    }
    measure()
    const t = setTimeout(measure, 300)
    return () => clearTimeout(t)
  }, [resume, resume.settings.template])

  const zoomIn  = () => setScale(s => Math.min(s + 0.07, 1.4))
  const zoomOut = () => setScale(s => Math.max(s - 0.07, 0.3))
  const reset   = () => {
    if (containerRef.current) {
      const w = containerRef.current.offsetWidth
      setScale(Math.max(Math.min((w - 32) / 794, 1.0), 0.3))
    }
  }

  // Correct visual height after scaling
  const visualHeight = templateHeight * scale

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#f1f5f9',
      overflow: 'hidden', // ✅ outer overflow block
    }}>

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11px', fontWeight: 700, color: '#64748b',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            Live Preview
          </span>
          <span style={{
            fontSize: '11px', color: '#64748b',
            background: '#f1f5f9', padding: '2px 8px', borderRadius: '20px',
          }}>
            {label}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button onClick={zoomOut} style={{
            padding: '6px', borderRadius: '6px', border: 'none',
            background: 'transparent', cursor: 'pointer', color: '#64748b',
          }}>
            <ZoomOut size={14} />
          </button>
          <button onClick={reset} style={{
            padding: '4px 8px', fontSize: '11px', fontWeight: 600,
            color: '#374151', border: 'none', background: '#f1f5f9',
            borderRadius: '6px', cursor: 'pointer', minWidth: '40px',
          }}>
            {Math.round(scale * 100)}%
          </button>
          <button onClick={zoomIn} style={{
            padding: '6px', borderRadius: '6px', border: 'none',
            background: 'transparent', cursor: 'pointer', color: '#64748b',
          }}>
            <ZoomIn size={14} />
          </button>
        </div>
      </div>

      {/* Scrollable Preview Area */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden', // ✅ horizontal overflow block
          padding: '20px 12px 40px',
          scrollBehavior: 'smooth',
        }}
      >
        {/* Center wrapper */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>

          {/* Fixed height box — visual size of scaled resume */}
          <div style={{
            position: 'relative',
            width: '794px',
            maxWidth: '100%',        // ✅ container से बाहर नहीं जाएगा
            height: `${visualHeight}px`,
            flexShrink: 0,
            overflow: 'visible',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: `translateX(-50%) scale(${scale})`,
              transformOrigin: 'top center',
              width: '794px',
            }}>
              <div ref={templateRef} style={{
                boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}>
                <Suspense fallback={
                  <div style={{ height: '1123px', background: '#fff' }} />
                }>
                  <Template resume={resume} />
                </Suspense>
              </div>
            </div>
          </div>

        </div>

        {/* End of Preview indicator */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '8px', maxWidth: '320px', margin: '0 auto 8px',
          }}>
            <div style={{ flex: 1, height: '1px', background: '#cbd5e1' }} />
            <span style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
              End of Preview
            </span>
            <div style={{ flex: 1, height: '1px', background: '#cbd5e1' }} />
          </div>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
            ✅ Scroll up to review · Use zoom to inspect details
          </p>
        </div>

      </div>
    </div>
  )
}