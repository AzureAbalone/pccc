import { CheckCircle2, FileText } from "lucide-react"
import { motion } from "framer-motion"

interface CitationListProps {
  citations: { source: string; text: string }[]
}

export function CitationList({ citations }: CitationListProps) {
  return (
    <div className="space-y-4 mt-6 lg:mt-8 pt-6 lg:pt-8 border-t border-zinc-200/60">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200/50 flex items-center justify-center">
          <FileText size={16} className="text-orange-600" />
        </div>
        <h3 className="font-heading font-semibold text-zinc-800">Căn cứ pháp lý</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {citations.map((citation, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-50/50 to-amber-50/30 border border-orange-200/40 hover:border-orange-300/50 hover:shadow-sm transition-all cursor-pointer group"
          >
            <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
            <div className="space-y-1.5 min-w-0">
              <div className="text-[11px] font-mono font-semibold text-orange-700 px-2 py-1 rounded-md bg-orange-100/80 border border-orange-200/50 inline-block">
                {citation.source}
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed group-hover:text-zinc-800">
                {citation.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
