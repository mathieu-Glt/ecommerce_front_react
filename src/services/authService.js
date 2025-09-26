// import {
//   signInWithEmailAndPassword,
//   GoogleAuthProvider,
//   signInWithPopup,
// } from "firebase/auth";
// import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
// import { auth, db } from "../config/firebase";
// import { createOrUpdateUser, loginWithEmail, register } from "../api/auth";

// /**
//  * Service d'authentification
//  * Gère toute la logique d'authentification Firebase
//  */
// class AuthService {
//   /**
//    * Connexion avec email et mot de passe
//    */
//   static async loginWithEmail(email, password) {
//     try {
//       // ✅ Utiliser l'API MongoDB pour l'authentification
//       console.log("Authentification MongoDB en cours...");

//       const data = await loginWithEmail(email, password);

//       if (!data.success) {
//         throw new Error(data.error || "Authentification échouée");
//       }

//       // Formater la réponse pour correspondre au format attendu
//       const user = {
//         uid: data.user._id,
//         email: data.user.email,
//         firstname: data.user.name?.split(" ")[0] || "User",
//         lastname: data.user.name?.split(" ").slice(1).join(" ") || "Test",
//         role: data.user.role,
//       };

//       return {
//         user,
//         token: data.token,
//         profile: {
//           firstname: user.firstname,
//           lastname: user.lastname,
//         },
//       };

//       /*
//       // Code Firebase original (commenté temporairement)
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const user = userCredential.user;
//       const token = await user.getIdToken(true);

//       // Récupérer le profil utilisateur
//       const userProfile = await this.getUserProfile(user.uid);

//       // Créer ou mettre à jour l'utilisateur côté serveur
//       await this.createOrUpdateUserOnServer(token);

//       return {
//         user: {
//           uid: user.uid,
//           email: user.email,
//           firstname: userProfile.firstname || null,
//           lastname: userProfile.lastname || null,
//         },
//         token,
//         profile: userProfile,
//       };
//       */
//     } catch (error) {
//       console.error("Erreur lors de la connexion email:", error);
//       throw error;
//     }
//   }

//   /**
//    * Connexion avec Google
//    */
//   async loginWithGoogle() {
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       console.log("loginWithGoogle result :", result);
//       const user = result.user;
//       const token = await user.getIdToken(true);
//       console.log("loginWithGoogle token :", token);
//       // Récupérer ou créer le profil utilisateur
//       const userProfile = await this.getOrCreateGoogleUserProfile(user);
//       console.log("loginWithGoogle userProfile :", userProfile);

//       // Créer ou mettre à jour l'utilisateur côté serveur
//       const userOnServer = await this.createOrUpdateUserOnServer(token);
//       console.log("loginWithGoogle userOnServer :", userOnServer);

//       return {
//         user: {
//           uid: user.uid,
//           email: user.email,
//           firstname:
//             userProfile.firstname || user.displayName?.split(" ")[0] || null,
//           lastname:
//             userProfile.lastname ||
//             user.displayName?.split(" ").slice(1).join(" ") ||
//             null,
//         },
//         token,
//         profile: userProfile,
//       };
//     } catch (error) {
//       console.error("Erreur lors de la connexion Google:", error);
//       throw error;
//     }
//   }

//   /**
//    * Récupérer le profil utilisateur depuis Firestore
//    */
//   // async getUserProfile(uid) {
//   //   try {
//   //     const userDocRef = doc(db, "users", uid);
//   //     const userDoc = await getDoc(userDocRef);

//   //     if (userDoc.exists()) {
//   //       return userDoc.data();
//   //     }
//   //     return {};
//   //   } catch (error) {
//   //     console.error("Erreur lors de la récupération du profil:", error);
//   //     return {};
//   //   }
//   // }

//   /**
//    * Récupérer ou créer le profil utilisateur Google
//    */
//   async getOrCreateGoogleUserProfile(user) {
//     try {
//       const userDocRef = doc(db, "users", user.uid);
//       const userDoc = await getDoc(userDocRef);

//       if (userDoc.exists()) {
//         return userDoc.data();
//       }

//       // Créer un nouveau profil utilisateur
//       const newUserProfile = {
//         uid: user.uid,
//         email: user.email,
//         firstname: user.displayName?.split(" ")[0] || null,
//         lastname: user.displayName?.split(" ").slice(1).join(" ") || null,
//         displayName: user.displayName,
//         photoURL: user.photoURL,
//         providerId: user.providerData[0]?.providerId || "google.com",
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       };

//       await setDoc(userDocRef, newUserProfile, { merge: true });
//       console.log("Profil Google créé dans Firestore");

//       return newUserProfile;
//     } catch (error) {
//       console.error("Erreur lors de la création du profil Google:", error);
//       throw error;
//     }
//   }

//   /**
//    * Inscription d'un nouvel utilisateur
//    */
//   static async register(userData) {
//     console.log("User data:", userData);
//     try {
//       console.log("Inscription MongoDB en cours...");

//       const data = await register(userData);
//       console.log("Réponse du serveur:", data);

//       if (!data.success) {
//         throw new Error(data.error || "Inscription échouée");
//       }

//       // Formater la réponse pour correspondre au format attendu
//       const user = {
//         uid: data.user._id,
//         email: data.user.email,
//         firstname: data.user.firstname || "User",
//         lastname: data.user.lastname || "Test",
//         picture: data.user.picture,
//         address: data.user.address || "",
//         role: "user",
//       };

//       return {
//         user,
//         token: data.token,
//         profile: {
//           firstname: user.firstname,
//           lastname: user.lastname,
//           picture: user.picture,
//           address: user.address,
//           role: user.role,
//         },
//       };
//     } catch (error) {
//       console.error("Erreur lors de l'inscription:", error);
//       throw error;
//     }
//   }

//   /**
//    * Créer ou mettre à jour l'utilisateur côté serveur
//    */
//   async createOrUpdateUserOnServer(token) {
//     try {
//       const userToken = await createOrUpdateUser(token);
//       console.log("loginWithGoogle userToken :", userToken);
//       return userToken;
//     } catch (error) {
//       console.error(
//         "Erreur lors de la création/mise à jour côté serveur:",
//         error
//       );
//       throw error;
//     }
//   }

//   /**
//    * Formater le nom d'affichage pour les messages de bienvenue
//    */
//   // formatDisplayName(userProfile, email) {
//   //   return (
//   //     userProfile.firstname ||
//   //     userProfile.lastname ||
//   //     email.replace(".gmx@hotmail.fr", "") ||
//   //     "Utilisateur"
//   //   );
//   // }
// }

// export default AuthService;
