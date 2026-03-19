import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaWarehouse, FaSearch, FaChartLine } from "react-icons/fa";
import "./AdminWareHouseManager.css";
import { AdminWareHouseManager } from "./AdminWareHousePageAPI/AdminWareHouseManager";

// Hooks and Components
import { useManagerSearch } from "./hooks/useManagerSearch";
import ManagerCard from "./components/ManagerCard";

const AdminWareHouseManagers = () => {
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Use custom hook for managing logic
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedManagers,
    totalCount,
    activeCount
  } = useManagerSearch(managers);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const res = await AdminWareHouseManager.getWarehouseManagers();
      const rawData = res?.result?.content || [];
      const mappedData = rawData.map((m) => ({
        id: m.id,
        name: `${m.firstName || ""} ${m.lastName || ""}`,
        description: m.email,
        phone: m.phoneNumber || "N/A",
        status: m.status?.toLowerCase() || "inactive",
        role: m.roles?.[0]?.name || "Manager",
      }));
      setManagers(mappedData);
    } catch (error) {
      console.error("❌ API ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  return (
    <div className="warehouse-manager-page">
      {/* HEADER */}
      <div className="warehouse-manager-header">
        <div className="warehouse-manager-title">
          <div>
            <h1>Warehouse Managers</h1>
            <p>Manage warehouse manager accounts (Total: {totalCount})</p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="warehouse-manager-stats">
        <div className="warehouse-manager-stat-card stat-blue">
          <div>
            <p>Total Managers</p>
            <h3>{totalCount}</h3>
          </div>
          <FaWarehouse />
        </div>

        <div className="warehouse-manager-stat-card stat-green">
          <div>
            <p>Active</p>
            <h3>{activeCount}</h3>
          </div>
          <FaChartLine />
        </div>
      </div>

      {/* CONTENT */}
      <div className="warehouse-manager-content">
        <div className="warehouse-manager-search">
          <FaSearch className="warehouse-manager-search-icon" />
          <input
            type="text"
            placeholder="Search manager..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="warehouse-manager-grid">
            {paginatedManagers.map((manager) => (
              <ManagerCard
                key={manager.id}
                manager={manager}
                onClick={() => navigate(`/admin/warehouse-manager/${manager.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="warehouse-manager-pagination">
        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminWareHouseManagers;