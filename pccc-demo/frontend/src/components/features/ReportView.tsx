import { useState } from "react"
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/Tabs"
import { Button } from "../ui/Button"
import { CategoryTab } from "./CategoryTab"
import { CitationList } from "./CitationList"
import type { ComplianceResponse } from "@pccc/shared"

interface ReportViewProps {
  initialTab?: string
  data?: ComplianceResponse | null
  onNewAnalysis?: () => void
  onNavigateToInput?: () => void
}

export function ReportView({
  initialTab = "escape",
  data,
  onNewAnalysis,
  onNavigateToInput
}: ReportViewProps) {
  // Internal tab state - only updates this component, not the entire app
  const [activeTab, setActiveTab] = useState(() => {
    // If it's just the generic report view, default to escape
    if (initialTab === 'report' || !initialTab) {
      return 'escape'
    }
    // Extract tab value from initialTab if it's in format "report-xxx"
    if (initialTab.includes('-')) {
      return initialTab.split('-')[1] || 'escape'
    }
    return initialTab
  })

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
    buildingType: "---",
    fireClass: "---",
    hazardGroup: "---"
  }

  const dynamicStats = [
    { label: "Số tầng", value: info.floors ?? "--", unit: "tầng", icon: Layers },
    { label: "Chiều cao", value: info.height ?? "--", unit: "m", icon: ArrowUpFromLine },
    { label: "Diện tích", value: info.floorArea ? info.floorArea.toLocaleString() : "--", unit: "m²", icon: Maximize2 },
    { label: "Loại CT", value: info.buildingType ?? "---", unit: "", icon: Building2 },
    { label: "Cấp PCCC", value: info.fireClass ?? "---", unit: "", icon: ShieldCheck },
    { label: "Nhóm nguy hiểm", value: info.hazardGroup ?? "---", unit: "", icon: AlertTriangle },
  ]
  // Helper to extract unique references from items
  const getUniqueReferences = (items: any[]) => {
    if (!items) return []
    const references = items.flatMap(item => item.references || [])
    const uniqueRefs = Array.from(new Map(references.map(ref => [ref.source, ref])).values())
    return uniqueRefs.map(ref => ({
      source: ref.source,
      text: ref.text,
      url: ref.url,
      category: activeTab
    }))
  }

  return (
    <div className="space-y-6 lg:space-y-8 pb-8">
      {/* Stats Header - Horizontal scrollable on mobile, wrap on desktop */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-zinc-200/50 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden animate-fade-in-up">
        <div className="grid grid-cols-2">
          {dynamicStats.map((stat, i) => (
            <div 
              key={i} 
              className="relative p-4 lg:p-5 flex flex-col justify-center group hover:bg-zinc-50/50 transition-colors border-b border-zinc-100 odd:border-r overflow-hidden"
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
                  {stat.unit && (
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

      {/* Tabs - Internal state, no parent re-render */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="escape" icon={<DoorOpen size={18} />}>
            Thoát nạn
          </TabsTrigger>
          <TabsTrigger value="fire" icon={<Flame size={18} />}>
            Cháy lan
          </TabsTrigger>
          <TabsTrigger value="traffic" icon={<Truck size={18} />}>
            Giao thông
          </TabsTrigger>
          <TabsTrigger value="tech" icon={<Wrench size={18} />}>
            Kỹ thuật
          </TabsTrigger>
        </TabsList>

        <div className="mt-6 lg:mt-8 min-h-[300px] lg:min-h-[400px]">
          <TabsContent value="escape">
            <CategoryTab
              title="Giải pháp thoát nạn"
              items={complianceData.escapeSolutions}
              icon={<DoorOpen size={24} className="text-emerald-500" />}
            />
            <CitationList 
              activeTab="escape"
              citations={getUniqueReferences(complianceData.escapeSolutions)} 
            />
          </TabsContent>

          <TabsContent value="fire">
            <CategoryTab
              title="Ngăn cháy lan"
              items={complianceData.fireSpreadPrevention}
              icon={<Flame size={24} className="text-orange-500" />}
            />
            <CitationList 
              activeTab="fire"
              citations={getUniqueReferences(complianceData.fireSpreadPrevention)} 
            />
          </TabsContent>

          <TabsContent value="traffic">
            <CategoryTab
              title="Giao thông chữa cháy"
              items={complianceData.fireTraffic}
              icon={<Truck size={24} className="text-blue-500" />}
            />
            <CitationList 
              activeTab="traffic"
              citations={getUniqueReferences(complianceData.fireTraffic)} 
            />
          </TabsContent>

          <TabsContent value="tech">
            <CategoryTab
              title="Hệ thống kỹ thuật"
              items={complianceData.technicalSystems}
              icon={<Wrench size={24} className="text-purple-500" />}
            />
            <CitationList 
              activeTab="tech"
              citations={getUniqueReferences(complianceData.technicalSystems)} 
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

