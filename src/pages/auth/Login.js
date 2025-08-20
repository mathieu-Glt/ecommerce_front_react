import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/eshop1.jpg"; // chemin vers ton logo
import "./Login.css";

// Composants
import LoginForm from "../../components/auth/LoginForm";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";

// Hooks
import useAuth from "../../hooks/useAuth";
import useLogin from "../../hooks/useLogin";

/**
 * Page de connexion
 * Composant principal qui orchestre la logique de connexion
 */
function Login() {
  const { user: reduxUser } = useSelector((state) => ({ ...state }));
  const { user: authUser } = useAuth();
  const {
    loading,
    formData,
    handleEmailLogin,
    handleGoogleLogin,
    updateFormData,
  } = useLogin();

  // Log des utilisateurs pour debug
  useEffect(() => {
    console.log("Redux user: ", reduxUser);
  }, [reduxUser]);

  // Pré-remplir l'email si disponible
  useEffect(() => {
    const email = authUser?.emailForRegistration;
    if (email) {
      updateFormData({ email, password: "" });
    }
  }, [authUser, updateFormData]);

  return (
    <div className="login-page">
      <div className="container p-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body p-4">
                <h1 className="text-center mb-4">Login</h1>
                <p className="text-center text-muted mb-4">
                  Please enter your credentials to login.
                </p>

                {/* Indicateur de chargement */}
                {loading && (
                  <div className="text-center mb-3">
                    {/* <div className="spinner-border text-primary" role="status"> */}
                    {/* <span className="visually-hidden">Chargement...</span> */}
                    <div className="loader-container">
                      <img src={logo} alt="Logo" className="logo-loader" />
                    </div>
                    {/* </div> */}
                  </div>
                )}

                {/* Formulaire de connexion */}
                <div className="mb-4">
                  <LoginForm
                    onSubmit={handleEmailLogin}
                    loading={loading}
                    formData={formData}
                    onFormDataChange={updateFormData}
                  />
                </div>

                {/* Séparateur */}
                <div className="text-center mb-4">
                  <span className="text-muted">ou</span>
                </div>

                {/* Bouton Google */}
                <div className="mb-4">
                  <GoogleLoginButton
                    onClick={handleGoogleLogin}
                    loading={loading}
                  />
                </div>

                {/* Lien mot de passe oublié */}
                <div className="text-center">
                  <Link to="/forgot-password" className="text-decoration-none">
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
