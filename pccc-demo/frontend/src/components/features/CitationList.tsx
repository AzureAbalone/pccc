import { ArrowUpRight, CheckCircle2, FileText } from "lucide-react"
import { motion } from "framer-motion"

interface CitationListProps {
  citations: {
    source: string;
    text: string;
    url?: string | null;
    category?: string
  }[];
  activeTab: string;
}

export function CitationList({ citations, activeTab }: CitationListProps) {
  // Map simplified tab names to full categories if needed, or just match direct strings
  // 'escape', 'fire', 'traffic', 'tech'
  const filteredCitations = citations.filter(c => {
    if (!c.category) return true; // Show uncategorized items everywhere? Or nowhere? Let's show specific.
    // Map activeTab to category logic if they differ, or ensure they match in parent
    const tabMap: Record<string, string> = {
      'escape': 'escape',
      'fire': 'fire',
      'traffic': 'traffic',
      'tech': 'tech'
    };
    return c.category === tabMap[activeTab];
  });

  return (
    <div className="space-y-4 mt-6 lg:mt-8 pt-6 lg:pt-8 border-t border-zinc-200/60">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200/50 flex items-center justify-center">
          <FileText size={16} className="text-orange-600" />
        </div>
        <h3 className="font-heading font-semibold text-zinc-800">Căn cứ pháp lý</h3>
      </div>

      {filteredCitations.length === 0 ? (
        <div className="text-center p-8 text-zinc-400 text-sm bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200">
          Chưa có trích dẫn cụ thể cho phần này.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredCitations.map((citation, index) => (
            <motion.div
              key={`${citation.source}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              id={`citation-${citation.source.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`}
              className="flex flex-col sm:flex-row sm:items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-50/50 to-amber-50/30 border border-orange-200/40 hover:border-orange-300/50 hover:shadow-sm transition-all group relative scroll-mt-20"
            >
              <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform hidden sm:block" />
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-[11px] font-mono font-semibold text-orange-700 px-2 py-1 rounded-md bg-orange-100/80 border border-orange-200/50 inline-block">
                    {citation.source}
                  </div>
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed group-hover:text-zinc-800">
                  {citation.text}
                </p>
              </div>

              {citation.url && (
                <a
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200/50 rounded-lg transition-colors group/link mt-2 sm:mt-0 w-full sm:w-auto justify-center"
                >
                  <span>Xem văn bản</span>
                  <ArrowUpRight size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
