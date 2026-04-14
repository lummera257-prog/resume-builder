import { useResume } from '../../context/ResumeContext'
import { SectionCard, EntryCard, Field, TextInput, TextArea, AddButton } from '../ui/SectionCard'

const BLANK = { title: '', description: '', date: '' }

export default function Achievements() {
  const { resume, addItem, updateItem, removeItem, reorderItem, toggleSection } = useResume()
  const enabled = resume.settings.activeSections.includes('achievements')
  const items = resume.achievements

  return (
    <SectionCard title="Achievements & Awards" icon="⭐" enabled={enabled}
      onToggle={() => toggleSection('achievements')} badge={items.length > 0 ? `${items.length}` : undefined}>

      {items.map((ach, i) => (
        <EntryCard key={ach.id}
          onRemove={() => removeItem('achievements', ach.id)}
          onMoveUp={() => reorderItem('achievements', i, i - 1)}
          onMoveDown={() => reorderItem('achievements', i, i + 1)}
          canMoveUp={i > 0} canMoveDown={i < items.length - 1}>

          <div className="grid grid-cols-2 gap-2 pr-16">
            <div className="col-span-2">
              <Field label="Achievement Title">
                <TextInput value={ach.title} onChange={v => updateItem('achievements', ach.id, { title: v })}
                  placeholder="Winner — National Hackathon 2023" />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Description">
                <TextArea value={ach.description}
                  onChange={v => updateItem('achievements', ach.id, { description: v })}
                  rows={2}
                  placeholder="Won 1st place among 800+ teams for building an accessibility tool." />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Date (optional)">
                <TextInput value={ach.date} onChange={v => updateItem('achievements', ach.id, { date: v })}
                  placeholder="Sep 2023" />
              </Field>
            </div>
          </div>
        </EntryCard>
      ))}

      <AddButton onClick={() => addItem('achievements', BLANK)} label="Add Achievement" />
    </SectionCard>
  )
}
