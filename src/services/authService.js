import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { createOrUpdateUser } from "../api/auth";

/**
 * Service d'authentification
 * Gère toute la logique d'authentification Firebase
 */
class AuthService {
  /**
   * Connexion avec email et mot de passe
   */
  async loginWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken(true);

      // Récupérer le profil utilisateur
      const userProfile = await this.getUserProfile(user.uid);

      // Créer ou mettre à jour l'utilisateur côté serveur
      await this.createOrUpdateUserOnServer(token);

      return {
        user: {
          uid: user.uid,
          email: user.email,
          firstname: userProfile.firstname || null,
          lastname: userProfile.lastname || null,
        },
        token,
        profile: userProfile,
      };
    } catch (error) {
      console.error("Erreur lors de la connexion email:", error);
      throw error;
    }
  }

  /**
   * Connexion avec Google
   */
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken(true);

      // Récupérer ou créer le profil utilisateur
      const userProfile = await this.getOrCreateGoogleUserProfile(user);

      // Créer ou mettre à jour l'utilisateur côté serveur
      await this.createOrUpdateUserOnServer(token);

      return {
        user: {
          uid: user.uid,
          email: user.email,
          firstname:
            userProfile.firstname || user.displayName?.split(" ")[0] || null,
          lastname:
            userProfile.lastname ||
            user.displayName?.split(" ").slice(1).join(" ") ||
            null,
        },
        token,
        profile: userProfile,
      };
    } catch (error) {
      console.error("Erreur lors de la connexion Google:", error);
      throw error;
    }
  }

  /**
   * Récupérer le profil utilisateur depuis Firestore
   */
  async getUserProfile(uid) {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return userDoc.data();
      }
      return {};
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
      return {};
    }
  }

  /**
   * Récupérer ou créer le profil utilisateur Google
   */
  async getOrCreateGoogleUserProfile(user) {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return userDoc.data();
      }

      // Créer un nouveau profil utilisateur
      const newUserProfile = {
        uid: user.uid,
        email: user.email,
        firstname: user.displayName?.split(" ")[0] || null,
        lastname: user.displayName?.split(" ").slice(1).join(" ") || null,
        displayName: user.displayName,
        photoURL: user.photoURL,
        providerId: user.providerData[0]?.providerId || "google.com",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(userDocRef, newUserProfile, { merge: true });
      console.log("Profil Google créé dans Firestore");

      return newUserProfile;
    } catch (error) {
      console.error("Erreur lors de la création du profil Google:", error);
      throw error;
    }
  }

  /**
   * Créer ou mettre à jour l'utilisateur côté serveur
   */
  async createOrUpdateUserOnServer(token) {
    try {
      await createOrUpdateUser(token);
      console.log("Utilisateur créé/mis à jour côté serveur");
    } catch (error) {
      console.error(
        "Erreur lors de la création/mise à jour côté serveur:",
        error
      );
      throw error;
    }
  }

  /**
   * Formater le nom d'affichage pour les messages de bienvenue
   */
  formatDisplayName(userProfile, email) {
    return (
      userProfile.firstname ||
      userProfile.lastname ||
      email.replace(".gmx@hotmail.fr", "") ||
      "Utilisateur"
    );
  }
}

export default new AuthService();
