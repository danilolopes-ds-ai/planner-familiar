
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Target, 
  PlusCircle, 
  AlertTriangle,
  TrendingDown,
  Edit,
  Trash2
} from 'lucide-react'

const DividasMetas = () => {
  const [debts, setDebts] = useState([])
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [debtDialogOpen, setDebtDialogOpen] = useState(false)
  const [goalDialogOpen, setGoalDialogOpen] = useState(false)
  const [editGoalDialogOpen, setEditGoalDialogOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [debtFormData, setDebtFormData] = useState({
    description: '',
    total_amount: '',
    paid_amount: '',
    monthly_payment: ''
  })
  const [goalFormData, setGoalFormData] = useState({
    name: '',
    target_amount: '',
    saved_amount: ''
  })
  const [goalUpdateData, setGoalUpdateData] = useState({
    saved_amount: ''
  })

  useEffect(() => {
    fetchDebts()
    fetchGoals()
  }, [])

  const fetchDebts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/debts', {
        headers: {
          'x-access-token': token,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setDebts(data)
      } else {
        setError('Erro ao carregar dívidas')
      }
    } catch (error) {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/goals', {
        headers: {
          'x-access-token': token,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setGoals(data)
      } else {
        setError('Erro ao carregar metas')
      }
    } catch (error) {
      setError('Erro de conexão')
    }
  }

  const handleDebtSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/debts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(debtFormData),
      })

      if (response.ok) {
        setDebtDialogOpen(false)
        setDebtFormData({
          description: '',
          total_amount: '',
          paid_amount: '',
          monthly_payment: ''
        })
        fetchDebts()
      } else {
        const data = await response.json()
        setError(data.message || 'Erro ao criar dívida')
      }
    } catch (error) {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const handleGoalSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(goalFormData),
      })

      if (response.ok) {
        setGoalDialogOpen(false)
        setGoalFormData({
          name: '',
          target_amount: '',
          saved_amount: ''
        })
        fetchGoals()
      } else {
        const data = await response.json()
        setError(data.message || 'Erro ao criar meta')
      }
    } catch (error) {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const handleGoalUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/goals/${selectedGoal.id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(goalUpdateData),
      })

      if (response.ok) {
        setEditGoalDialogOpen(false)
        setSelectedGoal(null)
        setGoalUpdateData({ saved_amount: '' })
        fetchGoals()
      } else {
        const data = await response.json()
        setError(data.message || 'Erro ao atualizar meta')
      }
    } catch (error) {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const openEditGoal = (goal) => {
    setSelectedGoal(goal)
    setGoalUpdateData({ saved_amount: goal.saved_amount.toString() })
    setEditGoalDialogOpen(true)
  }

  const handleDeleteDebt = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta dívida?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/debts/${id}`, {
        method: 'DELETE',
        headers: {
          'x-access-token': token,
        },
      })

      if (response.ok) {
        fetchDebts()
      } else {
        setError('Erro ao excluir dívida')
      }
    } catch (error) {
      setError('Erro de conexão')
    }
  }

  const handleDeleteGoal = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta meta?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/goals/${id}`, {
        method: 'DELETE',
        headers: {
          'x-access-token': token,
        },
      })

      if (response.ok) {
        fetchGoals()
      } else {
        setError('Erro ao excluir meta')
      }
    } catch (error) {
      setError('Erro de conexão')
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const calculateMonthsToPayOff = (debt) => {
    if (debt.monthly_payment <= 0) return 'Indefinido'
    const remaining = debt.remaining_amount
    return Math.ceil(remaining / debt.monthly_payment)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Metas e Dívidas</h1>
        <p className="text-muted-foreground">
          Gerencie suas dívidas e acompanhe o progresso das suas metas
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="goals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="goals">Metas</TabsTrigger>
          <TabsTrigger value="debts">Dívidas</TabsTrigger>
        </TabsList>

        <TabsContent value="debts" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Dívidas</h2>
              <p className="text-muted-foreground">Controle suas dívidas e pagamentos</p>
            </div>
            <Dialog open={debtDialogOpen} onOpenChange={setDebtDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Nova Dívida
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Nova Dívida</DialogTitle>
                  <DialogDescription>
                    Registre uma nova dívida para acompanhamento
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleDebtSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      placeholder="Ex: Cartão de crédito, Financiamento..."
                      value={debtFormData.description}
                      onChange={(e) => setDebtFormData({...debtFormData, description: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="total_amount">Valor Total</Label>
                      <Input
                        id="total_amount"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={debtFormData.total_amount}
                        onChange={(e) => setDebtFormData({...debtFormData, total_amount: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paid_amount">Valor Pago</Label>
                      <Input
                        id="paid_amount"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={debtFormData.paid_amount}
                        onChange={(e) => setDebtFormData({...debtFormData, paid_amount: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthly_payment">Pagamento Mensal</Label>
                    <Input
                      id="monthly_payment"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={debtFormData.monthly_payment}
                      onChange={(e) => setDebtFormData({...debtFormData, monthly_payment: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Dívida'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : debts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma dívida cadastrada</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Registre suas dívidas para acompanhar os pagamentos
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {debts.map((debt) => {
                const progressPercentage = (debt.paid_amount / debt.total_amount) * 100
                const monthsToPayOff = calculateMonthsToPayOff(debt)
                
                return (
                  <Card key={debt.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-red-600" />
                        {debt.description}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progresso</span>
                          <span>{progressPercentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total</p>
                          <p className="font-medium">{formatCurrency(debt.total_amount)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Pago</p>
                          <p className="font-medium text-green-600">{formatCurrency(debt.paid_amount)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Restante</p>
                          <p className="font-medium text-red-600">{formatCurrency(debt.remaining_amount)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Mensal</p>
                          <p className="font-medium">{formatCurrency(debt.monthly_payment)}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            Tempo estimado: {monthsToPayOff} {monthsToPayOff === 1 ? 'mês' : 'meses'}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDebt(debt.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Metas</h2>
              <p className="text-muted-foreground">Defina e acompanhe suas metas financeiras</p>
            </div>
            <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Nova Meta
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Nova Meta</DialogTitle>
                  <DialogDescription>
                    Defina uma nova meta financeira
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleGoalSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Meta</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Viagem, Carro, Casa..."
                      value={goalFormData.name}
                      onChange={(e) => setGoalFormData({...goalFormData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="target_amount">Valor da Meta</Label>
                      <Input
                        id="target_amount"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={goalFormData.target_amount}
                        onChange={(e) => setGoalFormData({...goalFormData, target_amount: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="saved_amount">Valor Atual</Label>
                      <Input
                        id="saved_amount"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={goalFormData.saved_amount}
                        onChange={(e) => setGoalFormData({...goalFormData, saved_amount: e.target.value})}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Meta'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : goals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma meta cadastrada</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Defina suas metas financeiras para acompanhar o progresso
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {goals.map((goal) => (
                <Card key={goal.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        {goal.name}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditGoal(goal)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span>{goal.progress_percentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={goal.progress_percentage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Meta</p>
                        <p className="font-medium">{formatCurrency(goal.target_amount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Economizado</p>
                        <p className="font-medium text-green-600">{formatCurrency(goal.saved_amount)}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Faltam: {formatCurrency(goal.target_amount - goal.saved_amount)}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Dialog para editar meta */}
          <Dialog open={editGoalDialogOpen} onOpenChange={setEditGoalDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Atualizar Meta</DialogTitle>
                <DialogDescription>
                  Atualize o valor economizado para {selectedGoal?.name}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleGoalUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="update_saved_amount">Valor Economizado</Label>
                  <Input
                    id="update_saved_amount"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={goalUpdateData.saved_amount}
                    onChange={(e) => setGoalUpdateData({saved_amount: e.target.value})}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Atualizando...' : 'Atualizar Meta'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DividasMetas

