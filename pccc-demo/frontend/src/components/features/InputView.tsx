import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, AlertCircle } from "lucide-react"
import { Textarea } from "../ui/Textarea"

interface InputViewProps {
  onSubmit: (description: string) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

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
    <div className="max-w-3xl mx-auto space-y-8 lg:space-y-10 min-h-[calc(100vh-14rem)] flex flex-col justify-center">
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
      <div className="relative animate-fade-in-up stagger-1 group">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-3xl -z-10 transition-colors group-hover:bg-white/60" />
        <Textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[200px] lg:min-h-[280px] w-full border-0 resize-none text-lg lg:text-xl leading-relaxed p-6 lg:p-8 focus:ring-0 bg-transparent placeholder:text-zinc-300 text-zinc-800"
          placeholder="Mô tả công trình của bạn..."
          disabled={isLoading}
        />
        
      {/* Submit Button - Morphing */}
      <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8">
        <motion.button
          onClick={handleSubmit}
          disabled={isLoading || !description.trim()}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          layout
          className={`
            relative h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/30 
            flex items-center justify-center overflow-hidden
            disabled:opacity-50 disabled:cursor-not-allowed
            min-w-[4rem]
          `}
        >
          {/* Background and Shadow Pulse */}
          {!isLoading && !description.trim() ? null : (
             <motion.div 
               className="absolute inset-0"
               initial={{ opacity: 0 }}
               whileHover={{ opacity: 1 }}
             />
          )}

          <AnimatePresence mode="popLayout" initial={false}>
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
                className="px-4" // Fixed padding for loader
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-7 h-7 border-[3px] border-white/90 border-t-transparent rounded-full"
                />
              </motion.div>
            ) : (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout 
                className="flex items-center px-5 h-full"
              >
                <Play className="fill-white w-7 h-7" strokeWidth={0} />
                <motion.span
                  style={{ width: 0, opacity: 0, marginLeft: 0 }}
                  variants={{
                    initial: { width: 0, opacity: 0, marginLeft: 0 },
                    hover: { width: "auto", opacity: 1, marginLeft: 8 },
                  }}
                  className="font-heading font-bold text-lg whitespace-nowrap overflow-hidden"
                >
                  Gửi
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
      </div>
    </div>
  )
}


