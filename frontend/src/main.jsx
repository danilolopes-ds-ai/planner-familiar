import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Componente React simples para testar
const SimpleApp = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰 Finanças Familiares</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem', maxWidth: '600px' }}>
        Gerencie as finanças da sua família de forma simples e eficiente
      </p>
      <button 
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: '2px solid white',
          color: 'white',
          padding: '15px 30px',
          borderRadius: '10px',
          fontSize: '1.2rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.3)'
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.2)'
        }}
        onClick={() => alert('App React funcionando! 🎉')}
      >
        Testar React
      </button>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SimpleApp />
  </StrictMode>,
)
