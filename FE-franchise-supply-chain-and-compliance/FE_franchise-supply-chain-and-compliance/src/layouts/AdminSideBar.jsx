import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Zap, Users, LogOut, BarChart3, Settings, FileText, MapPin, Ticket,Car, ChevronLeft, ChevronRight,Coins, Clock, List, User} from "lucide-react";
import { removeCookie, removeUserRoles } from "../utils/cookieUtils";
import "./AdminSideBar.css";

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [openFolders, setOpenFolders] = useState({});
  const navigate = useNavigate();

  const toggleFolder = (folderName) => {
    if (isCollapsed) setIsCollapsed(false);

    setOpenFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

    const menuStructure = [
    {
      type: "folder",
      name: "Suppiler",
      icon: <Zap size={20} />,
      items: [
        { name: "Quản Lý", path: "/admin/supplier", icon: <MapPin size={18} /> },
      ]
    },
    {
      type: "folder",
      name: "Quản lý Kho bãi",
      icon: <Car size={20} />,
      items: [
        { name: "Nhập hàng", path: "/admin/inbound", icon: <MapPin size={18} /> },
        { name: "Xuất hàng", path: "/admin/outbound", icon: <MapPin size={18} /> },
      ]
    },
    {
      type: "folder",
      name: "Warehouse",
      icon: <BarChart3 size={20} />,
      items: [
        { name: "Warehouse List", path: "/admin/warehouse", icon: <List size={18} /> },
        { name: "Warehouse Manager", path: "/admin/warehouse-manager", icon: <User size={18} /> },
      ]
    },
    {
      type: "folder",
      name: "Tài chính",
      icon: <BarChart3 size={20} />,
      items: [
        { name: "Thống kê doanh thu", path: "###", icon: <BarChart3 size={18} /> },
        { name: "Lịch sử giao dịch", path: "###", icon: <FileText size={18} /> },
        { name: "Mã giảm giá", path: "###", icon: <Ticket size={18} /> },
      ]
    },
    {
      type: "item",
      name: "Cấu hình hệ thống",
      path: "###",
      icon: <Settings size={20} />
    },
  ];

  return (
    <aside className={`admin-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* NÚT MŨI TÊN TRÔI NỔI NẰM Ở MÉP PHẢI (Chuyển ra đây) */}
      <button
        className="toggle-menu-btn"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight size={18} strokeWidth={3} />
        ) : (
          <ChevronLeft size={18} strokeWidth={3} />
        )}
      </button>

      {/* Logo Section */}
      <div className="logo-section">
        <div className="logo-container">
          <div className="logo-icon">S</div>
          <div className="logo-text menu-text">
            <h1>Admin</h1>
            <p>Quản trị hệ thống</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="navigation">
        <div className="nav-items">
          {menuStructure.map((item, index) => {
            if (item.type === "folder") {
              const isOpen = openFolders[item.name];
              return (
                <div key={index} className="nav-folder">
                  <div
                    className="nav-folder-header"
                    onClick={() => toggleFolder(item.name)}
                  >
                    <div className="folder-left">
                      <div className="icon">{item.icon}</div>
                      <span className="menu-text">{item.name}</span>
                    </div>
                    <div className="folder-arrow menu-text">
                      {isOpen ? "▼" : "▶"}
                    </div>
                  </div>
                  {isOpen && (
                    <div
                      className={`nav-folder-items ${isCollapsed ? "hide-folder" : ""}`}
                    >
                      {item.items.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          className={({ isActive }) =>
                            `nav-item nav-subitem ${isActive ? "active" : ""}`
                          }
                        >
                          <div className="icon">{subItem.icon}</div>
                          <span className="menu-text">{subItem.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            } else {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                >
                  <div className="icon">{item.icon}</div>
                  <span className="menu-text">{item.name}</span>
                </NavLink>
              );
            }
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="user-section">
        <div className="user-info">
          <div className="user-avatar">A</div>
          <div className="user-details menu-text">
            <div className="user-name">Quản trị viên</div>
          </div>
        </div>
        <button
          className="logout-btn"
          onClick={() => {
            if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
              removeCookie("access_token");
              removeCookie("refresh_token");
              removeUserRoles();
              navigate("/login");
            }
          }}
        >
          <LogOut size={18} />
          <span className="menu-text">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
