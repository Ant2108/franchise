import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminWareHousePage.css";
import { Row, Col, Card, Statistic, Badge } from "antd";
import {
  HomeOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import {
  FaWarehouse,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import WareHouseAdminAPI from "./AdminWareHousePageAPI/AdminWareHousePageAPI";

export default function AdminWareHousePage() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await WareHouseAdminAPI.getAllWarehouses();
    //   console.log("Full response:", res);
    //   console.log("Data:", res);
    //   console.log("Is array:", Array.isArray(res));

      if (Array.isArray(res)) {
        setWarehouses(res);
      } else {
        setWarehouses([]);
        console.warn("API did not return array:", res);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load warehouses");
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);
  // ================= CALCULATE STATS =================
  const totalWarehouses = warehouses.length;

  const activeWarehouses = warehouses.filter(
    (wh) => wh.status === "ACTIVE"
  ).length;

  // ================= RENDER =================
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
      <Row gutter={16} style={{ margin: "30px 0" }}>
        <Col xs={24} sm={12} md={6}>
          <Card className="dashboard-card">
            <div className="card-content">
              <Statistic
                title="Total Warehouses"
                value={totalWarehouses}
                prefix={
                  <div className="stat-icon-wrapper blue">
                    <HomeOutlined className="stat-icon" />
                  </div>
                }
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card className="dashboard-card">
            <div className="card-content">
              <Statistic
                title="Active Facilities"
                value={activeWarehouses}
                prefix={
                  <div className="stat-icon-wrapper green">
                    <CheckCircleOutlined className="stat-icon" />
                  </div>
                }
              />
            </div>
          </Card>
        </Col>

      </Row>

      <div className="table-section">
        <div className="table-header">
          <div className="search-box">
            <FaSearch />
            <input placeholder="Search warehouses..." />
          </div>

          <button className="add-btn" onClick={() => navigate("/admin/warehouse/create")}>
            <FaPlus /> Add Warehouse
          </button>
        </div>

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
            {warehouses.length === 0 && !loading && (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No warehouses found
                </td>
              </tr>
            )}

            {warehouses.map((wh) => (
              <tr key={wh.id}>
                <td>{wh.code}</td>
                <td>{wh.name}</td>
                <td>{wh.location}</td>
                <td>{wh.description}</td> 
                <td>
                  <span
                    className={`status ${
                      wh.status === "ACTIVE"
                        ? "active"
                        : wh.status === "INACTIVE"  
                        ? "inactive"
                        : "maintenance"
                    }`}
                  >
                    {wh.status}
                  </span>
                </td>

                <td>
                  <button className="edit" onClick={() => navigate(`/admin/warehouse/update/${wh.id}`)}>
                    <FaEdit />
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <span>Total {warehouses.length} warehouses</span>
        </div>
      </div>
    </div>
  );
}