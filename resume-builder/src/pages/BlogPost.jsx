import { useParams, Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'
import Footer from '../components/Footer'

export default function BlogPost() {
  const { slug } = useParams()
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-2xl font-bold text-slate-700 mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-blue-600 hover:underline">← Back to Blog</Link>
      </div>
    )
  }

  const related = blogPosts.filter(p => p.slug !== slug).slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <title>{post.title} — ResumeForge Blog</title>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">R</div>
            <span className="font-bold text-slate-900">ResumeForge</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/blog" className="text-slate-600 hover:text-slate-900">← Blog</Link>
            <Link to="/" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 font-semibold">
              Build Resume →
            </Link>
          </nav>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 py-10 w-full">

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {post.category}
          </span>
          <span className="text-xs text-slate-400">{post.readTime}</span>
          <span className="text-xs text-slate-400">
            {new Date(post.date).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric'
            })}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
          {post.title}
        </h1>
        <p className="text-lg text-slate-500 mb-8 border-b border-slate-200 pb-8">
          {post.description}
        </p>

        {/* Content */}
        <MarkdownContent content={post.content} />

        {/* CTA Box */}
        <div className="mt-10 bg-blue-600 rounded-xl p-6 text-white text-center">
          <h3 className="text-lg font-bold mb-2">Build Your Free ATS Resume Now</h3>
          <p className="text-blue-100 text-sm mb-4">No account needed. Download PDF in minutes.</p>
          <Link to="/" className="inline-block bg-white text-blue-600 font-bold px-6 py-2.5 rounded-lg hover:bg-blue-50">
            🚀 Start Building Free
          </Link>
        </div>
      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 pb-12 w-full">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map(r => (
              <Link key={r.slug} to={`/blog/${r.slug}`}
                className="bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                <span className="text-xs text-blue-600 font-semibold">{r.category}</span>
                <h3 className="text-sm font-bold text-slate-800 mt-1 leading-snug">{r.title}</h3>
                <span className="text-xs text-blue-600 mt-2 inline-block">Read →</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

function MarkdownContent({ content }) {
  const lines = content.trim().split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-slate-900 mt-8 mb-3">
          {line.replace('## ', '')}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-lg font-bold text-slate-800 mt-6 mb-2">
          {line.replace('### ', '')}
        </h3>
      )
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listItems.push(
          <li key={i} className="text-slate-600 leading-relaxed">
            {lines[i].replace(/^[-*] /, '')}
          </li>
        )
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1.5 mb-4 ml-4">
          {listItems}
        </ul>
      )
      continue
    } else if (/^\d+\. /.test(line)) {
      const listItems = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        listItems.push(
          <li key={i} className="text-slate-600 leading-relaxed">
            {lines[i].replace(/^\d+\. /, '')}
          </li>
        )
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-1.5 mb-4 ml-4">
          {listItems}
        </ol>
      )
      continue
    } else if (line.startsWith('```')) {
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(
        <pre key={i} className="bg-slate-900 text-green-400 rounded-lg p-4 text-xs overflow-x-auto mb-4 font-mono">
          {codeLines.join('\n')}
        </pre>
      )
    } else if (line.startsWith('| ')) {
      const tableLines = []
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      const headers = tableLines[0].split('|').filter(Boolean).map(h => h.trim())
      const rows = tableLines.slice(2).map(r => r.split('|').filter(Boolean).map(c => c.trim()))
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse border border-slate-200 rounded-lg">
            <thead className="bg-slate-100">
              <tr>
                {headers.map((h, j) => (
                  <th key={j} className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, j) => (
                <tr key={j} className="hover:bg-slate-50">
                  {row.map((cell, k) => (
                    <td key={k} className="border border-slate-200 px-3 py-2 text-slate-600">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    } else if (line.trim() === '') {
      // skip empty lines
    } else {
      const parts = line.split(/(\*\*[^*]+\*\*)/)
      const rendered = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>
        }
        return part
      })
      elements.push(
        <p key={i} className="text-slate-600 mb-3 leading-relaxed">{rendered}</p>
      )
    }
    i++
  }

  return <div className="space-y-1">{elements}</div>
}