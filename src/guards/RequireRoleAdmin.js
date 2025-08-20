import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/userContext";
import useLocalStorage from "../hooks/useLocalStorage";
import { currentUser } from "../api/auth";

const RequireRoleAdmin = ({ children, redirectTo = "/login" }) => {
  const { user, profile, loading } = useUser();
  const [serverUser, setServerUser] = useState(null);
  const [serverLoading, setServerLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Récupérer le token avec useLocalStorage
  const [token] = useLocalStorage("token", null);

  console.log("RequireRoleAdmin - Debug Info:");
  console.log("  user:", user);
  console.log("  profile:", profile);
  console.log("  loading:", loading);
  console.log("  token:", token);
  console.log("  serverUser:", serverUser);

  // Fonction pour récupérer les données utilisateur depuis le serveur
  const fetchCurrentUser = async () => {
    if (!token) {
      console.log("RequireRoleAdmin - Pas de token disponible");
      return;
    }

    setServerLoading(true);
    setServerError(null);

    try {
      const response = await currentUser(token);
      console.log("currentUser response:", response);

      if (response.data) {
        setServerUser(response.data);
        console.log(
          "RequireRoleAdmin - Utilisateur récupéré du serveur:",
          response.data
        );
      }
    } catch (error) {
      console.error(
        "RequireRoleAdmin - Erreur lors de la récupération utilisateur:",
        error
      );
      setServerError(error.message);
    } finally {
      setServerLoading(false);
    }
  };

  // Appeler fetchCurrentUser quand le token change
  useEffect(() => {
    if (token && user) {
      fetchCurrentUser();
    }
  }, [token, user]);

  // État de chargement global
  if (loading || serverLoading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">
            {loading
              ? "Chargement du profil..."
              : "Vérification des permissions..."}
          </p>
        </div>
      </div>
    );
  }

  // Pas d'utilisateur connecté
  if (!user) {
    console.log(
      "RequireRoleAdmin - Pas d'utilisateur, redirection vers:",
      redirectTo
    );
    return <Navigate to={redirectTo} replace />;
  }

  // Pas de token
  if (!token) {
    console.log(
      "RequireRoleAdmin - Pas de token, redirection vers:",
      redirectTo
    );
    return <Navigate to={redirectTo} replace />;
  }

  // Erreur serveur
  if (serverError) {
    console.log("RequireRoleAdmin - Erreur serveur:", serverError);
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          ❌ Erreur lors de la vérification des permissions: {serverError}
        </div>
      </div>
    );
  }

  // Vérifier le rôle - priorité au serveur, puis au profile local
  const userRole = serverUser?.role || profile?.role;
  const isAdmin = userRole === "admin";

  console.log("RequireRoleAdmin - Rôle utilisateur:", userRole);
  console.log("RequireRoleAdmin - Est admin:", isAdmin);

  if (!isAdmin) {
    console.log("RequireRoleAdmin - Accès refusé, rôle insuffisant");
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          ⚠️ Accès refusé : Vous devez avoir le rôle "admin" pour accéder à
          cette page.
          <br />
          <strong>Votre rôle actuel :</strong> {userRole || "Non défini"}
        </div>
        <div className="mt-3">
          <button
            className="btn btn-primary me-2"
            onClick={() => window.history.back()}
          >
            Retour
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => (window.location.href = "/")}
          >
            Accueil
          </button>
        </div>
      </div>
    );
  }

  console.log("RequireRoleAdmin - Accès autorisé avec rôle admin");
  return children;
};

export default RequireRoleAdmin;
