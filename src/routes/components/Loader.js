// src/components/Loader.js
import React from "react";
import logo from "../../assets/eshop1.jpg"; // chemin vers ton logo
import "./Loader.css"; // pour l’animation

export default function Loader() {
  return (
    <div className="loader-container">
      <img src={logo} alt="Logo" className="logo-loader" />
    </div>
  );
}
