import React, { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import {
  DatabaseOutlined,
  ShoppingCartOutlined,
  WarningOutlined,
  DollarOutlined,
  InboxOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  SwapOutlined,
  FileTextOutlined,
  BellOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  StarFilled
} from "@ant-design/icons";

/* ================= DATA ================= */
const lineData = [
  { name: "Jan", orders: 250, revenue: 680 },
  { name: "Feb", orders: 320, revenue: 720 },
  { name: "Mar", orders: 290, revenue: 690 },
  { name: "Apr", orders: 360, revenue: 790 },
  { name: "May", orders: 400, revenue: 830 },
  { name: "Jun", orders: 430, revenue: 860 },
];
const pieData = [
  { name: "Roasted Beans", value: 45 },
  { name: "Raw Beans", value: 30 },
  { name: "Syrups", value: 15 },
  { name: "Equipment", value: 10 },
];
const COLORS = ["#d4a373", "#c68a53", "#a06a33", "#1a1a2e"];
const sparklineData1 = [{v:10},{v:15},{v:13},{v:20},{v:18},{v:25},{v:22},{v:30}];
const sparklineData2 = [{v:30},{v:25},{v:28},{v:20},{v:22},{v:15},{v:18},{v:10}];

const recentActivities = [
  { id: 1, type: "success", text: "Order #WH-0932 fulfilled for Quận 1", time: "10 mins ago", icon: <CheckCircleOutlined /> },
  { id: 2, type: "warning", text: "Low stock alert: Arabica Beans (15kg left)", time: "1 hour ago", icon: <WarningOutlined /> },
  { id: 3, type: "info", text: "Received 500kg of Robusta from Supplier A", time: "2 hours ago", icon: <InboxOutlined /> },
  { id: 4, type: "default", text: "Transferred 50kg to Branch 3", time: "3 hours ago", icon: <SwapOutlined /> },
];

const topProducts = [
  { id: 1, name: "Arabica Premium 1kg", sold: 124, revenue: "24M VND", trend: "+12%" },
  { id: 2, name: "Robusta Honey 1kg", sold: 86, revenue: "15M VND", trend: "+8%" },
  { id: 3, name: "Mocha Syrup 500ml", sold: 320, revenue: "32M VND", trend: "-3%" },
  { id: 4, name: "Espresso Machine", sold: 4, revenue: "160M VND", trend: "+15%" },
];

/* ================= COMPONENT ================= */
export default function WareHouseDashboard() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`pm-dashboard ${isLoaded ? 'fade-in' : ''}`}>
      {/* HERO SECTION */}
      <div className="pm-hero">
        <div className="pm-hero-content">
          <div className="pm-hero-greeting">
            <h1>Good morning, Admin! 👋</h1>
            <p>Here’s what’s happening in your warehouse today.</p>
          </div>
          <div className="pm-quick-actions">
            <button className="pm-btn-secondary"><BellOutlined /> Alerts <span className="pm-badge">3</span></button>
            <button className="pm-btn-primary"><PlusOutlined /> Create Order</button>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="pm-stats-grid">
        <StatCard
          title="Total Inventory"
          value="15,432 kg"
          percent="+12%"
          icon={<DatabaseOutlined />}
          theme="orange"
          isPositive={true}
          sparkData={sparklineData1}
          sparkColor="#ea580c"
        />
        <StatCard
          title="Active Orders"
          value="284"
          percent="+8%"
          icon={<ShoppingCartOutlined />}
          theme="blue"
          isPositive={true}
          sparkData={sparklineData1}
          sparkColor="#2563eb"
        />
        <StatCard
          title="Low Stock Items"
          value="23"
          percent="-5%"
          icon={<WarningOutlined />}
          theme="red"
          isPositive={false}
          sparkData={sparklineData2}
          sparkColor="#dc2626"
        />
        <StatCard
          title="Monthly Revenue"
          value="847M VND"
          percent="+23%"
          icon={<DollarOutlined />}
          theme="green"
          isPositive={true}
          sparkData={sparklineData1}
          sparkColor="#16a34a"
        />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="pm-main-grid">
        {/* CHART: Orders & Revenue */}
        <div className="pm-card col-span-2">
          <div className="pm-card-header">
            <div className="pm-card-title">
              <h3>Orders & Revenue Trends</h3>
              <p>Performance over the last 6 months</p>
            </div>
            <div className="pm-card-actions">
              <select>
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
          </div>
          <div className="pm-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrdersArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4a373" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d4a373" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a1a2e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1a1a2e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 13 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: "#64748b", fontSize: 13 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="orders" stroke="#d4a373" strokeWidth={3} fillOpacity={1} fill="url(#colorOrdersArea)" />
                <Area type="monotone" dataKey="revenue" stroke="#1a1a2e" strokeWidth={3} fillOpacity={1} fill="url(#colorRevArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TOP PRODUCTS */}
        <div className="pm-card">
          <div className="pm-card-header">
            <div className="pm-card-title">
              <h3>Top Products</h3>
            </div>
            <span className="wh-link">View All</span>
          </div>
          <div className="pm-product-list">
            {topProducts.map((prod, idx) => (
              <div key={prod.id} className="pm-product-item">
                <div className="pm-product-img">
                  <StarFilled style={{ color: idx === 0 ? '#fbbf24' : '#cbd5e1', fontSize: 18 }} />
                </div>
                <div className="pm-product-info">
                  <div className="pm-product-name">{prod.name}</div>
                  <div className="pm-product-sales">{prod.sold} sales</div>
                </div>
                <div className="pm-product-revenue">
                  <span className="pm-product-amount">{prod.revenue}</span>
                  <span className={`pm-product-percentage ${prod.trend.includes('+') ? '' : 'down'}`}>
                    {prod.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="pm-bottom-grid">
        {/* INVENTORY DISTRIBUTION */}
        <div className="pm-card">
          <div className="pm-card-header">
            <div className="pm-card-title">
              <h3>Inventory Distribution</h3>
            </div>
          </div>
          <div className="chart-wrapper-pie" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={65} outerRadius={90}
                  paddingAngle={5} dataKey="value" stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-center-label">
              <span>Total</span>
              <strong>100%</strong>
            </div>
          </div>
          <div className="wh-pie-legend-grid">
            {pieData.map((entry, index) => (
              <div className="wh-legend-item-sm" key={index}>
                <div className="dot" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="name">{entry.name}</span>
                <span className="val">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITIES */}
        <div className="pm-card">
          <div className="pm-card-header">
            <div className="pm-card-title">
              <h3>Recent Activities</h3>
            </div>
            <button className="wh-btn-icon"><SyncOutlined /></button>
          </div>
          <div className="pm-timeline">
            {recentActivities.map((act) => (
              <div key={act.id} className="pm-timeline-item">
                <div className={`pm-timeline-icon ${act.type}`}>{act.icon}</div>
                <div className="pm-timeline-content">
                  <h4>{act.text}</h4>
                  <p>{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="pm-card">
          <div className="pm-card-header">
            <div className="pm-card-title">
              <h3>Quick Actions</h3>
            </div>
          </div>
          <div className="pm-quick-links">
            <button className="pm-quick-btn">
              <InboxOutlined style={{ fontSize: 24 }} />
              Receive Stock
            </button>
            <button className="pm-quick-btn">
              <SwapOutlined style={{ fontSize: 24 }} />
              Transfer
            </button>
            <button className="pm-quick-btn">
              <FileTextOutlined style={{ fontSize: 24 }} />
              Reports
            </button>
            <button className="pm-quick-btn">
              <ShoppingCartOutlined style={{ fontSize: 24 }} />
              Orders
            </button>
          </div>
          
          <div className="wh-promo-box" style={{ marginTop: 24, background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
            <div className="promo-text">
              <h4>Want smarter insights?</h4>
              <p>Enable AI prediction for stock automation.</p>
            </div>
            <button className="wh-btn-sm-primary">Enable AI</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STAT CARD WITH SPARKLINE ================= */
function StatCard({ title, value, percent, icon, theme, isPositive, sparkData, sparkColor }) {
  // theme map for colors
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