import { Sidebar } from "./Sidebar"
import { MobileHeader } from "./MobileHeader"
import { BottomNav } from "./BottomNav"
import { FireBackground } from "./FireBackground"
import { motion } from "framer-motion"

interface AppLayoutProps {
  children: React.ReactNode
  currentView: string
  onNavigate: (view: string) => void
}

export function AppLayout({ children, currentView, onNavigate }: AppLayoutProps) {
  return (
    <>
      {/* Fixed elements at root level - ensures proper fixed positioning */}
      <MobileHeader />
      <BottomNav currentView={currentView} onNavigate={onNavigate} />
      
      {/* Main app container */}
      <div className="min-h-screen text-zinc-900 noise-overlay relative overflow-x-hidden">
        {/* Dynamic Fire Background */}
        <FireBackground />

        {/* Sidebar (Desktop only) */}
        <Sidebar 
          currentView={currentView} 
          onNavigate={onNavigate}
        />
        
        {/* Main Content */}
        <main className="lg:pl-64 min-h-screen pb-28 lg:pb-0 pt-20 lg:pt-0 relative z-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
            <motion.div
              key={currentView.startsWith('report') ? 'report' : currentView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </>
  )
}

