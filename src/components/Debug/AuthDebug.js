import React from "react";
import { useUser } from "../../contexts/userContext";
import { useSelector } from "react-redux";

const AuthDebug = () => {
  const { user, userLocalStorage, token } = useUser();
  const reduxState = useSelector((state) => state);
  const reduxUser = reduxState?.user?.user;

  const authenticatedUser = userLocalStorage || user || reduxUser;

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
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
      <h4>🔍 Auth Debug</h4>
      <div>
        <strong>user:</strong> {user ? "✅" : "❌"}
      </div>
      <div>
        <strong>userLocalStorage:</strong> {userLocalStorage ? "✅" : "❌"}
      </div>
      <div>
        <strong>reduxUser:</strong> {reduxUser ? "✅" : "❌"}
      </div>
      <div>
        <strong>token:</strong> {token ? "✅" : "❌"}
      </div>
      <div>
        <strong>authenticatedUser:</strong> {authenticatedUser ? "✅" : "❌"}
      </div>

      {userLocalStorage && (
        <div style={{ marginTop: "10px" }}>
          <strong>userLocalStorage data:</strong>
          <pre style={{ fontSize: "10px", overflow: "auto" }}>
            {JSON.stringify(userLocalStorage, null, 2)}
          </pre>
        </div>
      )}

      {token && (
        <div style={{ marginTop: "10px" }}>
          <strong>Token:</strong> {token.substring(0, 20)}...
        </div>
      )}
    </div>
  );
};

export default AuthDebug;
