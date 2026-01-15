import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, DoorOpen, Flame, Truck, Wrench } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "../../lib/utils"

interface TabOption {
  id: string
  label: string
  shortLabel: string
  icon: React.ReactNode
  color: string
  bgColor: string
  borderColor: string
}

interface MobileTabSelectorProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

const tabs: TabOption[] = [
  { 
    id: "escape", 
    label: "Giải pháp thoát nạn", 
    shortLabel: "Thoát nạn",
    icon: <DoorOpen size={18} />,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-300"
  },
  { 
    id: "fire", 
    label: "Ngăn cháy lan", 
    shortLabel: "Cháy lan",
    icon: <Flame size={18} />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300"
  },
  { 
    id: "traffic", 
    label: "Giao thông chữa cháy", 
    shortLabel: "Giao thông",
    icon: <Truck size={18} />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300"
  },
  { 
    id: "tech", 
    label: "Hệ thống kỹ thuật", 
    shortLabel: "Kỹ thuật",
    icon: <Wrench size={18} />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300"
  },
]

export function MobileTabSelector({ activeTab, onTabChange }: MobileTabSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const activeTabData = tabs.find(t => t.id === activeTab) || tabs[0]

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false)
      }
    }
    if (isExpanded) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isExpanded])

  const handleTabSelect = (tabId: string) => {
    onTabChange(tabId)
    setIsExpanded(false)
  }

  return (
    <div ref={containerRef} className="lg:hidden relative z-40 mb-4">
      {/* Active Tab Button - Trigger */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between gap-3 p-3 rounded-xl",
          "bg-white/80 backdrop-blur-md border shadow-sm",
          "transition-all duration-200 cursor-pointer",
          activeTabData.borderColor,
          isExpanded && "ring-2 ring-orange-200 ring-offset-2"
        )}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            activeTabData.bgColor,
            activeTabData.color
          )}>
            {activeTabData.icon}
          </div>
          <div className="text-left">
            <div className="text-xs text-zinc-400 font-medium">Đang xem</div>
            <div className={cn("font-semibold", activeTabData.color)}>
              {activeTabData.label}
            </div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-zinc-400"
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.button>

      {/* Expandable Options Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-full left-0 right-0 mt-2 overflow-hidden"
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-zinc-200/80 shadow-xl shadow-zinc-900/10 p-2">
              <div className="grid grid-cols-2 gap-2">
                {tabs.map((tab, index) => {
                  const isActive = tab.id === activeTab
                  
                  return (
                    <motion.button
                      key={tab.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleTabSelect(tab.id)}
                      className={cn(
                        "relative flex flex-col items-center gap-2 p-4 rounded-xl",
                        "transition-all duration-200 cursor-pointer",
                        "border-2",
                        isActive 
                          ? cn(tab.bgColor, tab.borderColor, "shadow-md") 
                          : "bg-zinc-50/50 border-transparent hover:bg-zinc-100/80"
                      )}
                    >
                      {/* Icon container */}
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                        isActive 
                          ? cn("bg-white shadow-sm", tab.color)
                          : "bg-white/60 text-zinc-400"
                      )}>
                        {tab.icon}
                      </div>
                      
                      {/* Label */}
                      <span className={cn(
                        "text-xs font-semibold text-center transition-colors",
                        isActive ? tab.color : "text-zinc-500"
                      )}>
                        {tab.shortLabel}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop overlay when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/40 backdrop-blur-sm -z-10"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
