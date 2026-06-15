import {
  forwardRef,
  InputHTMLAttributes,
} from "react"

import { cn } from "@/lib/utils"

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<
  HTMLInputElement,
  InputProps
>(
  (
    { label, error, className, ...props },
    ref
  ) => {
    return (
      <div>
        {label && (
          <label className="mb-2 block text-sm font-medium text-muted-foreground">
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-border bg-muted px-4 py-3 text-foreground outline-none transition focus:border-ring",
            error && "border-destructive",
            className
          )}
          {...props}
        />

        {error && (
          <p className="mt-1 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
