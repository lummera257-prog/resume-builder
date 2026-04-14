import { Analytics } from '@vercel/analytics/react'
import { ResumeProvider } from './context/ResumeContext'
import Builder from './pages/Builder'

export default function App() {
  return (
    <ResumeProvider>
      <Builder />
      <Analytics />
    </ResumeProvider>
  )
}
