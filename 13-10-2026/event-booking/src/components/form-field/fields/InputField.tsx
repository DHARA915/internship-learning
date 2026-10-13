// import { useState } from "react";
// import { Eye, EyeOff, Search } from "lucide-react";
// import { Input } from "../../ui/input";
// import { FieldWrapper } from "../Fieldwrapper ";
// import type { InputFieldProps, InputType } from "./Types";

// const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// const DEFAULT_PLACEHOLDER: Partial<Record<InputType, string>> = {
//   email: "you@example.com",
//   tel: "9876543210",
//   url: "https://example.com",
// };

// const AUTOCOMPLETE: Partial<Record<InputType, string>> = {
//   email: "email",
//   password: "current-password",
//   tel: "tel",
//   url: "url",
// };

// const INPUT_MODE: Partial<
//   Record<InputType, "email" | "numeric" | "decimal" | "url">
// > = {
//   email: "email",
//   tel: "numeric",
//   number: "decimal",
//   url: "url",
// };

// export function InputField({
//   name,
//   label,
//   type = "text",
//   value = "",
//   onChange,
//   onBlur,
//   placeholder,
//   error: externalError,
//   helperText,
//   required,
//   disabled,
//   className,
//   validate = true,
//   onValidate,
//   minLength,
//   maxLength,
//   min,
//   max,
//   step,
//   requireStrong = false,
// }: InputFieldProps) {
//   const [showPassword, setShowPassword] = useState(false);
//   const [touched, setTouched] = useState(false);
//   const [internalError, setInternalError] = useState<string>();

//   const isPassword = type === "password";
//   const isSearch = type === "search";
//   const error = externalError ?? internalError;

//   // phone defaults to exactly 10 digits
//   const phoneMin = minLength ?? 10;
//   const phoneMax = maxLength ?? 10;

//   /** returns an error message or undefined */
//   const check = (v: string): string | undefined => {
//     if (v === "")
//       return required ? `${label ?? "This field"} is required` : undefined;

//     switch (type) {
//       case "email":
//         return EMAIL_RE.test(v) ? undefined : "Enter a valid email address";

//       case "tel":
//         if (!/^\d+$/.test(v)) return "Phone number can contain digits only";
//         if (v.length < phoneMin || v.length > phoneMax)
//           return phoneMin === phoneMax
//             ? `Phone number must be ${phoneMin} digits`
//             : `Phone number must be ${phoneMin}-${phoneMax} digits`;
//         return;

//       case "url":
//         try {
//           const u = new URL(v);
//           return u.protocol === "http:" || u.protocol === "https:"
//             ? undefined
//             : "URL must start with http:// or https://";
//         } catch {
//           return "Enter a valid URL (e.g. https://example.com)";
//         }

//       case "password": {
//         const len = minLength ?? 8;
//         if (v.length < len)
//           return `Password must be at least ${len} characters`;
//         if (requireStrong) {
//           if (!/[A-Z]/.test(v)) return "Add at least one uppercase letter";
//           if (!/[a-z]/.test(v)) return "Add at least one lowercase letter";
//           if (!/\d/.test(v)) return "Add at least one number";
//           if (!/[^A-Za-z0-9]/.test(v))
//             return "Add at least one special character";
//         }
//         return;
//       }

//       case "number": {
//         const n = Number(v);
//         if (Number.isNaN(n)) return "Enter a valid number";
//         if (min !== undefined && n < min)
//           return `Value must be at least ${min}`;
//         if (max !== undefined && n > max) return `Value must be at most ${max}`;
//         return;
//       }

//       case "time":
//         // native time inputs give "HH:mm" (24h)
//         return /^([01]\d|2[0-3]):[0-5]\d$/.test(v)
//           ? undefined
//           : "Enter a valid time";

//       default: // text
//         if (minLength !== undefined && v.length < minLength)
//           return `Must be at least ${minLength} characters`;
//         if (maxLength !== undefined && v.length > maxLength)
//           return `Must be at most ${maxLength} characters`;
//     }
//   };

//   const runValidation = (v: string) => {
//     if (!validate) return;
//     const err = check(v);
//     setInternalError(err);
//     onValidate?.(err, name);
//   };

//   // for preventing scroll while number type
//   const preventWheel = (e: WheelEvent) => e.preventDefault();

//   const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
//     if (type === "number") {
//       e.currentTarget.addEventListener("wheel", preventWheel, {
//         passive: false,
//       });
//     }
//   };

//   /** clean the value while typing, depending on type */
//   const sanitize = (raw: string) => {
//     if (type === "tel") return raw.replace(/\D/g, "").slice(0, phoneMax); // digits only
//     if (type === "email" || type === "url") return raw.trim();
//     return raw;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const next = sanitize(e.target.value);
//     onChange?.(next, name);
//     if (touched) runValidation(next); // after first blur, validate live
//   };

//   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
//     e.currentTarget.removeEventListener("wheel", preventWheel);
//     setTouched(true);
//     runValidation(e.target.value);
//     onBlur?.();
//   };

//   return (
//     <FieldWrapper {...{ name, label, required, error, helperText, className }}>
//       <div className="relative">
//         <Input
//           id={name}
//           name={name}
//           type={isPassword && showPassword ? "text" : type}
//           value={value}
//           placeholder={placeholder ?? DEFAULT_PLACEHOLDER[type]}
//           disabled={disabled}
//           inputMode={INPUT_MODE[type]}
//           autoComplete={AUTOCOMPLETE[type]}
//           maxLength={
//             type === "text" || type === "tel"
//               ? type === "tel"
//                 ? phoneMax
//                 : maxLength
//               : undefined
//           }
//           min={type === "number" ? min : undefined}
//           max={type === "number" ? max : undefined}
//           step={type === "number" || type === "time" ? step : undefined}
//           className={isPassword ? "pr-10" : isSearch ? "pl-9" : undefined}
//           aria-invalid={!!error}
//           aria-describedby={error ? `${name}-error` : undefined}
//           onFocus={handleFocus}
//           onChange={handleChange}
//           onBlur={handleBlur}
//         />

//         {isSearch && (
//           <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
//         )}

//         {isPassword && (
//           <button
//             type="button"
//             disabled={disabled}
//             onClick={() => setShowPassword((s) => !s)}
//             aria-label={showPassword ? "Hide password" : "Show password"}
//             className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
//           >
//             {showPassword ? (
//               <Eye className="size-4" />
//             ) : (
//               <EyeOff className="size-4" />
//             )}
//           </button>
//         )}
//       </div>
//     </FieldWrapper>
//   );
// }
import { useState } from "react";
import { Eye, EyeOff, Search } from "lucide-react";
import { Input } from "../../ui/input";
import { FieldWrapper } from "../Fieldwrapper ";
import type { InputFieldProps, InputType } from "./Types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const DEFAULT_PLACEHOLDER: Partial<Record<InputType, string>> = {
  email: "you@example.com",
  tel: "9876543210",
  url: "https://example.com",
};

const AUTOCOMPLETE: Partial<Record<InputType, string>> = {
  email: "email",
  password: "current-password",
  tel: "tel",
  url: "url",
};

const INPUT_MODE: Partial<
  Record<InputType, "email" | "numeric" | "decimal" | "url">
> = {
  email: "email",
  tel: "numeric",
  number: "decimal",
  url: "url",
};

export function InputField({
  name,
  label,
  type = "text",
  value = "",
  onChange,
  onBlur,
  placeholder,
  error: externalError,
  helperText,
  required,
  disabled,
  className,
  validate = true,
  onValidate,
  minLength,
  maxLength,
  min,
  max,
  step,
  requireStrong = false,
}: InputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [internalError, setInternalError] = useState<string>();

  const isPassword = type === "password";
  const isSearch = type === "search";

  // `||` (not `??`) so an empty-string error from the parent doesn't hide the internal one
  const error = externalError || internalError;

  // phone defaults to exactly 10 digits
  const phoneMin = minLength ?? 10;
  const phoneMax = maxLength ?? 10;

  /** returns an error message or undefined */
  const check = (fieldValue: string): string | undefined => {
    if (fieldValue === "")
      return required ? `${label ?? "This field"} is required` : undefined;

    switch (type) {
      case "email":
        return EMAIL_RE.test(fieldValue)
          ? undefined
          : "Enter a valid email address";

      case "tel":
        if (!/^\d+$/.test(fieldValue))
          return "Phone number can contain digits only";
        if (fieldValue.length < phoneMin || fieldValue.length > phoneMax)
          return phoneMin === phoneMax
            ? `Phone number must be ${phoneMin} digits`
            : `Phone number must be ${phoneMin}-${phoneMax} digits`;
        return;

      case "url":
        try {
          const parsedUrl = new URL(fieldValue);
          return parsedUrl.protocol === "http:" ||
            parsedUrl.protocol === "https:"
            ? undefined
            : "URL must start with http:// or https://";
        } catch {
          return "Enter a valid URL (e.g. https://example.com)";
        }

      case "password": {
        const minPasswordLength = minLength ?? 8;
        if (fieldValue.length < minPasswordLength)
          return `Password must be at least ${minPasswordLength} characters`;
        if (requireStrong) {
          if (!/[A-Z]/.test(fieldValue))
            return "Add at least one uppercase letter";
          if (!/[a-z]/.test(fieldValue))
            return "Add at least one lowercase letter";
          if (!/\d/.test(fieldValue)) return "Add at least one number";
          if (!/[^A-Za-z0-9]/.test(fieldValue))
            return "Add at least one special character";
        }
        return;
      }

      case "number": {
        const parsedNumber = Number(fieldValue);
        if (Number.isNaN(parsedNumber)) return "Enter a valid number";
        if (min !== undefined && parsedNumber < min)
          return `Value must be at least ${min}`;
        if (max !== undefined && parsedNumber > max)
          return `Value must be at most ${max}`;
        return;
      }

      case "date": {
        // native date inputs give "YYYY-MM-DD"
        const parsedDate = new Date(`${fieldValue}T00:00:00`);
        return DATE_RE.test(fieldValue) && !Number.isNaN(parsedDate.getTime())
          ? undefined
          : "Enter a valid date";
      }

      case "time":
        // native time inputs give "HH:mm" (24h)
        return TIME_RE.test(fieldValue) ? undefined : "Enter a valid time";

      default: // text
        if (minLength !== undefined && fieldValue.length < minLength)
          return `Must be at least ${minLength} characters`;
        if (maxLength !== undefined && fieldValue.length > maxLength)
          return `Must be at most ${maxLength} characters`;
    }
  };

  const runValidation = (fieldValue: string) => {
    if (!validate) return;
    const errorMessage = check(fieldValue);
    setInternalError(errorMessage);
    onValidate?.(errorMessage, name);
  };

  // for preventing scroll while number type
  const preventWheel = (wheelEvent: WheelEvent) => wheelEvent.preventDefault();

  const handleFocus = (focusEvent: React.FocusEvent<HTMLInputElement>) => {
    if (type === "number") {
      focusEvent.currentTarget.addEventListener("wheel", preventWheel, {
        passive: false,
      });
    }
  };

  /** clean the value while typing, depending on type */
  const sanitize = (rawValue: string) => {
    if (type === "tel") return rawValue.replace(/\D/g, "").slice(0, phoneMax); // digits only
    if (type === "email" || type === "url") return rawValue.trim();
    return rawValue;
  };

  const handleChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = sanitize(changeEvent.target.value);
    onChange?.(nextValue, name);
    if (isTouched) runValidation(nextValue); // after first blur, validate live
  };

  const handleBlur = (blurEvent: React.FocusEvent<HTMLInputElement>) => {
    blurEvent.currentTarget.removeEventListener("wheel", preventWheel);
    setIsTouched(true);
    runValidation(blurEvent.target.value);
    onBlur?.();
  };

  return (
    <FieldWrapper {...{ name, label, required, error, helperText, className }}>
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={isPassword && isPasswordVisible ? "text" : type}
          value={value}
          placeholder={placeholder ?? DEFAULT_PLACEHOLDER[type]}
          disabled={disabled}
          inputMode={INPUT_MODE[type]}
          autoComplete={AUTOCOMPLETE[type]}
          maxLength={
            type === "text" || type === "tel"
              ? type === "tel"
                ? phoneMax
                : maxLength
              : undefined
          }
          min={type === "number" ? min : undefined}
          max={type === "number" ? max : undefined}
          step={type === "number" || type === "time" ? step : undefined}
          className={isPassword ? "pr-10" : isSearch ? "pl-9" : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          onFocus={handleFocus}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {isSearch && (
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        )}

        {isPassword && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsPasswordVisible((isVisible) => !isVisible)}
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            {isPasswordVisible ? (
              <Eye className="size-4" />
            ) : (
              <EyeOff className="size-4" />
            )}
          </button>
        )}
      </div>
    </FieldWrapper>
  );
}
