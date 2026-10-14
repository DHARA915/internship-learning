
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
//   SelectGroup
// } from "../../ui/select";
// import { FieldWrapper } from "../Fieldwrapper ";
// import type { SelectFieldProps } from "./Types";

// const inputCls =
//   " rounded-lg border border-line bg-primary text-foreground placeholder:text-tertiary";

// export function SelectField({
//   name,
//   label,
//   value,
//   onChange,
//   options,
//   placeholder = "Select an option",
//   error,
//   helperText,
//   required,
//   disabled,
//   className,
// }: SelectFieldProps) {

//   return (
//     <FieldWrapper
//       {...{
//         name,
//         label,
//         required,
//         error,
//         helperText,
//         className,
//       }}
//     >
//       <Select
//         name={name}
//         value={value || undefined}
      
//         disabled={disabled}
//          items={options.map(({ label, value }) => ({ label, value }))}  
//         onValueChange={(v) => onChange?.(v ?? "", name)}
       
//       >
//         <SelectTrigger
//           id={name}
//           aria-invalid={!!error}
//           className={`${inputCls} w-full`}
//         >
//           <SelectValue placeholder={placeholder} />
//         </SelectTrigger>

//         <SelectContent className="rounded-lg border-line text-black" alignItemWithTrigger={true}>
//            <SelectGroup>
//           {options.map((o) => (
//             <SelectItem
//               key={o.value}
//               value={o.value}
//               disabled={o.disabled}
//               className="cursor-pointer focus:row-dull focus:text-primary"
//             >
//               {o.label}
//             </SelectItem>
//           ))}
//           </SelectGroup>
//         </SelectContent>
//       </Select>
//     </FieldWrapper>
//   );
// }

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { FieldWrapper } from "../Fieldwrapper ";
import type { SelectFieldProps } from "./Types";

export function SelectField({
  name,
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  helperText,
  required,
  disabled,
  className,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);

  // close the dropdown when the page scrolls (scrolling inside the list is ignored)
  useEffect(() => {
    if (!open) return;

    const close = (e: Event) => {
      if (
        e.target instanceof Element &&
        e.target.closest('[data-slot="select-content"]')
      ) {
        return;
      }
      setOpen(false);
    };

    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [open]);

  return (
    <FieldWrapper {...{ name, label, required, error, helperText, className }}>
      <Select
        name={name}
        value={value || null}
        disabled={disabled}
        open={open}
        onOpenChange={setOpen}
        items={options.map(({ label, value }) => ({ label, value }))}
        onValueChange={(v) => onChange?.(v ?? "", name)}
      >
        <SelectTrigger
          id={name}
          aria-invalid={!!error}
          className="w-full rounded-lg border-line bg-primary text-foreground"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent alignItemWithTrigger={false} className="rounded-lg border-line">
          {options.map((o) => (
            <SelectItem
              key={o.value}
              value={o.value}
              disabled={o.disabled}
              className="cursor-pointer"
            >
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}