"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "cn"
import { CheckIcon } from "lucide-react"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none group-has-disabled/field:opacity-50 group-has-[:focus-visible]/field-label:ring-0 group-has-[:focus-visible]/field-label:not-data-checked:border-input after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground group-has-[:focus-visible]/field-label:data-checked:border-primary dark:data-checked:bg-primary",

          "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-line bg-transparent transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50 group-has-disabled/field:opacity-50",

  // focus: border goes a little darker, thin ring
  "focus-visible:outline-none focus-visible:border-line-strong focus-visible:ring-1 focus-visible:ring-line-strong",

  // error: red border
  "aria-invalid:border-danger aria-invalid:ring-0",

  // error + focus: stays red, thin red ring
  "aria-invalid:focus-visible:border-danger aria-invalid:focus-visible:ring-1 aria-invalid:focus-visible:ring-danger",

  // checked
  "data-checked:border-button-primary data-checked:bg-button-primary data-checked:text-on-brand",

  // checked + error: keep the checked look
  "aria-invalid:data-checked:border-button-primary",


        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
