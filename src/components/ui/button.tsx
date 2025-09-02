import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-poppins",
        hero: "bg-coton-black text-white hover:bg-coton-black/90 shadow-card rounded-lg font-poppins font-medium",
        rose: "bg-coton-rose text-coton-black hover:bg-coton-rose/80 rounded-lg font-poppins",
        outline: "border-2 border-coton-black bg-transparent text-coton-black hover:bg-coton-black hover:text-white rounded-lg font-poppins",
        pill: "bg-coton-rose text-coton-black hover:bg-coton-rose/80 rounded-pill font-roboto text-sm",
        coin: "bg-gradient-rose text-coton-black hover:shadow-soft rounded-lg font-poppins font-medium",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg font-poppins",
        premium: "bg-gradient-hero text-white hover:shadow-soft rounded-lg font-poppins font-medium",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg font-poppins",
        link: "text-primary underline-offset-4 hover:underline font-roboto",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-9 rounded-md px-4 text-sm",
        lg: "h-14 rounded-lg px-8 text-lg",
        icon: "h-12 w-12",
        pill: "h-8 px-4 text-sm",
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
