import { ResumeProvider } from './context/ResumeContext'
import Builder from './pages/Builder'

export default function App() {
  return (
    <ResumeProvider>
      <Builder />
    </ResumeProvider>
  )
}
