import { useResume } from '../../context/ResumeContext'
import { SectionCard, EntryCard, Field, TextInput, TextArea, AddButton } from '../ui/SectionCard'
import { genId } from '../../utils/defaultData'

export default function CustomSection({ section }) {
  const { updateCustomSection, removeCustomSection } = useResume()

  const addEntry = () => {
    const entry = { id: genId(), title: '', subtitle: '', description: '' }
    updateCustomSection(section.id, { entries: [...(section.entries || []), entry] })
  }

  const updateEntry = (entryId, data) => {
    const updated = section.entries.map(e => e.id === entryId ? { ...e, ...data } : e)
    updateCustomSection(section.id, { entries: updated })
  }

  const removeEntry = (entryId) => {
    updateCustomSection(section.id, { entries: section.entries.filter(e => e.id !== entryId) })
  }

  const moveEntry = (from, to) => {
    const arr = [...section.entries]
    const [item] = arr.splice(from, 1)
    arr.splice(to, 0, item)
    updateCustomSection(section.id, { entries: arr })
  }

  return (
    <SectionCard title={section.title || 'Custom Section'} icon="✏️" defaultOpen={true}>
      {/* Section title editor */}
      <div className="mb-4 pb-3 border-b border-slate-100">
        <Field label="Section Title">
          <div className="flex gap-2">
            <TextInput value={section.title}
              onChange={v => updateCustomSection(section.id, { title: v })}
              placeholder="Volunteer Work, Publications, Patents..." />
            <button type="button" onClick={() => removeCustomSection(section.id)}
              className="px-2 py-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs transition-colors whitespace-nowrap">
              Remove Section
            </button>
          </div>
        </Field>
      </div>

      {(section.entries || []).map((entry, i) => (
        <EntryCard key={entry.id}
          onRemove={() => removeEntry(entry.id)}
          onMoveUp={() => moveEntry(i, i - 1)}
          onMoveDown={() => moveEntry(i, i + 1)}
          canMoveUp={i > 0} canMoveDown={i < section.entries.length - 1}>

          <div className="grid grid-cols-2 gap-2 pr-16">
            <div className="col-span-2">
              <Field label="Title">
                <TextInput value={entry.title} onChange={v => updateEntry(entry.id, { title: v })}
                  placeholder="Main heading for this entry" />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Subtitle (optional)">
                <TextInput value={entry.subtitle} onChange={v => updateEntry(entry.id, { subtitle: v })}
                  placeholder="Organization, date, or secondary info" />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Description">
                <TextArea value={entry.description} onChange={v => updateEntry(entry.id, { description: v })}
                  rows={2} placeholder="Details about this entry..." />
              </Field>
            </div>
          </div>
        </EntryCard>
      ))}

      <AddButton onClick={addEntry} label={`Add ${section.title || 'Entry'}`} />
    </SectionCard>
  )
}
