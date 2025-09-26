// src/pages/auth/OAuthRedirect.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchCurrentUser } from "../actions/authActions";
import { syncAuthData } from "../utils/storageSync";

const OAuthRedirect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  //   useEffect(() => {
  //     const params = new URLSearchParams(location.search);
  //     const tokenFromUrl = params.get("token"); // facultatif, si tu veux juste vérifier
  //     if (tokenFromUrl) {
  //       dispatch(fetchCurrentUser())
  //         .then((res) => {
  //           navigate("/"); // redirection finale
  //         })
  //         .catch(() => navigate("/login"));
  //     } else {
  //       navigate("/login");
  //     }
  //   }, [dispatch, navigate, location]);

  return <p>Connexion en cours...</p>;
};

export default OAuthRedirect;
