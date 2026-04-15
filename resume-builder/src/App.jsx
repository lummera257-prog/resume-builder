import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ResumeProvider } from './context/ResumeContext'

import Builder from './pages/Builder'
import About from './pages/About'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

// ✅ Footer HATA DIYA — ab sirf PageLayout mein rahega
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
        </Routes>
      </Router>
    </ResumeProvider>
  )
}