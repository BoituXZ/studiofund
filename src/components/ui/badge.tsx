import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center h-6 px-2.5 rounded-md text-xs font-semibold uppercase tracking-wide border-0 transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 text-primary hover:bg-primary/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
        success:
          "bg-success/10 text-success hover:bg-success/20",
        warning:
          "bg-warning/15 text-amber-700 hover:bg-warning/25", /* Warning foreground is usually black, so this might be high contrast. If warning-foreground is white, this is bad. Let's use a specific class or text-amber-700 */
        info:
          "bg-info/10 text-info hover:bg-info/20",
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
