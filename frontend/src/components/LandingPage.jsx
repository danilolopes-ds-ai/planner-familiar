import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, TrendingUp, PieChart, CreditCard } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Finanças Familiares</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gerencie as finanças da sua família de forma simples e eficiente. 
            Controle orçamentos, investimentos e metas financeiras.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <PieChart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Orçamento Familiar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Organize receitas e despesas da família. Visualize gráficos detalhados e mantenha controle total.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Investimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Acompanhe seus investimentos e aportes. Monitore o crescimento do patrimônio familiar.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CreditCard className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Cartões e Metas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Gerencie cartões de crédito e defina metas financeiras. Quite dívidas de forma organizada.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Comece Agora
            </h2>
            <p className="text-gray-600 mb-6">
              Esta é a versão demo da aplicação. O backend está sendo configurado.
            </p>
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => alert('Em breve! Backend sendo configurado no Vercel.')}
            >
              Demo - Em Desenvolvimento
            </Button>
          </div>
        </div>

        {/* Status */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">
              Sistema em desenvolvimento - Frontend funcionando
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
