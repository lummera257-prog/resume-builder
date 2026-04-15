import { useResume } from '../../context/ResumeContext'
import { SectionCard, EntryCard, Field, TextInput, TextArea, AddButton } from '../ui/SectionCard'

const BLANK = {
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: ''
}

export default function Experience() {
  const { resume, addItem, updateItem, removeItem, reorderItem, toggleSection } = useResume()

  const enabled = resume.settings.activeSections.includes('experience')
  const items = resume.experience

  return (
    <SectionCard
      title="Work Experience"
      icon="💼"
      enabled={enabled}
      onToggle={() => toggleSection('experience')}
      badge={items.length > 0 ? `${items.length}` : undefined}
    >

      {items.map((exp, i) => (
        <EntryCard
          key={exp.id}
          onRemove={() => removeItem('experience', exp.id)}
          onMoveUp={() => reorderItem('experience', i, i - 1)}
          onMoveDown={() => reorderItem('experience', i, i + 1)}
          canMoveUp={i > 0}
          canMoveDown={i < items.length - 1}
        >

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-10">

            <div className="sm:col-span-2">
              <Field label="Company">
                <TextInput
                  value={exp.company}
                  onChange={v => updateItem('experience', exp.id, { company: v })}
                  placeholder="Google"
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Position / Role">
                <TextInput
                  value={exp.position}
                  onChange={v => updateItem('experience', exp.id, { position: v })}
                  placeholder="Senior Software Engineer"
                />
              </Field>
            </div>

            <Field label="Start Date">
              <TextInput
                value={exp.startDate}
                onChange={v => updateItem('experience', exp.id, { startDate: v })}
                placeholder="Jan 2022"
              />
            </Field>

            <Field label="End Date">
              <TextInput
                value={exp.current ? 'Present' : exp.endDate}
                onChange={v => updateItem('experience', exp.id, { endDate: v })}
                placeholder="Present"
                disabled={exp.current}
              />
            </Field>

            <div className="sm:col-span-2 flex items-center gap-2 -mt-1 mb-1">
              <input
                type="checkbox"
                id={`current-${exp.id}`}
                checked={!!exp.current}
                onChange={e =>
                  updateItem('experience', exp.id, {
                    current: e.target.checked,
                    endDate: ''
                  })
                }
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`current-${exp.id}`}
                className="text-xs text-slate-600"
              >
                Currently working here
              </label>
            </div>

            <div className="sm:col-span-2">
              <Field label="Location (optional)">
                <TextInput
                  value={exp.location}
                  onChange={v => updateItem('experience', exp.id, { location: v })}
                  placeholder="San Francisco, CA (Remote)"
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field
                label="Key Responsibilities & Achievements"
                hint="Use bullet points + numbers (e.g., Increased performance by 40%)"
              >
                <TextArea
                  value={exp.description}
                  onChange={v => updateItem('experience', exp.id, { description: v })}
                  rows={4}
                  placeholder={
                    "• Built scalable system used by 50K users\n• Improved performance by 40%\n• Led team of 3 developers"
                  }
                />
              </Field>
            </div>

          </div>

        </EntryCard>
      ))}

      <AddButton onClick={() => addItem('experience', BLANK)} label="Add Experience" />

    </SectionCard>
  )
}