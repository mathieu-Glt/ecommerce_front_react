import React from "react";
import PropTypes from "prop-types";
import { isCloudinaryImage } from "../utils/cloudinaryUtils";

const CloudinaryStats = ({ images = [] }) => {
  const cloudinaryImages = images.filter((img) => isCloudinaryImage(img));
  const localImages = images.filter((img) => !isCloudinaryImage(img));

  const totalImages = images.length;
  const cloudinaryCount = cloudinaryImages.length;
  const localCount = localImages.length;

  if (totalImages === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center text-gray-600">
          <span className="mr-2">📸</span>
          <span className="text-sm">Aucune image sélectionnée</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="mr-2">☁️</span>
          <span className="text-sm font-medium text-blue-800">
            Statistiques Cloudinary
          </span>
        </div>
        <div className="text-xs text-blue-600">
          {totalImages} image{totalImages > 1 ? "s" : ""} au total
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-blue-700">Cloudinary:</span>
          <span className="font-medium text-blue-800">{cloudinaryCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Local:</span>
          <span className="font-medium text-gray-700">{localCount}</span>
        </div>
      </div>

      {cloudinaryCount > 0 && (
        <div className="mt-2 text-xs text-blue-600">
          ✅ {cloudinaryCount} image{cloudinaryCount > 1 ? "s" : ""} optimisée
          {cloudinaryCount > 1 ? "s" : ""} par Cloudinary
        </div>
      )}
    </div>
  );
};

CloudinaryStats.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
};

export default CloudinaryStats;



