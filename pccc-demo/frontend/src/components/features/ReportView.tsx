import { useState } from "react"
import {
  DoorOpen,
  Flame,
  Truck,
  Wrench,
  Download,
  Share2,
  RefreshCw,
  FileText
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 space-y-6 animate-fade-in-up">
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
    { label: "Số tầng", value: info.floors ?? "--", unit: "tầng" },
    { label: "Chiều cao", value: info.height ?? "--", unit: "mét" },
    { label: "Diện tích sàn", value: info.floorArea ? info.floorArea.toLocaleString() : "--", unit: "m²" },
    { label: "Loại CT", value: info.buildingType ?? "---", unit: "" },
    { label: "Cấp PCCC", value: info.fireClass ?? "---", unit: "" },
    { label: "Nhóm nguy hiểm", value: info.hazardGroup ?? "---", unit: "" },
  ]

  return (
    <div className="space-y-6 lg:space-y-8 pb-8">
      {/* Stats Header - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
        {dynamicStats.map((stat, i) => (
          <div
            key={i}
            className="bg-white/70 backdrop-blur-sm border border-zinc-200/60 rounded-xl p-3 lg:p-4 text-center shadow-sm hover:shadow-md transition-all animate-fade-in-up cursor-default group"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="text-[10px] lg:text-xs text-zinc-400 uppercase tracking-wider mb-1 font-semibold group-hover:text-orange-500 transition-colors">
              {stat.label}
            </div>
            <div className="font-heading font-bold text-zinc-800 text-sm lg:text-base">
              <span className="font-mono text-orange-600">{stat.value}</span>
              {stat.unit && (
                <span className="text-[10px] lg:text-xs text-zinc-400 font-normal ml-1">{stat.unit}</span>
              )}
            </div>
          </div>
        ))}
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
          </TabsContent>

          <TabsContent value="fire">
            <CategoryTab
              title="Ngăn cháy lan"
              items={complianceData.fireSpreadPrevention}
              icon={<Flame size={24} className="text-orange-500" />}
            />
          </TabsContent>

          <TabsContent value="traffic">
            <CategoryTab
              title="Giao thông chữa cháy"
              items={complianceData.fireTraffic}
              icon={<Truck size={24} className="text-blue-500" />}
            />
          </TabsContent>

          <TabsContent value="tech">
            <CategoryTab
              title="Hệ thống kỹ thuật"
              items={complianceData.technicalSystems}
              icon={<Wrench size={24} className="text-purple-500" />}
            />
          </TabsContent>
        </div>
      </Tabs>

      <CitationList citations={complianceData.citations} activeTab={activeTab} />
    </div>
  )
}

