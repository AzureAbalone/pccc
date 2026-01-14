import * as React from "react"
import { createContext, useContext, useState, useEffect } from 'react'
import { cn } from "../../lib/utils"
import { motion, LayoutGroup } from "framer-motion"

// Hook to detect mobile screen
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])
  
  return isMobile
}

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

const TabsContext = createContext<{
  value: string
  onValueChange: (value: string) => void
  isMobile: boolean
} | null>(null)

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  const isMobile = useIsMobile()
  
  return (
    <TabsContext.Provider value={{ value, onValueChange, isMobile }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <LayoutGroup>
      <div className={cn(
        "flex items-stretch p-1 bg-zinc-100/60 rounded-xl",
        className
      )}>
        {children}
      </div>
    </LayoutGroup>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export function TabsTrigger({ value, children, className, icon }: TabsTriggerProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error("TabsTrigger must be used within Tabs")
  
  const { isMobile } = context
  const isActive = context.value === value
  
  return (
    <button
      onClick={() => context.onValueChange(value)}
      className={cn(
        "relative flex-1 flex items-center justify-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors duration-200",
        isActive 
          ? "text-orange-600" 
          : "text-zinc-500 hover:text-zinc-700",
        className
      )}
    >
      {/* Smooth sliding background pill */}
      {isActive && (
        <motion.div
          layoutId="activeTabBg"
          className="absolute inset-0 bg-white rounded-lg shadow-sm border border-zinc-200/60"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 35,
          }}
        />
      )}
      
      {/* Icon - always visible */}
      <motion.span 
        className="relative z-10 flex-shrink-0"
        animate={{ 
          scale: isActive ? 1 : 0.95,
          opacity: isActive ? 1 : 0.85 
        }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.span>
      
      {/* Text - animated on mobile, always visible on desktop */}
      {isMobile ? (
        <motion.span
          className="relative z-10 text-sm font-medium whitespace-nowrap overflow-hidden"
          initial={false}
          animate={{
            width: isActive ? "auto" : 0,
            opacity: isActive ? 1 : 0,
            marginLeft: isActive ? 0 : -4,
          }}
          transition={{
            width: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
            opacity: { duration: 0.2, delay: isActive ? 0.05 : 0 },
            marginLeft: { duration: 0.2 },
          }}
        >
          {children}
        </motion.span>
      ) : (
        <span className="relative z-10 text-sm font-medium">
          {children}
        </span>
      )}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error("TabsContent must be used within Tabs")
  
  if (context.value !== value) return null
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("", className)}
    >
      {children}
    </motion.div>
  )
}


