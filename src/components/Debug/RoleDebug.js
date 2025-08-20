import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/userContext";
import useLocalStorage from "../../hooks/useLocalStorage";
import { currentUser } from "../../api/auth";

function RoleDebug() {
  const { user, profile, loading } = useUser();
  const [token] = useLocalStorage("token", null);
  const [serverUser, setServerUser] = useState(null);
  const [serverLoading, setServerLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const fetchCurrentUser = async () => {
    if (!token) {
      console.log("RoleDebug - Pas de token disponible");
      return;
    }

    setServerLoading(true);
    setServerError(null);

    try {
      const response = await currentUser(token);
      console.log("RoleDebug - currentUser response:", response);

      if (response.data) {
        setServerUser(response.data);
        console.log(
          "RoleDebug - Utilisateur récupéré du serveur:",
          response.data
        );
      }
    } catch (error) {
      console.error(
        "RoleDebug - Erreur lors de la récupération utilisateur:",
        error
      );
      setServerError(error.message);
    } finally {
      setServerLoading(false);
    }
  };

  useEffect(() => {
    if (token && user) {
      fetchCurrentUser();
    }
  }, [token, user]);

  return (
    <div className="container mt-4">
      <h2>🔍 Debug Rôle Utilisateur</h2>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>État Local (UserContext)</h5>
            </div>
            <div className="card-body">
              <p>
                <strong>Loading:</strong> {loading ? "✅ Oui" : "❌ Non"}
              </p>
              <p>
                <strong>User existe:</strong> {user ? "✅ Oui" : "❌ Non"}
              </p>
              <p>
                <strong>Profile existe:</strong> {profile ? "✅ Oui" : "❌ Non"}
              </p>
              <p>
                <strong>Rôle local:</strong> {profile?.role || "Non défini"}
              </p>
              <p>
                <strong>Email:</strong> {user?.email || "Non disponible"}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>État Serveur (API)</h5>
            </div>
            <div className="card-body">
              <p>
                <strong>Loading:</strong> {serverLoading ? "✅ Oui" : "❌ Non"}
              </p>
              <p>
                <strong>Token:</strong> {token ? "✅ Présent" : "❌ Absent"}
              </p>
              <p>
                <strong>Erreur:</strong> {serverError || "Aucune"}
              </p>
              <p>
                <strong>Rôle serveur:</strong>{" "}
                {serverUser?.role || "Non défini"}
              </p>
              <p>
                <strong>Status:</strong> {serverUser?.status || "Non défini"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h5>Test d'accès Admin</h5>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <h6>Conditions pour accéder au composant Test :</h6>
            <ul>
              <li>
                ✅ Loading terminé: {!loading && !serverLoading ? "Oui" : "Non"}
              </li>
              <li>✅ User existe: {user ? "Oui" : "Non"}</li>
              <li>✅ Token existe: {token ? "Oui" : "Non"}</li>
              <li>✅ Pas d'erreur serveur: {!serverError ? "Oui" : "Non"}</li>
              <li>
                ✅ Rôle = "admin":{" "}
                {serverUser?.role === "admin" || profile?.role === "admin"
                  ? "Oui"
                  : "Non"}
              </li>
            </ul>
          </div>

          <div
            className={`alert ${
              serverUser?.role === "admin" || profile?.role === "admin"
                ? "alert-success"
                : "alert-warning"
            }`}
          >
            <strong>Résultat :</strong>{" "}
            {serverUser?.role === "admin" || profile?.role === "admin"
              ? "Accès autorisé"
              : "Accès refusé"}
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h5>Actions</h5>
        </div>
        <div className="card-body">
          <div className="btn-group" role="group">
            <button
              className="btn btn-primary me-2"
              onClick={fetchCurrentUser}
              disabled={serverLoading}
            >
              {serverLoading ? "Chargement..." : "Rafraîchir données serveur"}
            </button>
            <a href="/admin" className="btn btn-secondary me-2">
              Tester accès admin
            </a>
            <a href="/test" className="btn btn-info">
              Tester sans protection
            </a>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h5>Données brutes</h5>
        </div>
        <div className="card-body">
          <details>
            <summary>UserContext - User</summary>
            <pre className="bg-light p-3 rounded">
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>
          <details>
            <summary>UserContext - Profile</summary>
            <pre className="bg-light p-3 rounded">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </details>
          <details>
            <summary>Serveur - Response</summary>
            <pre className="bg-light p-3 rounded">
              {JSON.stringify(serverUser, null, 2)}
            </pre>
          </details>
          <details>
            <summary>Token</summary>
            <pre className="bg-light p-3 rounded">
              {token ? token.substring(0, 50) + "..." : "Aucun token"}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}

export default RoleDebug;
