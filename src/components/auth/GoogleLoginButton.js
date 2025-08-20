import React from "react";
import { GoogleOutlined } from "@ant-design/icons";

/**
 * Composant bouton de connexion Google
 */
const GoogleLoginButton = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      className="btn btn-danger"
      disabled={loading}
      block
      shape="round"
      size="large"
      icon={<GoogleOutlined />}
    >
      {loading ? "Connexion en cours..." : "Login with Google"}
    </button>
  );
};

export default GoogleLoginButton;


