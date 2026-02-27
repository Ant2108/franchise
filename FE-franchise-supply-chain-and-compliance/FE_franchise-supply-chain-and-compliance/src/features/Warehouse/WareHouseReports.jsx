import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts";
import {
  ShoppingCartOutlined,
  DollarOutlined,
  InboxOutlined,
  UserOutlined,
} from "@ant-design/icons";

const categoryData = [
  { name: "Electronics", sales: 45678, orders: 456, growth: 23 },
  { name: "Clothing", sales: 34562, orders: 678, growth: 15 },
  { name: "Food & Beverages", sales: 28934, orders: 234, growth: -5 },
  { name: "Home Goods", sales: 23456, orders: 345, growth: 18 },
  { name: "Sports", sales: 19876, orders: 289, growth: 12 },
];

const customersData = [
  { name: "Acme Corp", orders: 156, revenue: 234567, growth: 34 },
  { name: "TechStart Inc", orders: 134, revenue: 198765, growth: 28 },
  { name: "Global Solutions", orders: 98, revenue: 176543, growth: 22 },
  { name: "Enterprise LLC", orders: 87, revenue: 154321, growth: 19 },
  { name: "NextGen Systems", orders: 76, revenue: 145678, growth: 15 },
];

const revenueData = [
  { name: "Jan", revenue: 68000 },
  { name: "Feb", revenue: 72000 },
  { name: "Mar", revenue: 69000 },
  { name: "Apr", revenue: 79000 },
  { name: "May", revenue: 83000 },
  { name: "Jun", revenue: 86000 },
];

const ordersData = [
  { name: "Jan", orders: 250, items: 1200 },
  { name: "Feb", orders: 320, items: 1500 },
  { name: "Mar", orders: 290, items: 1300 },
  { name: "Apr", orders: 360, items: 1700 },
  { name: "May", orders: 400, items: 1900 },
  { name: "Jun", orders: 430, items: 2100 },
];

function WareHouseReports() {
  return (
    <>
      <h1 className="wh-title">Reports & Analytics</h1>
      <p className="wh-sub">
        Comprehensive insights into warehouse operations
      </p>

      <div className="wh-stats">
        <Stat
          value="2,025"
          title="Total Orders (Monthly)"
          percent="+18%"
          icon={<ShoppingCartOutlined />}
          iconClass="icon-blue"
        />

        <Stat
          value="$453.7K"
          title="Monthly Revenue"
          percent="+23%"
          icon={<DollarOutlined />}
          iconClass="icon-green"
        />

        <Stat
          value="9,903"
          title="Items Processed"
          percent="+12%"
          icon={<InboxOutlined />}
          iconClass="icon-purple"
        />

        <Stat
          value="156"
          title="Active Customers"
          percent="+8%"
          icon={<UserOutlined />}
          iconClass="icon-orange"
        />
      </div>
      

      <div className="wh-chart-row">
        <div className="wh-card">
          <h3>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="wh-card">
          <h3>Orders & Items Processed</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#3b82f6" />
              <Bar dataKey="items" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="wh-table-row">

      {/* CATEGORY PERFORMANCE */}
      <div className="wh-card">
        <h3>Category Performance</h3>
        <table className="wh-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Sales</th>
              <th>Orders</th>
              <th>Growth</th>
            </tr>
          </thead>
          <tbody>
            {categoryData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>${item.sales.toLocaleString()}</td>
                <td>{item.orders}</td>
                <td className={item.growth > 0 ? "green" : "red"}>
                  {item.growth > 0 ? "↗" : "↘"} {item.growth}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOP CUSTOMERS */}
      <div className="wh-card">
        <h3>Top Customers</h3>
        <table className="wh-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Orders</th>
              <th>Revenue</th>
              <th>Growth</th>
            </tr>
          </thead>
          <tbody>
            {customersData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.orders}</td>
                <td>${item.revenue.toLocaleString()}</td>
                <td className="green">
                  ↗ {item.growth}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
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