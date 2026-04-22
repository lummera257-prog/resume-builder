import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Analytics — defer करें ताकि main thread block न हो
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      import('@vercel/analytics').then(({ inject }) => inject())
      import('@vercel/speed-insights').then(({ injectSpeedInsights }) => injectSpeedInsights())
    }, 2000)
  })
}
