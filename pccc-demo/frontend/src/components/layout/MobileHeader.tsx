import { Flame } from "lucide-react"

export function MobileHeader() {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-2xl shadow-lg shadow-zinc-900/5 flex items-center justify-center px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-200/50">
            <Flame className="text-white" size={18} />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight text-zinc-900">PCCC AI</span>
        </div>
      </div>
    </header>
  )
}
