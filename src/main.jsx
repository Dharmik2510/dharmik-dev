import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Self-hosted fonts (no Google Fonts request): Instrument Sans (with width axis), Instrument Serif, Geist Mono
import '@fontsource-variable/instrument-sans/wdth.css'
import '@fontsource-variable/instrument-sans/wdth-italic.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource-variable/geist-mono'
import '@fontsource/noto-sans-gujarati/500.css'
import './styles/globals.css'
import './styles/journey.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
