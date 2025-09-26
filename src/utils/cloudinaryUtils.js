// Utilitaires pour gérer les images Cloudinary

/**
 * Génère une URL optimisée pour une image Cloudinary
 * @param {string} url - URL originale de l'image Cloudinary
 * @param {Object} options - Options de transformation
 * @returns {string} URL optimisée
 */
export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url || !url.includes("cloudinary")) {
    return url; // Retourner l'URL originale si ce n'est pas une image Cloudinary
  }

  const {
    width = "auto",
    height = "auto",
    quality = "auto",
    format = "auto",
    crop = "fill",
  } = options;

  // Pour l'instant, retourner l'URL originale pour éviter les erreurs
  // TODO: Implémenter les transformations Cloudinary plus tard
  return url;
};

/**
 * Génère une URL de thumbnail pour une image Cloudinary
 * @param {string} url - URL originale de l'image Cloudinary
 * @param {number} size - Taille du thumbnail (carré)
 * @returns {string} URL du thumbnail
 */
export const getThumbnailUrl = (url, size = 300) => {
  return getOptimizedImageUrl(url, {
    width: size,
    height: size,
    crop: "fill",
    quality: 80,
  });
};

/**
 * Génère une URL responsive pour une image Cloudinary
 * @param {string} url - URL originale de l'image Cloudinary
 * @param {number} maxWidth - Largeur maximale
 * @returns {string} URL responsive
 */
export const getResponsiveImageUrl = (url, maxWidth = 800) => {
  return getOptimizedImageUrl(url, {
    width: maxWidth,
    quality: 85,
    format: "auto",
  });
};

/**
 * Vérifie si une URL est une image Cloudinary
 * @param {string} url - URL à vérifier
 * @returns {boolean} True si c'est une image Cloudinary
 */
export const isCloudinaryImage = (url) => {
  return url && url.includes("cloudinary");
};

/**
 * Extrait le public_id d'une URL Cloudinary
 * @param {string} url - URL Cloudinary
 * @returns {string|null} Public ID ou null
 */
export const getCloudinaryPublicId = (url) => {
  if (!isCloudinaryImage(url)) {
    return null;
  }

  try {
    // Exemple d'URL: https://res.cloudinary.com/dwouvqcis/image/upload/v1756486994/ecommerce/1756486994215_fqozd8cpk.jpg
    const urlParts = url.split("/");

    // Trouver l'index de "upload"
    const uploadIndex = urlParts.findIndex((part) => part === "upload");
    if (uploadIndex === -1) {
      return null;
    }

    // Prendre tout ce qui suit "upload" jusqu'à la fin
    const pathAfterUpload = urlParts.slice(uploadIndex + 1);

    // Ignorer la version (v1756486994) et prendre le reste
    const publicIdParts = pathAfterUpload.slice(1); // Ignorer la version

    return publicIdParts.join("/");
  } catch (error) {
    console.error("Erreur extraction public_id:", error);
    return null;
  }
};
