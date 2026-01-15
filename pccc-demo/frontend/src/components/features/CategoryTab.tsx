import { motion } from "framer-motion"
import { Check, BookOpen } from "lucide-react"
import { useState, useMemo } from "react"

interface Reference {
  source: string
  text?: string
  url?: string | null
  clause?: string
  requirement?: string
}

interface ComplianceItem {
  title?: string
  content: string
  references?: Reference[]
}

interface CategoryTabProps {
  title: string
  items: ComplianceItem[]
  icon: React.ReactNode
}

export function CategoryTab({ title, items, icon }: CategoryTabProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  // Handle case where items might still be strings during migration or error
  const normalizedItems = items?.map(item => {
    if (typeof item === 'string') return { content: item, references: [] }
    return item
  }) || []

  // Calculate max width from all references
  const maxRefWidth = useMemo(() => {
    const allSources = normalizedItems.flatMap(item => 
      item.references?.map(r => r.source) || []
    );
    const longestSource = allSources.reduce((max, s) => 
      s.length > max.length ? s : max, '');
    // Approximate: each character ~7px + icon 10px + padding 16px + gap 4px
    return Math.max(120, longestSource.length * 7 + 30);
  }, [normalizedItems]);

  // Get color theme based on title
  const getTheme = () => {
    if (title.includes('thoát nạn')) return {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200/50',
      text: 'text-emerald-600',
      accent: 'bg-emerald-500',
      ring: 'ring-emerald-400'
    }
    if (title.includes('cháy lan')) return {
      bg: 'bg-orange-50',
      border: 'border-orange-200/50',
      text: 'text-orange-600',
      accent: 'bg-orange-500',
      ring: 'ring-orange-400'
    }
    if (title.includes('Giao thông')) return {
      bg: 'bg-blue-50',
      border: 'border-blue-200/50',
      text: 'text-blue-600',
      accent: 'bg-blue-500',
      ring: 'ring-blue-400'
    }
    return {
      bg: 'bg-purple-50',
      border: 'border-purple-200/50',
      text: 'text-purple-600',
      accent: 'bg-purple-500',
      ring: 'ring-purple-400'
    }
  }

  const theme = getTheme()

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header with Lucide icon */}
      <div className="flex items-center gap-3 mb-4 lg:mb-6">
        <div className="w-12 h-12 rounded-xl bg-white/50 backdrop-blur-sm border border-zinc-200/60 shadow-sm flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h2 className="font-heading text-xl lg:text-2xl font-bold text-zinc-900">{title}</h2>
          <p className="text-sm text-zinc-500">{normalizedItems.length} giải pháp được đề xuất</p>
        </div>
      </div>

      {/* Items - Single Column Full Width */}
      <div className="flex flex-col gap-2">
        {normalizedItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              relative bg-white/50 backdrop-blur-sm border border-zinc-200/40 rounded-xl 
              hover:shadow-lg hover:border-zinc-300/60 hover:bg-white/70
              transition-all duration-300 group cursor-pointer
              ${expandedIndex === index ? 'ring-2 ' + theme.ring + ' ring-offset-2' : ''}
            `}
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            {/* Top accent bar */}
            <div className={`h-1 w-full ${theme.accent} opacity-80`} />

            <div className="p-3">
              {/* Single row layout */}
              <div className="flex items-center gap-3">
                <div className={`
                  w-7 h-7 rounded-lg ${theme.bg} ${theme.border} border
                  flex items-center justify-center shrink-0
                  group-hover:scale-110 transition-transform
                `}>
                  <span className={`text-xs font-bold ${theme.text}`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                {/* Full content inline */}
                <div className="flex-1 min-w-0">
                  <p className="text-base text-zinc-900 leading-snug text-justify">
                    {item.title ? `${item.title}: ${item.content}` : item.content}
                  </p>
                </div>

              {/* References - inline */}
              {item.references && item.references.length > 0 && (
                <div className="shrink-0 flex items-center gap-1.5">
                  {item.references.slice(0, 2).map((ref, idx) => (
                    <a
                      key={idx}
                      href={`#citation-${ref.source.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const id = `citation-${ref.source.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`;
                        const element = document.getElementById(id);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          element.classList.add('ring-2', 'ring-orange-400', 'ring-offset-2');
                          setTimeout(() => element.classList.remove('ring-2', 'ring-orange-400', 'ring-offset-2'), 2000);
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-orange-100/80 text-orange-700 border border-orange-200/50 hover:bg-orange-200 transition-colors no-underline cursor-pointer text-center"
                      style={{ minWidth: `${maxRefWidth}px` }}
                    >
                      <BookOpen size={10} />
                      <span>{ref.source}</span>
                    </a>
                  ))}
                </div>
              )}
              </div>
            </div>

            {/* Checkmark indicator */}
            <div className={`
              absolute top-3 right-3 w-5 h-5 rounded-full 
              ${theme.bg} border ${theme.border}
              flex items-center justify-center opacity-0 group-hover:opacity-100
              transition-opacity duration-300
            `}>
              <Check size={12} className={theme.text} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {normalizedItems.length === 0 && (
        <div className="text-center p-12 text-zinc-400 text-sm bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-100 flex items-center justify-center">
            {icon}
          </div>
          <p className="font-medium text-zinc-500">Chưa có giải pháp được đề xuất</p>
          <p className="text-xs mt-1">Vui lòng thử phân tích lại với thông tin chi tiết hơn</p>
        </div>
      )}
    </div>
  )
}
