/**
 * PDF Export Utility
 * Uses html2pdf.js for client-side PDF generation — completely free, no backend needed
 */

export const exportToPDF = async (elementId, filename = 'resume') => {
  // Dynamically import html2pdf to avoid SSR issues
  const html2pdf = (await import('html2pdf.js')).default

  const element = document.getElementById(elementId)
  if (!element) {
    console.error('Resume element not found:', elementId)
    return
  }

  const opt = {
    margin:       [0, 0, 0, 0],
    filename:     `${filename.replace(/\s+/g, '_')}_Resume.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794,
      backgroundColor: '#ffffff',
    },
    jsPDF:        {
      unit: 'px',
      format: 'a4',
      orientation: 'portrait',
      hotfixes: ['px_scaling'],
    },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] },
  }

  try {
    await html2pdf().set(opt).from(element).save()
    return { success: true }
  } catch (err) {
    console.error('PDF generation failed:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Calculate ATS compatibility score based on resume data
 * Helps users optimize for Applicant Tracking Systems
 */
export const calculateATSScore = (resumeData) => {
  let score = 0
  const issues = []
  const tips = []

  const { personalInfo, summary, experience, education, skills, settings } = resumeData

  // Personal info completeness (20 pts)
  if (personalInfo.name)     score += 5
  if (personalInfo.email)    score += 5
  if (personalInfo.phone)    score += 5
  if (personalInfo.location) score += 3
  if (personalInfo.linkedin) { score += 2; } 
  else tips.push('Add LinkedIn profile URL')

  // Summary (15 pts)
  if (summary) {
    score += 10
    if (summary.length >= 100) score += 5
    else tips.push('Expand summary to 100+ characters with keywords')
  } else {
    issues.push('Missing professional summary')
  }

  // Experience (25 pts)
  if (experience.length > 0) {
    score += 15
    const hasQuantified = experience.some(e =>
      /\d+[%x+]|\d+\s*(users|customers|team|million|thousand|k\b)/i.test(e.description)
    )
    if (hasQuantified) score += 10
    else tips.push('Add metrics to experience (e.g., "increased sales by 30%")')
  } else {
    issues.push('No work experience added')
  }

  // Education (10 pts)
  if (education.length > 0) score += 10
  else tips.push('Add your educational background')

  // Skills (20 pts)
  if (skills.length > 0) {
    score += 10
    const totalSkills = skills.reduce((acc, s) => acc + (s.items?.length || 0), 0)
    if (totalSkills >= 8) score += 10
    else { score += 5; tips.push('Add 8+ skills for better ATS matching') }
  } else {
    issues.push('No skills listed — critical for ATS')
  }

  // Layout bonus (10 pts)
  if (settings.layout === 'single') {
    score += 10
  } else {
    tips.push('Single-column layout has better ATS compatibility')
  }

  return {
    score: Math.min(score, 100),
    grade: score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Needs Work',
    color: score >= 85 ? '#059669' : score >= 70 ? '#2563eb' : score >= 50 ? '#d97706' : '#e11d48',
    issues,
    tips,
  }
}
