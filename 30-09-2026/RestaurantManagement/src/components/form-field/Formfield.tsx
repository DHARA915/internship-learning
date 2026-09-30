import { InputField } from "./fields/InputField";
import { TextareaField } from "./fields/Textareafield";
import { SelectField } from "./fields/Selectfield";
import { RadioField } from "./fields/Radiofield";
import { CheckboxField } from "./fields/CheckboxField";
import { MultiSelectField } from "./fields/Multiselectfield";
import type { FormFieldProps } from "./fields/Types.ts";

/**
 * Common field component.
 * Pass `type` and the matching field is rendered:
 *
 *  text | email | password | number | tel | url  → InputField
 *  textarea                                       → TextareaField
 *  select                                         → SelectField
 *  radio                                          → RadioField
 *  checkbox                                       → CheckboxField
 *  multiselect                                    → MultiSelectField
 *
 * When `type` is omitted it renders a text input.
 */
export function FormField(props: FormFieldProps) {
  switch (props.type) {
    case "textarea":
      return <TextareaField {...props} />;

    case "select":
      return <SelectField {...props} />;

    case "radio":
      return <RadioField {...props} />;

    case "checkbox":
      return <CheckboxField {...props} />;

    case "multiselect":
      return <MultiSelectField {...props} />;

    case "text":
    case "email":
    case "password":
    case "number":
    case "tel":
    case "url":
    default:
      return <InputField {...props} />;
  }
}