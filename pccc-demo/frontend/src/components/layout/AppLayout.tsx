import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { MobileHeader } from "./MobileHeader"
import { BottomNav } from "./BottomNav"
import { motion } from "framer-motion"

interface AppLayoutProps {
  children: React.ReactNode
  currentView: string
  onNavigate: (view: string) => void
}

export function AppLayout({ children, currentView, onNavigate }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <div className="min-h-screen text-zinc-900 noise-overlay relative">
      {/* Decorative Orbs - Soft Visual Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-orange w-[600px] h-[600px] -top-48 -right-48 opacity-30" />
        <div className="orb orb-blue w-[500px] h-[500px] top-1/2 -left-64 opacity-20" />
        <div className="orb orb-orange w-[400px] h-[400px] -bottom-32 right-1/4 opacity-25" />
      </div>

      {/* Mobile Header */}
      <MobileHeader 
        isMenuOpen={isMobileMenuOpen} 
        onToggleMenu={toggleMobileMenu} 
      />

      {/* Sidebar (Desktop fixed, Mobile drawer) */}
      <Sidebar 
        currentView={currentView} 
        onNavigate={onNavigate}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={closeMobileMenu}
      />
      
      {/* Main Content */}
      <main className="lg:pl-64 min-h-screen pb-24 lg:pb-0 relative z-10">
        {/* Spacer for mobile header */}
        <div className="h-20 lg:h-0" />
        
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav currentView={currentView} onNavigate={onNavigate} />
    </div>
  )
}
