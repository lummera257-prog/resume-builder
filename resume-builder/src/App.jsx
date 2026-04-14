import { ResumeProvider } from './context/ResumeContext'
import Builder from './pages/Builder'
import { SpeedInsights } from '@vercel/speed-insights/react'

export default function App() {
  return (
    <ResumeProvider>
      <Builder />
      <SpeedInsights />
    </ResumeProvider>
  )
}
