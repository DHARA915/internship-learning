export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "multiselect";

export type InputType = "text" | "email" | "password" | "number" | "tel" | "url";

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

/** Props shared by every field */
export interface BaseFieldProps<V> {
  name: string;
  label?: string;
  value?: V;
  onChange?: (value: V, name: string) => void;
  onBlur?: () => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// export type InputFieldProps = BaseFieldProps<string> & {
//   type?: "text" | "email" | "password" | "number" | "tel" | "url";
//   placeholder?: string;
// };

export interface InputFieldProps {
  name: string;
  label?: string;
  type?: InputType;
  value?: string;
  onChange?: (value: string, name: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string; // external error (e.g. from server) always wins
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
 
  // validation
  validate?: boolean; // default true, set false to turn off
  onValidate?: (error: string | undefined, name: string) => void;
 
  // per-type options
  minLength?: number; // text, password (default 8), tel (default 10)
  maxLength?: number; // text, tel (default 10)
  min?: number; // number
  max?: number; // number
  step?: number; // number
  requireStrong?: boolean; // password: upper + lower + digit + special
}

export type TextareaFieldProps = BaseFieldProps<string> & {
  placeholder?: string;
  rows?: number;
};

export type SelectFieldProps = BaseFieldProps<string> & {
  options: Option[];
  placeholder?: string;
};

export type RadioFieldProps = BaseFieldProps<string> & {
  options: Option[];
  orientation?: "vertical" | "horizontal";
};

export type CheckboxFieldProps = BaseFieldProps<boolean>;

export type MultiSelectFieldProps = BaseFieldProps<string[]> & {
  options: Option[];
  placeholder?: string;
};

/** Discriminated union: `type` decides which props are valid */
export type FormFieldProps =
  | InputFieldProps
  | ({ type: "textarea" } & TextareaFieldProps)
  | ({ type: "select" } & SelectFieldProps)
  | ({ type: "radio" } & RadioFieldProps)
  | ({ type: "checkbox" } & CheckboxFieldProps)
  | ({ type: "multiselect" } & MultiSelectFieldProps);