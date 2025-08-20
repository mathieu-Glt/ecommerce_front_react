import React from "react";
import useSessionManager from "../hooks/useSessionManager";

function SessionTest() {
  const { refreshSession, forceLogout } = useSessionManager();

  const simulateSessionExpiry = () => {
    // Supprimer les données de session pour simuler l'expiration
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("lastActivity");

    console.log("SessionTest - Session supprimée, popup devrait apparaître");

    // Recharger la page pour déclencher la vérification
    window.location.reload();
  };

  const simulateInactivity = () => {
    // Définir une activité très ancienne (plus de 2 minutes)
    const oldTimestamp = Date.now() - 3 * 60 * 1000; // 3 minutes
    sessionStorage.setItem("lastActivity", oldTimestamp.toString());

    console.log("SessionTest - Inactivité simulée, popup devrait apparaître");

    // Recharger la page pour déclencher la vérification
    window.location.reload();
  };

  const showSessionInfo = () => {
    const sessionUser = sessionStorage.getItem("user");
    const sessionToken = sessionStorage.getItem("token");
    const lastActivity = sessionStorage.getItem("lastActivity");

    const info = {
      sessionUser: sessionUser ? "Présent" : "Absent",
      sessionToken: sessionToken ? "Présent" : "Absent",
      lastActivity: lastActivity
        ? new Date(parseInt(lastActivity)).toLocaleString()
        : "Aucune",
      timeSinceLastActivity: lastActivity
        ? Math.floor((Date.now() - parseInt(lastActivity)) / 1000) + " secondes"
        : "N/A",
    };

    alert(JSON.stringify(info, null, 2));
  };

  const forceShowModal = () => {
    // Forcer l'affichage de la popup pour tester les boutons
    console.log("SessionTest - Force affichage popup");

    // Simuler une session expirée
    sessionStorage.setItem(
      "user",
      JSON.stringify({ email: "test@example.com" })
    );
    sessionStorage.setItem("token", "fake-token");
    sessionStorage.setItem(
      "lastActivity",
      (Date.now() - 3 * 60 * 1000).toString()
    );

    // Recharger la page pour déclencher la vérification
    window.location.reload();
  };

  const forceShowModalSimple = () => {
    console.log("SessionTest - Force affichage modal simple");

    // Créer des données de test directement
    const testUser = { email: "test@example.com", uid: "test123" };
    const testToken = "fake-token-123";

    // Simuler une session expirée
    sessionStorage.setItem("user", JSON.stringify(testUser));
    sessionStorage.setItem("token", testToken);
    sessionStorage.setItem(
      "lastActivity",
      (Date.now() - 3 * 60 * 1000).toString()
    );

    // Forcer la vérification immédiate
    setTimeout(() => {
      console.log("SessionTest - Vérification forcée");
      // Recharger la page pour déclencher la vérification
      window.location.reload();
    }, 100);
  };

  const testModalButtons = () => {
    console.log("SessionTest - Test des boutons de la modale");

    // Créer une session expirée
    const testUser = { email: "test@example.com", uid: "test123" };
    const testToken = "fake-token-123";

    // Simuler une session expirée
    sessionStorage.setItem("user", JSON.stringify(testUser));
    sessionStorage.setItem("token", testToken);
    sessionStorage.setItem(
      "lastActivity",
      (Date.now() - 3 * 60 * 1000).toString()
    );

    // Forcer l'affichage de la modale
    setTimeout(() => {
      console.log("SessionTest - Test des boutons - Vérification forcée");
      window.location.reload();
    }, 100);
  };

  const testModalDirect = () => {
    console.log("SessionTest - Test direct de la modale");

    // Créer une session expirée directement
    const testUser = { email: "test@example.com", uid: "test123" };
    const testToken = "fake-token-123";

    // Simuler une session expirée
    sessionStorage.setItem("user", JSON.stringify(testUser));
    sessionStorage.setItem("token", testToken);
    sessionStorage.setItem(
      "lastActivity",
      (Date.now() - 3 * 60 * 1000).toString()
    );

    // Forcer l'affichage de la modale sans recharger
    console.log("SessionTest - Test direct - Données créées");
    alert("Modale devrait s'afficher maintenant. Testez les boutons !");
  };

  const testSimpleModal = () => {
    console.log("SessionTest - Test simple de la modale");

    // Créer une session expirée
    const testUser = { email: "test@example.com", uid: "test123" };
    const testToken = "fake-token-123";

    // Simuler une session expirée
    sessionStorage.setItem("user", JSON.stringify(testUser));
    sessionStorage.setItem("token", testToken);
    sessionStorage.setItem(
      "lastActivity",
      (Date.now() - 3 * 60 * 1000).toString()
    );

    // Forcer l'affichage de la modale
    console.log("SessionTest - Test simple - Données créées");

    // Recharger la page pour déclencher la vérification
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const testRefreshSession = () => {
    console.log("SessionTest - Test de rafraîchissement de session");

    // Créer une session valide
    const testUser = { email: "test@example.com", uid: "test123" };
    const testToken = "fake-token-123";

    // Simuler une session valide
    sessionStorage.setItem("user", JSON.stringify(testUser));
    sessionStorage.setItem("token", testToken);
    sessionStorage.setItem("lastActivity", Date.now().toString());

    localStorage.setItem("user", JSON.stringify(testUser));
    localStorage.setItem("token", testToken);

    console.log("SessionTest - Session valide créée");
    alert(
      "Session valide créée. Testez maintenant le bouton 'Prolonger la session' !"
    );
  };

  const testCompleteLogout = () => {
    console.log("SessionTest - Test de déconnexion complète");

    // Simuler une session active
    sessionStorage.setItem(
      "user",
      JSON.stringify({ email: "test@example.com" })
    );
    sessionStorage.setItem("token", "fake-token");
    sessionStorage.setItem("lastActivity", Date.now().toString());

    localStorage.setItem("user", JSON.stringify({ email: "test@example.com" }));
    localStorage.setItem("token", "fake-token");

    console.log("SessionTest - Données créées, test de déconnexion...");

    // Appeler la déconnexion
    forceLogout();

    // Vérifier après un délai
    setTimeout(() => {
      const sessionUser = sessionStorage.getItem("user");
      const sessionToken = sessionStorage.getItem("token");
      const localUser = localStorage.getItem("user");
      const localToken = localStorage.getItem("token");

      const result = {
        sessionStorage: {
          user: sessionUser ? "Présent" : "Supprimé ✅",
          token: sessionToken ? "Présent" : "Supprimé ✅",
        },
        localStorage: {
          user: localUser ? "Présent" : "Supprimé ✅",
          token: localToken ? "Présent" : "Supprimé ✅",
        },
      };

      alert(
        "Résultat de la déconnexion complète:\n" +
          JSON.stringify(result, null, 2)
      );
    }, 1000);
  };

  return (
    <div className="container mt-4">
      <h2>🧪 Test de Session</h2>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Actions de Test</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button
                  className="btn btn-success"
                  onClick={forceShowModalSimple}
                >
                  🧪 Test Modal Simple (jaune)
                </button>

                <button className="btn btn-primary" onClick={testModalButtons}>
                  🧪 Test Boutons Modale
                </button>

                <button className="btn btn-info" onClick={testModalDirect}>
                  🧪 Test Direct Modale
                </button>

                <button className="btn btn-success" onClick={testSimpleModal}>
                  🧪 Test Simple Modale
                </button>

                <button
                  className="btn btn-warning"
                  onClick={testRefreshSession}
                >
                  🧪 Test Rafraîchissement Session
                </button>

                <button className="btn btn-success" onClick={forceShowModal}>
                  🧪 Forcer affichage popup (test boutons)
                </button>

                <button
                  className="btn btn-warning"
                  onClick={simulateSessionExpiry}
                >
                  🧪 Simuler expiration session
                </button>

                <button className="btn btn-danger" onClick={simulateInactivity}>
                  🧪 Simuler inactivité (3 min)
                </button>

                <button className="btn btn-info" onClick={showSessionInfo}>
                  ℹ️ Afficher infos session
                </button>

                <button className="btn btn-success" onClick={refreshSession}>
                  ✅ Rafraîchir session
                </button>

                <button className="btn btn-secondary" onClick={forceLogout}>
                  🚪 Forcer déconnexion
                </button>

                <button className="btn btn-dark" onClick={testCompleteLogout}>
                  🧪 Test déconnexion complète
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Informations</h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <h6>Comment tester :</h6>
                <ol>
                  <li>Cliquez sur "Simuler expiration session"</li>
                  <li>La popup devrait apparaître</li>
                  <li>
                    Choisissez "Restaurer la session" ou attendez 30 secondes
                  </li>
                </ol>
              </div>

              <div className="alert alert-warning">
                <h6>Fonctionnalités :</h6>
                <ul>
                  <li>✅ Détection automatique d'expiration</li>
                  <li>✅ Countdown de 30 secondes</li>
                  <li>✅ Boutons d'action</li>
                  <li>✅ Synchronisation sessionStorage</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionTest;
