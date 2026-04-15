import { useResume } from '../../context/ResumeContext'
import { SectionCard, Field, TextArea } from '../ui/SectionCard'

export default function Summary() {
  const { resume, updateSummary, toggleSection } = useResume()

  const enabled = resume.settings.activeSections.includes('summary')
  const words =
    resume.summary?.trim().split(/\s+/).filter(Boolean).length || 0

  return (
    <SectionCard
      title="Professional Summary"
      icon="📝"
      enabled={enabled}
      onToggle={() => toggleSection('summary')}
      badge={`${words} words`}
    >
      <Field hint="Tip: Keep it 50–80 words. Use strong keywords and measurable impact.">
        <TextArea
          value={resume.summary}
          onChange={updateSummary}
          rows={4}
          placeholder="Experienced software engineer with expertise in React and Node.js. Built scalable applications serving thousands of users. Passionate about clean code and performance optimization."
        />
      </Field>
    </SectionCard>
  )
}