import { tv } from "tailwind-variants";
import { twMerge } from 'tailwind-merge'

const button = tv({
  base: [
    "rounded-md font-medium transition-colors",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
    "disabled:cursor-not-allowed disabled:opacity-40",
  ],
  variants: {
    variant: {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50",
      danger: "border border-red-200 text-red-600 hover:bg-red-50",
      ghost: "text-gray-400 hover:bg-gray-100 hover:text-gray-600",
      dashed: "border border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700",
      list: "font-normal text-left text-gray-700 hover:bg-gray-100 active:bg-gray-200",
    },
    size: {
      sm: "px-2.5 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      icon: "p-1 text-sm leading-none",
      list: "w-full px-2 py-1.5 text-sm",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  defaultVariants: {
    variant: "secondary",
    size: "md",
    fullWidth: false,
  },
});

export function Button({ variant, size, fullWidth, className, ...rest }) {
  return (
    <button
      className={button({ variant, size, fullWidth, className })} 
      {...rest}
    />
  );
}