import React from "react";
import PropTypes from "prop-types";
import {
  isCloudinaryImage,
  getThumbnailUrl,
  getResponsiveImageUrl,
} from "../utils/cloudinaryUtils";

const CloudinaryImage = ({
  src,
  alt,
  className = "",
  size = "medium", // small, medium, large, custom
  customSize = null,
  showCloudinaryBadge = false,
  loading = "lazy",
  ...props
}) => {
  // Déterminer la taille de l'image
  const getImageSize = () => {
    if (customSize) return customSize;

    switch (size) {
      case "small":
        return 150;
      case "medium":
        return 300;
      case "large":
        return 600;
      default:
        return 300;
    }
  };

  // Générer l'URL optimisée
  const getOptimizedUrl = () => {
    if (!src) return null;

    if (isCloudinaryImage(src)) {
      const imageSize = getImageSize();
      return getThumbnailUrl(src, imageSize);
    }

    // Pour les images non-Cloudinary, retourner l'URL originale
    if (src.startsWith("http")) {
      return src;
    }

    // Pour les images locales
    if (src.startsWith("/uploads/")) {
      return `${process.env.REACT_APP_API}${src}`;
    }

    return `${process.env.REACT_APP_API}/uploads/${src}`;
  };

  const optimizedUrl = getOptimizedUrl();

  if (!optimizedUrl) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
      >
        <span className="text-gray-400 text-sm">Aucune image</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        src={optimizedUrl}
        alt={alt}
        className={className}
        loading={loading}
        {...props}
      />

      {/* Badge Cloudinary (optionnel) */}
      {showCloudinaryBadge && isCloudinaryImage(src) && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold opacity-75">
          ☁️ Cloudinary
        </div>
      )}
    </div>
  );
};

CloudinaryImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large", "custom"]),
  customSize: PropTypes.number,
  showCloudinaryBadge: PropTypes.bool,
  loading: PropTypes.oneOf(["lazy", "eager"]),
};

export default CloudinaryImage;



