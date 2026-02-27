import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  CartesianGrid
} from "recharts";

import {
  DatabaseOutlined,
  ShoppingCartOutlined,
  WarningOutlined,
  DollarOutlined,InboxOutlined 
} from "@ant-design/icons";
import CustomTooltip from "./CustomTooltip";
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
  { name: "Electronics", value: 27 },
  { name: "Clothing", value: 25 },
  { name: "Beverages", value: 19 },
  { name: "Home Goods", value: 16 },
  { name: "Other", value: 14 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#6b7280"];

/* ================= COMPONENT ================= */

function WareHouseDashboard() {
  return (
    <>
      <h1 className="wh-title">Dashboard</h1>
      <p className="wh-sub">
        Welcome back! Here's what's happening in your warehouse today.
      </p>

      {/* STAT CARDS */}
      <div className="wh-stats">
        <StatCard
          title="Total Inventory"
          value="15,432"
          percent="+12%"
          icon={<InboxOutlined/>}
          iconClass="icon-blue"
          green
        />
        <StatCard
          title="Active Orders"
          value="284"
          percent="+8%"
          icon={<ShoppingCartOutlined />}
          iconClass="icon-green"
          green
        />
        <StatCard
          title="Low Stock Items"
          value="23"
          percent="-5%"
          icon={<WarningOutlined />}
          iconClass="icon-purple"
          red
        />
        <StatCard
          title="Monthly Revenue"
          value="$847K"
          percent="+23%"
          icon={<DollarOutlined />}
          iconClass="icon-yellow"
          green
        />
      </div>

      {/* CHART ROW */}
      {/* CHART ROW */}
<div className="wh-chart-row">
  <div className="wh-card big">
    <h3>Orders & Revenue Trends</h3>

    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={lineData}>
        <defs>
          <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>

          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="name" tick={{ fill: "#6B7280" }} />
        <YAxis tick={{ fill: "#6B7280" }} />

        <Tooltip content={<CustomTooltip />} />

        <Line
          type="monotone"
          dataKey="orders"
          stroke="#3b82f6"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          fillOpacity={1}
          fill="url(#colorOrders)"
          animationDuration={1200}
        />

        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#10b981"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          fillOpacity={1}
          fill="url(#colorRevenue)"
          animationDuration={1400}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>

  <div className="wh-card">
    <h3>Inventory Distribution</h3>

    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          outerRadius={100}
          innerRadius={60}
          paddingAngle={3}
          label={({ percent }) =>
            `${(percent * 100).toFixed(0)}%`
          }
        >
          {pieData.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index]}
              style={{ cursor: "pointer" }}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>
    </>
  );
}

/* ================= STAT CARD ================= */

function StatCard({ title, value, percent, icon, iconClass, green, red }) {
  return (
    <div className="wh-card stat">
      <div className={`stat-icon ${iconClass}`}>
        {icon}
      </div>

      <h2>{value}</h2>
      <p>{title}</p>

      <span
        className={`wh-percent ${
          green ? "green" : ""
        } ${red ? "red" : ""}`}
      >
        {percent}
      </span>
    </div>
  );
}

export default WareHouseDashboard;