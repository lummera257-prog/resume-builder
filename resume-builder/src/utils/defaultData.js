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
    template: 'clarity',      // 'clarity' | 'prism'
    layout: 'single',          // 'single' | 'double'
    colorScheme: 'blue',       // 'blue' | 'emerald' | 'violet' | 'rose' | 'slate' | 'amber'
    fontSize: 'medium',        // 'small' | 'medium' | 'large'
    fontFamily: 'modern',      // 'modern' | 'classic' | 'minimal'
    sectionOrder: [
      'summary', 'experience', 'education', 'skills',
      'projects', 'certifications', 'languages', 'achievements'
    ],
    activeSections: ['summary', 'experience', 'education', 'skills'],
  },
}

// ─── Sample/Demo resume data ──────────────────────────────────────────────────
export const sampleResumeData = {
  personalInfo: {
    name: 'Arjun Sharma',
    title: 'Senior Full-Stack Developer',
    email: 'arjun.sharma@email.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, Karnataka',
    website: 'arjunsharma.dev',
    linkedin: 'linkedin.com/in/arjunsharma',
    github: 'github.com/arjunsharma',
    photo: '',
  },
  summary: 'Passionate Full-Stack Developer with 6+ years of experience building scalable web applications. Expert in React, Node.js, and cloud infrastructure. Led teams of 5+ engineers delivering products used by 500K+ users. Strong focus on clean code, performance optimization, and developer experience.',
  experience: [
    {
      id: '1',
      company: 'Razorpay',
      position: 'Senior Software Engineer',
      startDate: '2022-03',
      endDate: '',
      current: true,
      location: 'Bengaluru, India',
      description: '• Led development of payment checkout SDK used by 300K+ merchants across India\n• Reduced page load time by 42% through code splitting and lazy loading strategies\n• Mentored a team of 4 junior engineers, conducting weekly code reviews\n• Architected microservices migration from monolith, improving deployment frequency by 3x',
    },
    {
      id: '2',
      company: 'Swiggy',
      position: 'Software Engineer',
      startDate: '2020-06',
      endDate: '2022-02',
      current: false,
      location: 'Bengaluru, India',
      description: '• Built real-time order tracking system handling 2M+ daily active users\n• Developed internal dashboard reducing ops team\'s manual work by 60%\n• Implemented A/B testing framework that increased conversion rate by 18%',
    },
  ],
  education: [
    {
      id: '1',
      institution: 'IIT Roorkee',
      degree: 'B.Tech',
      field: 'Computer Science & Engineering',
      startDate: '2016-07',
      endDate: '2020-05',
      gpa: '8.7/10',
      description: 'Relevant coursework: Data Structures, OS, DBMS, Computer Networks, Machine Learning',
    },
  ],
  skills: [
    { id: '1', category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux'] },
    { id: '2', category: 'Backend', items: ['Node.js', 'Express', 'Python', 'FastAPI', 'GraphQL'] },
    { id: '3', category: 'Database', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'] },
    { id: '4', category: 'DevOps', items: ['AWS', 'Docker', 'Kubernetes', 'GitHub Actions', 'Terraform'] },
  ],
  projects: [
    {
      id: '1',
      name: 'DevBuddy — AI Code Review Tool',
      description: 'Built an AI-powered code review tool using GPT-4 API that integrates with GitHub PRs. Automatically identifies bugs, security issues, and suggests improvements. Gained 2,000+ GitHub stars in first month.',
      technologies: 'React, Node.js, OpenAI API, GitHub API, PostgreSQL',
      link: 'github.com/arjunsharma/devbuddy',
    },
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Solutions Architect — Associate',
      issuer: 'Amazon Web Services',
      date: '2023-08',
      link: '',
    },
  ],
  languages: [
    { id: '1', language: 'Hindi', proficiency: 'Native' },
    { id: '2', language: 'English', proficiency: 'Professional' },
  ],
  achievements: [
    {
      id: '1',
      title: 'Hackathon Winner — HackIndia 2023',
      description: 'Won 1st place among 800+ teams for building an AI-powered accessibility tool for visually impaired users.',
      date: '2023-09',
    },
  ],
  customSections: [],
  settings: {
    template: 'clarity',
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
