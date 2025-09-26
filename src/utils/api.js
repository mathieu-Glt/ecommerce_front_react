import axios from "axios";
import { auth } from "../config/firebase";

// Fonction pour valider si un token est un token Firebase ID
export const isValidFirebaseToken = (token) => {
  if (!token) return false;

  // Les tokens Firebase ID commencent avec ce header spécifique
  return token.startsWith("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9");
};

// Fonction pour obtenir un nouveau token Firebase ID
export const getFreshFirebaseToken = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No authenticated user found");
    }

    // Force refresh pour obtenir un nouveau token
    const token = await currentUser.getIdToken(true);
    console.log(
      "Fresh Firebase ID token obtained for API call:",
      token ? token.substring(0, 20) + "..." : "null"
    );

    if (!isValidFirebaseToken(token)) {
      throw new Error("Invalid Firebase ID token format");
    }

    return token;
  } catch (error) {
    console.error("Error getting fresh Firebase ID token:", error);
    throw error;
  }
};

// Fonction pour faire des appels API authentifiés
export const authenticatedApiCall = async (method, endpoint, data = null) => {
  try {
    const token = await getFreshFirebaseToken();

    const config = {
      method,
      url: `${process.env.REACT_APP_API}${endpoint}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response;
  } catch (error) {
    console.error(`API call failed (${method} ${endpoint}):`, error);
    throw error;
  }
};

// Fonctions API spécifiques
export const createOrUpdateUser = async () => {
  return await authenticatedApiCall("POST", "/user/create-or-update-user");
};
