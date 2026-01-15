import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, AlertCircle } from "lucide-react"
import { Textarea } from "../ui/Textarea"

interface InputViewProps {
  onSubmit: (description: string) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

// Loading status messages to cycle through
const loadingMessages = [
  "AI đang phân tích công trình",
  "Đang trích xuất thông số kỹ thuật",
  "Đang tra cứu quy chuẩn PCCC",
  "Đang đánh giá giải pháp thoát nạn",
  "Đang kiểm tra ngăn cháy lan",
  "Đang xác định hệ thống kỹ thuật",
  "Đang tổng hợp kết quả phân tích"
]

export function InputView({ onSubmit, isLoading = false, error }: InputViewProps) {
  const [description, setDescription] = useState(
    "Toà nhà chung cư 25 tầng, diện tích sàn 1000m2 ở Hà Nội."
  )
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [dots, setDots] = useState("")
  const [isHovered, setIsHovered] = useState(false)

  // Animate dots during loading
  useEffect(() => {
    if (!isLoading) {
      setDots("")
      setLoadingMessageIndex(0)
      return
    }

    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".")
    }, 400)

    return () => clearInterval(dotsInterval)
  }, [isLoading])

  // Cycle through loading messages - stop at final message
  useEffect(() => {
    if (!isLoading) return

    // If already at last message, don't start interval
    if (loadingMessageIndex >= loadingMessages.length - 1) return

    const messageInterval = setInterval(() => {
      setLoadingMessageIndex(prev => {
        const next = prev + 1
        // Stop at the last message
        if (next >= loadingMessages.length - 1) {
          clearInterval(messageInterval)
          return loadingMessages.length - 1
        }
        return next
      })
    }, 4000)

    return () => clearInterval(messageInterval)
  }, [isLoading, loadingMessageIndex])

  const handleSubmit = async () => {
    if (description.trim()) {
      await onSubmit(description)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 lg:space-y-10 h-[calc(100vh-10rem)] lg:h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
      {/* Header */}
      <div className="space-y-4 animate-fade-in-up text-center">
        <h1 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900">
          Mô tả Công trình
        </h1>
        <p className="text-zinc-500 text-lg max-w-xl mx-auto">
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

      {/* Input Area - Clean / No Box */}
      <div className="relative animate-fade-in-up stagger-1 group w-full">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-3xl -z-10 transition-colors group-hover:bg-white/60" />
        <Textarea 
          value={isLoading ? "" : description}
          onChange={(e) => setDescription(e.target.value)}
          className={`min-h-[200px] lg:min-h-[280px] w-full border-0 resize-none text-lg lg:text-xl leading-relaxed p-6 lg:p-8 focus:ring-0 bg-transparent text-zinc-800 ${
            isLoading 
              ? "placeholder:text-orange-500/70 placeholder:font-medium" 
              : "placeholder:text-zinc-300"
          }`}
          placeholder={isLoading ? `${loadingMessages[loadingMessageIndex]}${dots}` : "Mô tả công trình của bạn..."}
          disabled={isLoading}
        />
        
      {/* Submit Button - Morphing circle to pill */}
      <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8">
        <motion.button
          onClick={handleSubmit}
          disabled={isLoading || !description.trim()}
          animate={{ width: isHovered ? 130 : 64 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
          className={`
            h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white 
            shadow-lg shadow-orange-500/30 
            flex items-center justify-center gap-2 overflow-hidden cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-7 h-7 border-[3px] border-white/90 border-t-transparent rounded-full"
            />
          ) : (
            <>
              <Play className="fill-white w-7 h-7 shrink-0" strokeWidth={0} />
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="font-heading font-bold text-lg whitespace-nowrap overflow-hidden pr-1"
                  >
                    Gửi
                  </motion.span>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.button>
      </div>
      </div>
    </div>
  )
}


