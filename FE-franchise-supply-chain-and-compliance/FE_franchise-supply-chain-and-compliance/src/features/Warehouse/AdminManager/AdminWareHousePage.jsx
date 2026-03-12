import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminWareHousePage.css";
import { Row, Col, Card, Statistic } from "antd";
import { HomeOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { FaWarehouse, FaSearch, FaPlus, FaEdit } from "react-icons/fa";
import { getStatusLabel, getStatusClass } from "../../../utils/statusUtils";
import { MapContainer, TileLayer, Marker, Popup, useMap, } from "react-leaflet";
import L from "leaflet";
import WareHouseAdminAPI from "./AdminWareHousePageAPI/AdminWareHousePageAPI";
import { motion } from "framer-motion";
//fly to map
function FlyToHandler({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { duration: 1.5 });
    }
  }, [position, map]);

  return null;
}
export default function AdminWareHousePage() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const navigate = useNavigate();
  //animation loading
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowIntro(false);
  //   }, 3000); 

  //   return () => clearTimeout(timer);
  // }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await WareHouseAdminAPI.getAllWarehouses();
      setWarehouses(Array.isArray(res) ? res : []);
    } catch (err) {
      setError("Failed to load warehouses", err);
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const filteredWarehouses = warehouses
    .filter((wh) =>
      wh.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wh.code?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((wh) => {
      if (filterStatus === "ALL") {
        return wh.status !== "CLOSE";
      }
      return wh.status === filterStatus;
    });

  const totalWarehouses = warehouses.filter(
    (wh) => wh.status !== "CLOSE"
  ).length;
  const activeWarehouses = warehouses.filter(
    (wh) => wh.status === "ACTIVE"
  ).length;

  const flyToWarehouse = (wh) => {
    const lat = parseFloat(wh.latitude);
    const lng = parseFloat(wh.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      console.log("Invalid coordinates:", wh);
      return;
    }

    setSelectedPosition([lat, lng]);
  };

  // const createIcon = (status) => {
  //   return L.divIcon({
  //     className: `custom-marker ${status?.toLowerCase()}`,
  //     iconSize: [18, 18],
  //   });
  // };
  // tùy chọn STYLE CỦA MARKER TRÊN MAP
  const createIcon = (status) => {
    let color = "#6b7280";
    let radarClass = "";
    let enableAnimation = false;

    if (status === "ACTIVE") {
      color = "#22c55e";
      radarClass = "radar-active";
      enableAnimation = true;
    }
    else if (status === "MAINTAIN") {
      color = "#f97316";
      radarClass = "radar-maintain";
      enableAnimation = true;
    }
    else if (status === "INACTIVE") {
      color = "#ef4444";
    }
    //${enableAnimation ? `<div class="radar-ring ${radarClass}"></div>` : ""} code này là 1 vong tròn xung quanh marker
    // ${enableAnimation ? `
    //           <div class="radar-ring ${radarClass}"></div>
    //           <div class="radar-ring radar-delay ${radarClass}"></div>
    //         ` : ""} code này là 2 vong tròn xung quanh marker
    const html = `
      <div class="marker-wrapper">
        ${enableAnimation ? `<div class="radar-ring ${radarClass}"></div>` : ""}
        <div class="${enableAnimation ? "bounce" : ""}">
          <svg width="36" height="48" viewBox="0 0 36 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 0C8 0 0 8 0 18c0 13 18 30 18 30s18-17 18-30C36 8 28 0 18 0z"
              fill="${color}"
            />
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
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <motion.div
      className="warehouse-page"
      variants={pageVariant}
      initial="hidden"
      animate="visible"
    >
      
      <motion.div
        className="warehouse-page"
        variants={pageVariant}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="warehouse-header">
          <h1>
            <FaWarehouse /> Quản lý Kho Hàng
          </h1>
          <p>Quản lý và giám sát tất cả các kho hàng</p>
        </motion.div>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {/* ===== STATS ===== */}
        <motion.div >
          <Row gutter={16} style={{ margin: "30px 0" }}>
            <Col xs={24} sm={12} md={6}>
              <Card className="dashboard-card">
                <Statistic
                  title="Tổng Kho Hàng"
                  value={totalWarehouses}
                  prefix={<HomeOutlined />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card className="dashboard-card">
                <Statistic
                  title="Cơ sở hoạt động"
                  value={activeWarehouses}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
          </Row>
        </motion.div>

        <div className="content-grid">
          {/* ================= TABLE ================= */}
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
                onClick={() => navigate("/admin/warehouse/create", {
                  state: { fromWarehouse: true },
                })}
              >
                <FaPlus /> Thêm Kho
              </button>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Tên Kho</th>
                    <th>Vị Trí</th>
                    <th>Mô Tả</th>
                    <th>Trạng Thái</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredWarehouses.length === 0 && !loading && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        Không tìm thấy kho hàng nào
                      </td>
                    </tr>
                  )}

                  {filteredWarehouses.map((wh) => (
                    <tr
                      key={wh.id}
                      onClick={() => flyToWarehouse(wh)}
                      style={{ cursor: "pointer" }}
                    >
                      <td style={{ verticalAlign: 'top' }}>{wh.code}</td>
                      <td style={{ verticalAlign: 'top' }}>{wh.name}</td>
                      <td style={{ verticalAlign: 'top' }}>
                        <div className="scrollable-cell location-cell">
                          {wh.location}
                        </div>
                      </td>
                      <td style={{ verticalAlign: 'top' }}>
                        <div className="scrollable-cell desc-cell">
                          {wh.description}
                        </div>
                      </td>
                      <td>
                        <span className={`status ${getStatusClass(wh.status)}`}>
                          {getStatusLabel(wh.status)}
                        </span>
                      </td>
                      <td>
                        <button
                          className="action-btn edit-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/warehouse/update/${wh.id}`, {
                              state: { fromWarehouse: true },
                            });
                          }}
                        >
                          <FaEdit />
                          <span>Chỉnh Sửa</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              Tổng {warehouses.filter(w => w.status !== "CLOSE").length} kho hàng
            </div>
          </motion.div>

          {/* ================= MAP ================= */}
          <motion.div
            className="map-section"

          >
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
              //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FlyToHandler position={selectedPosition} />

              {warehouses
                .filter(
                  (wh) => wh.latitude != null && wh.longitude != null && (filterStatus === "ALL"
                    ? wh.status !== "CLOSE"
                    : wh.status === filterStatus)
                )
                .map((wh) => (
                  <Marker
                    key={wh.id}
                    position={[
                      parseFloat(wh.latitude),
                      parseFloat(wh.longitude),
                    ]}
                    icon={createIcon(wh.status)}
                  >
                    <Popup>
                      <div className="custom-popup">
                        <div className="popup-title">{wh.name}</div>

                        <div className="popup-location">
                          📍 {wh.location}
                        </div>
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
    </motion.div>

  );
}