import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getCategories } from "../../api/category";
import { getSubs, createSub, updateSub, deleteSub } from "../../api/sub";
import useToast from "../../hooks/useToast";
import SubForm from "./components/subForm";

const AdminSub = () => {
  const { user, token } = useSelector((state) => state.user);
  const {
    showSuccess,
    showError,
    showLoading,
    updateToSuccess,
    updateToError,
    dismissAll,
  } = useToast();

  console.log("👤 Utilisateur connecté:", user);
  console.log("🔑 Token présent:", !!token);

  const [subs, setSubs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  // Charger les catégories et sous-catégories
  useEffect(() => {
    if (token) {
      console.log("🚀 useEffect déclenché - chargement des données");
      loadData();
    }
  }, [token]);

  const loadData = async () => {
    console.log("🔄 Début du chargement des données");
    setLoading(true);
    try {
      console.log(
        "🔍 Chargement des données avec token:",
        token ? "Token présent" : "Token manquant"
      );

      const [categoriesRes, subsRes] = await Promise.all([
        getCategories(token),
        getSubs(token),
      ]);

      console.log("📊 Réponse catégories:", categoriesRes);
      console.log("📊 Réponse sous-catégories:", subsRes);

      // S'assurer que les données sont des tableaux
      const categoriesData = categoriesRes || [];
      const subsData = subsRes || [];

      console.log("📋 Catégories à définir:", categoriesData);
      console.log("📋 Sous-catégories à définir:", subsData);

      setCategories(categoriesData);
      setSubs(subsData);
      console.log("✅ Chargement des données terminé");
    } catch (error) {
      showError("Erreur lors du chargement des données");
      console.error("❌ Error loading data:", error);
      // En cas d'erreur, initialiser avec des tableaux vides
      setCategories([]);
      setSubs([]);
    } finally {
      setLoading(false);
      console.log("🏁 État de chargement mis à false");
    }
  };

  // Soumettre le formulaire
  const handleFormSubmit = async (formData) => {
    if (!formData.name || !formData.slug || !formData.parent) {
      showError("Tous les champs sont requis");
      return;
    }

    // Nettoyer les toasts existants
    dismissAll();

    const loadingToast = showLoading(
      editingSub ? "Mise à jour..." : "Création..."
    );

    try {
      if (editingSub) {
        await updateSub(editingSub.slug, formData, token);
        updateToSuccess(loadingToast, "Sous-catégorie mise à jour avec succès");
      } else {
        await createSub(formData, token);
        updateToSuccess(loadingToast, "Sous-catégorie créée avec succès");
      }

      setEditingSub(null);
      await loadData(); // Attendre que loadData se termine
    } catch (error) {
      // Afficher le message d'erreur spécifique du serveur
      const errorMessage =
        error.response?.data?.message ||
        (editingSub
          ? "Erreur lors de la mise à jour"
          : "Erreur lors de la création");
      updateToError(loadingToast, errorMessage);
      console.error("Error submitting form:", error);
    }
  };

  // Éditer une sous-catégorie
  const handleEdit = (sub) => {
    setEditingSub(sub);
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setEditingSub(null);
  };

  // Supprimer une sous-catégorie
  const handleDelete = async (sub) => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette sous-catégorie ?"
      )
    ) {
      return;
    }

    // Nettoyer les toasts existants
    dismissAll();

    const loadingToast = showLoading("Suppression...");

    try {
      await deleteSub(sub.slug, token);
      updateToSuccess(loadingToast, "Sous-catégorie supprimée avec succès");
      await loadData(); // Attendre que loadData se termine
    } catch (error) {
      updateToError(loadingToast, "Erreur lors de la suppression");
      console.error("Error deleting sub:", error);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestion des Sous-catégories</h1>

      {/* Formulaire */}
      <SubForm
        onSubmit={handleFormSubmit}
        onCancel={handleCancelEdit}
        initialData={editingSub}
        categories={categories}
        loading={loading}
      />

      {/* Liste des sous-catégories */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Sous-catégories existantes
        </h2>

        {!subs || subs.length === 0 ? (
          <p className="text-gray-500">Aucune sous-catégorie trouvée</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie parente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subs &&
                  subs.map((sub) => (
                    <tr key={sub._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sub.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sub.slug}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sub.parent?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(sub)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(sub)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSub;
