/**
 * PDF Export Utility
 * Uses html2pdf.js for client-side PDF generation — completely free, no backend needed
 */

export const exportToPDF = async (elementId, filename = 'resume') => {
  const html2pdf = (await import('html2pdf.js')).default

  const element = document.getElementById(elementId)
  if (!element) {
    console.error('Resume element not found:', elementId)
    return
  }

  // Clone करें ताकि original DOM affect न हो
  const clone = element.cloneNode(true)
  clone.style.width = '210mm'
  clone.style.margin = '0'
  clone.style.padding = '0'
  clone.style.boxSizing = 'border-box'
  clone.style.background = '#ffffff'

  // Temporary hidden container
  const wrapper = document.createElement('div')
  wrapper.style.position = 'fixed'
  wrapper.style.top = '-9999px'
  wrapper.style.left = '-9999px'
  wrapper.style.width = '210mm'
  wrapper.style.zIndex = '-1'
  wrapper.appendChild(clone)
  document.body.appendChild(wrapper)

  const opt = {
    margin:      [0, 0, 0, 0],
    filename:    `${filename.replace(/\s+/g, '_')}_Resume.pdf`,
    image:       { type: 'jpeg', quality: 1.0 },
    html2canvas: {
      scale:           3,
      useCORS:         true,
      letterRendering: true,
      scrollX:         0,
      scrollY:         0,
      backgroundColor: '#ffffff',
      logging:         false,
      width:           794,
      windowWidth:     794,
    },
    jsPDF: {
      unit:        'mm',
      format:      'a4',
      orientation: 'portrait',
      compress:    true,
    },
    pagebreak: {
      mode:   ['css', 'legacy'],
      before: '.page-break-before',
      after:  '.page-break-after',
      avoid:  ['tr', 'td', '.no-break'],
    },
  }

  try {
    await html2pdf().set(opt).from(clone).save()
    document.body.removeChild(wrapper)
    return { success: true }
  } catch (err) {
    console.error('PDF generation failed:', err)
    if (document.body.contains(wrapper)) document.body.removeChild(wrapper)
    return { success: false, error: err.message }
  }
}

/**
 * Calculate ATS compatibility score based on resume data
 */
export const calculateATSScore = (resumeData) => {
  let score = 0
  const issues = []
  const tips = []

  const { personalInfo, summary, experience, education, skills, settings } = resumeData

  // Personal info (20 pts)
  if (personalInfo.name)     score += 5
  if (personalInfo.email)    score += 5
  if (personalInfo.phone)    score += 5
  if (personalInfo.location) score += 3
  if (personalInfo.linkedin) { score += 2 }
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