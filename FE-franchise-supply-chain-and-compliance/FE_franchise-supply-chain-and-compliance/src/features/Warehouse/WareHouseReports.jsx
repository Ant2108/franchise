import { useState, useEffect, useMemo } from "react";
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, CartesianGrid
} from "recharts";
import {
  InboxOutlined, UserOutlined, ImportOutlined, ExportOutlined,
  WarningOutlined, CloseOutlined, BellOutlined, SearchOutlined
} from "@ant-design/icons";
import WareHouseInventoryLogAPI from "./AdminManager/AdminWareHousePageAPI/AdminWareHouseInventoryLogAPI";
import inboundApi from "../Inbound/InboundAPI/inboundApi";
import outboundApi from "../Outbound/OutboundAPI/outboundApi";
import metadataApi from "../../services/metadataService";
import apiClient from "../../services/axiosClient";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function WareHouseReports() {
  const [inventoryLogs, setInventoryLogs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [inboundOrders, setInboundOrders] = useState([]);
  const [outboundOrders, setOutboundOrders] = useState([]);

  // Low stock alert
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [showLowStockModal, setShowLowStockModal] = useState(false);
  const [lowStockSearch, setLowStockSearch] = useState("");

  const [isLoaded, setIsLoaded] = useState(false);
  const warehouseId = localStorage.getItem("warehouse_id");

  useEffect(() => {
    setIsLoaded(true);

    const fetchLogs = async () => {
      try {
        if (!warehouseId) return;
        const data = await WareHouseInventoryLogAPI.getInventoryLogs(warehouseId);
        setInventoryLogs(Array.isArray(data) ? data : data?.data || []);
      } catch (error) {
        console.error("Failed to fetch inventory logs:", error);
      }
    };

    const fetchInboundOutbound = async () => {
      try {
        const [inboundData, outboundData] = await Promise.all([
          inboundApi.getOrders(),
          outboundApi.getOrders(),
        ]);
        let inbounds = Array.isArray(inboundData) ? inboundData : inboundData?.data ?? [];
        let outbounds = Array.isArray(outboundData) ? outboundData : outboundData?.data ?? [];
        
        // Filter by warehouseId if available
        if (warehouseId) {
          inbounds = inbounds.filter(o => o.warehouseId === warehouseId);
          outbounds = outbounds.filter(o => o.warehouseId === warehouseId);
        }

        setInboundOrders(inbounds);
        setOutboundOrders(outbounds);

        // Build monthly chart data
        const monthlyOutbound = {};
        const monthlyInboundReceived = {};

        outbounds.forEach((order) => {
          const date = order.createdAt ? new Date(order.createdAt) : null;
          if (!date) return;
          const monthKey = date.getMonth();
          const qty = (order.items || []).reduce((s, item) => s + (parseFloat(item.quantity) || 0), 0);
          monthlyOutbound[monthKey] = (monthlyOutbound[monthKey] || 0) + qty;
        });

        inbounds.forEach((order) => {
          const date = order.actualDate ? new Date(order.actualDate) : order.expectedDate ? new Date(order.expectedDate) : null;
          if (!date) return;
          const monthKey = date.getMonth();
          const receivedQty = (order.items || []).reduce((s, item) => s + (parseFloat(item.receivedQuantity) || 0), 0);
          monthlyInboundReceived[monthKey] = (monthlyInboundReceived[monthKey] || 0) + receivedQty;
        });

        const allMonths = new Set([
          ...Object.keys(monthlyOutbound).map(Number),
          ...Object.keys(monthlyInboundReceived).map(Number),
        ]);
        const sortedMonths = [...allMonths].sort((a, b) => a - b);

        setChartData(sortedMonths.map((m) => ({
          name: MONTH_NAMES[m],
          outboundQuantity: monthlyOutbound[m] || 0,
          inboundReceivedQuantity: monthlyInboundReceived[m] || 0,
        })));
      } catch (error) {
        console.error("Failed to fetch inbound/outbound data:", error);
      }
    };

    const fetchInventories = async () => {
      try {
        const [data, ingredientsList, warehousesList] = await Promise.all([
          WareHouseInventoryLogAPI.getAllInventories(),
          metadataApi.getIngredients(),
          metadataApi.getWarehouses(),
        ]);
        let inventories = Array.isArray(data) ? data : data?.data ?? [];
        const ingredients = Array.isArray(ingredientsList) ? ingredientsList : ingredientsList?.data ?? [];
        const warehouses = Array.isArray(warehousesList) ? warehousesList : warehousesList?.data ?? [];

        // Filter by warehouseId
        if (warehouseId) {
          inventories = inventories.filter(inv => inv.warehouseId === warehouseId);
        }

        const ingredientMap = {};
        ingredients.forEach((i) => { ingredientMap[i.id] = { name: i.name, unit: i.unit }; });
        const warehouseMap = {};
        warehouses.forEach((w) => { warehouseMap[w.id] = w.name; });

        setInventoryItems(inventories.map((inv) => ({
          ...inv,
          ingredientName: ingredientMap[inv.ingredientId]?.name || inv.ingredientId,
          unit: ingredientMap[inv.ingredientId]?.unit || "",
          warehouseName: warehouseMap[inv.warehouseId] || inv.warehouseId,
        })));
      } catch (error) {
        console.error("Failed to fetch inventories:", error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const data = await apiClient.get("/suppliers/search", { keyword: "" });
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setSuppliers(list);
      } catch (error) {
        console.error("Failed to fetch suppliers:", error);
      }
    };

    fetchLogs();
    fetchInboundOutbound();
    fetchInventories();
    fetchSuppliers();

    const fetchLowStockAlerts = async () => {
      try {
        const data = await WareHouseInventoryLogAPI.getLowStockAlerts();
        let list = Array.isArray(data) ? data : data?.data ?? [];
        
        if (warehouseId) {
          list = list.filter(a => a.warehouseId === warehouseId);
        }
        
        setLowStockAlerts(list);
      } catch (error) {
        console.error("Failed to fetch low stock alerts:", error);
      }
    };
    fetchLowStockAlerts();
  }, []);

  // Compute Stats
  const inboundTotal = useMemo(() => {
    return inboundOrders
      .filter((o) => o.status === "COMPLETED")
      .reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);
  }, [inboundOrders]);

  const outboundTotal = useMemo(() => {
    return outboundOrders.reduce((sum, order) => {
      return sum + (order.items || []).reduce((s, item) => s + (parseFloat(item.quantity) || 0), 0);
    }, 0);
  }, [outboundOrders]);

  const totalAvailable = useMemo(() => {
    return inventoryItems.reduce((sum, inv) => sum + (parseFloat(inv.quantityAvailable) || 0), 0);
  }, [inventoryItems]);

  const totalReserved = useMemo(() => {
    return inventoryItems.reduce((sum, inv) => sum + (parseFloat(inv.quantityReserved) || 0), 0);
  }, [inventoryItems]);

  const filteredLowStock = useMemo(() => {
    const q = lowStockSearch.toLowerCase();
    if (!q) return lowStockAlerts;
    return lowStockAlerts.filter((a) =>
      a.ingredientName?.toLowerCase().includes(q) || a.warehouseName?.toLowerCase().includes(q)
    );
  }, [lowStockAlerts, lowStockSearch]);

  return (
    <div className={`pm-dashboard ${isLoaded ? 'fade-in' : ''}`}>
      {/* HEADER */}
      <div className="pm-page-header">
        <h1 className="pm-page-title">Reports & Analytics</h1>
        <p className="pm-page-subtitle">Comprehensive insights into warehouse operations</p>
      </div>

      {/* STATS */}
      <div className="pm-stats-grid">
        <Stat
          value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(inboundTotal)}
          title="Inbound Total Amount"
          icon={<ImportOutlined />}
          theme="blue"
        />
        <Stat
          value={outboundTotal.toLocaleString()}
          title="Outbound Total Quantity"
          icon={<ExportOutlined />}
          theme="green"
        />
        <Stat
          value={totalAvailable.toLocaleString()}
          title="Total Quantity Available"
          icon={<InboxOutlined />}
          theme="orange"
        />
        <Stat
          value={totalReserved.toLocaleString()}
          title="Total Quantity Reserved"
          icon={<UserOutlined />}
          theme="red"
        />
      </div>

      {/* CHARTS ROW (Using grid-template-columns: 2.2fr 1fr from pm-main-grid, but we need 1fr 1fr probably. Let's use bottom grid) */}
      <div className="pm-bottom-grid" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        
        {/* CHART */}
        <div className="pm-card">
          <div className="pm-card-header">
            <div className="pm-card-title">
              <h3>Volume Analytics</h3>
              <p>Outbound vs Inbound Received Quantity</p>
            </div>
            <div className="pm-card-actions">
              <select>
                <option>This Year</option>
                <option>All Time</option>
              </select>
            </div>
          </div>
          <div className="pm-chart-area">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 13 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: "#64748b", fontSize: 13 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
                <Bar dataKey="outboundQuantity" name="Outbound Qty" fill="#c68a53" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="inboundReceivedQuantity" name="Inbound Received Qty" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SUPPLIERS */}
        <div className="pm-card">
          <div className="pm-card-header">
            <div className="pm-card-title">
              <h3>Active Suppliers</h3>
              <p>Partner network overview</p>
            </div>
          </div>
          <div className="pm-table-container" style={{ margin: 0, height: '300px', overflowY: 'auto' }}>
            <table className="pm-table">
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.slice(0, 10).map((s, index) => (
                  <tr key={s.id || index}>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.phone}</td>
                    <td><span className={`pm-badge ${s.status === 'Active' ? 'green' : ''}`} style={{ background: s.status === 'Active' ? '#dcfce7' : '#f1f5f9', color: s.status === 'Active' ? '#16a34a' : '#64748b' }}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* TABLES ROW */}
      <div className="pm-bottom-grid" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        
        {/* INVENTORY OVERVIEW */}
        <div className="pm-card">
          <div className="pm-card-header">
            <div className="pm-card-title">
              <h3>Inventory Overview</h3>
            </div>
            <button
              onClick={() => setShowLowStockModal(true)}
              className="pm-btn-secondary"
              style={{ padding: '8px 16px', color: lowStockAlerts.length > 0 ? '#ef4444' : '#64748b' }}
            >
              <BellOutlined /> Alerts
              {lowStockAlerts.length > 0 && <span className="pm-badge" style={{ background: '#ef4444', color: 'white' }}>{lowStockAlerts.length}</span>}
            </button>
          </div>
          <div className="pm-table-container">
            <table className="pm-table">
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Warehouse</th>
                  <th>Available</th>
                  <th>Reserved</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.slice(0, 8).map((item, index) => (
                  <tr key={item.inventoryId || index}>
                    <td><strong style={{ color: '#1e293b' }}>{item.ingredientName}</strong></td>
                    <td>{item.warehouseName}</td>
                    <td className="positive">{parseFloat(item.quantityAvailable).toLocaleString()}</td>
                    <td style={{ color: '#f59e0b', fontWeight: 600 }}>{parseFloat(item.quantityReserved).toLocaleString()}</td>
                    <td>{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* INVENTORY LOGS */}
        <div className="pm-card">
          <div className="pm-card-header">
            <div className="pm-card-title">
              <h3>Recent Inventory Logs</h3>
            </div>
          </div>
          <div className="pm-table-container">
            <table className="pm-table">
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Type</th>
                  <th>Qty Changed</th>
                </tr>
              </thead>
              <tbody>
                {inventoryLogs.slice(0, 8).map((log, index) => {
                  const qty = parseFloat(log.quantityChanged);
                  return (
                    <tr key={log.id || index}>
                      <td><strong style={{ color: '#1e293b' }}>{log.ingredientName}</strong><div style={{ fontSize: 11, color: '#94a3b8' }}>{log.createdAt ? new Date(log.createdAt).toLocaleDateString() : ""}</div></td>
                      <td>{log.transactionType}</td>
                      <td className={qty >= 0 ? "positive" : "negative"}>
                        {qty >= 0 ? "+" : ""}{qty.toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
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
    </div>
  );
}

// Reusable Stat Component specific to Reports if needed, or using pm-stat-card
function Stat({ value, title, icon, theme }) {
  const themeMap = {
    orange: "pm-stat-icon orange",
    blue: "pm-stat-icon blue",
    green: "pm-stat-icon green",
    red: "pm-stat-icon red",
    purple: "pm-stat-icon purple"
  };

  return (
    <div className="pm-stat-card">
      <div className="pm-stat-header" style={{ marginBottom: 16 }}>
        <div className={themeMap[theme] || themeMap.blue}>
          {icon}
        </div>
      </div>
      <div className="pm-stat-title">{title}</div>
      <div className="pm-stat-value" style={{ fontSize: 22, marginTop: 4 }}>{value}</div>
    </div>
  );
}

export default WareHouseReports;
