import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import useToast from "./useToast";
import authService from "../services/authService";

/**
 * Hook personnalisé pour gérer la logique de connexion
 */
function useLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const { auth: authMessages, showError, showSuccess } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ✅ Synchroniser avec sessionStorage
  const syncWithSessionStorage = (userData, userToken) => {
    try {
      if (userData) {
        sessionStorage.setItem("user", JSON.stringify(userData));
      }
      if (userToken) {
        sessionStorage.setItem("token", userToken);
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation sessionStorage:", error);
    }
  };

  // Gestionnaire de connexion email/mot de passe
  const handleEmailLogin = async (data) => {
    dispatch({ type: "LOGIN_START" });
    setLoading(true);

    try {
      const result = await authService.loginWithEmail(
        data.email,
        data.password
      );

      // Connexion avec le hook useAuth
      authLogin(result.user, result.token);

      // ✅ Synchroniser avec sessionStorage
      syncWithSessionStorage(result.user, result.token);

      // Dispatch Redux
      dispatch({
        type: "LOGGED_IN_USER",
        payload: { user: result.user, token: result.token },
      });

      // Message de bienvenue avec le hook useToast
      const displayName = authService.formatDisplayName(
        result.profile,
        data.email
      );
      showSuccess(authMessages.loginSuccess(displayName));

      // Redirection
      navigate("/");
    } catch (error) {
      console.error("Error in email login:", error);
      showError(authMessages.loginError);
      dispatch({ type: "LOGIN_ERROR", payload: "Login failed" });
    } finally {
      setLoading(false);
      setFormData({ email: "", password: "" });
    }
  };

  // Gestionnaire de connexion Google
  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const result = await authService.loginWithGoogle();

      // Connexion avec le hook useAuth
      authLogin(result.user, result.token);

      // ✅ Synchroniser avec sessionStorage
      syncWithSessionStorage(result.user, result.token);

      // Dispatch Redux
      dispatch({
        type: "LOGGED_IN_USER",
        payload: { user: result.user, token: result.token },
      });

      // Message de succès avec le hook useToast
      showSuccess(authMessages.googleLoginSuccess);
      navigate("/");
    } catch (error) {
      console.error("Error in Google login:", error);
      showError(authMessages.googleLoginError);
      dispatch({ type: "LOGIN_ERROR", payload: "Login with Google failed" });
    } finally {
      setLoading(false);
    }
  };

  // Mise à jour des données du formulaire
  const updateFormData = (updater) => {
    setFormData(updater);
  };

  return {
    // État
    loading,
    formData,

    // Actions
    handleEmailLogin,
    handleGoogleLogin,
    updateFormData,
  };
}

export default useLogin;
