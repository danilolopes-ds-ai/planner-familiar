import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Garantir que o React esteja disponível globalmente em produção
if (typeof window !== 'undefined') {
  window.React = React
}

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element not found')
}

const root = createRoot(container)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
