import { useResume } from '../../context/ResumeContext'
import { SectionCard, EntryCard, Field, TextInput, TextArea, AddButton } from '../ui/SectionCard'

const BLANK = { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', description: '' }

export default function Education() {
  const { resume, addItem, updateItem, removeItem, reorderItem, toggleSection } = useResume()
  const enabled = resume.settings.activeSections.includes('education')
  const items = resume.education

  return (
    <SectionCard title="Education" icon="🎓" enabled={enabled}
      onToggle={() => toggleSection('education')} badge={items.length > 0 ? `${items.length}` : undefined}>

      {items.map((edu, i) => (
        <EntryCard key={edu.id}
          onRemove={() => removeItem('education', edu.id)}
          onMoveUp={() => reorderItem('education', i, i - 1)}
          onMoveDown={() => reorderItem('education', i, i + 1)}
          canMoveUp={i > 0} canMoveDown={i < items.length - 1}>

          <div className="grid grid-cols-2 gap-2 pr-16">
            <div className="col-span-2">
              <Field label="Institution">
                <TextInput value={edu.institution} onChange={v => updateItem('education', edu.id, { institution: v })}
                  placeholder="Massachusetts Institute of Technology" />
              </Field>
            </div>
            <Field label="Degree">
              <TextInput value={edu.degree} onChange={v => updateItem('education', edu.id, { degree: v })}
                placeholder="B.Tech / B.S. / M.S." />
            </Field>
            <Field label="Field of Study">
              <TextInput value={edu.field} onChange={v => updateItem('education', edu.id, { field: v })}
                placeholder="Computer Science" />
            </Field>
            <Field label="Start Year">
              <TextInput value={edu.startDate} onChange={v => updateItem('education', edu.id, { startDate: v })}
                placeholder="2018" />
            </Field>
            <Field label="End Year">
              <TextInput value={edu.endDate} onChange={v => updateItem('education', edu.id, { endDate: v })}
                placeholder="2022" />
            </Field>
            <div className="col-span-2">
              <Field label="GPA / Percentage (optional)">
                <TextInput value={edu.gpa} onChange={v => updateItem('education', edu.id, { gpa: v })}
                  placeholder="3.9/4.0 or 92%" />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Relevant Coursework / Activities (optional)">
                <TextArea value={edu.description}
                  onChange={v => updateItem('education', edu.id, { description: v })}
                  rows={2}
                  placeholder="Data Structures, Algorithms, Machine Learning, Distributed Systems" />
              </Field>
            </div>
          </div>
        </EntryCard>
      ))}

      <AddButton onClick={() => addItem('education', BLANK)} label="Add Education" />
    </SectionCard>
  )
}
