import * as Yup from "yup";

// 🔒 Définition du schéma de validation
export const validationSchema = Yup.object().shape({
  email: Yup.string().email("Email invalid").required("The email is required"),
  password: Yup.string()
    .min(8, "The password must be at least 8 characters")
    .required("The password is required"),
});
