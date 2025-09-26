import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, logoutUser, updateUserProfile } from "../api/auth";
import { fetchCurrentUser } from "../actions/authActions";
import { getSocket } from "../socket/socket";
const UserContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  updateProfile: () => {},
  //logout: () => {},
});

export const UserProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => ({
    user: state.user.user,
    loading: state.user.loading || false,
  }));
  console.log("UserProvider - user :", user);
  console.log("UserProvider - loading :", loading);

  // Fonction utilitaire pour récupérer le token
  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      console.log("UserProvider - token :", token);
      if (!token) {
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }
      const socket = getSocket();
      socket.on("user:logout", () => {
        console.log("Déconnecté par le serveur");
        dispatch({ type: "LOGOUT" });
        clearStorage();
        socket.disconnect();
      });

      try {
        dispatch({ type: "SET_LOADING", payload: true });
        console.log("🔍 Vérification du token...");
        const response = await currentUser(token);
        console.log("UserProvider - response :", response);
        if (response?.data) {
          console.log("✅ Utilisateur authentifié:", response.data);

          // Sauvegarder dans localStorage
          localStorage.setItem("user", JSON.stringify(response.data));
          localStorage.setItem("token", token);

          // Mettre à jour Redux
          dispatch({
            type: "LOGGED_IN_USER",
            payload: { user: response.data, token },
          });
        } else {
          console.log("❌ Token invalide");
          dispatch({ type: "LOGOUT" });
          clearStorage();
        }
      } catch (error) {
        console.error("❌ Erreur d'authentification:", error);
        dispatch({ type: "LOGOUT" });
        clearStorage();
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    // Exécuter seulement si pas d'utilisateur en mémoire
    if (!user) {
      checkAuth();
    }
  }, [user, dispatch]); // ✅ Pas de dépendances

  const clearStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  // Fonction pour mettre à jour le profil
  const updateProfile = async (newProfileData) => {
    if (!user) {
      throw new Error("Utilisateur non connecté");
    }

    const token = getToken();
    if (!token) {
      throw new Error("Token manquant");
    }

    try {
      console.log("🔄 Mise à jour du profil...");
      const response = await updateUserProfile(newProfileData, token);

      if (response?.data) {
        const updatedUser = { ...user, ...newProfileData };

        // Sauvegarder dans localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Mettre à jour Redux
        dispatch({
          type: "UPDATE_USER_PROFILE",
          payload: updatedUser,
        });

        console.log("✅ Profil mis à jour avec succès");
        return response.data;
      } else {
        throw new Error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("❌ Erreur mise à jour profil:", error);
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    console.log("🚪 Déconnexion utilisateur");
    dispatch({ type: "LOGOUT" });

    // requête axios pour déconnexion côté serveur
    logoutUser();
    const socket = getSocket();

    // Émission Socket.IO côté client
    socket.disconnect(); // Déconnexion du socket
    clearStorage();
  };

  // ✅ Optimisation avec useMemo
  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      updateProfile,
      logout,
    }),
    [user, loading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser doit être utilisé dans un UserProvider");
  }
  return context;
};
