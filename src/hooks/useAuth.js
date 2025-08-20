import { useState, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import { useDispatch } from "react-redux";

/**
 * Hook personnalisé pour gérer l'authentification
 * Gère de manière cohérente user et token dans localStorage
 */
function useAuth() {
  const dispatch = useDispatch();
  const [user, setUser, removeUser, clearUser, hasUser] = useLocalStorage(
    "user",
    null
  );
  const [token, setToken, removeToken, clearToken, hasToken] = useLocalStorage(
    "token",
    null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier si l'utilisateur est authentifié
  useEffect(() => {
    setIsAuthenticated(!!(user && token));
  }, [user, token]);

  // ✅ Synchroniser avec sessionStorage
  const syncWithSessionStorage = (userData, userToken) => {
    try {
      if (userData) {
        sessionStorage.setItem("user", JSON.stringify(userData));
      } else {
        sessionStorage.removeItem("user");
      }

      if (userToken) {
        sessionStorage.setItem("token", userToken);
      } else {
        sessionStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation sessionStorage:", error);
    }
  };

  // ✅ Synchroniser avec Redux
  const syncWithRedux = (userData, userToken) => {
    try {
      if (userData && userToken) {
        dispatch({
          type: "LOGGED_IN_USER",
          payload: { user: userData, token: userToken },
        });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation Redux:", error);
    }
  };

  // Fonction pour connecter un utilisateur
  const login = (userData, userToken) => {
    try {
      setUser(userData);
      setToken(userToken);

      // ✅ Synchroniser avec sessionStorage et Redux
      syncWithSessionStorage(userData, userToken);
      syncWithRedux(userData, userToken);

      console.log("✅ Utilisateur connecté avec succès");
    } catch (error) {
      console.error("❌ Erreur lors de la connexion:", error);
      throw error;
    }
  };

  // Fonction pour déconnecter un utilisateur
  const logout = () => {
    try {
      removeUser();
      removeToken();

      // ✅ Nettoyer sessionStorage et Redux
      syncWithSessionStorage(null, null);
      syncWithRedux(null, null);

      console.log("✅ Utilisateur déconnecté avec succès");
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion:", error);
      throw error;
    }
  };

  // Fonction pour mettre à jour les données utilisateur
  const updateUser = (newUserData) => {
    try {
      setUser(newUserData);

      // ✅ Synchroniser avec sessionStorage et Redux
      syncWithSessionStorage(newUserData, token);
      syncWithRedux(newUserData, token);

      console.log("✅ Données utilisateur mises à jour");
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour:", error);
      throw error;
    }
  };

  // Fonction pour rafraîchir le token
  const refreshToken = (newToken) => {
    try {
      setToken(newToken);

      // ✅ Synchroniser avec sessionStorage et Redux
      syncWithSessionStorage(user, newToken);
      syncWithRedux(user, newToken);

      console.log("✅ Token rafraîchi avec succès");
    } catch (error) {
      console.error("❌ Erreur lors du rafraîchissement du token:", error);
      throw error;
    }
  };

  // Fonction pour vérifier si l'authentification est valide
  const isAuthValid = () => {
    return !!(user && token && isAuthenticated);
  };

  // Fonction pour obtenir les informations d'authentification
  const getAuthInfo = () => {
    return {
      user,
      token,
      isAuthenticated,
      hasUser: hasUser(),
      hasToken: hasToken(),
    };
  };

  return {
    // État
    user,
    token,
    isAuthenticated,

    // Fonctions
    login,
    logout,
    updateUser,
    refreshToken,
    isAuthValid,
    getAuthInfo,

    // Fonctions utilitaires
    hasUser: hasUser(),
    hasToken: hasToken(),
    clearUser,
    clearToken,
  };
}

export default useAuth;
