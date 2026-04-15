import { useResume } from '../../context/ResumeContext'
import { SectionCard, Field, TextInput } from '../ui/SectionCard'

export default function PersonalInfo() {
  const { resume, updatePersonal } = useResume()
  const p = resume.personalInfo
  const set = (key) => (val) => updatePersonal({ [key]: val })

  return (
    <SectionCard title="Personal Information" icon="👤" defaultOpen={true}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        <div className="sm:col-span-2">
          <Field label="Full Name">
            <TextInput
              value={p.name}
              onChange={set('name')}
              placeholder="John Doe"
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Professional Title">
            <TextInput
              value={p.title}
              onChange={set('title')}
              placeholder="Senior Software Engineer"
            />
          </Field>
        </div>

        <Field label="Email">
          <TextInput
            value={p.email}
            onChange={set('email')}
            placeholder="john@email.com"
            type="email"
          />
        </Field>

        <Field label="Phone">
          <TextInput
            value={p.phone}
            onChange={set('phone')}
            placeholder="+1 555 000 0000"
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Location">
            <TextInput
              value={p.location}
              onChange={set('location')}
              placeholder="New York, NY"
            />
          </Field>
        </div>

        <Field label="LinkedIn">
          <TextInput
            value={p.linkedin}
            onChange={set('linkedin')}
            placeholder="linkedin.com/in/johndoe"
          />
        </Field>

        <Field label="GitHub">
          <TextInput
            value={p.github}
            onChange={set('github')}
            placeholder="github.com/johndoe"
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Website / Portfolio">
            <TextInput
              value={p.website}
              onChange={set('website')}
              placeholder="johndoe.dev"
            />
          </Field>
        </div>

      </div>
    </SectionCard>
  )
}