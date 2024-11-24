import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:bg-neutral-100 disabled:from-neutral-600 disabled:to-neutral-100 disabled:text-neutral-300 dark:disabled:bg-neutral-900 dark:disabled:from-neutral-400 dark:disabled:to-neutral-900 dark:disabled:text-neutral-700 border border-neutral-200 dark:border-neutral-800 shadow-small",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-blue-600 to-blue-700 text-black dark:text-white hover:from-blue-700 hover:to-blue-700",
        destructive:
          "bg-gradient-to-b from-amber-600 to-amber-700 text-destructive-foreground hover:from-amber-700 hover:to-amber-700",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-background text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900",
        ghost:
          "border-transparent shadow-none hover:bg-accent hover:text-accent-foreground dark:border-transparent",
        muted:
          "bg-neutral-200 text-neutral-600 hover:bg-neutral-200/80 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900/80",
        teritary:
          "bg-blue-100 text-blue-600 border-transparent hover:bg-blue-200 shadow-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        xs: "h-7 rounded-md px-2 text-xs",
        lg: "h-12 rounded-md px-8",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
