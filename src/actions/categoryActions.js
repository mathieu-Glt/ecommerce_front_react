import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/category";

// Récupérer toutes les catégories
export const fetchCategories = (token) => async (dispatch) => {
  console.log(
    "🚀 Début fetchCategories avec token:",
    token ? "Présent" : "Manquant"
  );
  dispatch({ type: "FETCH_CATEGORIES_START" });
  try {
    const data = await getCategories(token);
    console.log("🔍 Données reçues dans fetchCategories:", data);
    console.log("📊 Type de données:", typeof data);
    console.log("📊 Est un tableau:", Array.isArray(data));
    dispatch({ type: "FETCH_CATEGORIES_SUCCESS", payload: data });
    console.log("✅ Action FETCH_CATEGORIES_SUCCESS dispatchée");
  } catch (err) {
    console.error("❌ Erreur dans fetchCategories:", err);
    dispatch({ type: "FETCH_CATEGORIES_ERROR", payload: err.message });
  }
};

// Créer une catégorie
export const createNewCategory = (categoryData, token) => async (dispatch) => {
  dispatch({ type: "CREATE_CATEGORY_START" });
  try {
    const data = await createCategory(categoryData, token);
    dispatch({ type: "CREATE_CATEGORY_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "CREATE_CATEGORY_ERROR", payload: err.message });
  }
};

// Mettre à jour une catégorie
export const updateExistingCategory =
  (id, categoryData, token) => async (dispatch) => {
    dispatch({ type: "UPDATE_CATEGORY_START" });
    try {
      const data = await updateCategory(id, categoryData, token);
      dispatch({ type: "UPDATE_CATEGORY_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "UPDATE_CATEGORY_ERROR", payload: err.message });
    }
  };

// Supprimer une catégorie
export const deleteExistingCategory = (id, token) => async (dispatch) => {
  dispatch({ type: "DELETE_CATEGORY_START" });
  try {
    await deleteCategory(id, token);
    dispatch({ type: "DELETE_CATEGORY_SUCCESS", payload: id });
  } catch (err) {
    dispatch({ type: "DELETE_CATEGORY_ERROR", payload: err.message });
  }
};
