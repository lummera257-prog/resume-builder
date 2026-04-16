import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ResumeProvider } from './context/ResumeContext'

import Builder from './pages/Builder'
import About from './pages/About'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

import FreeResumeBuilder from './pages/seo/FreeResumeBuilder'
import CvBuilder from './pages/seo/CvBuilder'
import AtsResumeBuilder from './pages/seo/AtsResumeBuilder'
import ResumeTemplates from './pages/seo/ResumeTemplates'
import ResumeExamples from './pages/seo/ResumeExamples'
import ResumeForFreshers from './pages/seo/ResumeForFreshers'
import SoftwareEngineerResume from './pages/seo/SoftwareEngineerResume'
import HowToMakeResume from './pages/seo/HowToMakeResume'
import AtsResumeChecker from './pages/seo/AtsResumeChecker'

export default function App() {
  return (
    <ResumeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Builder />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

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
      </Router>
    </ResumeProvider>
  )
}