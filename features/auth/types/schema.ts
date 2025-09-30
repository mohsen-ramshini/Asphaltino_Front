import * as Yup from "yup";

// Login validation schema
export const validationSchema = Yup.object({
  username: Yup.string().required("Name is required"),
  password: Yup.string().required("Password is required").min(5,"Password must be at least 5 characters"),
  remember: Yup.boolean(),
});

// Sign up validation schema
export const signUpValidationSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  phone_number: Yup.string().optional(),
});

// Profile update validation schema
export const profileUpdateValidationSchema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone_number: Yup.string().optional(),
});

// Change password validation schema
export const changePasswordValidationSchema = Yup.object({
  current_password: Yup.string().required("Current password is required"),
  new_password: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirm_password: Yup.string()
    .required("Please confirm your new password")
    .oneOf([Yup.ref('new_password')], 'Passwords must match'),
});