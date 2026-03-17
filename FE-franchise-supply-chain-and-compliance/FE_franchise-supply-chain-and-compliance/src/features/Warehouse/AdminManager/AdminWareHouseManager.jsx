import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaWarehouse,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaMapMarkerAlt,
  FaPhone,
  FaChartLine,
} from "react-icons/fa";
import "./AdminWareHouseManager.css";
import { AdminWareHouseManager } from "./AdminWareHousePageAPI/AdminWareHouseManager";

const ITEMS_PER_PAGE = 8;

const AdminWareHouseManagers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [warehouses, setWarehouses] = useState([]);

  /* ================= API ================= */

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const res = await AdminWareHouseManager.getWarehouseManagers();

      console.log("🔥 FULL RESPONSE:", res);

      const rawData = res?.result?.content || [];

      // ✅ MAP DATA
      const mappedData = rawData.map((m) => ({
        id: m.id,
        name: `${m.firstName || ""} ${m.lastName || ""}`,
        description: m.email,
        address: "N/A", // backend chưa có
        phone: m.phoneNumber || "N/A",
        status: m.status?.toLowerCase() || "inactive",
        role: m.roles?.[0]?.name || "Manager",
      }));

      console.log("🔥 MAPPED DATA:", mappedData);

      setWarehouses(mappedData);
    } catch (error) {
      console.error("❌ API ERROR:", error);
    }
  };

  /* ================= FILTER ================= */

  const filteredWarehouses = warehouses.filter(
    (w) =>
      (w.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.phone || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ================= PAGINATION ================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredWarehouses.length / ITEMS_PER_PAGE)
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedWarehouses = filteredWarehouses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* ================= DELETE ================= */

  const handleDelete = (id) => {
    if (confirm("Delete this manager?")) {
      setWarehouses(warehouses.filter((w) => w.id !== id));
    }
  };

  return (
    <div className="warehouse-manager-page">
      {/* HEADER */}
      <div className="warehouse-manager-header">
        <div className="warehouse-manager-title">
          <div>
            <h1>Warehouse Managers</h1>
            <p>Manage warehouse manager accounts</p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="warehouse-manager-stats">
        <div className="warehouse-manager-stat-card stat-blue">
          <div>
            <p>Total Managers</p>
            <h3>{warehouses.length}</h3>
          </div>
          <FaWarehouse />
        </div>

        <div className="warehouse-manager-stat-card stat-green">
          <div>
            <p>Active</p>
            <h3>
              {warehouses.filter((w) => w.status === "active").length}
            </h3>
          </div>
          <FaChartLine />
        </div>
      </div>

      {/* CONTENT */}
      <div className="warehouse-manager-content">
        {/* SEARCH */}
        <div className="warehouse-manager-search">
          <FaSearch className="warehouse-manager-search-icon" />
          <input
            type="text"
            placeholder="Search manager..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* GRID */}
        <div className="warehouse-manager-grid">
          {paginatedWarehouses.map((warehouse) => (
            <div
              className="warehouse-manager-card"
              key={warehouse.id}
              onClick={() => navigate(`/admin/warehouse-manager/${warehouse.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="warehouse-manager-card-top"></div>

              <div className="warehouse-manager-card-header">
                <div className="warehouse-manager-card-title">
                  <div className="warehouse-manager-card-icon">
                    <FaWarehouse />
                  </div>

                  <div>
                    <h3>{warehouse.name}</h3>
                    <p>{warehouse.description}</p>
                  </div>
                </div>

                <span
                  className={`warehouse-manager-badge ${warehouse.status}`}
                >
                  {warehouse.status}
                </span>
              </div>

              <div className="warehouse-manager-info">
                <FaPhone />
                {warehouse.phone}
              </div>

              <div className="warehouse-manager-info">
                <FaMapMarkerAlt />
                {warehouse.role}
              </div>

              {/* BUTTONS */}
              <div className="warehouse-manager-buttons">
                <button
                  className="warehouse-manager-btn delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(warehouse.id);
                  }}
                >
                  <FaTrash /> Đuổi Việc!
                </button>
              </div>
            </div>
          ))}
        </div>
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