import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transform-gpu will-change-transform",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] hover:shadow-elegant rounded-xl font-poppins backdrop-blur-sm",
        cta: "bg-cta-primary text-cta-primary-foreground hover:bg-cta-primary/90 hover:scale-[1.02] shadow-elegant hover:shadow-premium rounded-xl font-poppins font-semibold",
        hero: "bg-gradient-to-r from-coton-black to-coton-nude text-coton-beige-light hover:from-coton-black/90 hover:to-coton-nude/90 hover:scale-[1.02] shadow-elegant hover:shadow-premium rounded-xl font-poppins font-medium",
        rose: "bg-gradient-to-r from-coton-rose to-coton-rose-alt text-coton-black hover:from-coton-rose/90 hover:to-coton-rose-alt/90 hover:scale-[1.02] shadow-card hover:shadow-elegant rounded-xl font-poppins",
        outline: "border-2 border-coton-black bg-transparent text-coton-black hover:bg-coton-black hover:text-coton-beige-light hover:scale-[1.02] hover:shadow-card rounded-xl font-poppins backdrop-blur-sm",
        soft: "bg-coton-beige-light/80 text-coton-black hover:bg-coton-beige hover:scale-[1.02] border border-coton-rose/30 hover:border-coton-rose/50 rounded-xl font-poppins backdrop-blur-sm shadow-soft",
        pill: "bg-gradient-to-r from-coton-rose to-coton-rose-alt text-coton-black hover:from-coton-rose/90 hover:to-coton-rose-alt/90 hover:scale-[1.05] rounded-pill font-roboto text-sm shadow-card",
        coin: "bg-gradient-rose text-coton-black hover:shadow-glow hover:scale-[1.05] rounded-xl font-poppins font-medium",
        ghost: "hover:bg-coton-rose/20 hover:text-coton-black hover:scale-[1.02] rounded-xl backdrop-blur-sm",
        destructive: "bg-gradient-to-r from-coton-coral to-red-400 text-coton-beige-light hover:from-coton-coral/90 hover:to-red-400/90 hover:scale-[1.02] shadow-card hover:shadow-elegant rounded-xl font-poppins",
        premium: "bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-white hover:from-amber-500 hover:via-yellow-600 hover:to-orange-600 hover:scale-[1.02] shadow-elegant hover:shadow-premium rounded-xl font-poppins font-semibold",
        secondary: "bg-gradient-to-r from-coton-nude-light to-coton-nude text-coton-black hover:from-coton-nude-light/90 hover:to-coton-nude/90 hover:scale-[1.02] shadow-card rounded-xl font-poppins",
        link: "text-coton-black underline-offset-4 hover:underline font-roboto hover:text-coton-coral hover:scale-[1.02]",
        nude: "bg-gradient-to-r from-coton-nude to-coton-nude-light text-coton-black hover:from-coton-nude/90 hover:to-coton-nude-light/90 hover:scale-[1.02] shadow-card rounded-xl font-poppins",
        black: "bg-black text-white hover:bg-black/90 hover:scale-[1.02] shadow-card hover:shadow-elegant rounded-xl font-poppins",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-10 rounded-xl px-4 text-sm",
        lg: "h-16 rounded-xl px-8 text-lg font-semibold",
        icon: "h-12 w-12 rounded-xl",
        pill: "h-9 px-5 text-sm rounded-pill",
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
