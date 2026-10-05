import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      // className={cn(
      //   "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors focus-visible:border-line-focus focus-visible:ring-0 aria-invalid:focus-visible:border-danger  outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
      //   className
      // )}
      className={cn(
  "h-8 w-full min-w-0 rounded-lg border border-line bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground md:text-sm",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

  // focus: border goes a little darker
  "focus-visible:outline-none focus-visible:border-c focus-visible:ring-1 focus-visible:ring-line-strong",

  // error: red border
  "aria-invalid:border-danger aria-invalid:ring-0",

  // error + focus: stays red, thin red ring shows it is focused
  "aria-invalid:focus-visible:border-danger aria-invalid:focus-visible:ring-1 aria-invalid:focus-visible:ring-danger",

  className
)}
      {...props}
    />
  )
}

export { Input }
