import React, { useEffect } from "react";
import { useUser } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/eshop1.jpg";

function Cart() {
  const navigate = useNavigate();
  const { user, profile, loading } = useUser();

  useEffect(() => {
    console.log("Cart - Debug Info:");
    console.log("  user:", user);
    console.log("  profile:", profile);
    console.log("  loading:", loading);

    // ✅ Attendre que le chargement soit terminé
    if (!loading) {
      if (!user) {
        console.log("Cart - Pas d'utilisateur, redirection vers login");
        navigate("/login");
      } else {
        console.log("Cart - Utilisateur connecté, affichage du panier");
      }
    }
  }, [user, profile, loading, navigate]);

  // ✅ Afficher un message de chargement pendant la vérification
  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <img src={logo} alt="Logo" className="logo-loader" />
          </div>
          <p className="mt-2">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // ✅ Rediriger si pas d'utilisateur
  if (!user) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="alert alert-warning">
            <p>You must be logged in to access the cart.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1>My Cart</h1>
      <p>Welcome {profile?.firstname || user.email} !</p>
      <div className="alert alert-info">Your cart is empty for the moment.</div>

      {/* Debug info */}
      <div className="mt-4 p-3 bg-light rounded">
        <h6>Debug Info:</h6>
        <p>
          <strong>User UID:</strong> {user.uid}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Profile:</strong> {JSON.stringify(profile, null, 2)}
        </p>
      </div>
    </div>
  );
}

export default Cart;
