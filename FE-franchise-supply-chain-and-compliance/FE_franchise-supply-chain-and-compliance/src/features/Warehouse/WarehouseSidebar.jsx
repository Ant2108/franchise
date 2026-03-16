import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  Truck,
  Package,
  BarChart3,
  Settings,
  Bell,
  LogOut
} from "lucide-react";
import { removeCookie, removeUserRoles } from "../../utils/cookieUtils";

const WarehouseSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      removeCookie("access_token");
      removeCookie("refresh_token");
      removeUserRoles();
      navigate("/login");
    }
  };

  return (
    <aside className="pm-sidebar">
      {/* Brand Logo */}
      <div className="pm-sidebar-header">
        <div className="pm-brand">
          <div className="pm-brand-icon">
            <Package size={20} color="white" />
          </div>
          <span className="pm-brand-text">Ware<span className="pm-brand-highlight">House</span></span>
        </div>
      </div>

      {/* Navigation */}
      <div className="pm-sidebar-menu">
        <p className="pm-sidebar-label">MAIN MENU</p>
        <nav className="pm-nav-group">
          <NavLink to="/warehouse" end className={({ isActive }) => isActive ? "pm-nav-item active" : "pm-nav-item"}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/warehouse/inventory" className={({ isActive }) => isActive ? "pm-nav-item active" : "pm-nav-item"}>
            <Boxes size={18} />
            <span>Inventory</span>
          </NavLink>

          <NavLink to="/warehouse/shipments" className={({ isActive }) => isActive ? "pm-nav-item active" : "pm-nav-item"}>
            <Truck size={18} />
            <span>Outbound</span>
          </NavLink>

          <NavLink to="/warehouse/inbound" className={({ isActive }) => isActive ? "pm-nav-item active" : "pm-nav-item"}>
            <Package size={18} />
            <span>Inbound Orders</span>
          </NavLink>

          <NavLink to="/warehouse/receiving" className={({ isActive }) => isActive ? "pm-nav-item active" : "pm-nav-item"}>
            <Package size={18} />
            <span>Receiving</span>
          </NavLink>

          <NavLink to="/warehouse/reports" className={({ isActive }) => isActive ? "pm-nav-item active" : "pm-nav-item"}>
            <BarChart3 size={18} />
            <span>Reports & Analytics</span>
          </NavLink>
        </nav>

        <p className="pm-sidebar-label" style={{ marginTop: 32 }}>SETTINGS</p>
        <nav className="pm-nav-group">
          <button className="pm-nav-item pm-nav-btn">
            <Settings size={18} />
            <span>Preferences</span>
          </button>
          <button className="pm-nav-item pm-nav-btn">
            <Bell size={18} />
            <span>Notifications</span>
            <span className="pm-sidebar-badge">4</span>
          </button>
        </nav>
      </div>

      {/* User Profile */}
      <div className="pm-sidebar-footer">
        <div className="pm-user-card">
          <img src="https://ui-avatars.com/api/?name=Admin+User&background=c68a53&color=fff" alt="Admin" className="pm-user-avatar" />
          <div className="pm-user-info">
            <span className="pm-user-name">Admin User</span>
            <span className="pm-user-role">Manager</span>
          </div>
          <button className="pm-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default WarehouseSidebar;