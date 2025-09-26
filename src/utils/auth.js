import { auth } from "../config/firebase";
import { isValidFirebaseToken } from "./api";

// Function to clear all authentication data
export const clearAuthData = () => {
  try {
    // Clear localStorage
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("pendingUserProfile");

    // Clear any other auth-related data
    window.localStorage.removeItem("emailForRegistration");

    console.log("All authentication data cleared");
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
};

// Function to validate and clean stored tokens
export const validateAndCleanTokens = () => {
  try {
    const storedToken = window.localStorage.getItem("token");

    if (storedToken && !isValidFirebaseToken(storedToken)) {
      console.log("Invalid token found in localStorage, clearing...");
      window.localStorage.removeItem("token");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error validating tokens:", error);
    return false;
  }
};

// Function to force logout and clear everything
export const forceLogout = async () => {
  try {
    // Clear all data
    clearAuthData();

    // Sign out from Firebase
    await auth.signOut();

    console.log("Force logout completed");
  } catch (error) {
    console.error("Error during force logout:", error);
  }
};






