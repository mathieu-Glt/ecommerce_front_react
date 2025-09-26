import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/userContext";
import { useSelector } from "react-redux";

const RouteTest = () => {
  const { user, userLocalStorage, loading } = useUser();
  const reduxState = useSelector((state) => state);
  const reduxUser = reduxState?.user?.user;

  const authenticatedUser = reduxUser || userLocalStorage || user;

  return (
    <div
      style={{
        position: "fixed",
        top: "80px",
        right: "10px",
        background: "white",
        border: "2px solid #333",
        padding: "10px",
        borderRadius: "5px",
        zIndex: 9999,
        fontSize: "12px",
        maxWidth: "300px",
      }}
    >
      <h4>🔗 Route Test</h4>
      <div>
        <strong>Loading:</strong> {loading ? "✅" : "❌"}
      </div>
      <div>
        <strong>Authenticated:</strong> {authenticatedUser ? "✅" : "❌"}
      </div>

      <div style={{ marginTop: "10px" }}>
        <h5>Test Links:</h5>
        <div style={{ marginBottom: "5px" }}>
          <Link
            to="/shopping-cart"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            🛒 Shopping Cart
          </Link>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <Link
            to="/admin"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            ⚙️ Admin
          </Link>
        </div>
        <div style={{ marginBottom: "5px" }}>
          <Link to="/" style={{ color: "blue", textDecoration: "underline" }}>
            🏠 Home
          </Link>
        </div>
      </div>

      {authenticatedUser && (
        <div
          style={{ marginTop: "10px", padding: "5px", background: "#e8f5e8" }}
        >
          <strong>✅ Should be able to access protected routes</strong>
        </div>
      )}

      {!authenticatedUser && (
        <div
          style={{ marginTop: "10px", padding: "5px", background: "#ffe8e8" }}
        >
          <strong>❌ Cannot access protected routes</strong>
        </div>
      )}
    </div>
  );
};

export default RouteTest;
