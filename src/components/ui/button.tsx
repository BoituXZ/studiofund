import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-body font-semibold ring-offset-background transition-premium focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-border disabled:text-muted-foreground tap-feedback [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground rounded-xl shadow-[0_2px_8px_rgba(0,61,165,0.2)] hover:bg-primary-hover hover:shadow-[0_4px_12px_rgba(0,61,165,0.3)] active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground rounded-xl shadow-[0_2px_8px_rgba(255,59,48,0.2)] hover:bg-destructive/90 hover:shadow-[0_4px_12px_rgba(255,59,48,0.3)] active:scale-[0.98]",
        outline:
          "border-2 border-primary bg-transparent text-primary rounded-xl hover:bg-primary/[0.04] active:bg-primary/[0.08]",
        secondary:
          "bg-surface text-foreground rounded-xl hover:bg-muted active:bg-muted/80",
        ghost: "bg-transparent text-primary rounded-lg hover:bg-primary/[0.04] active:bg-primary/[0.08]",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-[52px] px-6",
        sm: "h-[44px] px-4 text-body-sm rounded-lg",
        lg: "h-[56px] px-8 text-body-lg rounded-xl",
        icon: "h-[52px] w-[52px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
