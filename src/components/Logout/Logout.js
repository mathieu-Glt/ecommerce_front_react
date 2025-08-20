import React from "react";
import { useUser } from "../../contexts/userContext";
import { useDispatch } from "react-redux";
import useToast from "../../hooks/useToast";

const Logout = () => {
  const { logout, user } = useUser();
  const dispatch = useDispatch();
  const { auth: authMessages, showError, showSuccess } = useToast();

  const handleLogout = () => {
    try {
      // Appeler la fonction logout du UserContext
      // (elle fait déjà auth.signOut() et nettoie le localStorage)
      logout();

      // Nettoyer le state Redux
      dispatch({ type: "LOGOUT", payload: null });
      // Afficher un message de succès avec le hook useToast
      showSuccess(authMessages.logoutSuccess);
      // La redirection sera gérée automatiquement par RequireAuth
      // quand l'utilisateur sera déconnecté
    } catch (error) {
      console.error("Error in logout:", error);
      showError("Error in logout");
    }
  };

  // Si l'utilisateur n'est pas connecté, ne pas afficher le bouton
  if (!user) {
    return null;
  }

  return (
    <button
      onClick={handleLogout}
      className="btn btn-outline-danger"
      style={{ marginLeft: "10px" }}
    >
      <i className="fas fa-sign-out-alt"></i> Déconnexion
    </button>
  );
};

export default Logout;
