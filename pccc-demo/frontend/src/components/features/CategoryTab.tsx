import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface CategoryTabProps {
  title: string
  items: string[]
  icon: React.ReactNode
}

export function CategoryTab({ title, items, icon }: CategoryTabProps) {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header with Lucide icon */}
      <div className="flex items-center gap-3 mb-4 lg:mb-6">
        <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200/60 shadow-sm flex items-center justify-center">
          {icon}
        </div>
        <h2 className="font-heading text-xl lg:text-2xl font-bold text-zinc-900">{title}</h2>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 gap-3 lg:gap-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/70 backdrop-blur-sm border border-zinc-200/50 rounded-xl p-4 lg:p-5 hover:bg-white hover:shadow-md hover:border-zinc-300/60 transition-all cursor-pointer group"
          >
            <div className="flex gap-3 lg:gap-4">
              <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200/50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-100 group-hover:border-emerald-300/50 transition-colors">
                <Check size={14} className="text-emerald-600" />
              </div>
              <p className="text-sm lg:text-base text-zinc-700 leading-relaxed group-hover:text-zinc-900">{item}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
