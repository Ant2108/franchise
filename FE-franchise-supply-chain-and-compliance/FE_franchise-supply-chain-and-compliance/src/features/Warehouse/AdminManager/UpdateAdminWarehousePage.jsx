import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WareHouseAdminAPI from "./AdminWareHousePageAPI/AdminWareHousePageAPI";
import "./UpdateAdminWarehousePage.css";
import { Button } from "antd";
import {
  DashboardOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

export default function UpdateAdminWarehousePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    location: "",
    description: "",
    status: "ACTIVE",
    longitude: "",
    latitude: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await WareHouseAdminAPI.getWarehouseDetail(id);

        setFormData({
          code: res?.code || "",
          name: res?.name || "",
          location: res?.location || "",
          description: res?.description || "",
          status: res?.status || "ACTIVE",
          longitude: res?.longitude || "",
          latitude: res?.latitude || "",
        });
      } catch (err) {
        setError("Failed to load warehouse detail",err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await WareHouseAdminAPI.updateWarehouse(id, formData);
      navigate("/admin/warehouse");
    } catch (err) {
      alert("Update failed!",err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (error) return <p style={{ padding: 40 }}>{error}</p>;



  return (
    <div className="warehouseupdate-page">
      {/* HEADER */}
      <div className="page-header">
      <div className="header-inner">

        <div className="header-top">
          <Button
            icon={<ArrowLeftOutlined />}
            className="back-button"
            onClick={() => navigate("/admin/warehouse")}
          >
            Back to Warehouses
          </Button>
        </div>

        <h1>
          Edit Warehouse
          <span className="code-pill">{formData.code}</span>
        </h1>

        <p>Update warehouse information and settings</p>

      </div>
    </div>

      {/* ================= CONTENT ================= */}
      <div className="page-content">
        {/* SUMMARY */}
        <div className="summary-card">
          <div className="summary-item">
            <div className="summary-icon purple">
              <DashboardOutlined />
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-icon blue">
              <DatabaseOutlined />
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-icon green">
              <CheckCircleOutlined />
            </div>
            <div>
              <p>Status</p>
              <h2>{formData.status}</h2>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="section-card">
            <div className="section-header">Basic Information</div>
            <div className="section-body grid-2">
              <div>
                <label>* Warehouse Code</label>
                <input name="code" value={formData.code} onChange={handleChange} required />
              </div>

              <div>
                <label>* Warehouse Name</label>
                <input name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="full-width">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header">Location</div>
            <div className="section-body">
              <label>* Location</label>
              <input name="location" value={formData.location} onChange={handleChange} required />
              </div>
              <div className="section-body grid-2">
              <div>
                <label>* Latitude</label>
                <input name="latitude" value={formData.latitude} onChange={handleChange} required />
              </div>
              <div>
                <label>* Longitude</label>
                <input name="longitude" value={formData.longitude} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header">System Information</div>
            <div className="section-body grid-2">

              <div>
                <label>* Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="MAINTAIN">MAINTAIN</option>
                  <option value="CLOSE">CLOSE</option>
                </select>
              </div>

              
            </div>
          </div>

          <div className="action-area">
            <button type="button" className="btn-cancel" onClick={() => navigate("/admin/warehouse")}>
              Cancel
            </button>

            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}