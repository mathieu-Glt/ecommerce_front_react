import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import GoogleLoginButton from "./GoogleLoginButton";
import AzureLoginButton from "./AzureLoginButton";

const LoginForm = ({
  onSubmit,
  loading,
  formData,
  onFormDataChange,
  onAzureLogin,
  onGoogleLogin,
}) => {
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!formData.email) validationErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      validationErrors.email = "Enter a valid email";
    if (!formData.password) validationErrors.password = "Password is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onSubmit(formData);
    navigate("/");
  };

  const handleFieldChange = (field, value) => {
    onFormDataChange({ ...formData, [field]: value });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  // Redirection Azure AD
  // const handleAzureLogin = () => {
  //   console.log("Redirecting to Azure AD...");
  //   window.location.href = "http://localhost:8000/api/auth/azure";
  // };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h2>Welcome Back</h2>
        <form onSubmit={handleFormSubmit} className="login-form">
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password || ""}
              onChange={(e) => handleFieldChange("password", e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        {onGoogleLogin && (
          <GoogleLoginButton onClick={onGoogleLogin} loading={loading} />
        )}

        {/* Bouton Azure AD */}
        <AzureLoginButton onClick={onAzureLogin} loading={loading} />
      </div>

      <div className="forgot-password-links">
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  formData: PropTypes.object.isRequired,
  onFormDataChange: PropTypes.func.isRequired,
  onGoogleLogin: PropTypes.func,
  onAzureLogin: PropTypes.func,
};

export default LoginForm;
