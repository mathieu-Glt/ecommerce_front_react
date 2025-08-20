import React, { useEffect } from "react";
import { useUser } from "../../contexts/userContext";

function Test() {
  const { user, profile, loading } = useUser();

  useEffect(() => {
    console.log("Test component - Debug Info:");
    console.log("  user:", user);
    console.log("  profile:", profile);
    console.log("  loading:", loading);
  }, [user, profile, loading]);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement du composant Test...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1>Composant Test</h1>
      <div className="alert alert-success">
        ✅ Le composant Test fonctionne correctement !
      </div>

      <div className="card">
        <div className="card-body">
          <h5>Informations utilisateur :</h5>
          <p>
            <strong>Connecté :</strong> {user ? "Oui" : "Non"}
          </p>
          <p>
            <strong>Email :</strong> {user?.email || "Non disponible"}
          </p>
          <p>
            <strong>Rôle :</strong> {profile?.role || "Non défini"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Test;
