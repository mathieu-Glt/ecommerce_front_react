# 🎯 Guide d'utilisation du hook `useToast`

## 📋 Vue d'ensemble

Le hook `useToast` centralise la gestion des notifications dans l'application. Il évite la répétition de code et fournit une interface cohérente pour tous les types de notifications.

## 🚀 Installation et utilisation

```javascript
import useToast from "../hooks/useToast";

function MonComposant() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  // Utilisation simple
  showSuccess("Opération réussie !");
  showError("Une erreur s'est produite");
}
```

## 🎨 Méthodes disponibles

### Méthodes de base

| Méthode                        | Description                      | Exemple                              |
| ------------------------------ | -------------------------------- | ------------------------------------ |
| `showSuccess(message, config)` | Affiche un toast de succès       | `showSuccess("Opération réussie !")` |
| `showError(message, config)`   | Affiche un toast d'erreur        | `showError("Erreur de connexion")`   |
| `showWarning(message, config)` | Affiche un toast d'avertissement | `showWarning("Attention !")`         |
| `showInfo(message, config)`    | Affiche un toast d'information   | `showInfo("Information importante")` |

### Méthodes avancées

| Méthode                             | Description                     | Exemple                                        |
| ----------------------------------- | ------------------------------- | ---------------------------------------------- |
| `showLoading(message, config)`      | Affiche un toast de chargement  | `const toastId = showLoading("Chargement...")` |
| `updateToSuccess(toastId, message)` | Met à jour un toast vers succès | `updateToSuccess(toastId, "Terminé !")`        |
| `updateToError(toastId, message)`   | Met à jour un toast vers erreur | `updateToError(toastId, "Échec !")`            |
| `dismissToast(toastId)`             | Ferme un toast spécifique       | `dismissToast(toastId)`                        |
| `dismissAll()`                      | Ferme tous les toasts           | `dismissAll()`                                 |

## 🎯 Messages prédéfinis

### Messages d'authentification

```javascript
const { auth } = useToast();

// Utilisation
auth.loginSuccess("John Doe"); // "Welcome back John Doe !"
auth.loginError; // "Login failed"
auth.googleLoginSuccess; // "Login with Google success"
auth.logoutSuccess; // "Logout successful"
auth.registerSuccess; // "Registration successful"
auth.profileUpdated; // "Profile updated successfully"
```

### Messages CRUD

```javascript
const { crud } = useToast();

// Utilisation
crud.createSuccess("Product"); // "Product created successfully"
crud.updateSuccess("User"); // "User updated successfully"
crud.deleteSuccess("Item"); // "Item deleted successfully"
crud.fetchError("Products"); // "Failed to load Products"
```

### Messages de validation

```javascript
const { validation } = useToast();

// Utilisation
validation.requiredField("Email"); // "Email is required"
validation.invalidEmail; // "Please enter a valid email address"
validation.passwordTooShort; // "Password must be at least 6 characters"
validation.passwordsDoNotMatch; // "Passwords do not match"
```

### Messages d'erreurs réseau

```javascript
const { network } = useToast();

// Utilisation
network.connectionError; // "Connection error. Please check your internet connection."
network.serverError; // "Server error. Please try again later."
network.unauthorized; // "Unauthorized access. Please login again."
network.forbidden; // "Access forbidden. You don't have permission."
```

## 🔄 Exemples d'utilisation avancée

### 1. Toast de chargement avec mise à jour

```javascript
const { showLoading, updateToSuccess, updateToError } = useToast();

const handleAsyncOperation = async () => {
  const loadingToast = showLoading("Sauvegarde en cours...");

  try {
    await saveData();
    updateToSuccess(loadingToast, "Données sauvegardées !");
  } catch (error) {
    updateToError(loadingToast, "Erreur de sauvegarde");
  }
};
```

### 2. Utilisation avec messages prédéfinis

```javascript
const { auth, showError } = useToast();

const handleLogin = async () => {
  try {
    await loginUser();
    auth.loginSuccess(user.displayName);
  } catch (error) {
    showError(auth.loginError);
  }
};
```

### 3. Configuration personnalisée

```javascript
const { showSuccess } = useToast();

// Configuration personnalisée
showSuccess("Message personnalisé", {
  position: "bottom-center",
  autoClose: 5000,
  hideProgressBar: true,
});
```

## 🎨 Configuration par défaut

```javascript
const defaultConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};
```

## 🔧 Intégration avec useCrudOperations

Le hook `useCrudOperations` utilise `useToast` pour gérer automatiquement les notifications :

```javascript
import useCrudOperations from "../hooks/useCrudOperations";

function MonComposant() {
  const { createItem, updateItem, deleteItem } = useCrudOperations();

  const handleCreate = async () => {
    const result = await createItem(
      () => api.createProduct(data), // Fonction API
      "product", // Nom de l'item
      "Produit créé avec succès !" // Message personnalisé (optionnel)
    );

    if (result.success) {
      // Succès automatiquement géré par le hook
    }
  };
}
```

## 📝 Bonnes pratiques

### ✅ À faire

- Utiliser les messages prédéfinis quand possible
- Utiliser `showLoading` pour les opérations longues
- Personnaliser les messages selon le contexte
- Gérer les erreurs avec des messages appropriés

### ❌ À éviter

- Répéter le même message partout
- Utiliser `toast` directement au lieu du hook
- Oublier de gérer les états de chargement
- Afficher des messages trop techniques à l'utilisateur

## 🎯 Avantages

1. **Cohérence** : Tous les toasts ont le même style et comportement
2. **Maintenabilité** : Centralisation de la logique des notifications
3. **Réutilisabilité** : Messages prédéfinis réutilisables
4. **Flexibilité** : Configuration personnalisable par toast
5. **Performance** : Évite la répétition de code

## 🔄 Migration depuis `toast` direct

### Avant (❌)

```javascript
import { toast } from "react-toastify";

toast.success("Opération réussie !");
toast.error("Erreur de connexion");
```

### Après (✅)

```javascript
import useToast from "../hooks/useToast";

const { showSuccess, showError } = useToast();

showSuccess("Opération réussie !");
showError("Erreur de connexion");
```

## 📚 Ressources supplémentaires

- [Documentation react-toastify](https://fkhadra.github.io/react-toastify/)
- [Guide des hooks personnalisés](https://reactjs.org/docs/hooks-custom.html)
- [Patterns de gestion d'état](https://reactjs.org/docs/thinking-in-react.html)






