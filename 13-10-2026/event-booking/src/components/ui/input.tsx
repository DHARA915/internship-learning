import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // Default styles
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none transition-colors md:text-sm",

        // Placeholder
        "placeholder:text-muted-foreground",

        // Focus
        "focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring",

        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

        // Error
        "aria-invalid:border-danger aria-invalid:ring-0",
        "aria-invalid:focus-visible:border-danger aria-invalid:focus-visible:ring-1 aria-invalid:focus-visible:ring-danger",

        // Preserve custom classes passed by InputField
        className
      )}
      {...props}
    />
  );
}

export { Input };
