import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LandingPage from './components/LandingPage.jsx'

// Em produção no Vercel, usa apenas a LandingPage
const AppComponent = () => {
  if (import.meta.env.PROD) {
    return <LandingPage />
  }
  
  // Em desenvolvimento, carrega o App completo dinamicamente
  const App = React.lazy(() => import('./App.jsx'))
  return (
    <React.Suspense fallback={<div>Carregando...</div>}>
      <App />
    </React.Suspense>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppComponent />
  </StrictMode>,
)
