import React from 'react'

const SimpleApp = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: '#3b82f6',
          borderRadius: '50%',
          margin: '0 auto 1.5rem auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          💰
        </div>
        
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1rem'
        }}>
          Finanças Familiares
        </h1>
        
        <p style={{
          fontSize: '1.125rem',
          color: '#6b7280',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Sistema de gestão financeira familiar.<br />
          <strong>Status:</strong> Frontend funcionando ✅
        </p>
        
        <div style={{
          background: '#f3f4f6',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Funcionalidades
          </h3>
          <ul style={{
            textAlign: 'left',
            color: '#6b7280',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            margin: 0,
            paddingLeft: '1.5rem'
          }}>
            <li>Controle de orçamento familiar</li>
            <li>Gestão de investimentos</li>
            <li>Acompanhamento de cartões de crédito</li>
            <li>Definição de metas financeiras</li>
            <li>Relatórios e gráficos</li>
          </ul>
        </div>
        
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#dbeafe',
          color: '#1d4ed8',
          padding: '0.5rem 1rem',
          borderRadius: '9999px',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: '#3b82f6',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }}></div>
          Deploy funcionando no Vercel
        </div>
      </div>
    </div>
  )
}

export default SimpleApp
