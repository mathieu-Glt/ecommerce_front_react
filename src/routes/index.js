// src/routes/index.js
import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import Loadable from "./components/Loadable"; // corrige le chemin si besoin
import Test from "../components/test/test";
import SessionTest from "../components/SessionTest";
// Guards
import RequireAuth from "../guards/RequireAuth";
import RequireRoleAdmin from "../guards/RequireRoleAdmin";

// Authentication
const Register = Loadable(lazy(() => import("../pages/auth/Register")));
const Login = Loadable(lazy(() => import("../pages/auth/Login")));
const ForgotPassword = Loadable(
  lazy(() => import("../pages/auth/ForgotPassword"))
);

// Pages principales
const Home = Loadable(lazy(() => import("../pages/Home")));
const Cart = Loadable(lazy(() => import("../components/Cart/Cart")));
const ElementNotFound = Loadable(
  lazy(() => import("../components/404NotFound/HandleRouteNotFound"))
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          // <RequireAuth>
          <Home />
          // </RequireAuth>
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/shopping-cart"
        element={
          <RequireAuth>
            <Cart />
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireRoleAdmin>
            <Test />
          </RequireRoleAdmin>
        }
      />
      {/* Route temporaire pour debug */}
      {/* Route de test sans protection */}
      <Route path="/test" element={<Test />} />
      <Route path="/session-test" element={<SessionTest />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<ElementNotFound />} />
    </Routes>
  );
}
