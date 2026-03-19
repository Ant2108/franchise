import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminWareHousePage.css";
import { FaSearch, FaPlus } from "react-icons/fa";
import { getStatusLabel } from "../../../utils/statusUtils";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useWarehouseWizad } from "./hooks/useWarehouseWizad";
import { motion } from "framer-motion";

// Modularized components and hooks
import { useWarehouseSearch } from "./hooks/useWarehouseSearch";
import WarehouseStatCards from "./components/WarehouseStatCards";
import WarehouseTable from "./components/WarehouseTable";

// FlyToHandler component for map navigation
function FlyToHandler({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

// Marker style configuration
const createIcon = (status) => {
  let color = "#6b7280";
  let radarClass = "";
  let enableAnimation = false;

  if (status === "ACTIVE") {
    color = "#22c55e";
    radarClass = "radar-active";
    enableAnimation = true;
  } else if (status === "MAINTAIN") {
    color = "#f97316";
    radarClass = "radar-maintain";
    enableAnimation = true;
  } else if (status === "INACTIVE") {
    color = "#ef4444";
  }

  const html = `
    <div class="marker-wrapper">
      ${enableAnimation ? `<div class="radar-ring ${radarClass}"></div>` : ""}
      <div class="${enableAnimation ? "bounce" : ""}">
        <svg width="36" height="48" viewBox="0 0 36 48" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 0C8 0 0 8 0 18c0 13 18 30 18 30s18-17 18-30C36 8 28 0 18 0z" fill="${color}" />
          <circle cx="18" cy="18" r="7" fill="white"/>
          <circle cx="18" cy="18" r="4" fill="${color}"/>
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    className: "",
    html,
    iconSize: [36, 48],
    iconAnchor: [18, 48],
    popupAnchor: [0, -80],
  });
};

const pageVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, when: "beforeChildren", staggerChildren: 0.15 },
  },
};

export default function AdminWareHousePage() {
  const { warehouses, loading, fetchWarehouses } = useWarehouseWizad();
  const [selectedPosition, setSelectedPosition] = useState(null);
  const navigate = useNavigate();

  // Use custom hook for search and filtering
  const {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filteredWarehouses,
    stats
  } = useWarehouseSearch(warehouses);

  useEffect(() => {
    const controller = new AbortController();
    
    // Gọi hàm fetch từ hook, truyền thêm config signal để AbortController hoạt động
    fetchWarehouses({}, { signal: controller.signal });

    return () => {
      controller.abort(); // Cancel the request if component unmounts quickly
    };
  }, [fetchWarehouses]);

  const flyToWarehouse = (wh) => {
    if (!wh.latitude || !wh.longitude) return;
    const lat = parseFloat(wh.latitude);
    const lng = parseFloat(wh.longitude);
    if (!isNaN(lat) && !isNaN(lng)) setSelectedPosition([lat, lng]);
  };

  return (
    <motion.div
      className="warehouse-page"
      variants={pageVariant}
      initial="hidden"
      animate="visible"
    >
      <div className="warehouse-header">
        <h1>Quản lý Kho Hàng</h1>
      </div>

      {loading && <p>Loading...</p>}

      <WarehouseStatCards stats={stats} />

      <div className="content-grid">
        <motion.div className="table-section">
          <div className="table-header">
            <div style={{ display: "flex", gap: "10px" }}>
              <div className="filter-bar">
                <select
                  className="status-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="ALL">Tất cả</option>
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="INACTIVE">Ngừng hoạt động</option>
                  <option value="MAINTAIN">Bảo trì</option>
                  <option value="CLOSE">Đóng cửa</option>
                </select>

                <div className="search-box">
                  <FaSearch />
                  <input
                    placeholder="Tìm kiếm theo tên hoặc mã kho..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              className="add-btn"
              onClick={() => navigate("/admin/warehouse/create", { state: { fromWarehouse: true } })}
            >
              <FaPlus /> Thêm Kho
            </button>
          </div>

          <WarehouseTable
            warehouses={filteredWarehouses}
            loading={loading}
            onRowClick={flyToWarehouse}
            onEdit={(id) => navigate(`/admin/warehouse/update/${id}`, { state: { fromWarehouse: true } })}
          />

          <div className="pagination">
            Tổng {stats.total} kho hàng
          </div>
        </motion.div>

        <motion.div className="map-section">
          <h3>Vị Trí Kho Hàng</h3>
          <MapContainer
            center={[10.7769, 106.7009]}
            zoom={12}
            zoomControl={false}
            className="map-container"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap & CartoDB'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <FlyToHandler position={selectedPosition} />

            {warehouses
              .filter((wh) => wh.latitude != null && wh.longitude != null && (filterStatus === "ALL" ? wh.status !== "CLOSE" : wh.status === filterStatus))
              .map((wh) => (
                <Marker key={wh.id} position={[parseFloat(wh.latitude), parseFloat(wh.longitude)]} icon={createIcon(wh.status)}>
                  <Popup>
                    <div className="custom-popup">
                      <div className="popup-title">{wh.name}</div>
                      <div className="popup-location">📍 {wh.location}</div>
                      Trạng Thái: {getStatusLabel(wh.status)}
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>

          <div className="legend">
            <span><span className="dot green"></span> Hoạt Động</span>
            <span><span className="dot red"></span> Không Hoạt Động</span>
            <span><span className="dot orange"></span> Bảo Trì</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}