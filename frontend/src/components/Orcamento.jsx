import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  PlusCircle, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Calendar,
  Lightbulb,
  Edit,
  Trash2,
  Filter,
  RotateCcw
} from 'lucide-react'
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie,
  Cell, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'

const Orcamento = () => {
  const [currentBudget, setCurrentBudget] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [suggestions, setSuggestions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [activeTab, setActiveTab] = useState('visao-geral')

  // Estados do formulário de orçamento principal
  const [budgetForm, setBudgetForm] = useState({
    planned_income: 0,
    planned_expenses: 0
  })

  // Estados para receitas detalhadas
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false)
  const [incomeForm, setIncomeForm] = useState({
    name: '',
    amount: 0,
    type: 'fixa', // fixa ou variavel
    description: '',
    frequency: 'mensal' // mensal, semanal, anual
  })
  const [incomeItems, setIncomeItems] = useState([])

  // Estados para despesas detalhadas  
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [expenseForm, setExpenseForm] = useState({
    name: '',
    amount: 0,
    type: 'fixa', // fixa ou variavel
    category: 'casa',
    description: '',
    frequency: 'mensal',
    priority: 'media' // alta, media, baixa
  })
  const [expenseItems, setExpenseItems] = useState([])

  // Estado para categorias (compatibilidade com código existente)
  const [categoryForm, setCategoryForm] = useState({
    category_name: '',
    planned_amount: 0,
    color: '#3B82F6',
    description: '',
    priority: 2
  })

  // Categorias predefinidas
  const expenseCategories = [
    { value: 'casa', label: '🏠 Casa e Moradia' },
    { value: 'alimentacao', label: '🍽️ Alimentação' },
    { value: 'transporte', label: '🚗 Transporte' },
    { value: 'saude', label: '🏥 Saúde' },
    { value: 'educacao', label: '📚 Educação' },
    { value: 'lazer', label: '🎮 Lazer' },
    { value: 'roupas', label: '👕 Roupas' },
    { value: 'dividas', label: '💳 Dívidas' },
    { value: 'poupanca', label: '💰 Poupança' },
    { value: 'outros', label: '📦 Outros' }
  ]

  const frequencies = [
    { value: 'mensal', label: 'Mensal' },
    { value: 'semanal', label: 'Semanal' }, 
    { value: 'quinzenal', label: 'Quinzenal' },
    { value: 'anual', label: 'Anual' }
  ]

  const COLORS = {
    safe: '#10B981',      // Verde
    moderate: '#F59E0B',  // Amarelo
    high: '#EF4444',      // Vermelho
    exceeded: '#7C2D12'   // Marrom escuro
  }

  const PRIORITY_COLORS = {
    alta: '#EF4444',   // Alta - Vermelho
    media: '#F59E0B',  // Média - Amarelo
    baixa: '#10B981'   // Baixa - Verde
  }

  useEffect(() => {
    fetchBudgetData()
    fetchAnalytics()
    fetchSuggestions()
  }, [])

  const fetchBudgetData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/budget/current', {
        headers: { 'x-access-token': token }
      })
      
      if (response.ok) {
        const data = await response.json()
        setCurrentBudget(data)
        setBudgetForm({
          planned_income: data.planned_income,
          planned_expenses: data.planned_expenses
        })
      } else {
        setError('Erro ao carregar orçamento')
      }
    } catch (error) {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/budget/analytics', {
        headers: { 'x-access-token': token }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Erro ao carregar analytics:', error)
    }
  }

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/budget/suggestions', {
        headers: { 'x-access-token': token }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data)
      }
    } catch (error) {
      console.error('Erro ao carregar sugestões:', error)
    }
  }

  const saveBudget = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(budgetForm)
      })

      if (response.ok) {
        await fetchBudgetData()
        await fetchAnalytics()
        setIsEditing(false)
      } else {
        setError('Erro ao salvar orçamento')
      }
    } catch (error) {
      setError('Erro de conexão')
    }
  }

  const addCategory = async () => {
    if (!currentBudget || !currentBudget.id) {
      setError('Orçamento não encontrado. Crie um orçamento primeiro.')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/budget/${currentBudget.id}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(categoryForm)
      })

      if (response.ok) {
        await fetchBudgetData()
        await fetchAnalytics()
        setCategoryForm({
          category_name: '',
          planned_amount: 0,
          color: '#3B82F6',
          description: '',
          priority: 2
        })
      } else {
        setError('Erro ao adicionar categoria')
      }
    } catch (error) {
      setError('Erro de conexão')
    }
  }

  const updateCategory = async (categoryId, updates) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/budget/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        await fetchBudgetData()
        await fetchAnalytics()
        setEditingCategory(null)
      } else {
        setError('Erro ao atualizar categoria')
      }
    } catch (error) {
      setError('Erro de conexão')
    }
  }

  const deleteCategory = async (categoryId) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/budget/categories/${categoryId}`, {
        method: 'DELETE',
        headers: { 'x-access-token': token }
      })

      if (response.ok) {
        await fetchBudgetData()
        await fetchAnalytics()
      } else {
        setError('Erro ao excluir categoria')
      }
    } catch (error) {
      setError('Erro de conexão')
    }
  }

  // Novas funções para receitas detalhadas
  const addIncomeItem = async () => {
    if (!incomeForm.name || !incomeForm.amount) {
      setError('Nome e valor são obrigatórios')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const newIncome = {
        name: incomeForm.name,
        amount: parseFloat(incomeForm.amount),
        type: incomeForm.type,
        description: incomeForm.description,
        frequency: incomeForm.frequency,
        category: 'receita'
      }

      // Salvar no backend como transação
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify({
          description: newIncome.name,
          amount: newIncome.amount,
          type: 'income',
          category: newIncome.type, // fixa ou variavel
          payment_method: 'outros',
          notes: `${newIncome.description} - ${newIncome.frequency}`
        })
      })

      if (response.ok) {
        // Adicionar ao estado local também
        const newIncomeWithId = { id: Date.now(), ...newIncome }
        setIncomeItems(prev => [...prev, newIncomeWithId])
        setIncomeForm({
          name: '',
          amount: 0,
          type: 'fixa',
          description: '',
          frequency: 'mensal'
        })
        setIncomeDialogOpen(false)
        
        // Atualizar total planejado
        const totalIncome = [...incomeItems, newIncomeWithId].reduce((sum, item) => sum + item.amount, 0)
        setBudgetForm(prev => ({ ...prev, planned_income: totalIncome }))
        
        // Recarregar dados do orçamento
        await fetchBudgetData()
      } else {
        setError('Erro ao salvar receita')
      }
    } catch (error) {
      setError('Erro de conexão')
    }
  }

  const removeIncomeItem = (id) => {
    const updatedItems = incomeItems.filter(item => item.id !== id)
    setIncomeItems(updatedItems)
    
    // Atualizar total planejado
    const totalIncome = updatedItems.reduce((sum, item) => sum + item.amount, 0)
    setBudgetForm(prev => ({ ...prev, planned_income: totalIncome }))
  }

  // Novas funções para despesas detalhadas
  const addExpenseItem = async () => {
    if (!expenseForm.name || !expenseForm.amount) {
      setError('Nome e valor são obrigatórios')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const newExpense = {
        name: expenseForm.name,
        amount: parseFloat(expenseForm.amount),
        type: expenseForm.type,
        category: expenseForm.category,
        description: expenseForm.description,
        frequency: expenseForm.frequency,
        priority: expenseForm.priority
      }

      // Salvar no backend como transação
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify({
          description: newExpense.name,
          amount: newExpense.amount,
          type: 'expense',
          category: newExpense.category,
          payment_method: 'outros',
          notes: `${newExpense.description} - ${newExpense.frequency} - Prioridade: ${newExpense.priority}`
        })
      })

      if (response.ok) {
        // Adicionar ao estado local também
        const newExpenseWithId = { id: Date.now(), ...newExpense }
        setExpenseItems(prev => [...prev, newExpenseWithId])
        setExpenseForm({
          name: '',
          amount: 0,
          type: 'fixa',
          category: 'casa',
          description: '',
          frequency: 'mensal',
          priority: 'media'
        })
        setExpenseDialogOpen(false)
        
        // Atualizar total planejado
        const totalExpenses = [...expenseItems, newExpenseWithId].reduce((sum, item) => sum + item.amount, 0)
        setBudgetForm(prev => ({ ...prev, planned_expenses: totalExpenses }))
        
        // Recarregar dados do orçamento
        await fetchBudgetData()
      } else {
        setError('Erro ao salvar despesa')
      }
    } catch (error) {
      setError('Erro de conexão')
    }
  }

  const removeExpenseItem = (id) => {
    const updatedItems = expenseItems.filter(item => item.id !== id)
    setExpenseItems(updatedItems)
    
    // Atualizar total planejado
    const totalExpenses = updatedItems.reduce((sum, item) => sum + item.amount, 0)
    setBudgetForm(prev => ({ ...prev, planned_expenses: totalExpenses }))
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      safe: { label: 'Seguro', variant: 'success' },
      moderate: { label: 'Moderado', variant: 'warning' },
      high: { label: 'Alto', variant: 'destructive' },
      exceeded: { label: 'Excedido', variant: 'destructive' },
      no_budget: { label: 'Sem orçamento', variant: 'secondary' }
    }
    
    const config = statusConfig[status] || statusConfig.no_budget
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getBudgetHealthIcon = (health) => {
    switch (health) {
      case 'excellent':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'good':
        return <TrendingUp className="h-5 w-5 text-yellow-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case 'danger':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Target className="h-5 w-5 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orçamento</h1>
          <p className="text-muted-foreground">
            Gerencie seu orçamento familiar - {currentBudget?.month_name} {currentBudget?.year}
          </p>
        </div>
        <div className="flex gap-2">
          {getBudgetHealthIcon(currentBudget?.budget_health)}
          <Button onClick={() => setIsEditing(true)}>
            <Target className="h-4 w-4 mr-2" />
            Editar Orçamento
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="analises">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-4">
          {/* Cards de Resumo */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Planejada</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(currentBudget?.planned_income)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(currentBudget?.actual_income)} realizado ({currentBudget?.income_percentage}%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Despesas Planejadas</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(currentBudget?.planned_expenses)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(currentBudget?.actual_expenses)} gasto ({currentBudget?.expenses_percentage}%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Restante</CardTitle>
                {currentBudget?.remaining_budget >= 0 ? 
                  <TrendingUp className="h-4 w-4 text-green-500" /> : 
                  <TrendingDown className="h-4 w-4 text-red-500" />
                }
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${currentBudget?.remaining_budget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(currentBudget?.remaining_budget)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentBudget?.is_over_budget ? 'Orçamento excedido' : 'Dentro do orçamento'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                {getBudgetHealthIcon(currentBudget?.budget_health)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getStatusBadge(currentBudget?.budget_health)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentBudget?.categories?.length || 0} categorias
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          {analytics?.insights && analytics.insights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Insights do Orçamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.insights.map((insight, index) => (
                    <Alert key={index} variant={insight.type === 'warning' ? 'destructive' : 'default'}>
                      <AlertDescription>
                        <strong>{insight.title}:</strong> {insight.message}
                        {insight.categories && (
                          <div className="mt-2">
                            {insight.categories.map((cat, idx) => (
                              <Badge key={idx} variant="outline" className="mr-1">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ABA RECEITAS DETALHADAS */}
        <TabsContent value="receitas" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Receitas Detalhadas</h3>
              <p className="text-sm text-muted-foreground">
                Gerencie suas fontes de renda fixas e variáveis
              </p>
            </div>
            <Dialog open={incomeDialogOpen} onOpenChange={setIncomeDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nova Receita
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Receita</DialogTitle>
                  <DialogDescription>
                    Adicione uma nova fonte de renda ao seu orçamento
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="income-name">Nome da Receita</Label>
                    <Input
                      id="income-name"
                      placeholder="Ex: Salário, Freelance..."
                      value={incomeForm.name}
                      onChange={(e) => setIncomeForm({...incomeForm, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="income-amount">Valor (R$)</Label>
                    <Input
                      id="income-amount"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={incomeForm.amount}
                      onChange={(e) => setIncomeForm({...incomeForm, amount: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="income-type">Tipo</Label>
                      <Select 
                        value={incomeForm.type} 
                        onValueChange={(value) => setIncomeForm({...incomeForm, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixa">💰 Fixa</SelectItem>
                          <SelectItem value="variavel">📈 Variável</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="income-frequency">Frequência</Label>
                      <Select 
                        value={incomeForm.frequency} 
                        onValueChange={(value) => setIncomeForm({...incomeForm, frequency: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencies.map(freq => (
                            <SelectItem key={freq.value} value={freq.value}>
                              {freq.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="income-description">Descrição (opcional)</Label>
                    <Input
                      id="income-description"
                      placeholder="Detalhes sobre esta receita..."
                      value={incomeForm.description}
                      onChange={(e) => setIncomeForm({...incomeForm, description: e.target.value})}
                    />
                  </div>

                  <Button onClick={addIncomeItem} className="w-full">
                    Adicionar Receita
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Lista de Receitas */}
          <div className="grid gap-4">
            {incomeItems.map(income => (
              <Card key={income.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${income.type === 'fixa' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <div>
                      <h4 className="font-medium">{income.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {income.type === 'fixa' ? '💰 Fixa' : '📈 Variável'} • {income.frequency}
                        {income.description && ` • ${income.description}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(income.amount)}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeIncomeItem(income.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {incomeItems.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma receita cadastrada</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Adicione suas fontes de renda para ter um controle detalhado do seu orçamento
                  </p>
                  <Button onClick={() => setIncomeDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Adicionar Primeira Receita
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Resumo das Receitas */}
          {incomeItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resumo das Receitas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Fixo</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(incomeItems.filter(i => i.type === 'fixa').reduce((sum, i) => sum + i.amount, 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Variável</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(incomeItems.filter(i => i.type === 'variavel').reduce((sum, i) => sum + i.amount, 0))}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Total Geral</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(incomeItems.reduce((sum, i) => sum + i.amount, 0))}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ABA DESPESAS DETALHADAS */}
        <TabsContent value="despesas" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Despesas Detalhadas</h3>
              <p className="text-sm text-muted-foreground">
                Controle seus gastos fixos e variáveis por categoria
              </p>
            </div>
            <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nova Despesa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Despesa</DialogTitle>
                  <DialogDescription>
                    Adicione uma nova despesa ao seu orçamento
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="expense-name">Nome da Despesa</Label>
                    <Input
                      id="expense-name"
                      placeholder="Ex: Aluguel, Mercado..."
                      value={expenseForm.name}
                      onChange={(e) => setExpenseForm({...expenseForm, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="expense-amount">Valor (R$)</Label>
                    <Input
                      id="expense-amount"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expense-type">Tipo</Label>
                      <Select 
                        value={expenseForm.type} 
                        onValueChange={(value) => setExpenseForm({...expenseForm, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixa">🔒 Fixa</SelectItem>
                          <SelectItem value="variavel">📊 Variável</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="expense-priority">Prioridade</Label>
                      <Select 
                        value={expenseForm.priority} 
                        onValueChange={(value) => setExpenseForm({...expenseForm, priority: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alta">🔴 Alta</SelectItem>
                          <SelectItem value="media">🟡 Média</SelectItem>
                          <SelectItem value="baixa">🟢 Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="expense-category">Categoria</Label>
                    <Select 
                      value={expenseForm.category} 
                      onValueChange={(value) => setExpenseForm({...expenseForm, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="expense-frequency">Frequência</Label>
                    <Select 
                      value={expenseForm.frequency} 
                      onValueChange={(value) => setExpenseForm({...expenseForm, frequency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map(freq => (
                          <SelectItem key={freq.value} value={freq.value}>
                            {freq.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="expense-description">Descrição (opcional)</Label>
                    <Input
                      id="expense-description"
                      placeholder="Detalhes sobre esta despesa..."
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                    />
                  </div>

                  <Button onClick={addExpenseItem} className="w-full">
                    Adicionar Despesa
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Lista de Despesas */}
          <div className="grid gap-4">
            {expenseItems.map(expense => (
              <Card key={expense.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className={`w-4 h-4 rounded-full`}
                      style={{ backgroundColor: PRIORITY_COLORS[expense.priority] }}
                    ></div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{expense.name}</h4>
                        <Badge variant="outline">{expense.priority}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {expenseCategories.find(c => c.value === expense.category)?.label} • 
                        {expense.type === 'fixa' ? ' 🔒 Fixa' : ' 📊 Variável'} • {expense.frequency}
                        {expense.description && ` • ${expense.description}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-red-600">
                      {formatCurrency(expense.amount)}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeExpenseItem(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {expenseItems.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Target className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma despesa cadastrada</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Adicione suas despesas para ter um planejamento completo do seu orçamento
                  </p>
                  <Button onClick={() => setExpenseDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Adicionar Primeira Despesa
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Resumo das Despesas */}
          {expenseItems.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Por Tipo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">🔒 Despesas Fixas</p>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(expenseItems.filter(e => e.type === 'fixa').reduce((sum, e) => sum + e.amount, 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">📊 Despesas Variáveis</p>
                    <p className="text-lg font-bold text-orange-600">
                      {formatCurrency(expenseItems.filter(e => e.type === 'variavel').reduce((sum, e) => sum + e.amount, 0))}
                    </p>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Total Geral</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(expenseItems.reduce((sum, e) => sum + e.amount, 0))}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Por Prioridade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">🔴 Alta Prioridade</p>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(expenseItems.filter(e => e.priority === 'alta').reduce((sum, e) => sum + e.amount, 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">🟡 Média Prioridade</p>
                    <p className="text-lg font-bold text-yellow-600">
                      {formatCurrency(expenseItems.filter(e => e.priority === 'media').reduce((sum, e) => sum + e.amount, 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">🟢 Baixa Prioridade</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(expenseItems.filter(e => e.priority === 'baixa').reduce((sum, e) => sum + e.amount, 0))}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="categorias" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Categorias do Orçamento</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Nova Categoria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Categoria</DialogTitle>
                  <DialogDescription>
                    Crie uma nova categoria para organizar seu orçamento
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Nome da categoria"
                    value={categoryForm.category_name}
                    onChange={(e) => setCategoryForm({...categoryForm, category_name: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Valor planejado"
                    value={categoryForm.planned_amount}
                    onChange={(e) => setCategoryForm({...categoryForm, planned_amount: parseFloat(e.target.value) || 0})}
                  />
                  <Input
                    type="color"
                    value={categoryForm.color}
                    onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})}
                  />
                  <Input
                    placeholder="Descrição (opcional)"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  />
                  <select 
                    className="w-full p-2 border rounded"
                    value={categoryForm.priority}
                    onChange={(e) => setCategoryForm({...categoryForm, priority: parseInt(e.target.value)})}
                  >
                    <option value={1}>Alta Prioridade</option>
                    <option value={2}>Média Prioridade</option>
                    <option value={3}>Baixa Prioridade</option>
                  </select>
                  <Button onClick={addCategory} className="w-full">
                    Adicionar Categoria
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {currentBudget?.categories?.map((category) => (
              <Card key={category.id} className="border-l-4" style={{borderLeftColor: category.color}}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{category.category_name}</h4>
                        {getStatusBadge(category.status)}
                        <Badge 
                          style={{backgroundColor: PRIORITY_COLORS[category.priority]}}
                          className="text-white"
                        >
                          {category.priority_label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Gasto: {formatCurrency(category.actual_spent)}</span>
                          <span>Planejado: {formatCurrency(category.planned_amount)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${category.is_over_budget ? 'bg-red-500' : 'bg-blue-500'}`}
                            style={{width: `${Math.min(category.percentage_used, 100)}%`}}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {category.percentage_used.toFixed(1)}% utilizado
                          {category.is_over_budget && (
                            <span className="text-red-500 ml-2">
                              Excedeu em {formatCurrency(Math.abs(category.remaining_amount))}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingCategory(category)}
                      >
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteCategory(category.id)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analises" className="space-y-4">
          {analytics && analytics.categories && analytics.categories.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Categorias</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.categories}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="actual_spent"
                        label={({category_name, percentage_used}) => `${category_name}: ${percentage_used}%`}
                      >
                        {analytics.categories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.categories}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category_name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="planned_amount" fill="#8884d8" name="Planejado" />
                      <Bar dataKey="actual_spent" fill="#82ca9d" name="Gasto" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Nenhum dado analítico disponível</h3>
              <p className="text-muted-foreground mb-4">Configure seu orçamento e registre algumas transações para ver as análises</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          {suggestions && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Sugestões Baseadas no Histórico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-3">Receita Sugerida</h4>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(suggestions.suggested_income || 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Baseado na média dos últimos meses
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Total Despesas Sugeridas</h4>
                      <p className="text-2xl font-bold">
                        {formatCurrency(suggestions.total_suggested_expenses || 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Soma das categorias sugeridas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sugestões por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {suggestions.category_suggestions && suggestions.category_suggestions.length > 0 ? (
                      suggestions.category_suggestions.map((suggestion, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <h5 className="font-medium">{suggestion.category}</h5>
                            <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatCurrency(suggestion.suggested_amount)}</p>
                            <Badge variant={suggestion.confidence === 'high' ? 'default' : 'secondary'}>
                              {suggestion.confidence === 'high' ? 'Alta confiança' : 'Média confiança'}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhuma sugestão disponível no momento</p>
                        <p className="text-sm">Continue registrando transações para receber sugestões personalizadas</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog para editar orçamento */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Orçamento</DialogTitle>
            <DialogDescription>
              Atualize seus valores de receita e despesas planejadas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Receita Planejada</label>
              <Input
                type="number"
                value={budgetForm.planned_income}
                onChange={(e) => setBudgetForm({...budgetForm, planned_income: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Despesas Planejadas</label>
              <Input
                type="number"
                value={budgetForm.planned_expenses}
                onChange={(e) => setBudgetForm({...budgetForm, planned_expenses: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveBudget} className="flex-1">
                Salvar
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar categoria */}
      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Categoria</DialogTitle>
              <DialogDescription>
                Atualize o nome e o valor planejado da categoria
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={editingCategory.category_name}
                onChange={(e) => setEditingCategory({...editingCategory, category_name: e.target.value})}
              />
              <Input
                type="number"
                value={editingCategory.planned_amount}
                onChange={(e) => setEditingCategory({...editingCategory, planned_amount: parseFloat(e.target.value) || 0})}
              />
              <Button 
                onClick={() => updateCategory(editingCategory.id, editingCategory)}
                className="w-full"
              >
                Salvar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default Orcamento
