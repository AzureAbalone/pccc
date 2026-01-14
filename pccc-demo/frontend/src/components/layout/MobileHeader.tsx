import { Flame, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MobileHeaderProps {
  isMenuOpen: boolean
  onToggleMenu: () => void
}

export function MobileHeader({ isMenuOpen, onToggleMenu }: MobileHeaderProps) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-2xl shadow-lg shadow-zinc-900/5 flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-200/50">
            <Flame className="text-white" size={18} />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight text-zinc-900">PCCC AI</span>
        </div>

        {/* Menu Toggle */}
        <button
          onClick={onToggleMenu}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer text-zinc-600"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X size={22} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Menu size={22} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </header>
  )
}
