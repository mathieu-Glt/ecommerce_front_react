import React, { useState } from "react";
import {
  AppstoreOutlined,
  UserAddOutlined,
  LoginOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

function Navigation({ handleClick, currentUrl, paths }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Menu
        onClick={handleClick}
        selectedKeys={[currentUrl]}
        mode="horizontal"
        items={paths}
        style={{
          flex: 1,
          width: "100%",
          // ✅ Désactiver le menu burger
          overflow: "visible",
          borderBottom: "1px solid #f0f0f0",
        }}
        // ✅ Forcer l'affichage horizontal
        overflowedIndicator={null}
        // ✅ Désactiver la responsivité automatique
        collapsed={false}
        collapsedWidth={0}
      />
    </div>
  );
}

export default Navigation;
