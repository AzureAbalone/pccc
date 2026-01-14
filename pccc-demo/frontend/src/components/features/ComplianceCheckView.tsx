import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Circle,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from "lucide-react"
import { Card } from "../ui/Card"
import { Button } from "../ui/Button"
import { complianceCheckItems, type ComplianceCheckItem } from "../../data/mockData"

type StatusFilter = 'all' | 'pass' | 'fail' | 'warning' | 'unchecked'

const statusConfig = {
  pass: { 
    icon: CheckCircle2, 
    color: "text-emerald-500", 
    bg: "bg-emerald-50", 
    border: "border-emerald-200",
    label: "Đạt" 
  },
  fail: { 
    icon: XCircle, 
    color: "text-red-500", 
    bg: "bg-red-50", 
    border: "border-red-200",
    label: "Không đạt" 
  },
  warning: { 
    icon: AlertTriangle, 
    color: "text-amber-500", 
    bg: "bg-amber-50", 
    border: "border-amber-200",
    label: "Cần lưu ý" 
  },
  unchecked: { 
    icon: Circle, 
    color: "text-zinc-400", 
    bg: "bg-zinc-50", 
    border: "border-zinc-200",
    label: "Chưa kiểm tra" 
  }
}

function StatusBadge({ status }: { status: ComplianceCheckItem['status'] }) {
  const config = statusConfig[status]
  const Icon = config.icon
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color} ${config.border} border transition-colors duration-200`}>
      <Icon size={14} />
      {config.label}
    </span>
  )
}

function ComplianceItemCard({ item, isExpanded, onToggle }: { 
  item: ComplianceCheckItem
  isExpanded: boolean
  onToggle: () => void 
}) {
  const config = statusConfig[item.status]
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card 
        className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-zinc-300/80 hover:bg-white/90 ${isExpanded ? 'ring-2 ring-orange-200 shadow-md' : ''}`}
        onClick={onToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                {item.category}
              </span>
            </div>
            <h3 className="font-medium text-zinc-800 mb-2">{item.requirement}</h3>
            <p className="text-xs text-zinc-500 flex items-center gap-1">
              <ExternalLink size={12} />
              {item.standard}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <StatusBadge status={item.status} />
            <button className="text-zinc-400 hover:text-zinc-600 transition-colors duration-200 cursor-pointer p-1 rounded-lg hover:bg-zinc-100">
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {isExpanded && item.details && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className={`mt-4 pt-4 border-t border-zinc-100 ${config.bg} -mx-4 -mb-4 px-4 pb-4 rounded-b-xl`}>
                <p className="text-sm text-zinc-700">{item.details}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

export function ComplianceCheckView() {
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  const stats = useMemo(() => ({
    total: complianceCheckItems.length,
    pass: complianceCheckItems.filter(i => i.status === 'pass').length,
    fail: complianceCheckItems.filter(i => i.status === 'fail').length,
    warning: complianceCheckItems.filter(i => i.status === 'warning').length,
    unchecked: complianceCheckItems.filter(i => i.status === 'unchecked').length,
  }), [])
  
  const filteredItems = useMemo(() => {
    if (filter === 'all') return complianceCheckItems
    return complianceCheckItems.filter(item => item.status === filter)
  }, [filter])
  
  const passRate = Math.round((stats.pass / (stats.total - stats.unchecked)) * 100) || 0

  return (
    <div className="space-y-6 lg:space-y-8 pb-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200/50 flex items-center justify-center shadow-sm">
            <ShieldCheck size={24} className="text-orange-500" />
          </div>
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-bold text-zinc-900">
              Kiểm tra Hợp chuẩn
            </h1>
            <p className="text-zinc-500 text-sm">
              Đánh giá mức độ tuân thủ quy chuẩn PCCC
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4">
        {/* Pass Rate - Featured with Glassmorphism */}
        <div className="col-span-2 sm:col-span-1 relative overflow-hidden rounded-xl p-4 border border-white/40 shadow-lg backdrop-blur-xl bg-gradient-to-br from-white/60 via-emerald-50/40 to-emerald-100/30 cursor-default transition-all duration-200 hover:shadow-xl hover:border-emerald-200/60">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10 pointer-events-none transition-opacity duration-200" />
          <div className="relative">
            <div className="text-xs text-emerald-600/80 uppercase tracking-wider mb-1 font-semibold">Tỷ lệ đạt</div>
            <div className="font-heading text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">{passRate}%</div>
          </div>
        </div>
        
        {/* Pass Button */}
        <button
          onClick={() => setFilter('pass')}
          className={`p-4 rounded-xl border backdrop-blur-sm transition-all duration-200 text-left cursor-pointer ${
            filter === 'pass' 
              ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-200 shadow-md' 
              : 'bg-white/70 border-zinc-200/60 hover:border-emerald-300/80 hover:bg-emerald-50/30 hover:shadow-md'
          }`}
        >
          <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1 transition-colors duration-200">Đạt</div>
          <div className="font-heading text-2xl font-bold text-emerald-600">{stats.pass}</div>
        </button>
        
        {/* Fail Button */}
        <button
          onClick={() => setFilter('fail')}
          className={`p-4 rounded-xl border backdrop-blur-sm transition-all duration-200 text-left cursor-pointer ${
            filter === 'fail' 
              ? 'bg-red-50/80 border-red-300 ring-2 ring-red-200 shadow-md' 
              : 'bg-white/70 border-zinc-200/60 hover:border-red-300/80 hover:bg-red-50/30 hover:shadow-md'
          }`}
        >
          <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1 transition-colors duration-200">Không đạt</div>
          <div className="font-heading text-2xl font-bold text-red-600">{stats.fail}</div>
        </button>
        
        {/* Warning Button */}
        <button
          onClick={() => setFilter('warning')}
          className={`p-4 rounded-xl border backdrop-blur-sm transition-all duration-200 text-left cursor-pointer ${
            filter === 'warning' 
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-200 shadow-md' 
              : 'bg-white/70 border-zinc-200/60 hover:border-amber-300/80 hover:bg-amber-50/30 hover:shadow-md'
          }`}
        >
          <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1 transition-colors duration-200">Cần lưu ý</div>
          <div className="font-heading text-2xl font-bold text-amber-600">{stats.warning}</div>
        </button>
        
        {/* Unchecked Button */}
        <button
          onClick={() => setFilter('unchecked')}
          className={`p-4 rounded-xl border backdrop-blur-sm transition-all duration-200 text-left cursor-pointer ${
            filter === 'unchecked' 
              ? 'bg-zinc-100/80 border-zinc-400 ring-2 ring-zinc-300 shadow-md' 
              : 'bg-white/70 border-zinc-200/60 hover:border-zinc-400/80 hover:bg-zinc-100/30 hover:shadow-md'
          }`}
        >
          <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1 transition-colors duration-200">Chưa kiểm tra</div>
          <div className="font-heading text-2xl font-bold text-zinc-600">{stats.unchecked}</div>
        </button>
      </div>

      {/* Filter & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant={filter === 'all' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
            className="gap-2"
          >
            <Filter size={14} />
            Tất cả ({stats.total})
          </Button>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download size={14} />
          Xuất báo cáo
        </Button>
      </div>

      {/* Compliance Items List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <ComplianceItemCard
              key={item.id}
              item={item}
              isExpanded={expandedId === item.id}
              onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
            />
          ))}
        </AnimatePresence>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-zinc-400">
            Không có mục nào phù hợp với bộ lọc
          </div>
        )}
      </div>
    </div>
  )
}
