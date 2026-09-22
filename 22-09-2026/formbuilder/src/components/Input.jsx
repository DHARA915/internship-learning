import { tv } from "tailwind-variants";

const inputStyles = tv({
  base: "outline-none transition",

  variants: {
    inputType: {
      default: [
        "w-full",
        "rounded-md",
        "border",
        "border-gray-300",
        "px-2.5",
        "py-1.5",
        "text-sm",
        "text-gray-900",
        "placeholder:text-gray-400",
        "focus:border-blue-500",
        "focus:ring-2",
        "focus:ring-blue-500",
      ],

      radio: [
        "h-4",
        "w-4",
        "border-gray-300",
        "text-blue-600",
        "focus:ring-blue-500",
      ],

      checkbox: [
        "h-4",
        "w-4",
        "rounded",
        "border-gray-300",
        "text-blue-600",
        "focus:ring-blue-500",
      ],
    },

    error: {
      true: [
        "border-red-500",
        "focus:border-red-500",
        "focus:ring-red-500",
      ],
    },
  },

  defaultVariants: {
    inputType: "default",
    error: false,
  },
});

const  Input = ({type = "text",
  error = false,className,...props}) => 
    {
  const inputType =
    type === "radio" || type === "checkbox"
      ? type
      : "default";

  return (
    <input
      type={type}
      className={inputStyles({
        inputType,
        error,
        className,
      })}
      {...props}
    />
  );
}

export default Input;