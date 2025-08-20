import React, { useState } from "react";
import {
  HomeOutlined,
  AppstoreOutlined,
  SearchOutlined,
  UserAddOutlined,
  UserOutlined,
  LogoutOutlined,
  MailOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import Navigation from "../Navigation/Navigation";
import NavigationCustom from "../Navigation/NavigationCustom";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/userContext";
import Logout from "../Logout/Logout";
import Test from "../test/test";

function Header() {
  const [currentUrl, setCurrentUrl] = useState("/");
  const { user } = useUser();
  console.log("user: ", user);

  const handleClick = (e) => {
    setCurrentUrl(e.key);
  };

  const paths = [
    {
      label: <Link to="/">Home</Link>,
      key: "home",
      icon: <AppstoreOutlined />,
    },
    // Afficher Register/Login seulement si l'utilisateur n'est pas connecté
    ...(!user
      ? [
          {
            label: <Link to="/register">Register</Link>,
            key: "register",
            icon: <UserAddOutlined />,
          },
          {
            label: <Link to="/login">Login</Link>,
            key: "login",
            icon: <UserOutlined />,
          },
        ]
      : []),
    {
      // élément vide invisible pour pousser le suivant vers la droite
      label: <span style={{ flex: 1 }}></span>,
      key: "spacer",
      disabled: true,
    },
    // Afficher le panier et logout seulement si l'utilisateur est connecté
    ...(user
      ? [
          {
            label: <Link to="/shopping-cart">My shopping cart</Link>,
            key: "shopping-cart",
            icon: <ShoppingCartOutlined />,
          },
          {
            label: <Logout />,
            key: "logout",
            icon: <LogoutOutlined />,
          },
          {
            label: <Link to="/admin">Test</Link>,
            key: "admin",
            icon: <SettingOutlined />,
          },
        ]
      : []),
  ];

  return (
    <div>
      {/* ✅ Utiliser la navigation personnalisée au lieu d'Ant Design */}
      <NavigationCustom paths={paths} />

      {/* ❌ Ancienne navigation Ant Design (commentée) */}
      {/* <Navigation
        handleClick={handleClick}
        currentUrl={currentUrl}
        paths={paths}
      /> */}
    </div>
  );
}

export default Header;
