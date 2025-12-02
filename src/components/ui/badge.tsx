import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center h-6 px-2.5 rounded-md text-xs font-semibold uppercase tracking-wide border-0 transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-primary/[0.06] text-primary",
        secondary:
          "bg-[#F4F5F7] text-[#6B778C]",
        destructive:
          "bg-[#FFEBE9] text-[#DE350B]",
        success:
          "bg-[#E6F9F3] text-[#00875A]",
        warning:
          "bg-[#FFF4E6] text-[#FF991F]",
        info:
          "bg-[#E6F2FF] text-[#0052CC]",
        outline: "border border-border text-foreground bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
