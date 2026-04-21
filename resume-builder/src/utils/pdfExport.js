export const exportToPDF = async (elementId, filename = 'resume') => {
  const html2pdf = (await import('html2pdf.js')).default

  const element = document.getElementById(elementId)
  if (!element) { console.error('Resume element not found:', elementId); return }

  const saved = []
  let node = element
  while (node && node !== document.body) {
    saved.push({
      el: node,
      overflow:  node.style.overflow,
      overflowX: node.style.overflowX,
      overflowY: node.style.overflowY,
      maxHeight: node.style.maxHeight,
      height:    node.style.height,
    })
    node.style.overflow  = 'visible'
    node.style.overflowX = 'visible'
    node.style.overflowY = 'visible'
    node.style.maxHeight = 'none'
    node.style.height    = 'auto'
    node = node.parentElement
  }

  const origWidth  = element.style.width
  const origHeight = element.style.height
  element.style.width  = '794px'
  element.style.height = 'auto'

  await new Promise(r => setTimeout(r, 300))

  const opt = {
    margin:      [10, 0, 10, 0],
    filename:    `${filename.replace(/\s+/g, '_')}_Resume.pdf`,
    image:       { type: 'jpeg', quality: 1.0 },
    html2canvas: {
      scale:           2.5,
      useCORS:         true,
      allowTaint:      true,
      letterRendering: true,
      scrollX:         0,
      scrollY:         0,
      backgroundColor: '#ffffff',
      logging:         false,
      width:           794,
      windowWidth:     794,
      windowHeight:    element.scrollHeight,
    },
    jsPDF: {
      unit:        'mm',
      format:      'a4',
      orientation: 'portrait',
      compress:    true,
    },
    pagebreak: {
      mode:  ['css', 'legacy'],
      avoid: ['h1', 'h2', 'h3', 'tr', 'li', '.no-break'],
    },
  }

  const restore = () => {
    saved.forEach(({ el, overflow, overflowX, overflowY, maxHeight, height }) => {
      el.style.overflow  = overflow
      el.style.overflowX = overflowX
      el.style.overflowY = overflowY
      el.style.maxHeight = maxHeight
      el.style.height    = height
    })
    element.style.width  = origWidth
    element.style.height = origHeight
  }

  try {
    const worker = html2pdf().set(opt).from(element)
    const pdf    = await worker.toPdf().get('pdf')
    const total  = pdf.internal.getNumberOfPages()
    const pw     = pdf.internal.pageSize.getWidth()
    const ph     = pdf.internal.pageSize.getHeight()

    for (let i = 1; i <= total; i++) {
      pdf.setPage(i)

      // Footer only watermark — clean, subtle
      pdf.setFontSize(8)
      pdf.setTextColor(160, 160, 160)
      pdf.setFont('helvetica', 'normal')
      pdf.text(
        `freeresumeforgebuilder.com  •  Page ${i} of ${total}`,
        pw / 2,
        ph - 3,
        { align: 'center' }
      )
    }

    pdf.save(`${filename.replace(/\s+/g, '_')}_Resume.pdf`)
    restore()
    return { success: true }

  } catch (err) {
    console.error('PDF generation failed:', err)
    restore()
    return { success: false, error: err.message }
  }
}

export const calculateATSScore = (resumeData) => {
  let score = 0
  const issues = []
  const tips   = []
  const { personalInfo, summary, experience, education, skills, settings } = resumeData

  if (personalInfo.name)     score += 5
  if (personalInfo.email)    score += 5
  if (personalInfo.phone)    score += 5
  if (personalInfo.location) score += 3
  if (personalInfo.linkedin) score += 2
  else tips.push('Add LinkedIn profile URL')

  if (summary) {
    score += 10
    if (summary.length >= 100) score += 5
    else tips.push('Expand summary to 100+ characters with keywords')
  } else {
    issues.push('Missing professional summary')
  }

  if (experience.length > 0) {
    score += 15
    const hasQ = experience.some(e =>
      /\d+[%x+]|\d+\s*(users|customers|team|million|thousand|k\b)/i.test(e.description)
    )
    if (hasQ) score += 10
    else tips.push('Add metrics to experience (e.g., "increased sales by 30%")')
  } else {
    issues.push('No work experience added')
  }

  if (education.length > 0) score += 10
  else tips.push('Add your educational background')

  if (skills.length > 0) {
    score += 10
    const total = skills.reduce((acc, s) => acc + (s.items?.length || 0), 0)
    if (total >= 8) score += 10
    else { score += 5; tips.push('Add 8+ skills for better ATS matching') }
  } else {
    issues.push('No skills listed — critical for ATS')
  }

  if (settings.layout === 'single') score += 10
  else tips.push('Single-column layout has better ATS compatibility')

  return {
    score: Math.min(score, 100),
    grade: score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Needs Work',
    color: score >= 85 ? '#059669' : score >= 70 ? '#2563eb' : score >= 50 ? '#d97706' : '#e11d48',
    issues,
    tips,
  }
}