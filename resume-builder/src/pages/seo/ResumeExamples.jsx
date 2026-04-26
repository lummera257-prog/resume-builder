import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import { useResume } from '../../context/ResumeContext'
import { genId } from '../../utils/defaultData'

const examples = [
  {
    role: 'Financial Analyst',
    level: 'Mid-Senior',
    tags: ['Finance', 'Banking'],
    data: {
      personalInfo: {
        name: 'James Carter', title: 'Financial Analyst',
        email: 'james.carter@email.com', phone: '+1 (555) 214-9032',
        location: 'New York, NY', linkedin: 'linkedin.com/in/jamescarter',
        github: '', website: '', photo: '',
      },
      summary: 'Detail-oriented Financial Analyst with 6+ years of experience in financial modeling, risk analysis, and corporate finance. Proven track record of delivering actionable insights that drive revenue growth and operational efficiency.',
      experience: [
        { id: genId(), company: 'Goldman Sachs', position: 'Senior Financial Analyst', startDate: '2021-01', endDate: '', current: true, location: 'New York, NY', description: '• Developed complex financial models forecasting $500M+ in quarterly revenues\n• Conducted variance analysis reducing forecasting errors by 15%\n• Presented monthly financial reports to C-suite executives' },
        { id: genId(), company: 'JPMorgan Chase', position: 'Financial Analyst', startDate: '2018-06', endDate: '2021-01', current: false, location: 'New York, NY', description: '• Analyzed market trends and competitive landscape to inform investment strategies\n• Automated financial reporting using Excel macros, saving 10 hours weekly\n• Assisted in the underwriting of $2B in corporate loans' },
      ],
      education: [{ id: genId(), institution: 'NYU Stern', degree: 'B.S.', field: 'Finance', startDate: '2013-09', endDate: '2017-05', gpa: '3.8/4.0', description: '' }],
      skills: [
        { id: genId(), category: 'Core Skills', items: ['Financial Modeling', 'Excel', 'Bloomberg', 'SQL', 'Risk Analysis'] },
      ],
      projects: [],
      certifications: [{ id: genId(), name: 'Chartered Financial Analyst (CFA) Level II', issuer: 'CFA Institute', date: '2020-08', link: '' }],
      languages: [{ id: genId(), language: 'English', proficiency: 'Native' }],
      achievements: [],
      customSections: [],
      settings: { template: 'classic', colorScheme: 'blue', fontSize: 'medium', fontFamily: 'classic', sectionOrder: ['summary','experience','education','skills','certifications','languages'], activeSections: ['summary','experience','education','skills','certifications','languages'] },
    }
  },
  {
    role: 'Senior Software Engineer',
    level: 'Senior',
    tags: ['Engineering', 'Tech'],
    data: {
      personalInfo: {
        name: 'Sophia Nguyen', title: 'Senior Software Engineer',
        email: 'sophia.nguyen@email.com', phone: '+1 (555) 847-2910',
        location: 'San Francisco, CA', linkedin: 'linkedin.com/in/sophianguyen',
        github: 'github.com/sophianguyen', website: '', photo: '',
      },
      summary: 'Senior Software Engineer with 8+ years of experience building scalable backend architectures and dynamic frontends. Passionate about system design, mentoring junior engineers, and driving engineering best practices.',
      experience: [
        { id: genId(), company: 'Stripe', position: 'Senior Software Engineer', startDate: '2021-02', endDate: '', current: true, location: 'San Francisco, CA', description: '• Architected a highly available payments microservice processing 10k TPS\n• Reduced database query latency by 45% through advanced indexing and caching\n• Mentored 5 junior engineers and led cross-functional technical designs' },
        { id: genId(), company: 'Airbnb', position: 'Software Engineer', startDate: '2018-05', endDate: '2021-01', current: false, location: 'San Francisco, CA', description: '• Built frontend components for the core booking flow using React and TypeScript\n• Improved CI/CD pipeline speed by 30% using Docker optimizations\n• Collaborated with product managers to launch 3 major feature initiatives' },
      ],
      education: [{ id: genId(), institution: 'Stanford University', degree: 'B.S.', field: 'Computer Science', startDate: '2012-09', endDate: '2016-05', gpa: '3.9/4.0', description: '' }],
      skills: [
        { id: genId(), category: 'Languages & Frameworks', items: ['React', 'Node.js', 'TypeScript'] },
        { id: genId(), category: 'Infrastructure & DB', items: ['AWS', 'PostgreSQL', 'Docker'] },
      ],
      projects: [],
      certifications: [],
      languages: [{ id: genId(), language: 'English', proficiency: 'Native' }],
      achievements: [],
      customSections: [],
      settings: { template: 'modern', colorScheme: 'slate', fontSize: 'medium', fontFamily: 'modern', sectionOrder: ['summary','experience','education','skills','languages'], activeSections: ['summary','experience','education','skills','languages'] },
    }
  },
  {
    role: 'Research Scientist',
    level: 'Senior',
    tags: ['Science', 'Research'],
    data: {
      personalInfo: {
        name: 'Emily Davis', title: 'Research Scientist',
        email: 'emily.davis@email.com', phone: '+1 (555) 332-7841',
        location: 'Boston, MA', linkedin: 'linkedin.com/in/emilydavis',
        github: '', website: '', photo: '',
      },
      summary: 'Innovative Research Scientist with a Ph.D. in Biomedical Engineering. Extensive experience in clinical research, data analysis, and leading complex scientific studies from inception to publication.',
      experience: [
        { id: genId(), company: 'Pfizer', position: 'Research Scientist', startDate: '2020-06', endDate: '', current: true, location: 'Boston, MA', description: '• Led a team of 4 researchers in conducting pre-clinical trials for novel therapeutics\n• Analyzed massive genomic datasets using Python and R, uncovering 2 new biomarkers\n• Published 3 peer-reviewed articles in top-tier medical journals' },
        { id: genId(), company: 'Harvard Medical School', position: 'Lab Associate', startDate: '2017-08', endDate: '2020-05', current: false, location: 'Boston, MA', description: '• Assisted in executing complex biomedical assays and maintaining lab protocols\n• Designed MATLAB scripts to automate data processing workflows\n• Presented research findings at 5 international scientific conferences' },
      ],
      education: [{ id: genId(), institution: 'MIT', degree: 'Ph.D.', field: 'Biomedical Engineering', startDate: '2015-09', endDate: '2019-05', gpa: '', description: '' }],
      skills: [
        { id: genId(), category: 'Technical Skills', items: ['Python', 'MATLAB', 'Data Analysis', 'Clinical Research', 'R'] },
      ],
      projects: [],
      certifications: [],
      languages: [{ id: genId(), language: 'English', proficiency: 'Native' }],
      achievements: [],
      customSections: [],
      settings: { template: 'minimal', colorScheme: 'emerald', fontSize: 'medium', fontFamily: 'modern', sectionOrder: ['summary','experience','education','skills','languages'], activeSections: ['summary','experience','education','skills','languages'] },
    }
  },
  {
    role: 'Marketing Director',
    level: 'Executive',
    tags: ['Marketing', 'Leadership'],
    data: {
      personalInfo: {
        name: 'Robert Mitchell', title: 'Marketing Director',
        email: 'r.mitchell@email.com', phone: '+1 (555) 923-5517',
        location: 'Chicago, IL', linkedin: 'linkedin.com/in/rmitchell',
        github: '', website: '', photo: '',
      },
      summary: 'Visionary Marketing Director with 10+ years driving global brand strategy and high-impact integrated campaigns. Expert in leveraging analytics to optimize ROI and leading high-performing marketing teams.',
      experience: [
        { id: genId(), company: 'Nike', position: 'Marketing Director', startDate: '2020-03', endDate: '', current: true, location: 'Chicago, IL', description: '• Directed a $15M annual marketing budget, consistently achieving 30%+ ROI\n• Led a 25-person team across digital marketing, PR, and brand strategy\n• Launched a multi-channel campaign that increased market share by 12% in Q3' },
        { id: genId(), company: 'Coca-Cola', position: 'Senior Marketing Manager', startDate: '2016-04', endDate: '2020-02', current: false, location: 'Atlanta, GA', description: '• Managed end-to-end execution of national SEO and digital ad campaigns\n• Grew organic online engagement by 45% through targeted content strategies\n• Negotiated strategic brand partnerships generating $5M in added value' },
      ],
      education: [{ id: genId(), institution: 'Northwestern University', degree: 'MBA', field: 'Marketing', startDate: '2013-09', endDate: '2015-06', gpa: '', description: '' }],
      skills: [
        { id: genId(), category: 'Expertise', items: ['Brand Strategy', 'SEO', 'Campaign Management', 'Analytics'] },
      ],
      projects: [],
      certifications: [],
      languages: [{ id: genId(), language: 'English', proficiency: 'Native' }],
      achievements: [],
      customSections: [],
      settings: { template: 'elegant', colorScheme: 'violet', fontSize: 'medium', fontFamily: 'classic', sectionOrder: ['summary','experience','education','skills','languages'], activeSections: ['summary','experience','education','skills','languages'] },
    }
  },
  {
    role: 'VP of Operations',
    level: 'Executive',
    tags: ['Operations', 'Leadership'],
    data: {
      personalInfo: {
        name: 'William Thompson', title: 'VP of Operations',
        email: 'w.thompson@email.com', phone: '+1 (555) 774-3829',
        location: 'Dallas, TX', linkedin: 'linkedin.com/in/wthompson',
        github: '', website: '', photo: '',
      },
      summary: 'Dynamic VP of Operations with 15+ years of experience optimizing supply chain logistics and driving operational excellence. Proven success in scaling manufacturing processes and improving P&L performance for Fortune 500 companies.',
      experience: [
        { id: genId(), company: 'Tesla', position: 'VP of Operations', startDate: '2019-01', endDate: '', current: true, location: 'Dallas, TX', description: '• Oversee global operations strategy, managing a $50M operating budget\n• Streamlined supply chain logistics, reducing manufacturing lead times by 22%\n• Championed lean initiatives that resulted in $12M annual cost savings' },
        { id: genId(), company: 'Ford Motor Company', position: 'Director of Operations', startDate: '2013-05', endDate: '2018-12', current: false, location: 'Dearborn, MI', description: '• Directed daily operations across 3 major production facilities\n• Implemented quality control protocols that reduced defect rates by 40%\n• Negotiated vendor contracts saving the company $8M over 4 years' },
      ],
      education: [{ id: genId(), institution: 'Harvard Business School', degree: 'MBA', field: '', startDate: '2008-09', endDate: '2010-05', gpa: '', description: '' }],
      skills: [
        { id: genId(), category: 'Core Competencies', items: ['P&L Management', 'Supply Chain', 'Leadership', 'Strategy'] },
      ],
      projects: [],
      certifications: [],
      languages: [{ id: genId(), language: 'English', proficiency: 'Native' }],
      achievements: [],
      customSections: [],
      settings: { template: 'executive', colorScheme: 'slate', fontSize: 'medium', fontFamily: 'modern', sectionOrder: ['summary','experience','education','skills','languages'], activeSections: ['summary','experience','education','skills','languages'] },
    }
  },
  {
    role: 'UX/UI Designer',
    level: 'Mid-Senior',
    tags: ['Design', 'Creative'],
    data: {
      personalInfo: {
        name: 'Olivia Martinez', title: 'UX/UI Designer',
        email: 'olivia.martinez@email.com', phone: '+1 (555) 618-4403',
        location: 'Austin, TX', linkedin: 'linkedin.com/in/oliviamartinez',
        github: '', website: 'oliviamartinez.design', photo: '',
      },
      summary: 'Passionate UX/UI Designer dedicated to creating intuitive, visually stunning digital experiences. Adept at transforming complex user problems into elegant, accessible design solutions through rigorous research and prototyping.',
      experience: [
        { id: genId(), company: 'Spotify', position: 'Lead UX Designer', startDate: '2021-04', endDate: '', current: true, location: 'Austin, TX', description: '• Lead the design strategy for the core mobile application used by millions globally\n• Established a comprehensive design system accelerating engineering velocity by 25%\n• Conduct weekly user research sessions to continuously iterate on user flows' },
        { id: genId(), company: 'Adobe', position: 'UI Designer', startDate: '2018-07', endDate: '2021-03', current: false, location: 'San Jose, CA', description: '• Designed high-fidelity prototypes and pixel-perfect interfaces for creative cloud apps\n• Collaborated closely with product and engineering to ensure flawless implementation\n• Improved accessibility compliance (WCAG 2.1) across 4 major web properties' },
      ],
      education: [{ id: genId(), institution: 'Rhode Island School of Design', degree: 'B.F.A.', field: 'Design', startDate: '2014-09', endDate: '2018-05', gpa: '', description: '' }],
      skills: [
        { id: genId(), category: 'Tools & Methods', items: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'CSS'] },
      ],
      projects: [],
      certifications: [],
      languages: [{ id: genId(), language: 'English', proficiency: 'Native' }, { id: genId(), language: 'Spanish', proficiency: 'Fluent' }],
      achievements: [],
      customSections: [],
      settings: { template: 'creative', colorScheme: 'rose', fontSize: 'medium', fontFamily: 'modern', sectionOrder: ['summary','experience','education','skills','languages'], activeSections: ['summary','experience','education','skills','languages'] },
    }
  },
]

export default function ResumeExamples() {
  const { loadExample } = useResume()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Resume Examples 2026 | Professional Resume Samples | ResumeForge'
    let m = document.querySelector('meta[name="description"]')
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
    m.content = 'Browse professional resume examples for all industries and experience levels. Use free templates and build your resume instantly.'
    let c = document.querySelector('link[rel="canonical"]')
    if (!c) { c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c) }
    c.href = 'https://freeresumeforgebuilder.com/resume-examples'
  }, [])

  const handleUseExample = (example) => {
    loadExample(example.data)
    navigate('/')
  }

  return (
    <PageLayout>
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#1a1a2e' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', padding: '72px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>Professional Resume Examples</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.7 }}>
            Browse resume examples for all roles and experience levels. Click "Use This Example" to load it instantly into the builder.
          </p>
          <Link to="/" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>
            🚀 Build My Resume Free
          </Link>
        </div>

        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '20px' }}>Resume Examples by Role</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {examples.map((e, i) => (
              <div key={i} style={{ background: '#f8faff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a5f', margin: '0 0 6px' }}>{e.role}</h3>
                <p style={{ fontSize: '0.8rem', color: '#888', margin: '0 0 12px' }}>{e.level}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {e.tags.map((t, j) => (
                    <span key={j} style={{ background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
                <button
                  onClick={() => handleUseExample(e)}
                  style={{ background: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer', width: '100%' }}
                >
                  Use This Example →
                </button>
              </div>
            ))}
          </div>

          <p style={{ color: '#444', lineHeight: 1.8, marginBottom: '16px' }}>
            The best resume examples share common traits: they are concise, use strong action verbs, quantify achievements, and are tailored to the specific role.
          </p>

          <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', borderRadius: '16px', padding: '40px', textAlign: 'center', margin: '40px 0' }}>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 12px' }}>Create Your Own Professional Resume</h2>
            <Link to="/" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>
              🚀 Create Your Free Resume Now
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}