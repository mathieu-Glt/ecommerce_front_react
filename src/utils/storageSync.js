/**
 * Utilitaires pour synchroniser localStorage et sessionStorage
 */

// Synchroniser les données d'authentification
export const syncAuthData = (user, token) => {
  try {
    // localStorage (persistant)
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }

    // sessionStorage (session)
    if (token) {
      sessionStorage.setItem("token", token);
    } else {
      sessionStorage.removeItem("token");
    }

    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }

    console.log("✅ Données d'authentification synchronisées");
  } catch (error) {
    console.error("❌ Erreur lors de la synchronisation:", error);
  }
};

// Nettoyer toutes les données d'authentification
export const clearAuthData = () => {
  try {
    // localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // sessionStorage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    console.log("✅ Données d'authentification nettoyées");
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage:", error);
  }
};

// Récupérer les données d'authentification (priorité à sessionStorage puis localStorage)
export const getAuthData = () => {
  try {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    const user = sessionStorage.getItem("user") || localStorage.getItem("user");

    return {
      token,
      user: user ? JSON.parse(user) : null,
      isAuthenticated: !!token,
    };
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des données:", error);
    return { token: null, user: null, isAuthenticated: false };
  }
};
