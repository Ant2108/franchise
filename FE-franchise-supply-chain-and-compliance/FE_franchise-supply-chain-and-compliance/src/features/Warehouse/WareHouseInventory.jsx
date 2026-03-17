import InventoryTrack from "../Inventory/InventoryTrack";
import InventoryList from "../Inventory/InventoryList";
import inventoryApi from "../Inventory/InventoryAPI/inventoryApi";

import { useState, useMemo, useEffect } from "react";
import { getCookie } from "../../utils/cookieUtils";

import {
  DatabaseOutlined,
  WarningOutlined,
  DollarOutlined,
  InboxOutlined,
} from "@ant-design/icons";

function WareHouseInventory() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inventories, setInventories] = useState([])
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 5;

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getAll();
      const warehouseId = getCookie("warehouse_id");
      let data = Array.isArray(res) ? res : res?.data || [];
      
      if (warehouseId) {
        data = data.filter(item => item.warehouseId === warehouseId);
      }
      
      setInventories(data);
    } catch (err) {
      console.error("Fetch inventory error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const getStatus = (available) => {
    if (available === 0) return "out";
    if (available < 20) return "low";
    return "available";
  };
  const filteredData = useMemo(() => {
  return inventories.filter(
    (item) =>
      item.ingredientId?.toString().includes(search) ||
      item.warehouseId?.toString().includes(search)
  );
}, [search, inventories]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const totalItems = inventories.length;

  const lowStock = inventories.filter(
    (item) =>
      item.quantityAvailable > 0 && item.quantityAvailable < 20
  ).length;

  const outStock = inventories.filter(
    (item) => item.quantityAvailable === 0
  ).length;

  const totalValue = inventories.reduce(
    (acc, item) =>
      acc + item.quantityAvailable * (item.price || 0),
    0
  );

  return (
    <div className="warehouse-content">
      <h1 className="warehouse-title">Inventory Management</h1>
      <p className="warehouse-sub">
        Manage and track your warehouse inventory
      </p>

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