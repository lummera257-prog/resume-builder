// ─── Default empty resume structure ──────────────────────────────────────────
export const defaultResumeData = {
  personalInfo: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    photo: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  achievements: [],
  customSections: [],
  settings: {
    template: 'creative',
    layout: 'single',
    colorScheme: 'blue',
    fontSize: 'medium',
    fontFamily: 'modern',
    sectionOrder: [
      'summary', 'experience', 'education', 'skills',
      'projects', 'certifications', 'languages', 'achievements'
    ],
    activeSections: ['summary', 'experience', 'education', 'skills'],
  },
}

// ─── Sample/Demo resume data (USA) ───────────────────────────────────────────
export const sampleResumeData = {
  personalInfo: {
    name: 'Michael Bennett',
    title: 'Senior Full-Stack Software Engineer',
    email: 'michael.bennett@email.com',
    phone: '(415) 555-0192',
    location: 'San Francisco, CA',
    website: 'michaelbennett.dev',
    linkedin: 'linkedin.com/in/michaelbennett',
    github: 'github.com/michaelbennett',
    photo: '',
  },
  summary: 'Results-driven Full-Stack Software Engineer with 7+ years of experience designing and delivering scalable web applications. Proficient in React, Node.js, and AWS cloud infrastructure. Proven track record of leading cross-functional engineering teams and shipping products used by 1M+ users. Passionate about clean architecture, developer productivity, and measurable business impact.',
  experience: [
    {
      id: '1',
      company: 'Stripe',
      position: 'Senior Software Engineer',
      startDate: '2022-01',
      endDate: '',
      current: true,
      location: 'San Francisco, CA',
      description: '• Architected and launched a self-serve billing dashboard used by 200K+ merchants, reducing support tickets by 35%\n• Improved API response times by 48% through caching strategies and database query optimization\n• Led a team of 5 engineers, conducting code reviews and driving adoption of TypeScript across the org\n• Collaborated with Product and Design to define roadmap features, reducing time-to-ship by 20%',
    },
    {
      id: '2',
      company: 'Airbnb',
      position: 'Software Engineer',
      startDate: '2019-06',
      endDate: '2021-12',
      current: false,
      location: 'San Francisco, CA',
      description: '• Built real-time search ranking system processing 5M+ daily queries using Elasticsearch and Redis\n• Developed internal A/B testing platform that increased booking conversion rate by 22%\n• Reduced frontend bundle size by 40% through code splitting and lazy loading improvements\n• Onboarded and mentored 3 junior engineers during a high-growth hiring period',
    },
    {
      id: '3',
      company: 'Microsoft',
      position: 'Software Engineer I',
      startDate: '2017-08',
      endDate: '2019-05',
      current: false,
      location: 'Redmond, WA',
      description: '• Contributed to Azure DevOps dashboard features used by 500K+ enterprise customers\n• Implemented automated test coverage increasing unit test coverage from 54% to 89%\n• Participated in on-call rotation and resolved P1 production incidents with avg resolution time under 45 min',
    },
  ],
  education: [
    {
      id: '1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2013-08',
      endDate: '2017-05',
      gpa: '3.8/4.0',
      description: 'Relevant coursework: Algorithms, Operating Systems, Distributed Systems, Machine Learning, Database Systems',
    },
  ],
  skills: [
    { id: '1', category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux'] },
    { id: '2', category: 'Backend', items: ['Node.js', 'Express', 'Python', 'GraphQL', 'REST APIs'] },
    { id: '3', category: 'Database', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'] },
    { id: '4', category: 'DevOps & Cloud', items: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'] },
  ],
  projects: [
    {
      id: '1',
      name: 'OpenReview — AI Code Review Assistant',
      description: 'Built an open-source AI-powered code review tool integrating GPT-4 with GitHub Pull Requests. Automatically surfaces bugs, security vulnerabilities, and style issues. Reached 3,500+ GitHub stars within 6 weeks of launch.',
      technologies: 'React, Node.js, OpenAI API, GitHub API, PostgreSQL',
      link: 'github.com/michaelbennett/openreview',
    },
    {
      id: '2',
      name: 'SpendSmart — Personal Finance Dashboard',
      description: 'Developed a full-stack personal finance app with Plaid API integration, budget tracking, and ML-based spending predictions. 1,200+ active monthly users.',
      technologies: 'Next.js, Python, FastAPI, Plaid API, Chart.js',
      link: 'spendsmart.app',
    },
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect — Associate',
      issuer: 'Amazon Web Services',
      date: '2023-04',
      link: '',
    },
    {
      id: '2',
      name: 'Google Professional Cloud Developer',
      issuer: 'Google Cloud',
      date: '2022-11',
      link: '',
    },
  ],
  languages: [
    { id: '1', language: 'English', proficiency: 'Native' },
    { id: '2', language: 'Spanish', proficiency: 'Conversational' },
  ],
  achievements: [
    {
      id: '1',
      title: 'TechCrunch Disrupt Hackathon — 1st Place',
      description: 'Won first place among 600+ teams for building an accessibility tool using computer vision to assist visually impaired users in real time.',
      date: '2023-09',
    },
    {
      id: '2',
      title: 'Stripe Engineering Excellence Award',
      description: 'Recognized internally for delivering the billing dashboard project 3 weeks ahead of schedule with zero critical post-launch bugs.',
      date: '2023-03',
    },
  ],
  customSections: [],
  settings: {
    template: 'creative',
    layout: 'single',
    colorScheme: 'blue',
    fontSize: 'medium',
    fontFamily: 'modern',
    sectionOrder: [
      'summary', 'experience', 'education', 'skills',
      'projects', 'certifications', 'languages', 'achievements'
    ],
    activeSections: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'achievements'],
  },
}

// ─── Section metadata ─────────────────────────────────────────────────────────
export const SECTION_META = {
  summary:        { label: 'Professional Summary', icon: '📝', description: 'A brief about you' },
  experience:     { label: 'Work Experience',      icon: '💼', description: 'Jobs & internships' },
  education:      { label: 'Education',            icon: '🎓', description: 'Degrees & courses' },
  skills:         { label: 'Skills',               icon: '⚡', description: 'Technical & soft skills' },
  projects:       { label: 'Projects',             icon: '🚀', description: 'Personal & professional projects' },
  certifications: { label: 'Certifications',       icon: '🏆', description: 'Licenses & certificates' },
  languages:      { label: 'Languages',            icon: '🌐', description: 'Language proficiencies' },
  achievements:   { label: 'Achievements',         icon: '⭐', description: 'Awards & honors' },
}

export const PROFICIENCY_LEVELS = ['Native', 'Fluent', 'Professional', 'Conversational', 'Basic']

export const COLOR_SCHEMES = [
  { id: 'blue',    label: 'Ocean',    color: '#2563eb' },
  { id: 'emerald', label: 'Forest',   color: '#059669' },
  { id: 'violet',  label: 'Royal',    color: '#7c3aed' },
  { id: 'rose',    label: 'Crimson',  color: '#e11d48' },
  { id: 'slate',   label: 'Graphite', color: '#475569' },
  { id: 'amber',   label: 'Gold',     color: '#d97706' },
]

export const FONT_FAMILIES = [
  { id: 'modern',  label: 'Modern',  fonts: '"Geist", system-ui, sans-serif' },
  { id: 'classic', label: 'Classic', fonts: '"Playfair Display", Georgia, serif' },
  { id: 'minimal', label: 'Minimal', fonts: '"JetBrains Mono", monospace' },
]

// ─── Generate unique IDs ──────────────────────────────────────────────────────
export const genId = () => Math.random().toString(36).slice(2, 9)