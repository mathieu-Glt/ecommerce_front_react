import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Cart from "./components/Cart/Cart";
import ComponentNotFound from "./components/404NotFound/HandleRouteNotFound";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./contexts/userContext";
import RequireAuth from "./guards/RequireAuth";
import { useSelector } from "react-redux";
import AppRoutes from "./routes";
import SessionExpiryModal from "./components/SessionExpiryModal";

function App() {
  const { user } = useSelector((state) => state.user);
  console.log("user: ", user);

  return (
    <div className="App">
      <ToastContainer />
      <UserProvider>
        <Router>
          <Header />
          <AppRoutes /> {/* ✅ toutes les routes de l'application sont ici */}
          <SessionExpiryModal /> {/* ✅ Modal de gestion de session */}
        </Router>
      </UserProvider>
      <Footer />
    </div>
  );
}

export default App;
