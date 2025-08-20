import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "../../validator/validationLogin";
import { MailOutlined } from "@ant-design/icons";

/**
 * Composant formulaire de connexion
 */
const LoginForm = ({ onSubmit, loading, formData, onFormDataChange }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    onFormDataChange((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form" noValidate>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          {...register("email")}
          id="email"
          value={formData.email}
          placeholder="Enter your email"
          onChange={handleChange}
          required
          autoFocus
          disabled={loading}
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className={`form-control ${errors.password ? "is-invalid" : ""}`}
          {...register("password")}
          id="password"
          value={formData.password}
          placeholder="Enter your password"
          onChange={handleChange}
          required
          disabled={loading}
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password.message}</div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
        icon={<MailOutlined />}
      >
        {loading ? "Connexion en cours..." : "Login with Email and Password"}
      </button>
    </form>
  );
};

export default LoginForm;


