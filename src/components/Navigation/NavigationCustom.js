import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppstoreOutlined,
  UserAddOutlined,
  UserOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
} from "@ant-design/icons";

function NavigationCustom({ paths }) {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {/* Logo/Brand */}
        <Link className="navbar-brand" to="/">
          <AppstoreOutlined /> E-Commerce
        </Link>

        {/* Bouton toggle pour mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu de navigation */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {/* Éléments de gauche */}
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                to="/"
              >
                <AppstoreOutlined /> Home
              </Link>
            </li>
          </ul>

          {/* Éléments de droite */}
          <ul className="navbar-nav">
            {paths.map((item) => {
              // Ignorer les éléments spéciaux comme le spacer
              if (item.key === "spacer" || item.disabled) {
                return null;
              }

              return (
                <li key={item.key} className="nav-item">
                  <div className="nav-link">{item.label}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavigationCustom;
