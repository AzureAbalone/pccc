import { 
  Building2, 
  FileText, 
  ShieldCheck, 
  BookOpen, 
  Flame,
  X
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { NavItem } from "./NavItem"

interface SidebarProps {
  currentView: string
  onNavigate: (view: string) => void
  isMobileOpen?: boolean
  onCloseMobile?: () => void
}

export function Sidebar({ currentView, onNavigate, isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const handleNavigate = (view: string) => {
    onNavigate(view)
    onCloseMobile?.()
  }

  const sidebarContent = (
    <>
      {/* Logo - hidden on mobile (shown in MobileHeader) */}
      <div className="p-5 hidden lg:flex items-center gap-3 border-b border-zinc-100">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-200/50">
          <Flame className="text-white" size={20} />
        </div>
        <div>
          <span className="font-heading font-bold text-lg text-zinc-900 tracking-tight">PCCC AI</span>
          <p className="text-[10px] text-zinc-400 font-medium">Fire Safety Compliance</p>
        </div>
      </div>

      {/* Mobile header inside drawer */}
      <div className="p-4 flex lg:hidden items-center justify-between border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-200/50">
            <Flame className="text-white" size={18} />
          </div>
          <span className="font-heading font-bold text-lg text-zinc-900">Menu</span>
        </div>
        <button 
          onClick={onCloseMobile}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-zinc-100 cursor-pointer text-zinc-500 hover:text-zinc-700 transition-colors"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-3 mb-3 mt-2">Navigation</div>
        
        <NavItem 
          label="Công trình" 
          icon={Building2} 
          isActive={currentView === 'input'}
          onClick={() => handleNavigate('input')}
        />

        <NavItem 
          label="Thiết kế" 
          icon={FileText} 
          isActive={currentView.startsWith('report')}
          isExpanded={currentView.startsWith('report')}
          subItems={[
            { label: "Lối thoát nạn", onClick: () => handleNavigate('report-escape'), isActive: currentView === 'report-escape' },
            { label: "Ngăn cháy lan", onClick: () => handleNavigate('report-fire'), isActive: currentView === 'report-fire' },
            { label: "Giao thông CC", onClick: () => handleNavigate('report-traffic'), isActive: currentView === 'report-traffic' },
            { label: "Hệ thống kỹ thuật", onClick: () => handleNavigate('report-tech'), isActive: currentView === 'report-tech' },
          ]}
          onToggleExpand={() => handleNavigate('report-escape')}
        />

        <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-3 mb-3 mt-6">Compliance</div>

        <NavItem 
          label="Hợp chuẩn" 
          icon={ShieldCheck} 
          isActive={currentView === 'compliance'}
          onClick={() => handleNavigate('compliance')}
        />

        <NavItem 
          label="Quy phạm" 
          icon={BookOpen} 
          isActive={currentView === 'regulations'}
          onClick={() => handleNavigate('regulations')}
        />
      </div>

      <div className="p-3 border-t border-zinc-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-zinc-50 to-zinc-100/50 border border-zinc-200/50">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 flex items-center justify-center text-xs font-bold text-zinc-600 shadow-sm">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-800">Admin User</span>
            <span className="text-[10px] text-zinc-400 font-medium">Pro License</span>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar - Fixed */}
      <aside className="hidden lg:flex w-64 h-screen glass-panel flex-col fixed left-0 top-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar - Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-50"
              onClick={onCloseMobile}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white/95 backdrop-blur-xl border-r border-zinc-200 flex flex-col z-50 shadow-2xl shadow-zinc-900/10"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
