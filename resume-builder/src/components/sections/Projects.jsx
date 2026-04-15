import { useResume } from '../../context/ResumeContext'
import { SectionCard, EntryCard, Field, TextInput, TextArea, AddButton } from '../ui/SectionCard'

const BLANK = { name: '', description: '', technologies: '', link: '' }

export default function Projects() {
  const { resume, addItem, updateItem, removeItem, reorderItem, toggleSection } = useResume()

  const enabled = resume.settings.activeSections.includes('projects')
  const items = resume.projects

  return (
    <SectionCard
      title="Projects"
      icon="🚀"
      enabled={enabled}
      onToggle={() => toggleSection('projects')}
      badge={items.length > 0 ? `${items.length}` : undefined}
    >

      {items.map((proj, i) => (
        <EntryCard
          key={proj.id}
          onRemove={() => removeItem('projects', proj.id)}
          onMoveUp={() => reorderItem('projects', i, i - 1)}
          onMoveDown={() => reorderItem('projects', i, i + 1)}
          canMoveUp={i > 0}
          canMoveDown={i < items.length - 1}
        >

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-10">

            <div className="sm:col-span-2">
              <Field label="Project Name">
                <TextInput
                  value={proj.name}
                  onChange={v => updateItem('projects', proj.id, { name: v })}
                  placeholder="AI Resume Builder"
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field
                label="Description"
                hint="Explain what you built + impact/results"
              >
                <TextArea
                  value={proj.description}
                  onChange={v => updateItem('projects', proj.id, { description: v })}
                  rows={3}
                  placeholder="Built a resume builder used by 5,000+ users. Reduced creation time by 70% with real-time preview and one-click export."
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Technologies Used">
                <TextInput
                  value={proj.technologies}
                  onChange={v => updateItem('projects', proj.id, { technologies: v })}
                  placeholder="React, Node.js, PostgreSQL, AWS"
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Link (GitHub / Live URL)">
                <TextInput
                  value={proj.link}
                  onChange={v => updateItem('projects', proj.id, { link: v })}
                  placeholder="github.com/username/project"
                />
              </Field>
            </div>

          </div>

        </EntryCard>
      ))}

      <AddButton onClick={() => addItem('projects', BLANK)} label="Add Project" />

    </SectionCard>
  )
}