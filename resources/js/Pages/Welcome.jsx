import { useState } from 'react'
import { Bell, ChevronDown, Menu, X } from 'lucide-react'

// Navbar Component
function Navbar({ toggleSidebar }) {
  return (
    <nav className="bg-white border-b px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-6 w-6" />
        </button>
        <img 
          src="/placeholder.svg?height=40&width=150" 
          alt="Costa Rica Logo" 
          className="h-8"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            2
          </span>
        </button>
        <button className="flex items-center gap-2 bg-green-800 text-white px-3 py-1 rounded-full text-sm">
          OB
        </button>
      </div>
    </nav>
  )
}

// Sidebar Component
function Sidebar({ isOpen, setIsOpen }) {
  const menuItems = [
    { name: 'Inicio', active: true },
    { name: 'Auto-evaluación' },
    { name: 'Excelencia' },
    { name: 'Sostenibilidad' },
    { name: 'Progreso Social' },
    { name: 'Sostenibilidad' },
    { name: 'Vinculación' },
    { name: 'Certificaciones' },
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 bottom-0 left-0 z-50
        w-64 bg-green-800 text-white
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col h-screen
      `}>
        <div className="md:hidden p-4 flex justify-end">
          <button onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href="#"
              className={`
                block px-4 py-2 hover:bg-green-700
                ${item.active ? 'bg-green-700' : ''}
              `}
            >
              {item.name}
            </a>
          ))}
        </nav>
      </aside>
    </>
  )
}

// Progress Section Component
function ProgressSection() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="font-bold mb-4">Progreso</h2>
      <div className="space-y-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '12%' }} />
        </div>
        <div className="flex items-start gap-2">
          <div className="mt-1">✓</div>
          <div>
            <p className="font-medium">4 indicadores contestados</p>
            <p className="text-sm text-gray-600">Quedan 100 indicadores por responder</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Indicators Section Component
function IndicatorsSection() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="font-bold mb-4">Indicadores homologados</h2>
      <div className="flex items-start gap-2">
        <div className="mt-1">✓</div>
        <div>
          <p className="font-medium">8 indicadores homologados</p>
          <p className="text-sm text-gray-600">
            Si su empresa cuenta con certificaciones previas, puede optar por homologarlas.
          </p>
        </div>
      </div>
      <button className="mt-4 text-green-700 hover:underline">
        Agregar Certificaciones
      </button>
    </div>
  )
}

// FAQ Section Component
function FAQSection() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="font-bold mb-4">Sobre la plataforma de autoevaluación</h2>
      <p className="text-gray-600 mb-6">
        Esta plataforma está diseñada para que las empresas puedan medir la nota que obtendrían en este momento para aplicar por el proceso de licenciamiento de esencial COSTA RICA.
      </p>
      
      <h3 className="font-bold mb-4">Preguntas frecuentes</h3>
      <div className="space-y-2">
        {[
          '¿En qué consiste la autoevaluación?',
          '¿Cómo guardo mi progreso respondiendo la autoevaluación?',
          '¿Puede otro usuario en la empresa colaborar con las respuestas?',
          '¿Hay indicadores más importantes que otros?',
          '¿Puedo homologar certificaciones previas de mi empresa?'
        ].map((question) => (
          <button
            key={question}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg"
          >
            <span>{question}</span>
            <ChevronDown className="h-5 w-5 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  )
}

// Main Component
export default function Component() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={() => setSidebarOpen(true)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">¡Bienvenido Oscar!</h1>
              <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg">
                ESTATUS: NO APTO PARA LICENCIAMIENTO
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Autoevaluación de Buzz</h2>
                <ProgressSection />
                <IndicatorsSection />
              </div>
              
              <div>
                <FAQSection />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}