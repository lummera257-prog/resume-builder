const fs = require('fs');
const path = require('path');

const seoDir = path.join(__dirname, 'src', 'pages', 'seo');
const blogFile = path.join(__dirname, 'src', 'pages', 'Blog.jsx');
const blogPostFile = path.join(__dirname, 'src', 'pages', 'BlogPost.jsx');

const filesToProcess = fs.readdirSync(seoDir)
  .filter(f => f.endsWith('.jsx'))
  .map(f => path.join(seoDir, f));

filesToProcess.push(blogFile);
filesToProcess.push(blogPostFile);

let count = 0;

for (const file of filesToProcess) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace <Link to="/"> with <Link to="/builder">
  // BUT don't replace if it's the logo or breadcrumb. Actually, in SEO pages, ALL <Link to="/"> are CTAs to the builder.
  // Let's check Blog.jsx and BlogPost.jsx. They have:
  // <Link to="/" style={{ textDecoration: 'none' }} className="flex items-center gap-2 shrink-0"> (this is the Logo!)
  // In Blog.jsx: <Link to="/" className="inline-block bg-white text-blue-600 font-bold px-6 py-2.5 rounded-lg hover:bg-blue-50">Build My Resume Free</Link>
  
  // To be safe, we only replace <Link to="/"> if it contains CTA text like "Build", "Create", "Check", "Open", "Resume".
  
  const modified = content.replace(/<Link to="\/"([^>]*)>(.*?)<\/Link>/g, (match, attrs, innerText) => {
    const textLower = innerText.toLowerCase();
    if (textLower.includes('build') || textLower.includes('create') || textLower.includes('check') || textLower.includes('open') || textLower.includes('resume')) {
      count++;
      return `<Link to="/builder"${attrs}>${innerText}</Link>`;
    }
    return match;
  });

  fs.writeFileSync(file, modified, 'utf8');
}

console.log('Replaced', count, 'links');
