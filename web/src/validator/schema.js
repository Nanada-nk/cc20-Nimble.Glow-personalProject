import * as Yup from 'yup'

export const schemaRegister = Yup.object({
  firstName:
    Yup.string()
      .required("First name is required"),
  lastName:
    Yup.string()
      .required("Last name is required"),
  mobile:
    Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits (e.g. 0811111111)")
      .required("Mobile is required"),
  email:
    Yup.string()
      .email("Email is invalid")
      .max(30, "Email must be at most 30 characters")
      .required("Email is required"),
  password:
    Yup.string()
      .max(30, "Password must be at most 30 characters")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/,
        "Password must be at least 8 characters and include uppercase, lowercase, and a number")
      .required("Password is required"),
  confirmPassword:
    Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required")
}).noUnknown()

export const schemaLogin = Yup.object({
  email:
    Yup.string()
      .email("Email is invalid")
      .max(30, "Email must be at most 30 characters")
      .required("Email is required"),
  password:
    Yup.string()
      .max(30, "Password must be at most 30 characters")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/,
        "Password must be at least 8 characters and include uppercase, lowercase, and a number")
      .required("Password is required")
}).noUnknown()


export const schemaForgotPassword = Yup.object({
  email:
    Yup.string()
      .email("Email is invalid")
      .max(30, "Email must be at most 30 characters")
      .required("Email is required")
}).noUnknown()


export const schemaResetPassword = Yup.object({
  newPassword:
    Yup.string()
      .max(30, "Password must be at most 30 characters")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/,
        "Password must be at least 8 characters and include uppercase, lowercase, and a number")
      .required("Password is required"),
  confirmNewPassword:
    Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required")
}).noUnknown()
