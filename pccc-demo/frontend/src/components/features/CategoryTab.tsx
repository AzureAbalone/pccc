import { motion } from "framer-motion"
import { Check, ExternalLink } from "lucide-react"

interface Reference {
  source: string
  text: string
  url?: string | null
}

interface ComplianceItem {
  content: string
  references?: Reference[]
}

interface CategoryTabProps {
  title: string
  items: ComplianceItem[]
  icon: React.ReactNode
}

export function CategoryTab({ title, items, icon }: CategoryTabProps) {
  // Handle case where items might still be strings during migration or error
  const normalizedItems = items?.map(item => {
    if (typeof item === 'string') return { content: item, references: [] }
    return item
  }) || []

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
        {normalizedItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/70 backdrop-blur-sm border border-zinc-200/50 rounded-xl p-4 lg:p-5 hover:bg-white hover:shadow-md hover:border-zinc-300/60 transition-all cursor-pointer group"
          >
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 lg:gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200/50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-100 group-hover:border-emerald-300/50 transition-colors">
                  <Check size={14} className="text-emerald-600" />
                </div>
                <div className="flex-1 flex items-center justify-between gap-4">
                  <p className="text-sm lg:text-base text-zinc-700 leading-relaxed group-hover:text-zinc-900 font-medium">
                    {item.content}
                  </p>
                  
                  {item.references && item.references.length > 0 && (
                    <div className="shrink-0 flex flex-col sm:flex-row items-center gap-2">
                       {item.references.map((ref, idx) => (
                          <a
                            key={idx}
                            href={`#citation-${ref.source.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`}
                            onClick={(e) => {
                              e.preventDefault();
                              const id = `citation-${ref.source.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`;
                              const element = document.getElementById(id);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                element.classList.add('ring-2', 'ring-orange-400', 'ring-offset-2');
                                setTimeout(() => element.classList.remove('ring-2', 'ring-orange-400', 'ring-offset-2'), 2000);
                              }
                            }}
                            className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-mono font-semibold bg-orange-100/80 text-orange-700 border border-orange-200/50 hover:bg-orange-200 hover:text-orange-800 transition-colors no-underline cursor-pointer shadow-sm select-none whitespace-nowrap"
                          >
                            {ref.source}
                          </a>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
