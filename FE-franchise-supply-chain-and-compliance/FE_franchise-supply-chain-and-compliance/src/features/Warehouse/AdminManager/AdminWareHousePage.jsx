import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminWareHousePage.css";
import { Row, Col, Card, Statistic } from "antd";
import {HomeOutlined,CheckCircleOutlined} from "@ant-design/icons";
import {FaWarehouse,FaSearch,FaPlus,FaEdit} from "react-icons/fa";

import {MapContainer,TileLayer,Marker,Popup,useMap,} from "react-leaflet";
import L from "leaflet";
import WareHouseAdminAPI from "./AdminWareHousePageAPI/AdminWareHousePageAPI";
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
  const navigate = useNavigate();

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await WareHouseAdminAPI.getAllWarehouses();
      setWarehouses(Array.isArray(res) ? res : []);
    } catch (err) {
      setError("Failed to load warehouses",err);
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const filteredWarehouses = warehouses.filter((wh) =>
    wh.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wh.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalWarehouses = warehouses.length;
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
  let color;

  if (status === "ACTIVE") color = "#22c55e";
  else if (status === "INACTIVE") color = "#ef4444";
  else if (status === "MAINTAIN") color = "#f97316";
  else color = "#6b7280";

  const svg = `
    <svg width="36" height="48" viewBox="0 0 36 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Pin shape -->
      <path
        d="M18 0C8 0 0 8 0 18c0 13 18 30 18 30s18-17 18-30C36 8 28 0 18 0z"
        fill="${color}"
        filter="url(#glow)"
      />

      <!-- Inner circle -->
      <circle
        cx="18"
        cy="18"
        r="7"
        fill="white"
      />

      <!-- Status dot -->
      <circle
        cx="18"
        cy="18"
        r="4"
        fill="${color}"
      />
    </svg>
  `;

  return L.divIcon({
    className: "",
    html: svg,
    iconSize: [36, 48],
    iconAnchor: [18, 48],
    popupAnchor: [0, -40],
  });
};
  

  return (
    <div className="warehouse-page">
      <div className="warehouse-header">
        <h1>
          <FaWarehouse /> Warehouse Management
        </h1>
        <p>Manage and monitor all warehouse facilities</p>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* ===== STATS ===== */}
      <Row gutter={16} style={{ margin: "30px 0" }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="dashboard-card">
            <Statistic
              title="Total Warehouses"
              value={totalWarehouses}
              prefix={<HomeOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="dashboard-card">
            <Statistic
              title="Active Facilities"
              value={activeWarehouses}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <div className="content-grid">
        {/* ================= TABLE ================= */}
        <div className="table-section">
          <div className="table-header">
            <div className="search-box">
              <FaSearch />
              <input
                placeholder="Search by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              className="add-btn"
              onClick={() =>
                navigate("/admin/warehouse/create")
              }
            >
              <FaPlus /> Add Warehouse
            </button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredWarehouses.length === 0 && !loading && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No warehouses found
                    </td>
                  </tr>
                )}

                {filteredWarehouses.map((wh) => (
                  <tr
                    key={wh.id}
                    onClick={() => flyToWarehouse(wh)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{wh.code}</td>
                    <td>{wh.name}</td>
                    <td>{wh.location}</td>
                    <td>{wh.description}</td>
                    <td>
                      <span
                        className={`status ${wh.status.toLowerCase()}`}
                      >
                        {wh.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-btn edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/warehouse/update/${wh.id}`);
                        }}
                      >
                        <FaEdit />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            Total {warehouses.length} warehouses
          </div>
        </div>

        {/* ================= MAP ================= */}
        <div className="map-section">
          <h3>Warehouse Locations</h3>

          <MapContainer
            center={[10.7769, 106.7009]}
            zoom={12}
            className="map-container"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyToHandler position={selectedPosition} />

            {warehouses
              .filter(
                (wh) => wh.latitude != null && wh.longitude != null
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
                    <b>{wh.name}</b>
                    <br />
                    {wh.location}
                    <br />
                    Status: {wh.status}
                  </Popup>
                </Marker>
              ))}
          </MapContainer>

          <div className="legend">
            <span><span className="dot green"></span> Active</span>
            <span><span className="dot red"></span> Inactive</span>
            <span><span className="dot orange"></span> Maintain</span>
          </div>
        </div>
      </div>
    </div>
  );
}