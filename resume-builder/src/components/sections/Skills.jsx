import { useResume } from '../../context/ResumeContext'
import { SectionCard, EntryCard, Field, TextInput, AddButton } from '../ui/SectionCard'

const BLANK = { category: '', items: [] }

export default function Skills() {
  const { resume, addItem, updateItem, removeItem, reorderItem, toggleSection } = useResume()
  const enabled = resume.settings.activeSections.includes('skills')
  const items = resume.skills

  const handleItemsChange = (id, value) => {
    // value is a comma-separated string → store as array
    const arr = value.split(',').map(s => s.trim()).filter(Boolean)
    updateItem('skills', id, { items: arr })
  }

  return (
    <SectionCard title="Skills" icon="⚡" enabled={enabled}
      onToggle={() => toggleSection('skills')} badge={items.length > 0 ? `${items.reduce((a,s)=>a+(s.items?.length||0),0)} skills` : undefined}>

      <p className="text-xs text-slate-400 mb-3">
        Group skills by category. Separate skills with commas.
      </p>

      {items.map((skill, i) => (
        <EntryCard key={skill.id}
          onRemove={() => removeItem('skills', skill.id)}
          onMoveUp={() => reorderItem('skills', i, i - 1)}
          onMoveDown={() => reorderItem('skills', i, i + 1)}
          canMoveUp={i > 0} canMoveDown={i < items.length - 1}>

          <div className="grid grid-cols-1 gap-2 pr-14">
            <Field label="Category">
              <TextInput value={skill.category}
                onChange={v => updateItem('skills', skill.id, { category: v })}
                placeholder="Frontend / Backend / Tools / Soft Skills" />
            </Field>
            <Field label="Skills (comma separated)" hint="e.g. React, TypeScript, Node.js, AWS">
              <TextInput
                value={Array.isArray(skill.items) ? skill.items.join(', ') : skill.items}
                onChange={v => handleItemsChange(skill.id, v)}
                placeholder="React, TypeScript, Next.js, Tailwind CSS" />
            </Field>
          </div>
        </EntryCard>
      ))}

      <AddButton onClick={() => addItem('skills', BLANK)} label="Add Skill Category" />
    </SectionCard>
  )
}
