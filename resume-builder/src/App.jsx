import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ResumeProvider } from './context/ResumeContext'

import Builder from './pages/Builder'

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

export default function App() {
  return (
    <ResumeProvider>
      <Router>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <Routes>
            <Route path="/" element={<Builder />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Blog */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />

            {/* SEO Pages */}
            <Route path="/free-resume-builder" element={<FreeResumeBuilder />} />
            <Route path="/cv-builder" element={<CvBuilder />} />
            <Route path="/ats-resume-builder" element={<AtsResumeBuilder />} />
            <Route path="/resume-templates" element={<ResumeTemplates />} />
            <Route path="/resume-examples" element={<ResumeExamples />} />
            <Route path="/resume-for-freshers" element={<ResumeForFreshers />} />
            <Route path="/software-engineer-resume" element={<SoftwareEngineerResume />} />
            <Route path="/how-to-make-a-resume" element={<HowToMakeResume />} />
            <Route path="/ats-resume-checker" element={<AtsResumeChecker />} />
          </Routes>
        </Suspense>
      </Router>
    </ResumeProvider>
  )
}