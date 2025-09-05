import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { 
  Home, 
  PlusCircle, 
  CreditCard, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Menu, 
  LogOut,
  Users
} from 'lucide-react'

const Layout = ({ setIsAuthenticated }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Orçamento', href: '/orcamento', icon: Target },
    { name: 'Lançamentos', href: '/lancamentos', icon: PlusCircle },
    { name: 'Cartão de Crédito', href: '/cartao-credito', icon: CreditCard },
    { name: 'Investimentos', href: '/investimentos', icon: TrendingUp },
    { name: 'Dívidas e Metas', href: '/dividas-metas', icon: Users },
    { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate('/login')
  }

  const NavItems = ({ mobile = false }) => (
    <nav className="space-y-2">
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.href
        
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={mobile ? () => setSidebarOpen(false) : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center gap-2">
            <div className="bg-primary rounded-full p-2">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Finanças Familiares</span>
          </div>
          <NavItems />
          <div className="mt-auto">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex h-16 items-center gap-x-4 border-b bg-card px-4 shadow-sm sm:gap-x-6 sm:px-6">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <SheetDescription className="sr-only">
                Menu principal para navegar entre as páginas do aplicativo
              </SheetDescription>
              <div className="flex h-16 shrink-0 items-center gap-2 px-6">
                <div className="bg-primary rounded-full p-2">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Finanças Familiares</span>
              </div>
              <div className="px-6 py-4">
                <NavItems mobile />
                <div className="mt-8">
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full justify-start gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-full p-2">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">Finanças Familiares</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

