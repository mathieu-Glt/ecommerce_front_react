import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CategoryForm from "./components/categoryForm";
import { getCategory, updateCategory } from "../../api/category";
import useToast from "../../hooks/useToast";

const EditCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.user);
  const { showError, showSuccess } = useToast();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    if (!user || user.role !== "admin") {
      showError("Accès non autorisé");
      navigate("/");
      return;
    }

    loadCategory();
  }, [categoryId, user]);

  const loadCategory = async () => {
    try {
      setLoading(true);
      console.log("🔍 Chargement de la catégorie avec ID:", categoryId);
      console.log("🔑 Token:", token ? "Présent" : "Manquant");

      const categoryData = await getCategory(categoryId, token);
      console.log("✅ Catégorie récupérée:", categoryData);

      setCategory(categoryData);
    } catch (error) {
      console.error("❌ Erreur lors du chargement de la catégorie:", error);
      console.error("❌ Détails de l'erreur:", error.response?.data);
      showError("Erreur lors du chargement de la catégorie");
      navigate("/admin/categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryUpdated = async (updatedData) => {
    try {
      setSubmitting(true);
      console.log("🔍 Mise à jour de la catégorie avec ID:", categoryId);
      console.log("📝 Données à mettre à jour:", updatedData);

      await updateCategory(categoryId, updatedData, token);

      showSuccess("Catégorie mise à jour avec succès");
      navigate("/admin/categories");
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour:", error);
      console.error("❌ Détails de l'erreur:", error.response?.data);
      showError("Erreur lors de la mise à jour de la catégorie");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/categories");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Chargement de la catégorie...
          </p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Catégorie non trouvée
          </h3>
          <p className="text-gray-500 mb-6">
            La catégorie que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <button
            onClick={() => navigate("/admin/categories")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            Retour aux catégories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Modifier la catégorie
              </h1>
              <p className="text-gray-600">
                Modifiez les informations de la catégorie "{category.name}"
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
            >
              Annuler
            </button>
          </div>
        </div>

        {/* Formulaire d'édition */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <CategoryForm
            onSubmit={handleCategoryUpdated}
            initialData={category}
            submitLabel="Mettre à jour"
          />
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
