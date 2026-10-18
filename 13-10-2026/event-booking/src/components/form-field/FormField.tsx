import { InputField } from "../form-field/fields/InputField";
import { TextareaField } from "../form-field/fields/Textareafield";
import { SelectField } from "../form-field/fields/Selectfield";
import { RadioField } from "../form-field/fields/Radiofield";
import { CheckboxField } from "../form-field/fields/CheckboxField";
import { MultiSelectField } from "../form-field/fields/Multiselectfield";
import { ImageField } from "./fields/ImageField";
import type { FormFieldProps } from "./fields/Types.ts";
import MySelect from "./fields/select";

/**
 * Common field component.
 * Pass ``type`` and the matching field is rendered:
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
const FormField = (props: FormFieldProps)=> {
  switch (props.type) {
    case "textarea":
      return <TextareaField {...props} />;

    case 'mySelect':
    return <MySelect/>;
    case "select":
      return <SelectField {...props} />;

    case "radio":
      return <RadioField {...props} />;

    case "checkbox":
      return <CheckboxField {...props} />;

    case "multiselect":
      return <MultiSelectField {...props} />;

    case "file":
    return <ImageField {...props} />

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

export default FormField