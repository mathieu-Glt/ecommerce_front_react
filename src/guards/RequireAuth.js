import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/userContext";

const RequireAuth = ({ children, redirectTo = "/login" }) => {
  const { user, profile, loading } = useUser();
  const location = useLocation();

  console.log("RequireAuth - Debug Info:");
  console.log("  user:", user);
  console.log("  profile:", profile);
  console.log("  loading:", loading);
  console.log("  current location:", location.pathname);

  // ✅ Afficher un spinner pendant le chargement
  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // ✅ Rediriger si pas d'utilisateur
  if (!user) {
    console.log(
      "RequireAuth - Pas d'utilisateur, redirection vers:",
      redirectTo
    );
    return (
      <Navigate to={{ pathname: redirectTo, state: { from: location } }} />
    );
  }

  console.log("RequireAuth - Utilisateur connecté, affichage du contenu");
  return children;
};

export default RequireAuth;
