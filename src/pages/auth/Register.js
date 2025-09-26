import React, { useState } from "react";
import RegisterForm from "../../components/auth/RegisterForm";
import useAuth from "../../hooks/useAuth";

const Register = ({ redirectTo = "/" }) => {
  const { loading, error, register } = useAuth();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    picture: null,
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Fonction pour convertir un fichier en Base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Validation en temps réel
  const validateField = (field, value) => {
    const errors = {};

    switch (field) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.email = "Format d'email invalide";
        }
        break;

      case "password":
        if (value.length < 8) {
          errors.password =
            "Le mot de passe doit contenir au moins 8 caractères";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          errors.password =
            "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre";
        }
        break;

      case "confirmPassword":
        if (value !== formData.password) {
          errors.confirmPassword = "Les mots de passe ne correspondent pas";
        }
        break;

      case "firstname":
      case "lastname":
        if (value.length < 2) {
          errors[field] = `Le ${
            field === "firstname" ? "prénom" : "nom"
          } doit contenir au moins 2 caractères`;
        }
        break;

      case "address":
        if (value.length < 5) {
          errors.address = "L'adresse doit contenir au moins 5 caractères";
        }
        break;

      default:
        break;
    }

    return errors;
  };

  // Gestionnaire de soumission du formulaire
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validation côté client
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Les mots de passe ne correspondent pas" });
      return;
    }

    if (formData.password.length < 8) {
      setErrors({
        password: "Le mot de passe doit contenir au moins 8 caractères",
      });
      return;
    }

    const validationErrors = {};
    Object.keys(formData).forEach((field) => {
      if (field !== "picture" && field !== "confirmPassword") {
        const fieldErrors = validateField(field, formData[field]);
        Object.assign(validationErrors, fieldErrors);
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Convertir l'image en Base64 si elle existe
    let pictureBase64 = null;
    if (formData.picture) {
      try {
        pictureBase64 = await convertFileToBase64(formData.picture);
      } catch (err) {
        setErrors({ picture: "Erreur lors de la conversion de l'image" });
        return;
      }
    }

    // Préparer les données pour l'inscription
    const registerData = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      password: formData.password,
      address: formData.address,
      picture: pictureBase64,
    };

    try {
      await register(registerData, redirectTo);
    } catch (err) {
      console.error("Erreur d'inscription:", err);
    }
  };

  // Gestionnaire de changement de champ
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    const fieldErrors = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: fieldErrors[field],
    }));
  };

  // Gestionnaire de changement d'image
  const handleImageInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validation du fichier
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          picture:
            "Type de fichier non supporté. Utilisez JPEG, PNG, GIF ou WebP.",
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          picture: "L'image est trop volumineuse. Taille maximale : 2MB.",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        picture: file,
      }));

      setErrors((prev) => ({
        ...prev,
        picture: null,
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <RegisterForm
        formData={formData}
        errors={errors}
        loading={loading}
        imagePreview={imagePreview}
        onSubmit={handleFormSubmit}
        handleFieldChange={handleFieldChange}
        handleImageInputChange={handleImageInputChange}
      />
    </div>
  );
};

export default Register;
