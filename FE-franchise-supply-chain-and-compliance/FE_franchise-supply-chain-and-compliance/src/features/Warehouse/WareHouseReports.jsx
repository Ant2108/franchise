import { useState, useEffect, useMemo } from "react";
import {
  XAxis, YAxis,
  Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts";
import {
  InboxOutlined,
  UserOutlined,
  ImportOutlined,
  ExportOutlined,
  WarningOutlined,
  CloseOutlined,
  BellOutlined,
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

  useEffect(() => {

    const fetchLogs = async () => {
      try {
        const data = await WareHouseInventoryLogAPI.getAllInventoryLogs();
        setInventoryLogs(data);
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
        const inbounds = Array.isArray(inboundData) ? inboundData : inboundData?.data ?? [];
        const outbounds = Array.isArray(outboundData) ? outboundData : outboundData?.data ?? [];
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
        const inventories = Array.isArray(data) ? data : data?.data ?? [];
        const ingredients = Array.isArray(ingredientsList) ? ingredientsList : ingredientsList?.data ?? [];
        const warehouses = Array.isArray(warehousesList) ? warehousesList : warehousesList?.data ?? [];

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
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setLowStockAlerts(list);
      } catch (error) {
        console.error("Failed to fetch low stock alerts:", error);
      }
    };
    fetchLowStockAlerts();
  }, []);

  // ---- Stats computed from data (backend already filters by warehouse via X-Warehouse-Id header) ----
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
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <h1 className="wh-title" style={{ marginBottom: 2 }}>Reports & Analytics</h1>
          <p className="wh-sub" style={{ marginBottom: 0 }}>
            Comprehensive insights into warehouse operations
          </p>
        </div>
      </div>

      <div className="wh-stats">
        <Stat
          value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(inboundTotal)}
          title="Inbound Total Amount"
          percent=""
          icon={<ImportOutlined />}
          iconClass="icon-blue"
        />
        <Stat
          value={outboundTotal.toLocaleString()}
          title="Outbound Total Quantity"
          percent=""
          icon={<ExportOutlined />}
          iconClass="icon-green"
        />
        <Stat
          value={totalAvailable.toLocaleString()}
          title="Total Quantity Available"
          percent=""
          icon={<InboxOutlined />}
          iconClass="icon-purple"
        />
        <Stat
          value={totalReserved.toLocaleString()}
          title="Total Quantity Reserved"
          percent=""
          icon={<UserOutlined />}
          iconClass="icon-orange"
        />
      </div>

      <div className="wh-chart-row">
        <div className="wh-card">
          <h3>Suppliers</h3>
          <table className="wh-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s, index) => (
                <tr key={s.id || index}>
                  <td>{s.name}</td>
                  <td>{s.contactName}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>{s.address}</td>
                  <td>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="wh-card">
          <h3>Outbound Quantity & Inbound Received Quantity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="outboundQuantity" name="Outbound Quantity" fill="#3b82f6" />
              <Bar dataKey="inboundReceivedQuantity" name="Inbound Received Qty" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="wh-table-row">
        {/* INVENTORY OVERVIEW */}
        <div className="wh-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Inventory Overview</h3>
            <button
              onClick={() => setShowLowStockModal(true)}
              style={{
                position: "relative",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 20,
                color: lowStockAlerts.length > 0 ? "#ef4444" : "#9ca3af",
              }}
              title="Low Stock Alerts"
            >
              <BellOutlined />
              {lowStockAlerts.length > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -8,
                  background: "#ef4444", color: "white",
                  borderRadius: "50%", width: 18, height: 18,
                  fontSize: 11, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {lowStockAlerts.length}
                </span>
              )}
            </button>
          </div>
          <table className="wh-table">
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Warehouse</th>
                <th>Available</th>
                <th>Reserved</th>
                <th>Unit</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item, index) => (
                <tr key={item.inventoryId || index}>
                  <td>{item.ingredientName}</td>
                  <td>{item.warehouseName}</td>
                  <td>{parseFloat(item.quantityAvailable).toLocaleString()}</td>
                  <td>{parseFloat(item.quantityReserved).toLocaleString()}</td>
                  <td>{item.unit}</td>
                  <td>{item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* INVENTORY LOGS */}
        <div className="wh-card">
          <h3>Inventory Logs</h3>
          <table className="wh-table">
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Warehouse</th>
                <th>Type</th>
                <th>Qty Changed</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {inventoryLogs.map((log, index) => (
                <tr key={log.id || index}>
                  <td>{log.ingredientName}</td>
                  <td>{log.warehouseName}</td>
                  <td>{log.transactionType}</td>
                  <td>
                    <span style={{ color: parseFloat(log.quantityChanged) >= 0 ? "#22c55e" : "#ef4444", fontWeight: 600 }}>
                      {parseFloat(log.quantityChanged) >= 0 ? "+" : ""}{parseFloat(log.quantityChanged).toLocaleString()}
                    </span>
                  </td>
                  <td>{log.createdAt ? new Date(log.createdAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOW STOCK ALERT MODAL */}
      {showLowStockModal && (
        <div className="low-stock-overlay" onClick={() => setShowLowStockModal(false)}>
          <div className="low-stock-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: "#ef4444", display: "flex", alignItems: "center", gap: 8 }}>
                <WarningOutlined /> Low Stock Alerts ({lowStockAlerts.length})
              </h3>
              <button
                onClick={() => setShowLowStockModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#6b7280" }}
              >
                <CloseOutlined />
              </button>
            </div>
            <input
              className="low-stock-search"
              placeholder="Search ingredient or warehouse..."
              value={lowStockSearch}
              onChange={(e) => setLowStockSearch(e.target.value)}
            />
            {filteredLowStock.length === 0 ? (
              <p style={{ textAlign: "center", color: "#9ca3af", padding: 20 }}>No low stock alerts found.</p>
            ) : (
              <table className="wh-table">
                <thead>
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
                      <td>{alert.ingredientName}</td>
                      <td>{alert.warehouseName}</td>
                      <td>
                        <span style={{ color: "#ef4444", fontWeight: 600 }}>
                          {parseFloat(alert.quantityAvailable).toLocaleString()}
                        </span>
                      </td>
                      <td>{parseFloat(alert.alertThreshold).toLocaleString()}</td>
                      <td>
                        <span style={{ color: "#ef4444", fontWeight: 600 }}>
                          -{parseFloat(alert.deficit).toLocaleString()}
                        </span>
                      </td>
                      <td>{alert.ingredientUnit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Stat({ value, title, percent, icon, iconClass }) {
  return (
    <div className="wh-card stat">
      <div className="stat-top">
        <div className={`stat-icon ${iconClass}`}>{icon}</div>
        <div className="wh-percent green">{percent}</div>
      </div>
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}

export default WareHouseReports;

