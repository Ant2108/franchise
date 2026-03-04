import InventoryTrack from "../Inventory/InventoryTrack";
import InventoryList from "../Inventory/InventoryList";
import { useState, useMemo } from "react";
import {
  DatabaseOutlined,
  WarningOutlined,
  DollarOutlined,
  InboxOutlined,
} from "@ant-design/icons";

function WareHouseInventory() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const inventoryData = useMemo(
    () => [
      { code: "WH-001", name: "Laptop", stock: 120, price: 1000 },
      { code: "WH-002", name: "Keyboard", stock: 12, price: 50 },
      { code: "WH-003", name: "Mouse", stock: 0, price: 25 },
      { code: "WH-004", name: "Monitor", stock: 45, price: 300 },
      { code: "WH-005", name: "Headphone", stock: 18, price: 150 },
      { code: "WH-006", name: "USB Cable", stock: 200, price: 10 },
    ],
    [],
  );

  const getStatus = (stock) => {
    if (stock === 0) return "out";
    if (stock < 20) return "low";
    return "available";
  };

  const filteredData = useMemo(() => {
    return inventoryData.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, inventoryData]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const totalItems = inventoryData.length;

  const lowStock = inventoryData.filter(
    (item) => item.stock > 0 && item.stock < 20,
  ).length;

  const outStock = inventoryData.filter((item) => item.stock === 0).length;

  const totalValue = inventoryData.reduce(
    (acc, item) => acc + item.stock * item.price,
    0,
  );

  return (
    <div className="warehouse-content">
      <h1 className="warehouse-title">Inventory Management</h1>
      <p className="warehouse-sub">Manage and track your warehouse inventory</p>

      <div className="warehouse-stats">
        <StatCard
          title="Total Items"
          value={totalItems}
          icon={<DatabaseOutlined />}
          iconClass="icon-blue"
        />
        <StatCard
          title="Low Stock"
          value={lowStock}
          icon={<WarningOutlined />}
          iconClass="icon-yellow"
        />
        <StatCard
          title="Out of Stock"
          value={outStock}
          icon={<InboxOutlined />}
          iconClass="icon-red"
        />
        <StatCard
          title="Inventory Value"
          value={`$${totalValue.toLocaleString()}`}
          icon={<DollarOutlined />}
          iconClass="icon-green"
        />
      </div>
      <div>
        <InventoryTrack />
      </div>
      <div className="warehouse-search">
        <input
          type="text"
          placeholder="Search by name or code..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="warehouse-table-wrapper">
        <table className="warehouse-table">
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Product Name</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => {
              const status = getStatus(item.stock);
              return (
                <tr key={index}>
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.stock}</td>
                  <td>${item.price}</td>
                  <td>${(item.price * item.stock).toLocaleString()}</td>
                  <td>
                    <span className={`status status-${status}`}>
                      {status === "available" && "Available"}
                      {status === "low" && "Low Stock"}
                      {status === "out" && "Out of Stock"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* FIX CHẮC CHẮN CĂN PHẢI */}
      <div className="pagination-wrapper">
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
      <InventoryList />
    </div>
  );
}

function StatCard({ title, value, icon, iconClass }) {
  return (
    <div className="wh-card stat">
      <div className={`stat-icon ${iconClass}`}>{icon}</div>
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}

export default WareHouseInventory;
