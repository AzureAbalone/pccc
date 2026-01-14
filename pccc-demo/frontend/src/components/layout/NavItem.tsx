import { ChevronRight, ChevronDown, type LucideIcon } from "lucide-react"
import { cn } from "../../lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface NavItemProps {
  label: string
  icon?: LucideIcon
  isActive?: boolean
  onClick?: () => void
  subItems?: { label: string; onClick: () => void; isActive?: boolean }[]
  isExpanded?: boolean
  onToggleExpand?: () => void
}

export function NavItem({ 
  label, 
  icon: Icon, 
  isActive, 
  onClick, 
  subItems, 
  isExpanded, 
  onToggleExpand 
}: NavItemProps) {
  const hasSubItems = subItems && subItems.length > 0

  return (
    <div className="w-full">
      <button
        onClick={hasSubItems ? onToggleExpand : onClick}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer",
          isActive 
            ? "bg-gradient-to-r from-orange-50 to-amber-50/50 text-orange-700 shadow-sm border border-orange-200/50" 
            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80"
        )}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
              isActive 
                ? "bg-orange-500 text-white shadow-md shadow-orange-200" 
                : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200 group-hover:text-zinc-700"
            )}>
              <Icon size={16} />
            </div>
          )}
          <span className={cn(
            "text-sm font-medium transition-colors",
            isActive ? "text-orange-800" : ""
          )}>{label}</span>
        </div>
        
        {hasSubItems && (
          <div className={cn(
            "transition-transform duration-200",
            isExpanded ? "rotate-0" : "",
            isActive ? "text-orange-500" : "text-zinc-400"
          )}>
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        )}
        
        {!hasSubItems && isActive && (
          <motion.div 
            layoutId="activeNavIndicator"
            className="w-2 h-2 rounded-full bg-orange-500 shadow-sm shadow-orange-300"
          />
        )}
      </button>

      <AnimatePresence>
        {hasSubItems && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-11 pr-2 py-2 space-y-1">
              {subItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={cn(
                    "w-full text-left text-sm py-2 px-3 rounded-lg transition-all duration-150 relative cursor-pointer",
                    item.isActive 
                      ? "text-orange-700 font-medium bg-orange-50/80 border-l-2 border-orange-400" 
                      : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
