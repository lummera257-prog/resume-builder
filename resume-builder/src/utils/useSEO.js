import { useEffect } from 'react'

const BASE_URL = 'https://freeresumeforgebuilder.com'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`

const setMeta = (name, content) => {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el) }
  el.setAttribute('content', content)
}

const setOg = (property, content) => {
  let el = document.querySelector(`meta[property="${property}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el) }
  el.setAttribute('content', content)
}

const setCanonical = (href) => {
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) { el = document.createElement('link'); el.rel = 'canonical'; document.head.appendChild(el) }
  el.href = href
}

// Sets document title, meta description/keywords, Open Graph, Twitter Card,
// and canonical URL for a page. `path` is the route path (e.g. '/about').
export function useSEO({
  title,
  description,
  keywords,
  path = '',
  ogType = 'website',
  image = DEFAULT_IMAGE,
  noindex = false,
}) {
  useEffect(() => {
    const url = `${BASE_URL}${path}`

    if (title) document.title = title
    if (description) setMeta('description', description)
    if (keywords) setMeta('keywords', keywords)
    setMeta('robots', noindex ? 'noindex, follow' : 'index, follow')

    if (title) setOg('og:title', title)
    if (description) setOg('og:description', description)
    setOg('og:url', url)
    setOg('og:type', ogType)
    setOg('og:image', image)

    setMeta('twitter:card', 'summary_large_image')
    if (title) setMeta('twitter:title', title)
    if (description) setMeta('twitter:description', description)
    setMeta('twitter:image', image)

    setCanonical(url)
  }, [title, description, keywords, path, ogType, image, noindex])
}
