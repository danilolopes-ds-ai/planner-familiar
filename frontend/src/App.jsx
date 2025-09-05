
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Layout from './components/Layout'
import Orcamento from './components/Orcamento'
import Lancamentos from './components/Lancamentos'
import CartaoCredito from './components/CartaoCredito'
import Investimentos from './components/Investimentos'
import DividasMetas from './components/DividasMetas'
import Relatorios from './components/Relatorios'
import LandingPage from './components/LandingPage'
import './App.css'

// Função para detectar ambiente de produção
const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route 
              path="/" 
              element={
                isProduction ? 
                  <LandingPage /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? 
                  <Login setIsAuthenticated={setIsAuthenticated} /> : 
                  <Navigate to="/dashboard" replace />
              } 
            />
            <Route 
              path="/register" 
              element={
                !isAuthenticated ? 
                  <Register /> : 
                  <Navigate to="/dashboard" replace />
              } 
            />
            <Route 
              path="/" 
              element={
                isAuthenticated ? 
                  <Layout setIsAuthenticated={setIsAuthenticated} /> : 
                  <Navigate to="/login" replace />
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="orcamento" element={<Orcamento />} />
              <Route path="lancamentos" element={<Lancamentos />} />
              <Route path="cartao-credito" element={<CartaoCredito />} />
              <Route path="investimentos" element={<Investimentos />} />
              <Route path="dividas-metas" element={<DividasMetas />} />
              <Route path="relatorios" element={<Relatorios />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App

