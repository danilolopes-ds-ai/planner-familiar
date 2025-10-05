import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../config/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  PlusCircle, 
  Calendar,
  AlertCircle,
  Trash2
} from 'lucide-react'

const CartaoCredito = () => {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    closing_day: '',
    due_day: ''
  })
  const [purchaseData, setPurchaseData] = useState({
    description: '',
    total_amount: '',
    installments: 1,
    installment_amount: '',
    purchase_date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      const token = localStorage.getItem('token')
  const response = await fetch(`${API_BASE_URL}/credit-cards`, {
        headers: {
          'x-access-token': token,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCards(data)
      } else {
        setError('Erro ao carregar cartões')
      }
    } catch (error) {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
  const response = await fetch(`${API_BASE_URL}/credit-cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setDialogOpen(false)
        setFormData({
          name: '',
          closing_day: '',
          due_day: ''
        })
        fetchCards()
      } else {
        const data = await response.json()
        setError(data.message || 'Erro ao criar cartão')
      }
    } catch (error) {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCard = async (cardId) => {
    if (!confirm('Tem certeza que deseja excluir este cartão? Todas as compras associadas também serão excluídas.')) return

    try {
      const token = localStorage.getItem('token')
  const response = await fetch(`${API_BASE_URL}/credit-cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          'x-access-token': token,
        },
      })

      if (response.ok) {
        fetchCards()
      } else {
        setError('Erro ao excluir cartão')
      }
    } catch (error) {
      setError('Erro de conexão')
    }
  }

  const getDaysUntilClosing = (closingDay) => {
    const today = new Date()
    const currentDay = today.getDate()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    
    let closingDate = new Date(currentYear, currentMonth, closingDay)
    
    if (closingDay < currentDay) {
      closingDate = new Date(currentYear, currentMonth + 1, closingDay)
    }
    
    const diffTime = closingDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays
  }

  const getDaysUntilDue = (dueDay) => {
    const today = new Date()
    const currentDay = today.getDate()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    
    let dueDate = new Date(currentYear, currentMonth, dueDay)
    
    if (dueDay < currentDay) {
      dueDate = new Date(currentYear, currentMonth + 1, dueDay)
    }
    
    const diffTime = dueDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays
  }

  const handlePurchaseSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
  const response = await fetch(`${API_BASE_URL}/credit-cards/${selectedCard.id}/purchases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: JSON.stringify(purchaseData),
      })

      if (response.ok) {
        setPurchaseDialogOpen(false)
        setPurchaseData({
          description: '',
          total_amount: '',
          installments: 1,
          installment_amount: '',
          purchase_date: new Date().toISOString().split('T')[0]
        })
        setSelectedCard(null)
        fetchCards() // Recarrega os dados para mostrar as novas parcelas
      } else {
        const data = await response.json()
        setError(data.message || 'Erro ao adicionar compra')
      }
    } catch (error) {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cartões de Crédito</h1>
          <p className="text-muted-foreground">
            Gerencie seus cartões de crédito e datas importantes
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Novo Cartão
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Cartão de Crédito</DialogTitle>
              <DialogDescription>
                Adicione um novo cartão de crédito
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Cartão</Label>
                <Input
                  id="name"
                  placeholder="Ex: Nubank, Itaú, Bradesco..."
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="closing_day">Dia do Fechamento</Label>
                  <Input
                    id="closing_day"
                    type="number"
                    min="1"
                    max="31"
                    placeholder="Ex: 15"
                    value={formData.closing_day}
                    onChange={(e) => setFormData({...formData, closing_day: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due_day">Dia do Vencimento</Label>
                  <Input
                    id="due_day"
                    type="number"
                    min="1"
                    max="31"
                    placeholder="Ex: 10"
                    value={formData.due_day}
                    onChange={(e) => setFormData({...formData, due_day: e.target.value})}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Cartão'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog para adicionar compra parcelada */}
        <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
          <DialogContent className="mx-4 max-w-sm sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Compra Parcelada</DialogTitle>
              <DialogDescription>
                Adicione uma compra no cartão {selectedCard?.name}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePurchaseSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Descrição da Compra</Label>
                <Input
                  id="description"
                  placeholder="Ex: Notebook, Móveis, Viagem..."
                  value={purchaseData.description}
                  onChange={(e) => setPurchaseData({...purchaseData, description: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total_amount">Valor Total</Label>
                  <Input
                    id="total_amount"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={purchaseData.total_amount}
                    onChange={(e) => {
                      const totalAmount = e.target.value
                      const installmentAmount = totalAmount && purchaseData.installments > 0 
                        ? (parseFloat(totalAmount) / purchaseData.installments).toFixed(2)
                        : ''
                      setPurchaseData({
                        ...purchaseData, 
                        total_amount: totalAmount,
                        installment_amount: installmentAmount
                      })
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase_date">Data da Compra</Label>
                  <Input
                    id="purchase_date"
                    type="date"
                    value={purchaseData.purchase_date}
                    onChange={(e) => setPurchaseData({...purchaseData, purchase_date: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="installments">Parcelas</Label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={purchaseData.installments}
                    onChange={(e) => {
                      const installments = parseInt(e.target.value)
                      const installmentAmount = purchaseData.total_amount 
                        ? (parseFloat(purchaseData.total_amount) / installments).toFixed(2)
                        : ''
                      setPurchaseData({
                        ...purchaseData, 
                        installments: installments,
                        installment_amount: installmentAmount
                      })
                    }}
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12,18,24,36].map((num) => (
                      <option key={num} value={num}>
                        {num}x {purchaseData.total_amount ? `(R$ ${(parseFloat(purchaseData.total_amount) / num).toFixed(2)})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="installment_amount">Valor da Parcela</Label>
                  <Input
                    id="installment_amount"
                    type="number"
                    step="0.01"
                    value={purchaseData.installment_amount}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
              </div>

              {purchaseData.installments > 1 && purchaseData.total_amount && (
                <div className="text-sm text-blue-700 bg-blue-100 p-3 rounded">
                  💳 <strong>{purchaseData.description || 'Esta compra'}</strong> será dividida em{' '}
                  <strong>{purchaseData.installments}x</strong> de{' '}
                  <strong>R$ {purchaseData.installment_amount}</strong>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Salvando...' : 'Adicionar Compra'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : cards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum cartão cadastrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Adicione seus cartões de crédito para acompanhar as datas de fechamento e vencimento
            </p>
            <Button onClick={() => setDialogOpen(true)} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Adicionar Primeiro Cartão
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const daysUntilClosing = getDaysUntilClosing(card.closing_day)
            const daysUntilDue = getDaysUntilDue(card.due_day)
            
            return (
              <Card key={card.id} className="relative">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {card.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fechamento</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Dia {card.closing_day}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Vencimento</span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Dia {card.due_day}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Próximo fechamento:</span>
                      <Badge variant={daysUntilClosing <= 3 ? "destructive" : "secondary"}>
                        {daysUntilClosing === 0 ? 'Hoje' : 
                         daysUntilClosing === 1 ? 'Amanhã' : 
                         `${daysUntilClosing} dias`}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Próximo vencimento:</span>
                      <Badge variant={daysUntilDue <= 5 ? "destructive" : "secondary"}>
                        {daysUntilDue === 0 ? 'Hoje' : 
                         daysUntilDue === 1 ? 'Amanhã' : 
                         `${daysUntilDue} dias`}
                      </Badge>
                    </div>
                  </div>

                  {(daysUntilClosing <= 3 || daysUntilDue <= 5) && (
                    <Alert className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        {daysUntilClosing <= 3 && 'Fechamento próximo! '}
                        {daysUntilDue <= 5 && 'Vencimento próximo!'}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Botão para adicionar compra */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4" 
                    onClick={() => {
                      setSelectedCard(card)
                      setPurchaseDialogOpen(true)
                    }}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Adicionar Compra
                  </Button>

                  {/* Botão para excluir cartão */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50" 
                    onClick={() => handleDeleteCard(card.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Cartão
                  </Button>

                  {/* Lista de parcelas do cartão */}
                  {card.purchases && card.purchases.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">Parcelas Ativas</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {card.purchases.map((purchase, index) => (
                          <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                            <div className="font-medium">{purchase.description}</div>
                            <div className="text-gray-600">
                              {purchase.current_installment}/{purchase.total_installments}x R$ {purchase.installment_amount}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CartaoCredito

