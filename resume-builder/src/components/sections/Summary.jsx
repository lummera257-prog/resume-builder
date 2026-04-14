import { useResume } from '../../context/ResumeContext'
import { SectionCard, Field, TextArea } from '../ui/SectionCard'

export default function Summary() {
  const { resume, updateSummary, toggleSection } = useResume()
  const enabled = resume.settings.activeSections.includes('summary')
  const words = resume.summary?.trim().split(/\s+/).filter(Boolean).length || 0

  return (
    <SectionCard title="Professional Summary" icon="📝"
      enabled={enabled} onToggle={() => toggleSection('summary')}
      badge={`${words} words`}>
      <Field hint="Tip: 50–80 words with keywords. Focus on value you bring, not what you want.">
        <TextArea
          value={resume.summary}
          onChange={updateSummary}
          rows={5}
          placeholder="Passionate software engineer with 5+ years building scalable web apps. Expert in React and Node.js. Led teams of 4+ engineers delivering products used by 200K+ users..."
        />
      </Field>
    </SectionCard>
  )
}
