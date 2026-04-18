import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import { useResume } from '../../context/ResumeContext'
import { genId } from '../../utils/defaultData'

const examples = [
  {
    role: 'Software Engineer',
    level: 'Mid-Senior',
    tags: ['Tech', 'Engineering'],
    data: {
      personalInfo: {
        name: 'Alex Johnson', title: 'Senior Software Engineer',
        email: 'alex.johnson@email.com', phone: '(415) 555-0101',
        location: 'San Francisco, CA', linkedin: 'linkedin.com/in/alexjohnson',
        github: 'github.com/alexjohnson', website: '', photo: '',
      },
      summary: 'Senior Software Engineer with 6+ years of experience building scalable web applications. Proficient in React, Node.js, and AWS. Passionate about clean code and developer productivity.',
      experience: [
        { id: genId(), company: 'Google', position: 'Senior Software Engineer', startDate: '2021-03', endDate: '', current: true, location: 'San Francisco, CA', description: '• Led development of core search features used by 500M+ users\n• Reduced page load time by 35% through performance optimization\n• Mentored 4 junior engineers and conducted 50+ code reviews' },
        { id: genId(), company: 'Meta', position: 'Software Engineer', startDate: '2018-06', endDate: '2021-02', current: false, location: 'Menlo Park, CA', description: '• Built React components for Facebook News Feed used by 2B+ users\n• Improved API response time by 40% through caching strategies\n• Collaborated with product and design teams on 3 major feature launches' },
      ],
      education: [{ id: genId(), institution: 'Stanford University', degree: 'B.S.', field: 'Computer Science', startDate: '2014-09', endDate: '2018-06', gpa: '3.7/4.0', description: '' }],
      skills: [
        { id: genId(), category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'] },
        { id: genId(), category: 'Backend', items: ['Node.js', 'Python', 'GraphQL', 'REST APIs'] },
        { id: genId(), category: 'Cloud', items: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'] },
      ],
      projects: [{ id: genId(), name: 'DevTools Pro', description: 'Open-source developer productivity tool with 2,000+ GitHub stars.', technologies: 'React, Node.js, PostgreSQL', link: 'github.com/alexjohnson/devtools' }],
      certifications: [{ id: genId(), name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2022-05', link: '' }],
      languages: [{ id: genId(), language: 'English', proficiency: 'Native' }],
      achievements: [{ id: genId(), title: 'Hackathon Winner — TechCrunch 2022', description: 'Won 1st place among 400+ teams.', date: '2022-09' }],
      customSections: [],
      settings: { template: 'creative', colorScheme: 'blue', fontSize: 'medium', fontFamily: 'modern', sectionOrder: ['summary','experience','education','skills','projects','certifications','languages','achievements'], activeSections: ['summary','experience','education','skills','projects','certifications','languages','achievements'] },
    }
  },
  {
    role: 'Product Manager',
    level: 'Mid-Level',
    tags: ['Product', 'Management'],
    data: {
      personalInfo: {
        name: 'Sarah Chen', title: 'Product Manager',
        email: 'sarah.chen@email.com', phone: '(212) 555-0202',
        location: 'New York, NY', linkedin: 'linkedin.com/in/sarahchen',
        github: '', website: 'sarahchen.io', photo: '',
      },
      summary: 'Product Manager with 5+ years driving 0-to-1 product launches and cross-functional team alignment. Delivered products with $10M+ ARR impact across SaaS and consumer markets.',
      experience: [
        { id: genId(), company: 'Spotify', position: 'Product Manager', startDate: '2020-04', endDate: '', current: true, location: 'New York, NY', description: '• Owned podcast discovery feature driving 25% increase in podcast listening hours\n• Defined product roadmap and aligned 3 engineering teams across 2 time zones\n• Launched A/B tests improving user retention by 18%' },
        { id: genId(), company: 'HubSpot', position: 'Associate Product Manager', startDate: '2018-07', endDate: '2020-03', current: false, location: 'Boston, MA', description: '• Shipped CRM pipeline feature adopted by 40,000+ users in first month\n• Conducted 100+ user interviews to identify top pain points\n• Reduced onboarding drop-off by 30% through UX improvements' },
      ],
      education: [{ id: genId(), institution: 'Harvard Business School', degree: 'MBA', field: 'Business Administration', startDate: '2016-09', endDate: '2018-05', gpa: '', description: '' }],
      skills: [
        { id: genId(), category: 'Product', items: ['Product Strategy', 'Roadmapping', 'A/B Testing', 'User Research'] },
        { id: genId(), category: 'Analytics', items: ['SQL', 'Mixpanel', 'Google Analytics', 'Tableau'] },
        { id: genId(), category: 'Tools', items: ['Jira', 'Figma', 'Confluence', 'Notion'] },
      ],
      projects: [],
      certifications: [{ id: genId(), name: 'Certified Scrum Product Owner (CSPO)', issuer: 'Scrum Alliance', date: '2021-03', link: '' }],
      languages: [{ id: genId(), language: 'English', proficiency: 'Native' }, { id: genId(), language: 'Mandarin', proficiency: 'Fluent' }],
      achievements: [{ id: genId(), title: 'Product of the Year — HubSpot 2019', description: 'Recognized for CRM pipeline feature launch.', date: '2019-12' }],
      customSections: [],
      settings: { template: 'creative', colorScheme: 'violet', fontSize: 'medium', fontFamily: 'modern', sectionOrder: ['summary','experience','education','skills','projects','certifications','languages','achievements'], activeSections: ['summary','experience','education','skills','certifications','languages','achievements'] },
    }
  },
  {
    role: 'Fresh Graduate',
    level: 'Entry Level',
    tags: ['Fresher', 'Student'],
    data: {
      personalInfo: {
        name: 'Rahul Sharma', title: 'Computer Science Graduate',
        email: 'rahul.sharma@email.com', phone: '+91 98765 43210',
        location: 'Bangalore, India', linkedin: 'linkedin.com/in/rahulsharma',
        github: 'github.com/rahulsharma', website: '', photo: '',
      },
      summary: 'Recent Computer Science graduate with strong foundation in full-stack development. Built 3 projects with real users during college. Eager to contribute to a fast-growing engineering team.',
      experience: [
        { id: genId(), company: 'Infosys', position: 'Software Intern', startDate: '2024-05', endDate: '2024-08', current: false, location: 'Bangalore, India', description: '• Developed REST APIs for internal HR portal using Node.js and Express\n• Fixed 20+ bugs in legacy codebase and improved test coverage from 40% to 75%\n• Collaborated with senior engineers in daily standups and sprint planning' },
      ],
      education: [{ id: genId(), institution: 'IIT Delhi', degree: 'B.Tech', field: 'Computer Science', startDate: '2020-08', endDate: '2024-05', gpa: '8.4/10', description: 'Relevant coursework: Data Structures, DBMS, Operating Systems, Web Development' }],
      skills: [
        { id: genId(), category: 'Languages', items: ['JavaScript', 'Python', 'Java', 'C++'] },
        { id: genId(), category: 'Web', items: ['React', 'Node.js', 'HTML/CSS', 'Express'] },
        { id: genId(), category: 'Tools', items: ['Git', 'MySQL', 'MongoDB', 'VS Code'] },
      ],
      projects: [
        { id: genId(), name: 'StudyBuddy — Peer Learning App', description: 'Built a platform connecting students for peer tutoring. 200+ active users from college campus.', technologies: 'React, Node.js, MongoDB', link: 'github.com/rahulsharma/studybuddy' },
        { id: genId(), name: 'Expense Tracker', description: 'Personal finance app with budget alerts and spending analytics.', technologies: 'Python, Flask, SQLite', link: 'github.com/rahulsharma/expense-tracker' },
      ],
      certifications: [{ id: genId(), name: 'Meta Front-End Developer Certificate', issuer: 'Coursera', date: '2023-11', link: '' }],
      languages: [{ id: genId(), language: 'English', proficiency: 'Fluent' }, { id: genId(), language: 'Hindi', proficiency: 'Native' }],
      achievements: [{ id: genId(), title: 'Smart India Hackathon 2023 — Finalist', description: 'Top 10 among 5,000+ teams nationwide.', date: '2023-08' }],
      customSections: [],
      settings: { template: 'creative', colorScheme: 'emerald', fontSize: 'medium', fontFamily: 'modern', sectionOrder: ['summary','experience','education','skills','projects','certifications','languages','achievements'], activeSections: ['summary','experience','education','skills','projects','certifications','languages','achievements'] },
    }
  },
  {
    role: 'Data Scientist',
    level: 'Senior',
    tags: ['Data', 'ML/AI'],
    data: {
      personalInfo: {
        name: 'Priya Patel', title: 'Senior Data Scientist',
        email: 'priya.patel@email.com', phone: '(650) 555-0303',
        location: 'Seattle, WA', linkedin: 'linkedin.com/in/priyapatel',
        github: 'github.com/priyapatel', website: '', photo: '',
      },
      summary: 'Senior Data Scientist with 7+ years building ML models that drive business decisions. Specialized in NLP and recommendation systems. Published 3 research papers and led teams of 5+ data scientists.',
      experience: [
        { id: genId(), company: 'Amazon', position: 'Senior Data Scientist', startDate: '2020-01', endDate: '', current: true, location: 'Seattle, WA', description: '• Built recommendation engine increasing product click-through rate by 28%\n• Developed NLP model reducing customer service tickets by 40%\n• Led a team of 5 data scientists across 2 product lines' },
        { id: genId(), company: 'Netflix', position: 'Data Scientist', startDate: '2017-06', endDate: '2019-12', current: false, location: 'Los Gatos, CA', description: '• Improved content recommendation accuracy by 15% using collaborative filtering\n• Built A/B testing framework used by 12 product teams\n• Processed 10TB+ daily streaming data using Spark and Hadoop' },
      ],
      education: [{ id: genId(), institution: 'Carnegie Mellon University', degree: 'M.S.', field: 'Machine Learning', startDate: '2015-09', endDate: '2017-05', gpa: '3.9/4.0', description: '' }],
      skills: [
        { id: genId(), category: 'ML/AI', items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'NLP', 'Deep Learning'] },
        { id: genId(), category: 'Data', items: ['Python', 'SQL', 'Spark', 'Hadoop', 'Pandas'] },
        { id: genId(), category: 'Cloud', items: ['AWS SageMaker', 'GCP BigQuery', 'Azure ML'] },
      ],
      projects: [{ id: genId(), name: 'SentimentAI', description: 'Open-source sentiment analysis library with 1,500+ GitHub stars.', technologies: 'Python, PyTorch, HuggingFace', link: 'github.com/priyapatel/sentimentai' }],
      certifications: [{ id: genId(), name: 'Google Professional ML Engineer', issuer: 'Google Cloud', date: '2022-08', link: '' }],
      languages: [{ id: genId(), language: 'English', proficiency: 'Fluent' }, { id: genId(), language: 'Gujarati', proficiency: 'Native' }],
      achievements: [{ id: genId(), title: 'Best Paper Award — NeurIPS 2021', description: 'Recognized for research on efficient transformer architectures.', date: '2021-12' }],
      customSections: [],
      settings: { template: 'creative', colorScheme: 'rose', fontSize: 'medium', fontFamily: 'modern', sectionOrder: ['summary','experience','education','skills','projects','certifications','languages','achievements'], activeSections: ['summary','experience','education','skills','projects','certifications','languages','achievements'] },
    }
  },
  {
    role: 'Marketing Manager',
    level: 'Mid-Level',
    tags: ['Marketing', 'Growth'],
    data: {
      personalInfo: {
        name: 'James Carter', title: 'Digital Marketing Manager',
        email: 'james.carter@email.com', phone: '(312) 555-0404',
        location: 'Chicago, IL', linkedin: 'linkedin.com/in/jamescarter',
        github: '', website: 'jamescarter.co', photo: '',
      },
      summary: 'Digital Marketing Manager with 6+ years driving growth through SEO, paid media, and content strategy. Generated $5M+ in pipeline through integrated campaigns. Data-driven and ROI-focused.',
      experience: [
        { id: genId(), company: 'Salesforce', position: 'Digital Marketing Manager', startDate: '2021-02', endDate: '', current: true, location: 'Chicago, IL', description: '• Managed $2M annual paid media budget across Google, LinkedIn, and Meta\n• Grew organic traffic by 85% in 18 months through SEO and content strategy\n• Led team of 4 marketing specialists and 2 content writers' },
        { id: genId(), company: 'HubSpot', position: 'Marketing Specialist', startDate: '2018-04', endDate: '2021-01', current: false, location: 'Boston, MA', description: '• Launched email campaigns with 35%+ open rates (industry avg: 21%)\n• Managed social media accounts growing followers from 10K to 45K\n• Produced 50+ blog posts ranking on page 1 of Google' },
      ],
      education: [{ id: genId(), institution: 'University of Michigan', degree: 'B.A.', field: 'Marketing', startDate: '2014-09', endDate: '2018-05', gpa: '3.6/4.0', description: '' }],
      skills: [
        { id: genId(), category: 'Digital Marketing', items: ['SEO/SEM', 'Google Ads', 'Meta Ads', 'Email Marketing'] },
        { id: genId(), category: 'Analytics', items: ['Google Analytics', 'HubSpot', 'Salesforce', 'Tableau'] },
        { id: genId(), category: 'Content', items: ['Content Strategy', 'Copywriting', 'WordPress', 'Canva'] },
      ],
      projects: [],
      certifications: [
        { id: genId(), name: 'Google Ads Certified', issuer: 'Google', date: '2023-01', link: '' },
        { id: genId(), name: 'HubSpot Marketing Certified', issuer: 'HubSpot', date: '2022-06', link: '' },
      ],
      languages: [{ id: genId(), language: 'English', proficiency: 'Native' }],
      achievements: [{ id: genId(), title: 'Marketing Campaign of the Year — Salesforce 2022', description: 'Recognized for B2B campaign generating $3M in pipeline.', date: '2022-11' }],
      customSections: [],
      settings: { template: 'creative', colorScheme: 'amber', fontSize: 'medium', fontFamily: 'modern', sectionOrder: ['summary','experience','education','skills','projects','certifications','languages','achievements'], activeSections: ['summary','experience','education','skills','certifications','languages','achievements'] },
    }
  },
  {
    role: 'UX Designer',
    level: 'Mid-Level',
    tags: ['Design', 'Creative'],
    data: {
      personalInfo: {
        name: 'Emma Wilson', title: 'UX/UI Designer',
        email: 'emma.wilson@email.com', phone: '(646) 555-0505',
        location: 'New York, NY', linkedin: 'linkedin.com/in/emmawilson',
        github: '', website: 'emmawilson.design', photo: '',
      },
      summary: 'UX/UI Designer with 5+ years creating user-centered digital experiences for web and mobile. Led design for products used by 2M+ users. Expert in Figma, design systems, and usability research.',
      experience: [
        { id: genId(), company: 'Airbnb', position: 'Senior UX Designer', startDate: '2021-06', endDate: '', current: true, location: 'New York, NY', description: '• Redesigned host onboarding flow reducing drop-off by 42%\n• Built and maintained design system with 200+ components used by 15 designers\n• Conducted 30+ usability tests and synthesized findings into actionable design decisions' },
        { id: genId(), company: 'Spotify', position: 'UX Designer', startDate: '2019-03', endDate: '2021-05', current: false, location: 'New York, NY', description: '• Designed podcast player interface now used by 100M+ listeners\n• Created user journey maps and wireframes for 5 major feature releases\n• Improved app store rating from 4.1 to 4.6 through UX improvements' },
      ],
      education: [{ id: genId(), institution: 'Parsons School of Design', degree: 'B.F.A.', field: 'Communication Design', startDate: '2015-09', endDate: '2019-05', gpa: '3.8/4.0', description: '' }],
      skills: [
        { id: genId(), category: 'Design', items: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'] },
        { id: genId(), category: 'Research', items: ['User Interviews', 'Usability Testing', 'A/B Testing', 'Journey Mapping'] },
        { id: genId(), category: 'Development', items: ['HTML/CSS', 'React (basics)', 'Design Systems'] },
      ],
      projects: [{ id: genId(), name: 'DesignKit — Free UI Component Library', description: 'Open-source Figma component library with 5,000+ downloads.', technologies: 'Figma, Design Systems', link: 'figma.com/@emmawilson' }],
      certifications: [{ id: genId(), name: 'Google UX Design Certificate', issuer: 'Google / Coursera', date: '2021-01', link: '' }],
      languages: [{ id: genId(), language: 'English', proficiency: 'Native' }, { id: genId(), language: 'French', proficiency: 'Conversational' }],
      achievements: [{ id: genId(), title: 'Awwwards Site of the Day', description: 'Portfolio recognized for outstanding UI/UX design.', date: '2022-04' }],
      customSections: [],
      settings: { template: 'creative', colorScheme: 'violet', fontSize: 'medium', fontFamily: 'modern', sectionOrder: ['summary','experience','education','skills','projects','certifications','languages','achievements'], activeSections: ['summary','experience','education','skills','projects','certifications','languages','achievements'] },
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

          <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', borderRadius: '16px', padding: '40px', textAlign: 'center', marginTop: '40px' }}>
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