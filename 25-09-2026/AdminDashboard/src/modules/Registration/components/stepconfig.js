import PersonalDetails from "./PersonalDetails";
import Address from "./Address";
import AccountDetails from "./AccountDetails";

export const steps = [
  {
    component: PersonalDetails,
    title: "Personal Information",

    fields: [
      {
        name: "firstname",
        label: "First Name",
        type: "text",
        placeholder: "Enter first name",
        required: true,
      },
      {
        name: "lastName",
        label: "Last Name",
        type: "text",
        placeholder: "Enter last name",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Enter email",
        required: true,
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        placeholder: "Enter phone number",
        required: true,
      },
    ],
  },

  {
    component: Address,
    title: "Address Information",

    fields: [
      {
        name: "address",
        label: "Address",
        type: "text",
        placeholder: "Enter address",
        required: true,
      },
      {
        name: "city",
        label: "City",
        type: "text",
        placeholder: "Enter city",
        required: true,
      },
      {
        name: "state",
        label: "State",
        type: "text",
        placeholder: "Enter state",
        required: true,
      },
      {
        name: "pincode",
        label: "Pincode",
        type: "number",
        placeholder: "Enter pincode",
        required: true,
      },
    ],
  },

  {
    component: AccountDetails,
    title: "Account Information",

    fields: [
      {
        name: "username",
        label: "Username",
        type: "text",
        placeholder: "Enter username",
        required: true,
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter password",
        required: true,
      },
      {
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        placeholder: "Confirm password",
        required: true,
      },
    ],
  },
];  