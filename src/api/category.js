import { privateApi, publicApi } from "./config/api";

export const getCategories = async () => {
  try {
    const response = await publicApi.get(`/category/categories`);
    console.log("✅ Response getCategories:", response);
    return response;
  } catch (error) {
    console.error(
      "❌ Error getCategories:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getCategoryBySlug = async (slug) => {
  return await publicApi.get(`/category/category/slug/${slug}`);
};

export const getCategory = async (id) => {
  return await privateApi.get(`/category/category/id/${id}`);
};

export const createCategory = async (category) => {
  return await privateApi.post(`/category/category`, category);
};

export const updateCategory = async (id, category) => {
  console.log("🔍 Appel API updateCategory avec ID:", id);
  try {
    const response = await privateApi.put(`/category/category/${id}`, category);
    console.log("✅ Réponse updateCategory:", response);
    return response;
  } catch (error) {
    console.error(
      "❌ Erreur updateCategory:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteCategory = async (id) => {
  console.log("🔍 Appel API deleteCategory avec ID:", id);
  try {
    const response = await privateApi.delete(`/category/category/${id}`);
    console.log("✅ Réponse deleteCategory:", response);
    return response;
  } catch (error) {
    console.error(
      "❌ Erreur deleteCategory:",
      error.response?.data || error.message
    );
    throw error;
  }
};
