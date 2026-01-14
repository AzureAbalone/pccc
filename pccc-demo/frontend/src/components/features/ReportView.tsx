import { 
  DoorOpen, 
  Flame, 
  Truck, 
  Wrench,
  Download,
  Share2,
  RefreshCw
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/Tabs"
import { Button } from "../ui/Button"
import { CategoryTab } from "./CategoryTab"
import { CitationList } from "./CitationList"
import { mockComplianceResponse, statsData } from "../../data/mockData"
import type { ComplianceResponse } from "../../hooks/useCompliance"

interface ReportViewProps {
  activeTab?: string
  onTabChange: (tab: string) => void
  data?: ComplianceResponse | null
  onNewAnalysis?: () => void
}

export function ReportView({ 
  activeTab = "escape", 
  onTabChange, 
  data,
  onNewAnalysis 
}: ReportViewProps) {
  // Use API data if available, otherwise fall back to mock data
  const complianceData = data || mockComplianceResponse
  
  const mapTabToValue = (tab: string) => {
    if (tab.includes('escape')) return 'escape'
    if (tab.includes('fire')) return 'fire'
    if (tab.includes('traffic')) return 'traffic'
    if (tab.includes('tech')) return 'tech'
    return 'escape'
  }

  const currentTabValue = mapTabToValue(activeTab)

  return (
    <div className="space-y-6 lg:space-y-8 pb-8">
      {/* Stats Header - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
        {statsData.map((stat, i) => (
          <div 
            key={i} 
            className="bg-white/70 backdrop-blur-sm border border-zinc-200/60 rounded-xl p-3 lg:p-4 text-center shadow-sm hover:shadow-md transition-all animate-fade-in-up cursor-default"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="text-[10px] lg:text-xs text-zinc-400 uppercase tracking-wider mb-1 font-semibold">
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

      {/* Tabs - Pill style with sliding indicator */}
      <Tabs value={currentTabValue} onValueChange={(val) => onTabChange(`report-${val}`)}>
        <TabsList className="w-full lg:w-auto">
          <TabsTrigger value="escape" icon={<DoorOpen size={16} />}>
            <span className="hidden sm:inline">Lối thoát nạn</span>
            <span className="sm:hidden">Thoát nạn</span>
          </TabsTrigger>
          <TabsTrigger value="fire" icon={<Flame size={16} />}>
            <span className="hidden sm:inline">Ngăn cháy lan</span>
            <span className="sm:hidden">Cháy lan</span>
          </TabsTrigger>
          <TabsTrigger value="traffic" icon={<Truck size={16} />}>
            <span className="hidden sm:inline">Giao thông CC</span>
            <span className="sm:hidden">Giao thông</span>
          </TabsTrigger>
          <TabsTrigger value="tech" icon={<Wrench size={16} />}>
            <span className="hidden sm:inline">Hệ thống kỹ thuật</span>
            <span className="sm:hidden">Kỹ thuật</span>
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

      <CitationList citations={complianceData.citations} />
    </div>
  )
}
