import * as React from "react"
import { createContext, useContext } from 'react'
import { cn } from "../../lib/utils"
import { motion } from "framer-motion"

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

const TabsContext = createContext<{
  value: string
  onValueChange: (value: string) => void
} | null>(null)

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex items-center gap-1 p-1 bg-zinc-100/80 rounded-xl overflow-x-auto scrollbar-hide", className)}>
      {children}
    </div>
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
  
  const isActive = context.value === value
  
  return (
    <button
      onClick={() => context.onValueChange(value)}
      className={cn(
        "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg whitespace-nowrap cursor-pointer",
        isActive 
          ? "text-orange-700" 
          : "text-zinc-500 hover:text-zinc-700 hover:bg-white/50",
        className
      )}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-white rounded-lg shadow-sm border border-zinc-200/50"
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        />
      )}
      <span className={cn("relative z-10 flex items-center gap-2", isActive && "text-orange-600")}>
        {icon}
        {children}
      </span>
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("", className)}
    >
      {children}
    </motion.div>
  )
}
