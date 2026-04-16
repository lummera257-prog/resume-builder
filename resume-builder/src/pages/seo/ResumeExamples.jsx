import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import { useResume } from '../../context/ResumeContext'

// ── Default settings used by every example ──────────────────────────────────
const DEFAULT_SETTINGS = {
  template: 'clarity',
  layout: 'single',
  colorScheme: 'blue',
  fontSize: 'medium',
  fontFamily: 'modern',
  sectionOrder: ['summary','experience','education','skills','projects','certifications','languages','achievements'],
  activeSections: ['summary','experience','education','skills','projects','certifications','languages','achievements'],
}

// ── 6 USA-style example resumes ──────────────────────────────────────────────
const EXAMPLES = [
  {
    role: 'Software Engineer',
    level: 'Mid-Senior',
    tags: ['Tech', 'Engineering'],
    data: {
      personalInfo: {
        name: 'Michael Bennett',
        title: 'Senior Software Engineer',
        email: 'michael.bennett@email.com',
        phone: '(415) 555-0192',
        location: 'San Francisco, CA',
        website: 'michaelbennett.dev',
        linkedin: 'linkedin.com/in/michaelbennett',
        github: 'github.com/michaelbennett',
        photo: '',
      },
      summary: 'Results-driven Senior Software Engineer with 7+ years building scalable web applications. Expert in React, Node.js, and AWS. Led cross-functional teams shipping products to 1M+ users. Passionate about clean architecture and measurable business impact.',
      experience: [
        { id: '1', company: 'Stripe', position: 'Senior Software Engineer', startDate: '2022-01', endDate: '', current: true, location: 'San Francisco, CA',
          description: '• Architected self-serve billing dashboard used by 200K+ merchants, cutting support tickets 35%\n• Improved API response times 48% via caching and query optimization\n• Led team of 5 engineers, drove TypeScript adoption org-wide' },
        { id: '2', company: 'Airbnb', position: 'Software Engineer', startDate: '2019-06', endDate: '2021-12', current: false, location: 'San Francisco, CA',
          description: '• Built real-time search ranking system processing 5M+ daily queries\n• Developed A/B testing platform increasing booking conversion 22%\n• Reduced frontend bundle size 40% via code splitting' },
      ],
      education: [
        { id: '1', institution: 'UC Berkeley', degree: 'B.S.', field: 'Computer Science', startDate: '2013-08', endDate: '2017-05', gpa: '3.8/4.0', description: '' },
      ],
      skills: [
        { id: '1', category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'] },
        { id: '2', category: 'Backend', items: ['Node.js', 'Python', 'GraphQL', 'REST APIs'] },
        { id: '3', category: 'Cloud & DevOps', items: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'] },
      ],
      projects: [
        { id: '1', name: 'OpenReview — AI Code Review', description: 'Open-source GPT-4 powered code review tool integrated with GitHub PRs. 3,500+ GitHub stars in 6 weeks.', technologies: 'React, Node.js, OpenAI API, PostgreSQL', link: 'github.com/michaelbennett/openreview' },
      ],
      certifications: [
        { id: '1', name: 'AWS Certified Solutions Architect — Associate', issuer: 'Amazon Web Services', date: '2023-04', link: '' },
      ],
      languages: [{ id: '1', language: 'English', proficiency: 'Native' }],
      achievements: [
        { id: '1', title: 'TechCrunch Disrupt Hackathon — 1st Place', description: 'Won first among 600+ teams for an AI accessibility tool.', date: '2023-09' },
      ],
      customSections: [],
      settings: DEFAULT_SETTINGS,
    },
  },
  {
    role: 'Product Manager',
    level: 'Mid-Level',
    tags: ['Product', 'Management'],
    data: {
      personalInfo: {
        name: 'Sarah Johnson',
        title: 'Product Manager',
        email: 'sarah.johnson@email.com',
        phone: '(312) 555-0847',
        location: 'Chicago, IL',
        website: 'sarahjohnsonpm.com',
        linkedin: 'linkedin.com/in/sarahjohnson',
        github: '',
        photo: '',
      },
      summary: 'Strategic Product Manager with 5+ years driving product vision and execution for B2B SaaS platforms. Track record of launching features that grew ARR by $4M+. Expert at cross-functional collaboration, data-driven prioritization, and agile delivery.',
      experience: [
        { id: '1', company: 'HubSpot', position: 'Product Manager', startDate: '2021-03', endDate: '', current: true, location: 'Chicago, IL (Remote)',
          description: '• Owned CRM dashboard product used by 80K+ businesses globally\n• Launched 3 major features increasing user activation rate by 28%\n• Reduced churn 15% through targeted onboarding improvements\n• Managed roadmap across 4 engineering squads using agile methodology' },
        { id: '2', company: 'Salesforce', position: 'Associate Product Manager', startDate: '2019-07', endDate: '2021-02', current: false, location: 'Chicago, IL',
          description: '• Contributed to Sales Cloud pipeline features used by Fortune 500 clients\n• Ran customer discovery interviews to validate product hypotheses\n• Collaborated with design and engineering to ship quarterly releases on time' },
      ],
      education: [
        { id: '1', institution: 'Northwestern University', degree: 'B.A.', field: 'Economics & Business', startDate: '2015-09', endDate: '2019-05', gpa: '3.7/4.0', description: '' },
      ],
      skills: [
        { id: '1', category: 'Product', items: ['Roadmapping', 'User Research', 'A/B Testing', 'Agile/Scrum'] },
        { id: '2', category: 'Analytics', items: ['Mixpanel', 'Amplitude', 'SQL', 'Looker'] },
        { id: '3', category: 'Tools', items: ['Jira', 'Figma', 'Notion', 'Confluence'] },
      ],
      projects: [],
      certifications: [
        { id: '1', name: 'Certified Scrum Product Owner (CSPO)', issuer: 'Scrum Alliance', date: '2022-06', link: '' },
      ],
      languages: [{ id: '1', language: 'English', proficiency: 'Native' }, { id: '2', language: 'French', proficiency: 'Conversational' }],
      achievements: [
        { id: '1', title: 'HubSpot Product Impact Award', description: 'Recognized for launching the highest-rated feature of Q3 2023 based on NPS feedback.', date: '2023-10' },
      ],
      customSections: [],
      settings: DEFAULT_SETTINGS,
    },
  },
  {
    role: 'Fresh Graduate',
    level: 'Entry Level',
    tags: ['Fresher', 'Student'],
    data: {
      personalInfo: {
        name: 'Ethan Rivera',
        title: 'Computer Science Graduate',
        email: 'ethan.rivera@email.com',
        phone: '(512) 555-0374',
        location: 'Austin, TX',
        website: '',
        linkedin: 'linkedin.com/in/ethanrivera',
        github: 'github.com/ethanrivera',
        photo: '',
      },
      summary: 'Motivated Computer Science graduate from UT Austin with hands-on experience in full-stack development through internships and personal projects. Strong foundation in algorithms, data structures, and software design. Eager to contribute to a fast-moving engineering team.',
      experience: [
        { id: '1', company: 'Dell Technologies', position: 'Software Engineering Intern', startDate: '2024-05', endDate: '2024-08', current: false, location: 'Austin, TX',
          description: '• Built an internal inventory tracking dashboard using React and Node.js\n• Wrote unit tests achieving 85% code coverage on assigned modules\n• Participated in daily standups and two-week sprint cycles' },
        { id: '2', company: 'UT Austin Research Lab', position: 'Undergraduate Research Assistant', startDate: '2023-09', endDate: '2024-04', current: false, location: 'Austin, TX',
          description: '• Assisted in NLP research on text summarization models\n• Preprocessed datasets and ran training experiments using Python and PyTorch' },
      ],
      education: [
        { id: '1', institution: 'University of Texas at Austin', degree: 'B.S.', field: 'Computer Science', startDate: '2021-08', endDate: '2025-05', gpa: '3.6/4.0', description: 'Relevant coursework: Data Structures, Algorithms, Operating Systems, Machine Learning, Web Development' },
      ],
      skills: [
        { id: '1', category: 'Languages', items: ['Python', 'JavaScript', 'Java', 'C++'] },
        { id: '2', category: 'Web', items: ['React', 'Node.js', 'HTML/CSS', 'REST APIs'] },
        { id: '3', category: 'Tools', items: ['Git', 'Linux', 'Docker', 'VS Code'] },
      ],
      projects: [
        { id: '1', name: 'CampusEats — Food Discovery App', description: 'Built a full-stack food discovery app for college campuses with real-time menu updates and rating system. 400+ active users at UT Austin.', technologies: 'React, Node.js, MongoDB, Google Maps API', link: 'github.com/ethanrivera/campuseats' },
      ],
      certifications: [],
      languages: [{ id: '1', language: 'English', proficiency: 'Native' }, { id: '2', language: 'Spanish', proficiency: 'Conversational' }],
      achievements: [
        { id: '1', title: 'Dean\'s List — 5 consecutive semesters', description: 'Maintained GPA above 3.5 throughout undergraduate studies.', date: '2024-12' },
      ],
      customSections: [],
      settings: DEFAULT_SETTINGS,
    },
  },
  {
    role: 'Data Scientist',
    level: 'Senior',
    tags: ['Data', 'ML/AI'],
    data: {
      personalInfo: {
        name: 'Priya Patel',
        title: 'Senior Data Scientist',
        email: 'priya.patel@email.com',
        phone: '(206) 555-0561',
        location: 'Seattle, WA',
        website: 'priyapatel.io',
        linkedin: 'linkedin.com/in/priyapatel',
        github: 'github.com/priyapatel',
        photo: '',
      },
      summary: 'Senior Data Scientist with 6+ years building machine learning models and data pipelines that drive business decisions at scale. Expertise in NLP, recommendation systems, and causal inference. Proven ability to translate complex findings into clear executive-level insights.',
      experience: [
        { id: '1', company: 'Amazon', position: 'Senior Data Scientist', startDate: '2021-09', endDate: '', current: true, location: 'Seattle, WA',
          description: '• Built product recommendation model increasing click-through rate 19% across 50M+ users\n• Designed causal inference framework to measure true incrementality of promotions, saving $8M in misattributed spend\n• Led a team of 3 data scientists delivering quarterly ML roadmap' },
        { id: '2', company: 'Expedia Group', position: 'Data Scientist', startDate: '2018-07', endDate: '2021-08', current: false, location: 'Seattle, WA',
          description: '• Developed dynamic pricing model improving hotel booking revenue by 12%\n• Built NLP pipeline to classify 1M+ customer reviews for sentiment analysis\n• Deployed models to production using MLflow and AWS SageMaker' },
      ],
      education: [
        { id: '1', institution: 'University of Washington', degree: 'M.S.', field: 'Data Science', startDate: '2016-09', endDate: '2018-06', gpa: '3.9/4.0', description: '' },
        { id: '2', institution: 'Purdue University', degree: 'B.S.', field: 'Statistics & Mathematics', startDate: '2012-08', endDate: '2016-05', gpa: '3.7/4.0', description: '' },
      ],
      skills: [
        { id: '1', category: 'ML & AI', items: ['Python', 'PyTorch', 'Scikit-learn', 'XGBoost', 'NLP'] },
        { id: '2', category: 'Data Engineering', items: ['SQL', 'Spark', 'Airflow', 'dbt', 'Redshift'] },
        { id: '3', category: 'MLOps', items: ['MLflow', 'SageMaker', 'Docker', 'Kubernetes'] },
      ],
      projects: [
        { id: '1', name: 'Open Causal ML Toolkit', description: 'Open-source Python library for causal inference in A/B testing. 1,800+ GitHub stars, adopted by 3 Fortune 500 companies.', technologies: 'Python, PyTorch, NumPy, SciPy', link: 'github.com/priyapatel/causalml' },
      ],
      certifications: [
        { id: '1', name: 'AWS Certified Machine Learning — Specialty', issuer: 'Amazon Web Services', date: '2022-10', link: '' },
      ],
      languages: [{ id: '1', language: 'English', proficiency: 'Fluent' }, { id: '2', language: 'Hindi', proficiency: 'Native' }],
      achievements: [
        { id: '1', title: 'Amazon ML Excellence Award', description: 'Recognized for recommendation model delivering highest measured revenue lift in the team\'s history.', date: '2023-06' },
      ],
      customSections: [],
      settings: DEFAULT_SETTINGS,
    },
  },
  {
    role: 'Marketing Manager',
    level: 'Mid-Level',
    tags: ['Marketing', 'Growth'],
    data: {
      personalInfo: {
        name: 'Jessica Torres',
        title: 'Marketing Manager',
        email: 'jessica.torres@email.com',
        phone: '(646) 555-0293',
        location: 'New York, NY',
        website: 'jessicatorres.co',
        linkedin: 'linkedin.com/in/jessicatorres',
        github: '',
        photo: '',
      },
      summary: 'Data-driven Marketing Manager with 6 years of experience scaling B2C brands through performance marketing, content strategy, and lifecycle campaigns. Managed $2M+ ad budgets and led campaigns generating 3x ROAS. Strong collaborator across product, sales, and creative teams.',
      experience: [
        { id: '1', company: 'Glossier', position: 'Marketing Manager', startDate: '2022-02', endDate: '', current: true, location: 'New York, NY',
          description: '• Managed $1.2M annual paid social budget across Meta and TikTok, achieving 3.4x ROAS\n• Launched influencer program driving 40K new customers in Q1 2024\n• Led email lifecycle redesign, improving retention revenue 25%\n• Managed team of 2 marketing coordinators' },
        { id: '2', company: 'Warby Parker', position: 'Digital Marketing Specialist', startDate: '2019-06', endDate: '2022-01', current: false, location: 'New York, NY',
          description: '• Ran SEO and content strategy growing organic traffic 65% in 18 months\n• Launched Google Shopping campaigns delivering 2.8x ROAS on $400K budget\n• A/B tested email subject lines, improving open rates from 18% to 27%' },
      ],
      education: [
        { id: '1', institution: 'New York University', degree: 'B.S.', field: 'Marketing & Communications', startDate: '2015-09', endDate: '2019-05', gpa: '3.6/4.0', description: '' },
      ],
      skills: [
        { id: '1', category: 'Paid Media', items: ['Meta Ads', 'Google Ads', 'TikTok Ads', 'YouTube Ads'] },
        { id: '2', category: 'Analytics', items: ['Google Analytics 4', 'Mixpanel', 'Tableau', 'SQL'] },
        { id: '3', category: 'Tools', items: ['HubSpot', 'Klaviyo', 'Canva', 'Asana'] },
      ],
      projects: [],
      certifications: [
        { id: '1', name: 'Google Analytics Certification', issuer: 'Google', date: '2023-03', link: '' },
        { id: '2', name: 'Meta Certified Digital Marketing Associate', issuer: 'Meta', date: '2022-08', link: '' },
      ],
      languages: [{ id: '1', language: 'English', proficiency: 'Native' }, { id: '2', language: 'Spanish', proficiency: 'Fluent' }],
      achievements: [
        { id: '1', title: 'Glossier Brand Campaign Award — Q1 2024', description: 'Campaign recognized internally as highest-performing influencer launch in company history.', date: '2024-04' },
      ],
      customSections: [],
      settings: DEFAULT_SETTINGS,
    },
  },
  {
    role: 'UX Designer',
    level: 'Mid-Level',
    tags: ['Design', 'Creative'],
    data: {
      personalInfo: {
        name: 'Alex Kim',
        title: 'UX Designer',
        email: 'alex.kim@email.com',
        phone: '(213) 555-0418',
        location: 'Los Angeles, CA',
        website: 'alexkimdesign.com',
        linkedin: 'linkedin.com/in/alexkimdesign',
        github: '',
        photo: '',
      },
      summary: 'UX Designer with 5 years of experience designing intuitive, accessible digital products for web and mobile. Expert in end-to-end design process from user research to high-fidelity prototyping. Collaborated with engineering teams at fintech and health-tech companies to ship user-centered features used by 500K+ people.',
      experience: [
        { id: '1', company: 'Robinhood', position: 'UX Designer', startDate: '2022-04', endDate: '', current: true, location: 'Los Angeles, CA (Remote)',
          description: '• Redesigned onboarding flow reducing drop-off rate by 32% and increasing verified account completions\n• Conducted 50+ user interviews and usability tests to inform design decisions\n• Created and maintained design system with 200+ reusable components in Figma\n• Collaborated with 3 engineering squads across iOS, Android, and Web platforms' },
        { id: '2', company: 'Headspace', position: 'Junior UX Designer', startDate: '2020-01', endDate: '2022-03', current: false, location: 'Los Angeles, CA',
          description: '• Designed meditation content discovery feature used by 2M+ subscribers\n• Ran A/B tests on homepage layout, increasing free-to-paid conversion 18%\n• Worked with accessibility team to meet WCAG 2.1 AA standards across app' },
      ],
      education: [
        { id: '1', institution: 'ArtCenter College of Design', degree: 'B.F.A.', field: 'Interaction Design', startDate: '2016-09', endDate: '2020-05', gpa: '3.8/4.0', description: '' },
      ],
      skills: [
        { id: '1', category: 'Design', items: ['Figma', 'Prototyping', 'Wireframing', 'Design Systems'] },
        { id: '2', category: 'Research', items: ['User Interviews', 'Usability Testing', 'A/B Testing', 'Journey Mapping'] },
        { id: '3', category: 'Tools', items: ['Maze', 'Zeplin', 'Miro', 'Notion'] },
      ],
      projects: [
        { id: '1', name: 'AccessiCheck — Accessibility Audit Tool', description: 'Designed and prototyped a WCAG compliance checker for small business websites. Winner of LA Design Hackathon 2023.', technologies: 'Figma, Maze, React (handoff)', link: 'alexkimdesign.com/accessicheck' },
      ],
      certifications: [
        { id: '1', name: 'Google UX Design Professional Certificate', issuer: 'Google / Coursera', date: '2021-09', link: '' },
      ],
      languages: [{ id: '1', language: 'English', proficiency: 'Native' }, { id: '2', language: 'Korean', proficiency: 'Conversational' }],
      achievements: [
        { id: '1', title: 'LA Design Hackathon — 1st Place', description: 'Won first place among 200+ designers for an accessibility audit tool concept.', date: '2023-11' },
      ],
      customSections: [],
      settings: DEFAULT_SETTINGS,
    },
  },
]

// ── Page component ────────────────────────────────────────────────────────────
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

  const handleUseExample = (exampleData) => {
    loadExample(exampleData)
    navigate('/')
  }

  return (
    <PageLayout>
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#1a1a2e' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', padding: '72px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>
            Professional Resume Examples
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.7 }}>
            Browse resume examples for all roles and experience levels. Click "Use This Example" to instantly load it into the builder.
          </p>
          <Link to="/" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>
            🚀 Build My Resume Free
          </Link>
        </div>

        {/* Cards */}
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '20px' }}>
            Resume Examples by Role
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {EXAMPLES.map((e, i) => (
              <div key={i} style={{ background: '#f8faff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a5f', margin: '0 0 4px' }}>{e.role}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#666', margin: '0 0 12px' }}>{e.level}</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {e.tags.map((t, j) => (
                      <span key={j} style={{ background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>{t}</span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleUseExample(e.data)}
                  style={{ background: '#2563eb', color: '#fff', padding: '9px 18px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer', width: '100%', transition: 'background 0.2s' }}
                  onMouseEnter={ev => ev.target.style.background = '#1d4ed8'}
                  onMouseLeave={ev => ev.target.style.background = '#2563eb'}
                >
                  Use This Example →
                </button>
              </div>
            ))}
          </div>

          <p style={{ color: '#444', lineHeight: 1.8, marginBottom: '16px' }}>
            The best resume examples share common traits: they are concise, use strong action verbs, quantify achievements, and are tailored to the specific role. Use these examples as inspiration — then customize with ResumeForge for free.
          </p>

          {/* CTA */}
          <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', borderRadius: '16px', padding: '40px', textAlign: 'center', marginTop: '40px' }}>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 12px' }}>
              Create Your Own Professional Resume
            </h2>
            <Link to="/" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>
              🚀 Create Your Free Resume Now
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}