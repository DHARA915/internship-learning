import { tv } from "tailwind-variants";

const buttonStyles = tv({
  base: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline:
        "border border-border bg-background text-foreground hover:bg-secondary",
      ghost:
        "text-foreground hover:bg-secondary",
    },
    size: {
      sm: "px-3 py-1.5",
      md: "px-4 py-2",
      lg: "px-5 py-2.5",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

const Button = ({ variant, size, className, children, ...props }) => {
  return (
    <button
      className={buttonStyles({ variant, size, className })}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;