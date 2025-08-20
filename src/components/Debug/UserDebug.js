import React from "react";
import { useUser } from "../../contexts/userContext";
import { useSelector } from "react-redux";

function UserDebug() {
  const { user, profile, loading } = useUser();
  const reduxUser = useSelector((state) => state.user);

  return (
    <div className="container mt-4">
      <h2>🔍 Diagnostic Utilisateur</h2>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>UserContext</h5>
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
                <strong>Rôle:</strong> {profile?.role || "Non défini"}
              </p>
              <p>
                <strong>Email:</strong> {user?.email || "Non disponible"}
              </p>
              <p>
                <strong>UID:</strong> {user?.uid || "Non disponible"}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Redux State</h5>
            </div>
            <div className="card-body">
              <p>
                <strong>User existe:</strong> {reduxUser ? "✅ Oui" : "❌ Non"}
              </p>
              <p>
                <strong>Email:</strong> {reduxUser?.email || "Non disponible"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h5>Test d'accès</h5>
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <h6>Conditions pour accéder au composant Test :</h6>
            <ul>
              <li>✅ Loading terminé: {!loading ? "Oui" : "Non"}</li>
              <li>✅ User existe: {user ? "Oui" : "Non"}</li>
              <li>✅ Profile existe: {profile ? "Oui" : "Non"}</li>
              <li>
                ✅ Rôle = "admin": {profile?.role === "admin" ? "Oui" : "Non"}
              </li>
            </ul>
          </div>

          <div
            className={`alert ${
              profile?.role === "admin" ? "alert-success" : "alert-warning"
            }`}
          >
            <strong>Résultat :</strong>{" "}
            {profile?.role === "admin" ? "Accès autorisé" : "Accès refusé"}
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h5>Actions</h5>
        </div>
        <div className="card-body">
          <div className="btn-group" role="group">
            <a href="/test" className="btn btn-primary">
              Tester sans protection
            </a>
            <a href="/admin" className="btn btn-secondary">
              Tester avec protection admin
            </a>
            <a href="/shopping-cart" className="btn btn-info">
              Tester panier (auth simple)
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
            <summary>Redux - User</summary>
            <pre className="bg-light p-3 rounded">
              {JSON.stringify(reduxUser, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}

export default UserDebug;
