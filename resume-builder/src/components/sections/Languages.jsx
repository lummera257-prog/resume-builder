import { useResume } from '../../context/ResumeContext'
import { SectionCard, EntryCard, Field, TextInput, Select, AddButton } from '../ui/SectionCard'
import { PROFICIENCY_LEVELS } from '../../utils/defaultData'

const BLANK = { language: '', proficiency: 'Professional' }

export default function Languages() {
  const { resume, addItem, updateItem, removeItem, reorderItem, toggleSection } = useResume()
  const enabled = resume.settings.activeSections.includes('languages')
  const items = resume.languages

  return (
    <SectionCard title="Languages" icon="🌐" enabled={enabled}
      onToggle={() => toggleSection('languages')} badge={items.length > 0 ? `${items.length}` : undefined}>

      {items.map((lang, i) => (
        <EntryCard key={lang.id}
          onRemove={() => removeItem('languages', lang.id)}
          onMoveUp={() => reorderItem('languages', i, i - 1)}
          onMoveDown={() => reorderItem('languages', i, i + 1)}
          canMoveUp={i > 0} canMoveDown={i < items.length - 1}>

          <div className="grid grid-cols-2 gap-2 pr-16">
            <Field label="Language">
              <TextInput value={lang.language} onChange={v => updateItem('languages', lang.id, { language: v })}
                placeholder="English" />
            </Field>
            <Field label="Proficiency">
              <Select value={lang.proficiency}
                onChange={v => updateItem('languages', lang.id, { proficiency: v })}
                options={PROFICIENCY_LEVELS} />
            </Field>
          </div>
        </EntryCard>
      ))}

      <AddButton onClick={() => addItem('languages', BLANK)} label="Add Language" />
    </SectionCard>
  )
}
