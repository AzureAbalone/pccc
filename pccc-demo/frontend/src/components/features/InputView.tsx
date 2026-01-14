import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Sparkles, Search, FileCheck, AlertCircle } from "lucide-react"
import { Button } from "../ui/Button"
import { Textarea } from "../ui/Textarea"
import { Card } from "../ui/Card"

interface InputViewProps {
  onSubmit: (description: string) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

const features = [
  { icon: Sparkles, text: "Tự động trích xuất thông số", color: "text-amber-500" },
  { icon: Search, text: "Tra cứu TCVN/QCVN", color: "text-blue-500" },
  { icon: FileCheck, text: "Đề xuất giải pháp tối ưu", color: "text-emerald-500" },
]

export function InputView({ onSubmit, isLoading = false, error }: InputViewProps) {
  const [description, setDescription] = useState(
    "Toà nhà chung cư 25 tầng, diện tích sàn 1000m2 ở Hà Nội."
  )

  const handleSubmit = async () => {
    if (description.trim()) {
      await onSubmit(description)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="space-y-2 animate-fade-in-up">
        <h1 className="font-heading text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900">
          Mô tả Công trình
        </h1>
        <p className="text-zinc-500 text-sm lg:text-base">
          Nhập thông tin chi tiết về dự án để hệ thống phân tích và đề xuất giải pháp PCCC phù hợp.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200/50 text-red-700"
        >
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      {/* Input Card */}
      <Card className="p-1 animate-fade-in-up stagger-1 hover:shadow-lg">
        <div className="relative">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[200px] lg:min-h-[280px] border-0 resize-none text-base lg:text-lg leading-relaxed p-4 lg:p-6 focus:ring-0 bg-transparent placeholder:text-zinc-400"
            placeholder="Mô tả công trình của bạn..."
            disabled={isLoading}
          />

          {/* Submit Button */}
          <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6">
            <Button
              size="icon"
              onClick={handleSubmit}
              disabled={isLoading || !description.trim()}
              className="h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200/60 transition-all hover:scale-105 hover:shadow-xl hover:shadow-orange-200/70 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Phân tích công trình"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 lg:w-6 lg:h-6 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Play className="ml-0.5 fill-white" size={20} />
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Features Grid - Responsive */}
      {/* Features Grid - Responsive */}
      <div className="flex overflow-x-auto pb-4 gap-3 md:grid md:grid-cols-3 md:pb-0 lg:gap-4 snap-x snap-mandatory hide-scrollbar">
        {features.map((feature, i) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={i}
              className="flex items-center gap-3 p-3 lg:p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-zinc-200/50 shadow-sm hover:shadow-md hover:border-zinc-300/50 transition-all cursor-pointer group min-w-[240px] md:min-w-0 snap-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <div className={cn(
                "w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
                "bg-zinc-100 group-hover:bg-zinc-50",
                feature.color
              )}>
                <Icon size={16} className="lg:w-[18px] lg:h-[18px]" />
              </div>
              <span className="text-xs lg:text-sm text-zinc-600 font-medium group-hover:text-zinc-800 whitespace-nowrap md:whitespace-normal">{feature.text}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}
