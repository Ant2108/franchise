import { Outlet } from "react-router-dom";
import WarehouseAdminSideBar from "./AdminSideBar";
import "./AdminPage.css";
import { useState } from "react"
import AIChatbox from "../features/AIchat/AIChatbox";
const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="admin-layout">
      {/* --- SIDEBAR CỐ ĐỊNH --- */}
        <WarehouseAdminSideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* --- CONTENT CHÍNH --- */}
      <main className={`admin-content ${isCollapsed ? "expanded" : ""}`}>
        <Outlet />
      </main>
      <AIChatbox />
    </div>
    
  );
};

export default AdminLayout;
