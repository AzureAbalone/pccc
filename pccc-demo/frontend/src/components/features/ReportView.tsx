import { useState, useEffect } from "react"
import {
  DoorOpen,
  Flame,
  Truck,
  Wrench,
  Download,
  Share2,
  RefreshCw,
  FileText,
  Layers,
  ArrowUpFromLine,
  Maximize2,
  Building2,
  ShieldCheck,
  AlertTriangle
} from "lucide-react"
import { Button } from "../ui/Button"
import { MobileTabSelector } from "../ui/MobileTabSelector"
import { CategoryTab } from "./CategoryTab"
import { CitationList } from "./CitationList"
import type { ComplianceResponse } from "@pccc/shared"

interface ReportViewProps {
  initialTab?: string
  data?: ComplianceResponse | null
  onNewAnalysis?: () => void
  onNavigateToInput?: () => void
}

// Tab configuration
const tabConfig = {
  escape: {
    title: "Giải pháp thoát nạn",
    icon: <DoorOpen size={24} className="text-emerald-500" />,
    dataKey: "escapeSolutions" as const
  },
  fire: {
    title: "Ngăn cháy lan",
    icon: <Flame size={24} className="text-orange-500" />,
    dataKey: "fireSpreadPrevention" as const
  },
  traffic: {
    title: "Giao thông chữa cháy",
    icon: <Truck size={24} className="text-blue-500" />,
    dataKey: "fireTraffic" as const
  },
  tech: {
    title: "Hệ thống kỹ thuật",
    icon: <Wrench size={24} className="text-purple-500" />,
    dataKey: "technicalSystems" as const
  }
}

// Helper to extract tab from initialTab prop
function getActiveTab(initialTab?: string): keyof typeof tabConfig {
  if (!initialTab || initialTab === 'report') return 'escape'
  if (initialTab.includes('-')) {
    const tabPart = initialTab.split('-')[1]
    if (tabPart && tabPart in tabConfig) {
      return tabPart as keyof typeof tabConfig
    }
  }
  if (initialTab in tabConfig) {
    return initialTab as keyof typeof tabConfig
  }
  return 'escape'
}

export function ReportView({
  initialTab = "escape",
  data,
  onNewAnalysis,
  onNavigateToInput
}: ReportViewProps) {
  // Local state for mobile tab selection
  const [localActiveTab, setLocalActiveTab] = useState<keyof typeof tabConfig>(() => getActiveTab(initialTab))
  
  // Sync with initialTab prop changes (from sidebar navigation)
  useEffect(() => {
    setLocalActiveTab(getActiveTab(initialTab))
  }, [initialTab])
  
  const activeTab = localActiveTab
  const currentTab = tabConfig[activeTab]
  
  // Handler for mobile tab change
  const handleMobileTabChange = (tabId: string) => {
    if (tabId in tabConfig) {
      setLocalActiveTab(tabId as keyof typeof tabConfig)
    }
  }

  // Use API data if available. If not, show empty state.
  const complianceData = data

  if (!complianceData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center p-8 space-y-6 animate-fade-in-up">
        <div className="w-20 h-20 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100 shadow-sm">
          <FileText className="w-10 h-10 text-zinc-300" />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-xl font-heading font-bold text-zinc-800">Chưa có dữ liệu phân tích</h3>
          <p className="text-zinc-500">
            Vui lòng cung cấp thông tin công trình để hệ thống phân tích và đề xuất giải pháp PCCC phù hợp.
          </p>
        </div>
        <Button
          onClick={onNavigateToInput}
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200/50 hover:shadow-xl hover:scale-105 transition-all"
        >
          Nhập thông tin công trình
        </Button>
      </div>
    )
  }

  // Safely extract building info with defaults
  const info = complianceData.buildingInfo || {
    floors: null,
    height: null,
    floorArea: null,
    buildingType: null,
    fireClass: null,
    hazardGroup: null
  }

  const dynamicStats = [
    { label: "Số tầng", value: info.floors ?? "--", unit: "tầng", icon: Layers },
    { label: "Chiều cao", value: info.height ?? "--", unit: "m", icon: ArrowUpFromLine },
    { label: "Diện tích", value: info.floorArea ? info.floorArea.toLocaleString() : "--", unit: "m²", icon: Maximize2 },
    { label: "Loại CT", value: info.buildingType ?? "--", unit: "", icon: Building2 },
    { label: "Cấp PCCC", value: info.fireClass ?? "--", unit: "", icon: ShieldCheck },
    { label: "Nhóm nguy hiểm", value: info.hazardGroup ?? "--", unit: "", icon: AlertTriangle },
  ]

  // Helper to extract unique references from items and look up their text from citations
  const getUniqueReferences = (items: any[]) => {
    if (!items) return []
    const references = items.flatMap(item => item.references || [])
    const uniqueRefs = Array.from(new Map(references.map(ref => [ref.source, ref])).values())
    
    // Look up the actual citation text from complianceData.citations
    return uniqueRefs.map(ref => {
      // Find matching citation by source
      const matchedCitation = complianceData?.citations?.find(
        (c: any) => c.source === ref.source || c.source.includes(ref.source) || ref.source.includes(c.source)
      )
      return {
        source: ref.source,
        text: matchedCitation?.text || ref.text || ref.requirement || `Tham chiếu: ${ref.clause || ref.source}`,
        url: matchedCitation?.url || ref.url,
        clause: ref.clause,
        category: activeTab
      }
    })
  }

  // Get data for current tab
  const getCurrentTabData = () => {
    const dataKey = currentTab.dataKey
    return complianceData[dataKey] || []
  }

  return (
    <div className="space-y-6 lg:space-y-8 pb-8">
      {/* Stats Header - 2 cols on mobile, 3 cols on desktop */}
      <div className="bg-white/50 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="grid grid-cols-2 lg:grid-cols-3">
          {dynamicStats.map((stat, i) => (
            <div 
              key={i} 
              className={`
                relative p-4 lg:p-5 flex flex-col justify-center group hover:bg-zinc-50/50 transition-colors overflow-hidden
                border-b border-zinc-100
                ${i % 2 === 0 ? 'border-r lg:border-r-0' : ''}
                ${i % 3 !== 2 ? 'lg:border-r' : ''}
              `}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Watermark Icon */}
              <stat.icon 
                strokeWidth={1.5}
                className="absolute -right-2 -bottom-2 w-12 h-12 text-orange-500/10 group-hover:text-orange-500/20 transition-colors duration-500 -rotate-12" 
              />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-start gap-1">
                <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 group-hover:text-amber-600/70 transition-colors whitespace-nowrap">
                  {stat.label}
                </div>
                <div className="font-heading font-bold text-zinc-900 text-sm lg:text-base leading-snug">
                  {stat.value}
                  {stat.unit && stat.value !== "--" && stat.value !== "---" && (
                    <span className="text-[10px] text-zinc-400 font-medium ml-1 relative -top-0.5">{stat.unit}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Header with Actions - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-heading text-xl lg:text-2xl font-bold text-zinc-900">Kết quả Phân tích</h1>
        <div className="flex gap-2">
          {onNewAnalysis && (
            <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-initial" onClick={onNewAnalysis}>
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Phân tích mới</span>
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-initial">
            <Share2 size={14} />
            <span className="hidden sm:inline">Chia sẻ</span>
          </Button>
          <Button variant="primary" size="sm" className="gap-2 flex-1 sm:flex-initial">
            <Download size={14} />
            <span>Xuất PDF</span>
          </Button>
        </div>
      </div>

      {/* Mobile Tab Selector - Only visible on mobile */}
      <MobileTabSelector 
        activeTab={activeTab} 
        onTabChange={handleMobileTabChange} 
      />

      {/* Content - Direct render based on activeTab */}
      <div key={activeTab} className="min-h-[300px] lg:min-h-[400px] animate-fade-in-up">
        <CategoryTab
          key={`category-${activeTab}`}
          title={currentTab.title}
          items={getCurrentTabData()}
          icon={currentTab.icon}
        />
        <CitationList 
          key={`citations-${activeTab}`}
          activeTab={activeTab}
          citations={getUniqueReferences(getCurrentTabData())} 
        />
      </div>
    </div>
  )
}

