import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ResumeProvider } from './context/ResumeContext'

// Loading fallback
function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
    }}>
      <div style={{
        width: '32px', height: '32px',
        border: '3px solid #e2e8f0',
        borderTop: '3px solid #2563eb',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// सभी pages lazy load
const Home                   = lazy(() => import('./pages/Home'))
const Builder                = lazy(() => import('./pages/Builder'))
const About                  = lazy(() => import('./pages/About'))
const Contact                = lazy(() => import('./pages/Contact'))
const Privacy                = lazy(() => import('./pages/Privacy'))
const Terms                  = lazy(() => import('./pages/Terms'))
const Blog                   = lazy(() => import('./pages/Blog'))
const BlogPost               = lazy(() => import('./pages/BlogPost'))
const FreeResumeBuilder      = lazy(() => import('./pages/seo/FreeResumeBuilder'))
const CvBuilder              = lazy(() => import('./pages/seo/CvBuilder'))
const AtsResumeBuilder       = lazy(() => import('./pages/seo/AtsResumeBuilder'))
const ResumeTemplates        = lazy(() => import('./pages/seo/ResumeTemplates'))
const ResumeExamples         = lazy(() => import('./pages/seo/ResumeExamples'))
const ResumeForFreshers      = lazy(() => import('./pages/seo/ResumeForFreshers'))
const SoftwareEngineerResume = lazy(() => import('./pages/seo/SoftwareEngineerResume'))
const HowToMakeResume        = lazy(() => import('./pages/seo/HowToMakeResume'))
const AtsResumeChecker       = lazy(() => import('./pages/seo/AtsResumeChecker'))
const ToolAtsChecker         = lazy(() => import('./pages/tools/AtsChecker'))
const ToolCoverLetter        = lazy(() => import('./pages/tools/CoverLetter'))
const ToolResignationLetter  = lazy(() => import('./pages/tools/ResignationLetter'))
const NotFound                = lazy(() => import('./pages/NotFound'))
export default function App() {
  return (
    <ResumeProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"                        element={<Home />} />
            <Route path="/builder"                 element={<Builder />} />
            <Route path="/tools/ats-checker"       element={<ToolAtsChecker />} />
            <Route path="/tools/cover-letter"      element={<ToolCoverLetter />} />
            <Route path="/tools/resignation-letter" element={<ToolResignationLetter />} />
            <Route path="/about"                   element={<About />} />
            <Route path="/contact"                 element={<Contact />} />
            <Route path="/privacy"                 element={<Privacy />} />
            <Route path="/terms"                   element={<Terms />} />
            <Route path="/blog"                    element={<Blog />} />
            <Route path="/blog/:slug"              element={<BlogPost />} />
            <Route path="/free-resume-builder"     element={<FreeResumeBuilder />} />
            <Route path="/cv-builder"              element={<CvBuilder />} />
            <Route path="/ats-resume-builder"      element={<AtsResumeBuilder />} />
            <Route path="/resume-templates"        element={<ResumeTemplates />} />
            <Route path="/resume-examples"         element={<ResumeExamples />} />
            <Route path="/resume-for-freshers"     element={<ResumeForFreshers />} />
            <Route path="/software-engineer-resume" element={<SoftwareEngineerResume />} />
            <Route path="/how-to-make-a-resume"    element={<HowToMakeResume />} />
            <Route path="/ats-resume-checker"      element={<AtsResumeChecker />} />
            <Route path="*"                        element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </ResumeProvider>
  )
}