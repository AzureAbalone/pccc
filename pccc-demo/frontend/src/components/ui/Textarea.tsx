import * as React from "react"
import { cn } from "../../lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base shadow-sm transition-all",
        "placeholder:text-zinc-400 text-zinc-900",
        "focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
