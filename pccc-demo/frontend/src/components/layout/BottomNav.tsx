import { Building2, FileText, ShieldCheck, BookOpen } from "lucide-react"
import { cn } from "../../lib/utils"

interface BottomNavProps {
  currentView: string
  onNavigate: (view: string) => void
}

const navItems = [
  { id: "input", label: "Công trình", icon: Building2 },
  { id: "report", label: "Thiết kế", icon: FileText },
  { id: "compliance", label: "Hợp chuẩn", icon: ShieldCheck },
  { id: "regulations", label: "Quy phạm", icon: BookOpen },
]

export function BottomNav({ currentView, onNavigate }: BottomNavProps) {
  const getIsActive = (id: string) => {
    if (id === "report") return currentView.startsWith("report")
    return currentView === id
  }

  const handleNavigate = (id: string) => {
    if (id === "report") {
      onNavigate("report-escape")
    } else {
      onNavigate(id)
    }
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe">
      <div className="bg-white/90 backdrop-blur-xl border border-zinc-200/60 rounded-2xl shadow-lg shadow-zinc-900/10 mb-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = getIsActive(item.id)
            const Icon = item.icon
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all cursor-pointer min-w-[60px]",
                  isActive 
                    ? "text-orange-600" 
                    : "text-zinc-400 hover:text-zinc-600"
                )}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <div className={cn(
                  "relative p-2 rounded-xl transition-all",
                  isActive && "bg-orange-50 shadow-sm"
                )}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-orange-100/50 blur-sm" />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-orange-700" : "text-zinc-400"
                )}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
