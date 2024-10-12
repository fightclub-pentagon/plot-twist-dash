import { cn } from "@/lib/utils"

export function VisuallyHidden({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("sr-only", className)}
      {...props}
    />
  )
}
