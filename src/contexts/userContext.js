import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { clearAuthData, validateAndCleanTokens } from "../utils/auth";
import useLocalStorage from "../hooks/useLocalStorage";
import { useDispatch } from "react-redux";
import { currentUser } from "../api/auth";

const UserContext = createContext({
  user: null,
  profile: null,
  loading: true,
  updateProfile: () => {},
  logout: () => {},
});

export const UserProvider = ({ children, realtime = true }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Utilisation du hook useLocalStorage
  const [userLocalStorage, setUserLocalStorage, removeUserLocalStorage] =
    useLocalStorage("user", null);
  const [token, setTokenLocalStorage, removeTokenLocalStorage] =
    useLocalStorage("token", null);

  // ✅ Synchroniser avec sessionStorage
  const syncWithSessionStorage = (userData, userToken) => {
    try {
      if (userData) {
        sessionStorage.setItem("user", JSON.stringify(userData));
      } else {
        sessionStorage.removeItem("user");
      }

      if (userToken) {
        sessionStorage.setItem("token", userToken);
      } else {
        sessionStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation sessionStorage:", error);
    }
  };

  // ✅ Synchroniser avec Redux
  const syncWithRedux = (userData, userToken) => {
    try {
      if (userData && userToken) {
        dispatch({
          type: "LOGGED_IN_USER",
          payload: { user: userData, token: userToken },
        });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    } catch (error) {
      console.error("Erreur lors de la synchronisation Redux:", error);
    }
  };

  // Fonction pour mettre à jour le profil
  const updateProfile = async (newProfileData) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          ...newProfileData,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // ✅ Mettre à jour le localStorage avec le hook
      if (userLocalStorage) {
        const updatedLocalUser = {
          ...userLocalStorage,
          ...newProfileData,
        };
        setUserLocalStorage(updatedLocalUser);

        // ✅ Synchroniser avec sessionStorage et Redux
        syncWithSessionStorage(updatedLocalUser, token);
        syncWithRedux(updatedLocalUser, token);
      }

      console.log("Profil mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    // ✅ Utiliser les fonctions du hook pour nettoyer
    removeUserLocalStorage();
    removeTokenLocalStorage();

    // ✅ Nettoyer sessionStorage et Redux
    syncWithSessionStorage(null, null);
    syncWithRedux(null, null);

    clearAuthData();
    auth.signOut();
  };

  // Clear any old tokens on initialization to ensure we use fresh Firebase tokens
  useEffect(() => {
    validateAndCleanTokens();
  }, []);

  useEffect(() => {
    const off = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Firebase Auth State Changed:", firebaseUser);

      if (!firebaseUser) {
        // Utilisateur déconnecté
        setUser(null);
        setProfile(null);
        setLoading(false);

        // ✅ Nettoyer sessionStorage et Redux
        syncWithSessionStorage(null, null);
        syncWithRedux(null, null);
        return;
      }

      // Utilisateur connecté
      setUser(firebaseUser);

      // ✅ Les données localStorage sont déjà disponibles via le hook
      console.log("Données localStorage:", userLocalStorage);

      // Récupérer les données Firestore
      const userDocRef = doc(db, "users", firebaseUser.uid);

      try {
        if (realtime) {
          // Écouter les changements en temps réel
          const unsubscribe = onSnapshot(userDocRef, (snap) => {
            const firestoreData = snap.exists() ? snap.data() : {};
            console.log("Données Firestore:", firestoreData);

            // Fusionner les données localStorage et Firestore
            const mergedProfile = {
              ...userLocalStorage, // localStorage en premier
              ...firestoreData, // Firestore en second (écrase localStorage si conflit)
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              emailVerified: firebaseUser.emailVerified,
              providerId:
                (firebaseUser.providerData &&
                  firebaseUser.providerData[0]?.providerId) ||
                "firebase",
            };

            setProfile(mergedProfile);
            setLoading(false);

            // ✅ Synchroniser avec sessionStorage et Redux
            syncWithSessionStorage(mergedProfile, token);
            syncWithRedux(mergedProfile, token);
          });

          return () => unsubscribe();
        } else {
          // Récupération unique
          const snap = await getDoc(userDocRef);
          const firestoreData = snap.exists() ? snap.data() : {};
          console.log("Données Firestore:", firestoreData);
          // Récuperer le token de l'utilisateur
          const token = sessionStorage.getItem("token");
          console.log("Token:", token);
          // Récupérer le token de l'utilisateur de Firebase
          const userToken = await auth.currentUser.getIdToken();
          console.log("User Token:", userToken);
          // currentUser
          if (userToken) {
            const currentUserResponse = await currentUser(userToken);
            console.log("Données currentUser:", currentUserResponse);
          } else {
            const currentUserResponse = await currentUser(token);
            console.log("Données currentUser:", currentUserResponse);
          }

          // Fusionner les données
          const mergedProfile = {
            ...userLocalStorage,
            ...firestoreData,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified,
            providerId:
              (firebaseUser.providerData &&
                firebaseUser.providerData[0]?.providerId) ||
              "firebase",
          };

          setProfile(mergedProfile);
          setLoading(false);

          // ✅ Synchroniser avec sessionStorage et Redux
          syncWithSessionStorage(mergedProfile, token);
          syncWithRedux(mergedProfile, token);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        // En cas d'erreur, utiliser au moins les données localStorage
        if (userLocalStorage) {
          const fallbackProfile = {
            ...userLocalStorage,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified,
            providerId:
              (firebaseUser.providerData &&
                firebaseUser.providerData[0]?.providerId) ||
              "firebase",
          };

          setProfile(fallbackProfile);

          // ✅ Synchroniser avec sessionStorage et Redux
          syncWithSessionStorage(fallbackProfile, token);
          syncWithRedux(fallbackProfile, token);
        }
        setLoading(false);
      }
    });

    return () => off();
  }, [realtime, userLocalStorage, token, dispatch]); // ✅ Ajouter dispatch comme dépendance

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      userLocalStorage,
      token,
      updateProfile,
      logout,
    }),
    [user, profile, loading, userLocalStorage, token]
  );

  console.log("UserContext - value:", value);

  // Debug: afficher les valeurs dans la console
  useEffect(() => {
    console.log("UserContext - userLocalStorage:", userLocalStorage);
    console.log(
      "UserContext - token:",
      token ? token.substring(0, 20) + "..." : "null"
    );
    console.log("UserContext - profile:", profile);
  }, [userLocalStorage, token, profile]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
