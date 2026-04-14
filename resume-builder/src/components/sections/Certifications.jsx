import { useResume } from '../../context/ResumeContext'
import { SectionCard, EntryCard, Field, TextInput, AddButton } from '../ui/SectionCard'

const BLANK = { name: '', issuer: '', date: '', link: '' }

export default function Certifications() {
  const { resume, addItem, updateItem, removeItem, reorderItem, toggleSection } = useResume()
  const enabled = resume.settings.activeSections.includes('certifications')
  const items = resume.certifications

  return (
    <SectionCard title="Certifications" icon="🏆" enabled={enabled}
      onToggle={() => toggleSection('certifications')} badge={items.length > 0 ? `${items.length}` : undefined}>

      {items.map((cert, i) => (
        <EntryCard key={cert.id}
          onRemove={() => removeItem('certifications', cert.id)}
          onMoveUp={() => reorderItem('certifications', i, i - 1)}
          onMoveDown={() => reorderItem('certifications', i, i + 1)}
          canMoveUp={i > 0} canMoveDown={i < items.length - 1}>

          <div className="grid grid-cols-2 gap-2 pr-16">
            <div className="col-span-2">
              <Field label="Certification Name">
                <TextInput value={cert.name} onChange={v => updateItem('certifications', cert.id, { name: v })}
                  placeholder="AWS Solutions Architect – Associate" />
              </Field>
            </div>
            <Field label="Issuing Organization">
              <TextInput value={cert.issuer} onChange={v => updateItem('certifications', cert.id, { issuer: v })}
                placeholder="Amazon Web Services" />
            </Field>
            <Field label="Date Issued">
              <TextInput value={cert.date} onChange={v => updateItem('certifications', cert.id, { date: v })}
                placeholder="Aug 2023" />
            </Field>
            <div className="col-span-2">
              <Field label="Credential URL (optional)">
                <TextInput value={cert.link} onChange={v => updateItem('certifications', cert.id, { link: v })}
                  placeholder="credential.net/verify/abc123" />
              </Field>
            </div>
          </div>
        </EntryCard>
      ))}

      <AddButton onClick={() => addItem('certifications', BLANK)} label="Add Certification" />
    </SectionCard>
  )
}
