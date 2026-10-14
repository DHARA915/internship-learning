import { cn } from "cn";

type Step = {
  label: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

type StepperProps = {
  step: number;
  STEPS: Step[];
};

const Stepper = ({ step, STEPS }: StepperProps) => (
  <ol className="mb-5 flex items-center gap-2">
    {STEPS.map(({ label }, index) => (
      <li key={label} className="flex flex-1 flex-col gap-1.5">
        <span
          className={cn(
            "h-1.5 rounded-full",
            index <= step ? "bg-button-primary" : "bg-line",
          )}
        />
        <span
          className={cn(
            "text-xs font-medium",
            index === step
              ? "text-foreground"
              : "text-muted-foreground",
          )}
        >
          {label}
        </span>
      </li>
    ))}
  </ol>
);

export default Stepper