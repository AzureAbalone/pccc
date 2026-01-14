import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  BookOpen, 
  Search, 
  Filter,
  ExternalLink,
  Calendar,
  Building2,
  FileText,
  Scale,
  Scroll,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Card } from "../ui/Card"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { regulations, type Regulation } from "../../data/mockData"

type CategoryFilter = 'all' | 'qcvn' | 'tcvn' | 'law' | 'decree'

const categoryConfig = {
  qcvn: { 
    icon: Building2, 
    color: "text-blue-500", 
    bg: "bg-blue-50", 
    border: "border-blue-200",
    label: "Quy chuẩn" 
  },
  tcvn: { 
    icon: FileText, 
    color: "text-emerald-500", 
    bg: "bg-emerald-50", 
    border: "border-emerald-200",
    label: "Tiêu chuẩn" 
  },
  law: { 
    icon: Scale, 
    color: "text-purple-500", 
    bg: "bg-purple-50", 
    border: "border-purple-200",
    label: "Luật" 
  },
  decree: { 
    icon: Scroll, 
    color: "text-orange-500", 
    bg: "bg-orange-50", 
    border: "border-orange-200",
    label: "Nghị định" 
  }
}

function CategoryBadge({ category }: { category: Regulation['category'] }) {
  const config = categoryConfig[category]
  const Icon = config.icon
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color} ${config.border} border`}>
      <Icon size={14} />
      {config.label}
    </span>
  )
}

function StatusBadge({ status }: { status: Regulation['status'] }) {
  if (status === 'active') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
        <CheckCircle2 size={12} />
        Còn hiệu lực
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-500">
      <XCircle size={12} />
      Đã thay thế
    </span>
  )
}

function RegulationCard({ regulation, isExpanded, onToggle }: { 
  regulation: Regulation
  isExpanded: boolean
  onToggle: () => void 
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card 
        className={`p-4 lg:p-5 cursor-pointer transition-all hover:shadow-md ${isExpanded ? 'ring-2 ring-orange-200' : ''} ${regulation.status === 'superseded' ? 'opacity-70' : ''}`}
        onClick={onToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <CategoryBadge category={regulation.category} />
              <StatusBadge status={regulation.status} />
            </div>
            
            <h3 className="font-heading font-semibold text-zinc-800 text-lg mb-1">
              {regulation.code}
            </h3>
            <p className="text-sm text-zinc-600 line-clamp-2">
              {regulation.name}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <Building2 size={12} />
                {regulation.issuer}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {regulation.year}
              </span>
            </div>
          </div>
          
          <button className="text-zinc-400 hover:text-zinc-600 transition-colors shrink-0 mt-1">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className={`mt-4 pt-4 border-t border-zinc-100 space-y-4`}>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Mô tả
                  </h4>
                  <p className="text-sm text-zinc-700 leading-relaxed">
                    {regulation.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Phạm vi áp dụng
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {regulation.scope.map((scope, i) => (
                      <span 
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-600 text-xs font-medium"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="gap-2 mt-2">
                  <ExternalLink size={14} />
                  Xem văn bản gốc
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

export function RegulationsView() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  const stats = useMemo(() => ({
    total: regulations.length,
    qcvn: regulations.filter(r => r.category === 'qcvn').length,
    tcvn: regulations.filter(r => r.category === 'tcvn').length,
    law: regulations.filter(r => r.category === 'law').length,
    decree: regulations.filter(r => r.category === 'decree').length,
  }), [])
  
  const filteredRegulations = useMemo(() => {
    let result = regulations
    
    // Filter by category
    if (categoryFilter !== 'all') {
      result = result.filter(r => r.category === categoryFilter)
    }
    
    // Filter by search
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      result = result.filter(r => 
        r.code.toLowerCase().includes(searchLower) ||
        r.name.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower)
      )
    }
    
    // Sort: active first, then by year descending
    return result.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'active' ? -1 : 1
      }
      return b.year - a.year
    })
  }, [categoryFilter, search])

  return (
    <div className="space-y-6 lg:space-y-8 pb-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200/50 flex items-center justify-center shadow-sm">
            <BookOpen size={24} className="text-blue-500" />
          </div>
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-zinc-900">
              Quy phạm Pháp luật
            </h1>
            <p className="text-zinc-500 text-sm">
              Tra cứu quy chuẩn, tiêu chuẩn PCCC Việt Nam
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <Input
          type="text"
          placeholder="Tìm kiếm theo mã, tên hoặc nội dung..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-11 h-12"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={categoryFilter === 'all' ? 'primary' : 'outline'} 
          size="sm"
          onClick={() => setCategoryFilter('all')}
          className="gap-2"
        >
          <Filter size={14} />
          Tất cả ({stats.total})
        </Button>
        
        {(Object.entries(categoryConfig) as [CategoryFilter, typeof categoryConfig.qcvn][]).map(([key, config]) => {
          const Icon = config.icon
          const count = stats[key as keyof typeof stats]
          
          return (
            <Button
              key={key}
              variant={categoryFilter === key ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter(key)}
              className="gap-2"
            >
              <Icon size={14} />
              {config.label} ({count})
            </Button>
          )
        })}
      </div>

      {/* Regulations List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredRegulations.map((regulation) => (
            <RegulationCard
              key={regulation.id}
              regulation={regulation}
              isExpanded={expandedId === regulation.id}
              onToggle={() => setExpandedId(expandedId === regulation.id ? null : regulation.id)}
            />
          ))}
        </AnimatePresence>
        
        {filteredRegulations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-zinc-400" />
            </div>
            <p className="text-zinc-500">Không tìm thấy văn bản phù hợp</p>
            <p className="text-zinc-400 text-sm mt-1">Thử thay đổi từ khóa hoặc bộ lọc</p>
          </div>
        )}
      </div>
      
      {/* Results count */}
      {filteredRegulations.length > 0 && (
        <p className="text-center text-sm text-zinc-400">
          Hiển thị {filteredRegulations.length} / {regulations.length} văn bản
        </p>
      )}
    </div>
  )
}
