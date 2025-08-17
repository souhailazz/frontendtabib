import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'
import 'leaflet/dist/leaflet.css'
import { SEOProvider } from './components/SEO/SEO'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SEOProvider>
      <App />
    </SEOProvider>
  </StrictMode>,
)
