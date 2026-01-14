import { 
  Building2, 
  FileText, 
  ShieldCheck, 
  BookOpen, 
  Flame
} from "lucide-react"
import { NavItem } from "./NavItem"

interface SidebarProps {
  currentView: string
  onNavigate: (view: string) => void
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden lg:flex w-64 h-screen glass-panel flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-zinc-100">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-200/50">
          <Flame className="text-white" size={20} />
        </div>
        <div>
          <span className="font-heading font-bold text-lg text-zinc-900 tracking-tight">PCCC AI</span>
          <p className="text-[10px] text-zinc-400 font-medium">Fire Safety Compliance</p>
        </div>
      </div>

      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-3 mb-3 mt-2">Navigation</div>
        
        <NavItem 
          label="Công trình" 
          icon={Building2} 
          isActive={currentView === 'input'}
          onClick={() => onNavigate('input')}
        />

        <NavItem 
          label="Thiết kế" 
          icon={FileText} 
          isActive={currentView === 'report' || currentView.startsWith('report-')}
          onClick={() => onNavigate('report')}
        />

        <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-3 mb-3 mt-6">Compliance</div>

        <NavItem 
          label="Hợp chuẩn" 
          icon={ShieldCheck} 
          isActive={currentView === 'compliance'}
          onClick={() => onNavigate('compliance')}
        />

        <NavItem 
          label="Quy phạm" 
          icon={BookOpen} 
          isActive={currentView === 'regulations'}
          onClick={() => onNavigate('regulations')}
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
    </aside>
  )
}

