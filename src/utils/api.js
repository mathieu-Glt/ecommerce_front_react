import axios from "axios";
import { auth } from "../config/firebase";

// Function to validate if a token is a Firebase ID token
export const isValidFirebaseToken = (token) => {
  if (!token) return false;

  // Firebase ID tokens start with this specific header
  return token.startsWith("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9");
};

// Function to get a fresh Firebase ID token
export const getFreshFirebaseToken = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No authenticated user found");
    }

    // Force refresh to get a fresh token
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

// Function to make authenticated API calls
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

// Specific API functions
export const createOrUpdateUser = async () => {
  return await authenticatedApiCall("POST", "/user/create-or-update-user");
};
