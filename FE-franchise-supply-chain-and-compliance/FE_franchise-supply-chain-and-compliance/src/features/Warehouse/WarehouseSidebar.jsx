import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
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
import { WarningOutlined, CloseOutlined, InboxOutlined, SearchOutlined } from "@ant-design/icons";
import WareHouseInventoryLogAPI from "./AdminManager/AdminWareHousePageAPI/AdminWareHouseInventoryLogAPI";

import { removeCookie, removeUserRoles, getCookie } from "../../utils/cookieUtils";

const WarehouseSidebar = () => {

    const navigate = useNavigate();


    const warehouseId = getCookie('warehouse_id');

    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            removeCookie("access_token");
            removeCookie("refresh_token");
            removeUserRoles();
            removeCookie("warehouse_id");
            navigate("/login");
        }
    };

    const [showLowStockModal, setShowLowStockModal] = useState(false);
    const [lowStockAlerts, setLowStockAlerts] = useState([]);
    const [lowStockSearch, setLowStockSearch] = useState("");

    useEffect(() => {
        const fetchLowStockAlerts = async () => {
            try {

                if (!warehouseId) {
                    setLowStockAlerts([]);
                    return;
                }

                const data = await WareHouseInventoryLogAPI.getLowStockAlerts(warehouseId);
                const list = Array.isArray(data) ? data : data?.data ?? [];
                setLowStockAlerts(list);
            } catch (error) {
                console.error("Failed to fetch low stock alerts:", error);
            }
        };

        fetchLowStockAlerts();
    }, [warehouseId]);


    const filteredLowStock = useMemo(() => {
        const q = lowStockSearch.toLowerCase();
        if (!q) return lowStockAlerts;
        return lowStockAlerts.filter((a) =>
            a.ingredientName?.toLowerCase().includes(q) ||
            a.warehouseName?.toLowerCase().includes(q)
        );
    }, [lowStockAlerts, lowStockSearch]);

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
                    <button
                        className={`pm-nav-item pm-nav-btn ${lowStockAlerts.length > 0 ? 'notification-btn' : ''}`}
                        onClick={() => setShowLowStockModal(true)}
                        style={{
                            cursor: 'pointer',
                            position: 'relative',
                            backgroundColor: lowStockAlerts.length > 0 ? 'rgba(220, 38, 38, 0.05)' : 'transparent',
                            borderLeft: lowStockAlerts.length > 0 ? '3px solid #dc2626' : 'none',
                            paddingLeft: lowStockAlerts.length > 0 ? 'calc(1rem - 3px)' : '1rem'
                        }}
                    >
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <Bell size={18} />
                            {lowStockAlerts.length > 0 && (
                                <span
                                    className="notification-badge"
                                    style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        backgroundColor: '#dc2626',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)',
                                        animation: 'pulse 2s infinite'
                                    }}
                                >
                  {lowStockAlerts.length}
                </span>
                            )}
                        </div>
                        <span>Notifications</span>
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

            {/* LOW STOCK ALERT MODAL */}
            {showLowStockModal && (
                <div className="pm-modal-overlay" onClick={() => setShowLowStockModal(false)}>
                    <div className="pm-modal" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 0 24px 0" }}>
                            <h2 className="pm-page-title" style={{ margin: 0, color: "#dc2626", display: "flex", alignItems: "center", gap: 10 }}>
                                <WarningOutlined /> Low Stock Alerts ({lowStockAlerts.length})
                            </h2>
                            <button
                                onClick={() => setShowLowStockModal(false)}
                                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#94a3b8" }}
                            >
                                <CloseOutlined />
                            </button>
                        </div>

                        <div style={{ position: 'relative', marginBottom: 24 }}>
                            <SearchOutlined style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}/>
                            <input
                                className="pm-input"
                                style={{ paddingLeft: 42 }}
                                placeholder="Search ingredient or warehouse..."
                                value={lowStockSearch}
                                onChange={(e) => setLowStockSearch(e.target.value)}
                            />
                        </div>

                        {filteredLowStock.length === 0 ? (
                            <div style={{ textAlign: "center", color: "#9ca3af", padding: "40px 20px" }}>
                                <InboxOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} />
                                <p>No low stock alerts found.</p>
                            </div>
                        ) : (
                            <div className="pm-table-container">
                                <table className="pm-table">
                                    <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                    <tr>
                                        <th>Ingredient</th>
                                        <th>Warehouse</th>
                                        <th>Available</th>
                                        <th>Threshold</th>
                                        <th>Deficit</th>
                                        <th>Unit</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredLowStock.map((alert, index) => (
                                        <tr key={`${alert.warehouseId}-${alert.ingredientId}-${index}`}>
                                            <td><strong style={{ color: '#1e293b' }}>{alert.ingredientName}</strong></td>
                                            <td>{alert.warehouseName}</td>
                                            <td className="negative">{parseFloat(alert.quantityAvailable).toLocaleString()}</td>
                                            <td>{parseFloat(alert.alertThreshold).toLocaleString()}</td>
                                            <td className="negative">-{parseFloat(alert.deficit).toLocaleString()}</td>
                                            <td>{alert.ingredientUnit}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </aside>
    );
};

export default WarehouseSidebar;