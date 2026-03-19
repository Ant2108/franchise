import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import {
  DatabaseOutlined,
  ShoppingCartOutlined,
  WarningOutlined,
  InboxOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  SwapOutlined,
  FileTextOutlined,
  BellOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ExportOutlined,
  LoadingOutlined,
  StarFilled
} from "@ant-design/icons";
import { Spin } from "antd";
import { getCookie } from "../../utils/cookieUtils";
import inventoryApi from "../Inventory/InventoryAPI/inventoryApi";
import inboundApi from "../Inbound/InboundAPI/inboundApi";
import outboundApi from "../Outbound/OutboundAPI/outboundApi";
import WareHouseInventoryLogAPI from "./AdminManager/AdminWareHousePageAPI/AdminWareHouseInventoryLogAPI";

/* ================= CONSTANTS ================= */
const COLORS = ["#d4a373", "#c68a53", "#a06a33", "#1a1a2e", "#6366f1", "#14b8a6", "#f43f5e", "#8b5cf6"];
const sparklineData1 = [{v:10},{v:15},{v:13},{v:20},{v:18},{v:25},{v:22},{v:30}];
const sparklineData2 = [{v:30},{v:25},{v:28},{v:20},{v:22},{v:15},{v:18},{v:10}];

/* ================= COMPONENT ================= */
export default function WareHouseDashboard() {
  const { selectedWarehouse } = useOutletContext();
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  // State cho dữ liệu API
  const [inventoryList, setInventoryList] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [inboundOrders, setInboundOrders] = useState([]);
  const [outboundOrders, setOutboundOrders] = useState([]);
  const [inventoryLogs, setInventoryLogs] = useState([]);

  const warehouseId = selectedWarehouse?.id || getCookie("warehouse_id");

  const fetchAllData = async () => {
    if (!warehouseId) {
      setLoading(false);
      setIsLoaded(true);
      return;
    }
    try {
      setLoading(true);

      // Gọi tất cả API song song để nhanh hơn
      const [invRes, lowStockRes, inboundRes, outboundRes, logsRes] = await Promise.allSettled([
        inventoryApi.getAll(),
        inventoryApi.getLowStock(warehouseId),
        inboundApi.getOrders(),
        outboundApi.getOrders(),
        WareHouseInventoryLogAPI.getInventoryLogs(warehouseId),
      ]);

      // Xử lý kết quả (nếu API nào fail thì dùng mảng rỗng)
      const extractData = (res) => {
        if (res.status === "fulfilled") {
          const d = res.value;
          return Array.isArray(d) ? d : (d.result || []);
        }
        return [];
      };

      setInventoryList(extractData(invRes));
      setLowStockItems(extractData(lowStockRes));
      setInboundOrders(extractData(inboundRes));
      setOutboundOrders(extractData(outboundRes));
      setInventoryLogs(extractData(logsRes));

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [warehouseId]);

  // ========== TÍNH TOÁN DỮ LIỆU ==========

  // 1. Tổng số lượng trong kho (Dựa trên quantityAvailable từ API Inventory)
  const totalInventory = inventoryList.reduce((sum, item) => sum + (item.quantityAvailable || 0), 0);
  const totalItemsCount = inventoryList.length;

  // 2. Đơn hàng đang hoạt động (chưa COMPLETED, chưa CANCELLED)
  const activeInbound = inboundOrders.filter(o => o.status !== "COMPLETED" && o.status !== "CANCELLED");
  const activeOutbound = outboundOrders.filter(o => o.status !== "COMPLETED" && o.status !== "CANCELLED");
  const totalActiveOrders = activeInbound.length + activeOutbound.length;

  // 3. Low stock count
  const lowStockCount = lowStockItems.length;

  // 4. Tổng đơn nhập (Inbound total)
  const totalInboundCount = inboundOrders.length;

  // 5. Biểu đồ Pie - Phân bố tồn kho (Top items by quantity)
  const sortedInventory = [...inventoryList].sort((a, b) => (b.quantityOnHand || 0) - (a.quantityOnHand || 0));
  const topItems = sortedInventory.slice(0, 4);
  const otherItems = sortedInventory.slice(4);
  const totalQty = inventoryList.reduce((s, i) => s + (i.quantityOnHand || 0), 0);

  const pieChartData = topItems.map(item => ({
    name: item.ingredient?.name || "Unknown",
    value: item.quantityOnHand || 0
  }));
  if (otherItems.length > 0) {
    const otherQty = otherItems.reduce((s, i) => s + (i.quantityOnHand || 0), 0);
    if (otherQty > 0) pieChartData.push({ name: "Khác", value: otherQty });
  }

  // 6. Biểu đồ Bar - Tồn kho theo sản phẩm (Top 8)
  const barChartData = sortedInventory.slice(0, 8).map(item => ({
    name: item.ingredient?.name?.substring(0, 12) || "N/A",
    qty: item.quantityOnHand || 0,
    min: item.minimumQuantity || 0
  }));

  // 7. Recent Activities từ Inventory Logs
  const recentLogs = inventoryLogs.slice(0, 5).map((log, idx) => {
    let type = "default";
    let icon = <SwapOutlined />;
    let text = "";

    if (log.transactionType === "IN") {
      type = "success";
      icon = <InboxOutlined />;
      text = `Nhập ${log.quantity || 0} ${log.ingredient?.name || "sản phẩm"}`;
    } else if (log.transactionType === "OUT") {
      type = "info";
      icon = <ExportOutlined />;
      text = `Xuất ${log.quantity || 0} ${log.ingredient?.name || "sản phẩm"}`;
    } else {
      type = "warning";
      icon = <SyncOutlined />;
      text = `Cập nhật ${log.quantity || 0} ${log.ingredient?.name || "sản phẩm"}`;
    }

    const timeStr = log.createdAt
      ? new Date(log.createdAt).toLocaleString("vi-VN")
      : "Không rõ thời gian";

    return { id: log.id || idx, type, icon, text, time: timeStr };
  });

  // 8. Top sản phẩm (danh sách tồn kho nhiều nhất)
  const topProductsList = sortedInventory.slice(0, 5).map((item, idx) => ({
    id: item.id || idx,
    name: item.ingredient?.name || "Unknown",
    qty: item.quantityOnHand || 0,
    min: item.minimumQuantity || 0,
    status: (item.quantityOnHand || 0) <= (item.minimumQuantity || 0) ? "low" : "ok"
  }));

  // 9. Low stock list (cho bảng cảnh báo)
  const lowStockList = lowStockItems.slice(0, 5).map((item, idx) => ({
    id: item.id || idx,
    name: item.ingredientName || item.ingredient?.name || "Unknown",
    current: item.currentQuantity || item.quantityOnHand || 0,
    minimum: item.minimumQuantity || 0,
  }));

  // ========== RENDER ==========
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: "#d4a373" }} spin />} tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className={`pm-dashboard ${isLoaded ? 'fade-in' : ''}`}>
      {/* HERO SECTION */}
      <div className="pm-hero">
        <div className="pm-hero-content">
          <div className="pm-hero-greeting">
            <h1>Xin chào, <strong>{selectedWarehouse?.name || "Warehouse"}</strong> 👋</h1>
            <p>Tổng quan hoạt động kho hàng hôm nay.</p>
          </div>
          <div className="pm-quick-actions">
            <button className="pm-btn-secondary" onClick={fetchAllData}><SyncOutlined /> Làm mới</button>
            <button className="pm-btn-primary"><PlusOutlined /> Tạo đơn</button>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="pm-stats-grid">
        <StatCard
          title="Tổng số lượng hàng trong kho"
          value={`${totalItemsCount.toLocaleString("vi-VN")} `}
          percent={`${totalItemsCount} `}
          icon={<DatabaseOutlined />}
          theme="orange"
          isPositive={true}
          sparkData={sparklineData1}
          sparkColor="#ea580c"
        />
        <StatCard
          title="Đơn đang xử lý"
          value={`${totalActiveOrders.toLocaleString("vi-VN")}`}
          percent={`${activeInbound.length} nhập / ${activeOutbound.length} xuất`}
          icon={<ShoppingCartOutlined />}
          theme="blue"
          isPositive={true}
          sparkData={sparklineData1}
          sparkColor="#2563eb"
        />
        <StatCard
          title="Sắp hết hàng"
          value={`${lowStockCount.toLocaleString("vi-VN")}`}
          percent={`${lowStockCount}`}
          icon={<WarningOutlined />}
          theme="red"
          isPositive={lowStockCount === 0}
          sparkData={sparklineData2}
          sparkColor="#dc2626"
        />
        <StatCard
          title="Tổng đơn nhập"
          value={`${totalInboundCount.toLocaleString("vi-VN")}`}
          percent={`${inboundOrders.filter(o => o.status === "COMPLETED").length} hoàn thành`}
          icon={<InboxOutlined />}
          theme="green"
          isPositive={true}
          sparkData={sparklineData1}
          sparkColor="#16a34a"
        />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="pm-main-grid">
        {/* CHART: Inventory by Item (BarChart) */}
        <div className="pm-card col-span-2">
          <div className="pm-card-header">
            <div className="pm-card-title">
              <h3>Tồn kho theo sản phẩm</h3>
              <p>So sánh tồn kho hiện tại với mức tối thiểu</p>
            </div>
          </div>
          <div className="pm-chart-area">
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 13 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="qty" name="Tồn kho" fill="#d4a373" radius={[6,6,0,0]} />
                  <Bar dataKey="min" name="Mức tối thiểu" fill="#1a1a2e" radius={[6,6,0,0]} opacity={0.4} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#94a3b8" }}>
                Chưa có dữ liệu tồn kho
              </div>
            )}
          </div>
        </div>

        {/* TOP PRODUCTS TABLE */}
      </div>

      {/* BOTTOM ROW */}
      <div className="pm-bottom-grid">
        {/* INVENTORY DISTRIBUTION */}
        <div className="pm-card">
          <div className="pm-card-header">
            <div className="pm-card-title">
              <h3>Phân bố tồn kho</h3>
            </div>
          </div>
          <div className="chart-wrapper-pie" style={{ height: 220 }}>
            {pieChartData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%" cy="50%"
                      innerRadius={65} outerRadius={90}
                      paddingAngle={5} dataKey="value" stroke="none"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} qty`, "Số lượng"]}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-center-label">
                  <span>Tổng</span>
                  <strong>{totalQty.toLocaleString("vi-VN")}</strong>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#94a3b8" }}>
                Chưa có dữ liệu
              </div>
            )}
          </div>
          <div className="wh-pie-legend-grid">
            {pieChartData.map((entry, index) => (
              <div className="wh-legend-item-sm" key={index}>
                <div className="dot" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="name" title={entry.name} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 80 }}>{entry.name}</span>
                <span className="val">{totalQty > 0 ? Math.round((entry.value / totalQty) * 100) : 0}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITIES */}
        <div className="pm-card">
          <div className="pm-card-header">
            <div className="pm-card-title">
              <h3>Hoạt động gần đây</h3>
            </div>
            <button className="wh-btn-icon" onClick={fetchAllData}><SyncOutlined /></button>
          </div>
          <div className="pm-timeline">
            {recentLogs.length > 0 ? recentLogs.map((act) => (
              <div key={act.id} className="pm-timeline-item">
                <div className={`pm-timeline-icon ${act.type}`}>{act.icon}</div>
                <div className="pm-timeline-content">
                  <h4>{act.text}</h4>
                  <p>{act.time}</p>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: "center", padding: 20, color: "#94a3b8" }}>
                Chưa có hoạt động nào
              </div>
            )}
          </div>
        </div>

        {/* LOW STOCK ALERTS */}
        <div className="pm-card">
          <div className="pm-card-header">
            <div className="pm-card-title">
              <h3>Cảnh báo sắp hết</h3>
            </div>
          </div>
          {lowStockList.length > 0 ? (
            <div className="pm-product-list">
              {lowStockList.map((item) => (
                <div key={item.id} className="pm-product-item">
                  <div className="pm-product-img">
                    <WarningOutlined style={{ color: '#f59e0b', fontSize: 18 }} />
                  </div>
                  <div className="pm-product-info">
                    <div className="pm-product-name">{item.name}</div>
                    <div className="pm-product-sales">Tối thiểu: {item.minimum}</div>
                  </div>
                  <div className="pm-product-revenue">
                    <span className="pm-product-percentage down">
                      Còn {item.current}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 40, color: "#16a34a" }}>
              <CheckCircleOutlined style={{ fontSize: 32, marginBottom: 8 }} />
              <p>Tất cả nguyên liệu đều đủ hàng!</p>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}

/* ================= STAT CARD WITH SPARKLINE ================= */
function StatCard({ title, value, percent, icon, theme, isPositive, sparkData, sparkColor }) {
  const themeMap = {
    orange: "pm-stat-icon orange",
    blue: "pm-stat-icon blue",
    green: "pm-stat-icon green",
    red: "pm-stat-icon red",
    purple: "pm-stat-icon purple"
  };

  return (
    <div className="pm-stat-card">
      <div className="pm-stat-header">
        <div className={themeMap[theme] || themeMap.blue}>
          {icon}
        </div>
        <div className={`pm-stat-trend ${isPositive ? 'up' : 'down'}`}>
          {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {percent}
        </div>
      </div>
      
      <div className="pm-stat-title">{title}</div>
      <div className="pm-stat-value">{value}</div>

      <div style={{ height: 40, marginTop: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line type="monotone" dataKey="v" stroke={sparkColor} strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}