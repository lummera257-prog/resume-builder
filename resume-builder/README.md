# 🔨 ResumeForge — Free Professional Resume Builder

> Build beautiful, ATS-optimized resumes in minutes. No login. No paywall. Runs in your browser.

![ResumeForge](https://img.shields.io/badge/ResumeForge-v1.0.0-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Vite](https://img.shields.io/badge/Vite-5-646cff)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🎨 **2 Templates** | Classic (ATS-friendly) + Modern (sidebar layout) |
| 📊 **Live ATS Score** | Real-time score with tips to improve |
| 📝 **10 Sections** | Personal, Summary, Experience, Education, Skills, Projects, Certs, Languages, Achievements + Custom |
| 🎨 **6 Color Themes** | Ocean, Forest, Royal, Crimson, Graphite, Gold |
| 🔠 **3 Font Styles** | Modern, Classic, Minimal |
| 📄 **PDF Export** | One-click download, multi-page, A4 format |
| 💾 **Auto-save** | All data saved to localStorage automatically |
| 🔄 **Section Manager** | Reorder, toggle, add custom sections |
| 📱 **Mobile Responsive** | Works on all screen sizes |
| 🆓 **100% Free** | No backend, no account, no paid API |

---

## 🚀 Quick Start (Run Locally)

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Steps

```bash
# 1. Clone or extract the project
cd resume-builder

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser at:
# http://localhost:5173
```

That's it! 🎉

---

## 📦 Build for Production

```bash
npm run build
```

Output goes to `dist/` folder. You can deploy this anywhere.

---

## 🌐 Deploy for FREE

### Option 1 — Vercel (Recommended, 30 seconds)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Sign up free
3. Click **"New Project"** → Import your GitHub repo
4. Vercel auto-detects Vite — click **"Deploy"**
5. Your site is live at `https://yourname.vercel.app` 🎉

### Option 2 — GitHub Pages

```bash
# 1. Install gh-pages
npm install --save-dev gh-pages

# 2. Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# 3. Add to vite.config.js:
base: '/your-repo-name/'

# 4. Deploy
npm run deploy
```

### Option 3 — Netlify

1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com) → Drag & drop `dist/` folder
3. Done! Your site is live instantly.

---

## 📁 Project Structure

```
resume-builder/
├── index.html                    # Entry HTML
├── package.json
├── vite.config.js                # Vite config (base path for deploy)
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx                  # React root
    ├── App.jsx                   # Root component with Provider
    ├── index.css                 # Global styles + Tailwind
    │
    ├── context/
    │   └── ResumeContext.jsx     # Global state (useReducer + Context)
    │
    ├── pages/
    │   └── Builder.jsx           # Main builder page layout
    │
    ├── components/
    │   ├── Header.jsx            # Top nav with export button
    │   ├── FormPanel.jsx         # Left panel: all forms + settings
    │   ├── PreviewPanel.jsx      # Right panel: live preview
    │   │
    │   ├── sections/             # One file per resume section
    │   │   ├── PersonalInfo.jsx
    │   │   ├── Summary.jsx
    │   │   ├── Experience.jsx
    │   │   ├── Education.jsx
    │   │   ├── Skills.jsx
    │   │   ├── Projects.jsx
    │   │   ├── Certifications.jsx
    │   │   ├── Languages.jsx
    │   │   ├── Achievements.jsx
    │   │   └── CustomSection.jsx
    │   │
    │   └── ui/
    │       └── SectionCard.jsx   # Reusable form primitives
    │
    ├── templates/
    │   ├── ClassicTemplate.jsx   # ATS-friendly single column
    │   └── ModernTemplate.jsx    # Two-column sidebar layout
    │
    └── utils/
        ├── defaultData.js        # Sample data, constants, genId
        └── pdfExport.js          # PDF generator + ATS score calculator
```

---

## 🧠 How It Works

### State Management
All resume data lives in `ResumeContext` using `useReducer`. This gives you:
- Predictable state updates
- Easy to extend with new actions
- Auto-saved to `localStorage` on every change

### PDF Export
Uses `html2pdf.js` to capture the `#resume-preview` DOM element and convert it to PDF.
- Scale: 2x (retina quality)
- Format: A4
- Multi-page support via `pagebreak` options

### ATS Score
Calculated in real-time in `pdfExport.js`. Checks:
- Personal info completeness
- Summary presence + length
- Work experience with quantified metrics
- Skills count (8+ recommended)
- Layout type (single = better ATS score)

---

## 🎨 Adding a New Template

1. Create `src/templates/YourTemplate.jsx`
2. Accept `{ resume }` as props
3. Return JSX with `id="resume-preview"` on the root div
4. Add it to the template selector in `FormPanel.jsx`

---

## 🔧 Adding a New Section

1. Create `src/components/sections/YourSection.jsx`
2. Use hooks from `useResume()`: `addItem`, `updateItem`, `removeItem`
3. Add section key to `sectionOrder` in `defaultData.js`
4. Add to `SECTION_META` in `defaultData.js`
5. Import and render in `FormPanel.jsx`
6. Add render case in `ClassicTemplate.jsx` and `ModernTemplate.jsx`

---

## 💡 Pro Tips

1. **ATS Score**: Aim for 85+. Use single-column layout for job applications.
2. **Quantify everything**: "Increased sales by 30%" beats "Improved sales"
3. **Summary**: 50-80 words with role-specific keywords
4. **Skills**: Group by category. 8+ skills improves ATS matching.
5. **PDF quality**: Use "Classic" template for best ATS compatibility

---

## 📄 License

MIT — Free to use, modify, and deploy.

---

Made with ❤️ | ResumeForge
