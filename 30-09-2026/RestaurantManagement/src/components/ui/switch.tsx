import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "cn"

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer relative inline-flex h-6 w-10 shrink-0 items-center rounded-full  outline-none transition-colors",
        "data-checked:bg-neutral-200 data-unchecked:bg-neutral-700",
        "focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-[18px] rounded-full transition-transform",
          "data-checked:translate-x-5 data-checked:bg-neutral-900",
          "data-unchecked:translate-x-0 data-unchecked:bg-neutral-200"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }