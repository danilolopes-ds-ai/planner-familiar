import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Planner de Finanças Familiares - Versão Ferrari 🏎️
const FinancasApp = () => {
  const [activeSection, setActiveSection] = React.useState('dashboard')
  const [showModal, setShowModal] = React.useState(false)
  
  // Dados financeiros
  const [financialData, setFinancialData] = React.useState({
    saldo: 15750.00,
    renda: 8500.00,
    gastos: 6200.00,
    economia: 2300.00,
    cartoes: [
      { id: 1, nome: 'Nubank', limite: 5000, usado: 1200, vencimento: '15/09' },
      { id: 2, nome: 'Itaú', limite: 3000, usado: 800, vencimento: '20/09' }
    ],
    lancamentos: [
      { id: 1, data: '01/09', descricao: 'Salário', categoria: 'Renda', valor: 8500, tipo: 'entrada' },
      { id: 2, data: '02/09', descricao: 'Supermercado', categoria: 'Alimentação', valor: -320, tipo: 'saida' },
      { id: 3, data: '03/09', descricao: 'Gasolina', categoria: 'Transporte', valor: -180, tipo: 'saida' },
      { id: 4, data: '05/09', descricao: 'Internet', categoria: 'Contas', valor: -120, tipo: 'saida' }
    ],
    metas: [
      { id: 1, nome: 'Viagem Família', valor: 5000, economizado: 2300, prazo: 'Dezembro 2025' },
      { id: 2, nome: 'Emergência', valor: 10000, economizado: 6500, prazo: 'Ongoing' }
    ]
  })

  const addLancamento = (lancamento) => {
    const newLancamento = {
      ...lancamento,
      id: Date.now(),
      data: new Date(lancamento.data).toLocaleDateString('pt-BR')
    }
    
    setFinancialData(prev => ({
      ...prev,
      lancamentos: [newLancamento, ...prev.lancamentos],
      saldo: prev.saldo + (lancamento.tipo === 'entrada' ? lancamento.valor : -lancamento.valor)
    }))
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
      {/* Header Moderno */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Finanças Familiares</h1>
            </div>
            
            <nav className="flex flex-wrap gap-2">
              {[
                { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
                { id: 'cartoes', label: '💳 Cartões', icon: '💳' },
                { id: 'lancamentos', label: '💸 Lançamentos', icon: '💸' },
                { id: 'metas', label: '🎯 Metas', icon: '🎯' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-white text-blue-900 shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Dashboard */}
        {activeSection === 'dashboard' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-2">Dashboard Financeiro</h2>
              <p className="text-blue-200">Visão geral das suas finanças familiares</p>
            </div>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Saldo Total</p>
                    <p className="text-3xl font-bold">R$ {financialData.saldo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Renda Mensal</p>
                    <p className="text-3xl font-bold">R$ {financialData.renda.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Gastos Mensais</p>
                    <p className="text-3xl font-bold">R$ {financialData.gastos.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📉</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Economia</p>
                    <p className="text-3xl font-bold">R$ {financialData.economia.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💎</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos e Resumos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  📊 Distribuição de Gastos
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Alimentação', percent: 35, color: 'bg-green-500' },
                    { label: 'Transporte', percent: 25, color: 'bg-yellow-500' },
                    { label: 'Contas', percent: 20, color: 'bg-red-500' },
                    { label: 'Outros', percent: 20, color: 'bg-purple-500' }
                  ].map(item => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between text-white">
                        <span>{item.label}</span>
                        <span>{item.percent}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className={`${item.color} h-2 rounded-full transition-all duration-500`} style={{width: `${item.percent}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  🎯 Progresso das Metas
                </h3>
                <div className="space-y-4">
                  {financialData.metas.map(meta => {
                    const percent = (meta.economizado / meta.valor) * 100
                    return (
                      <div key={meta.id} className="space-y-2">
                        <div className="flex justify-between text-white">
                          <span className="font-medium">{meta.nome}</span>
                          <span>{percent.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3">
                          <div className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-500" style={{width: `${percent}%`}}></div>
                        </div>
                        <div className="flex justify-between text-sm text-blue-200">
                          <span>R$ {meta.economizado.toLocaleString('pt-BR')}</span>
                          <span>R$ {meta.valor.toLocaleString('pt-BR')}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cartões Section */}
        {activeSection === 'cartoes' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-2">💳 Cartões de Crédito</h2>
              <p className="text-blue-200">Gerencie seus cartões e limites</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {financialData.cartoes.map(cartao => {
                const percentUsed = (cartao.usado / cartao.limite) * 100
                const statusColor = percentUsed > 80 ? 'from-red-500 to-red-600' : percentUsed > 50 ? 'from-yellow-500 to-yellow-600' : 'from-green-500 to-green-600'
                
                return (
                  <div key={cartao.id} className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-xl border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">{cartao.nome}</h3>
                      <span className="text-2xl">💳</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Usado: R$ {cartao.usado.toLocaleString('pt-BR')}</span>
                        <span>Limite: R$ {cartao.limite.toLocaleString('pt-BR')}</span>
                      </div>
                      
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div className={`bg-gradient-to-r ${statusColor} h-3 rounded-full transition-all duration-500`} style={{width: `${percentUsed}%`}}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className={percentUsed > 80 ? 'text-red-300' : percentUsed > 50 ? 'text-yellow-300' : 'text-green-300'}>
                          {percentUsed.toFixed(1)}% usado
                        </span>
                        <span className="text-gray-300">Vence: {cartao.vencimento}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Lançamentos Section */}
        {activeSection === 'lancamentos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-4xl font-bold text-white">💸 Lançamentos</h2>
                <p className="text-blue-200">Controle suas entradas e saídas</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ➕ Novo Lançamento
              </button>
            </div>
            
            <div className="space-y-4">
              {financialData.lancamentos.map(lancamento => (
                <div key={lancamento.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        lancamento.tipo === 'entrada' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        <span className="text-xl">{lancamento.tipo === 'entrada' ? '📈' : '📉'}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{lancamento.descricao}</h4>
                        <p className="text-blue-200 text-sm">{lancamento.data} • {lancamento.categoria}</p>
                      </div>
                    </div>
                    <div className={`text-xl font-bold ${
                      lancamento.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {lancamento.valor > 0 ? '+' : ''}R$ {Math.abs(lancamento.valor).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metas Section */}
        {activeSection === 'metas' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-2">🎯 Metas Financeiras</h2>
              <p className="text-blue-200">Acompanhe seus objetivos financeiros</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {financialData.metas.map(meta => {
                const percent = (meta.economizado / meta.valor) * 100
                return (
                  <div key={meta.id} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">🎯</span>
                      <h3 className="text-xl font-bold text-white">{meta.nome}</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-white">
                        <span>Economizado: R$ {meta.economizado.toLocaleString('pt-BR')}</span>
                        <span>Meta: R$ {meta.valor.toLocaleString('pt-BR')}</span>
                      </div>
                      
                      <div className="w-full bg-white/20 rounded-full h-4">
                        <div className="bg-gradient-to-r from-green-400 to-green-500 h-4 rounded-full transition-all duration-500" style={{width: `${percent}%`}}></div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-green-400 font-semibold">{percent.toFixed(1)}% concluído</span>
                        <span className="text-blue-200">Prazo: {meta.prazo}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>

      {/* Modal para Novo Lançamento */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Novo Lançamento</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              const valor = parseFloat(formData.get('valor'))
              const tipo = formData.get('tipo')
              
              addLancamento({
                data: formData.get('data'),
                descricao: formData.get('descricao'),
                categoria: formData.get('categoria'),
                valor: tipo === 'entrada' ? valor : -valor,
                tipo
              })
            }} className="space-y-4">
              <input
                type="date"
                name="data"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
              <input
                type="text"
                name="descricao"
                placeholder="Descrição"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                name="categoria"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione a categoria</option>
                <option value="Alimentação">Alimentação</option>
                <option value="Transporte">Transporte</option>
                <option value="Contas">Contas</option>
                <option value="Renda">Renda</option>
                <option value="Outros">Outros</option>
              </select>
              <input
                type="number"
                name="valor"
                placeholder="Valor"
                step="0.01"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                name="tipo"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tipo</option>
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FinancasApp />
  </StrictMode>
)
