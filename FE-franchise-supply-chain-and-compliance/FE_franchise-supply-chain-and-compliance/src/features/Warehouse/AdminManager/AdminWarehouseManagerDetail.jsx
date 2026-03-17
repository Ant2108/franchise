import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaWarehouse,
  FaCalendarAlt,
  FaEdit,
} from "react-icons/fa";
import "./AdminWarehouseManagerDetail.css";
import { AdminWareHouseManager } from "./AdminWareHousePageAPI/AdminWareHouseManager";

const AdminWarehouseManagerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchManagerDetail = async () => {
      try {
        setLoading(true);
        const res = await AdminWareHouseManager.getWarehouseManagers();
        const rawData = res?.result?.content || [];
        
        // Find the specific manager by ID
        const selectedManager = rawData.find((m) => String(m.id) === String(id));
        
        if (selectedManager) {
          setManager({
            id: selectedManager.id,
            firstName: selectedManager.firstName || "N/A",
            lastName: selectedManager.lastName || "N/A",
            fullName: `${selectedManager.firstName || ""} ${selectedManager.lastName || ""}`,
            email: selectedManager.email || "N/A",
            phone: selectedManager.phoneNumber || "N/A",
            status: selectedManager.status?.toLowerCase() || "inactive",
            role: selectedManager.roles?.[0]?.name || "Warehouse Manager",
            username: selectedManager.username || "N/A",
            createdAt: selectedManager.createdAt || "N/A",
            // You can add more fields here if they exist in the API response
          });
        } else {
          setError("Manager not found");
        }
      } catch (err) {
        console.error("❌ Error fetching manager details:", err);
        setError("Failed to load manager details");
      } finally {
        setLoading(false);
      }
    };

    fetchManagerDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="manager-detail-loading">
        <div className="spinner"></div>
        <p>Loading manager details...</p>
      </div>
    );
  }

  if (error || !manager) {
    return (
      <div className="manager-detail-error">
        <FaTimesCircle className="error-icon" />
        <h2>{error || "Manager not found"}</h2>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="manager-detail-container">
      {/* HEADER SECTION */}
      <div className="manager-detail-header">
        <button className="back-btn-header" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back to Managers
        </button>
        <div className="header-actions">
          <button className="edit-btn-header">
            <FaEdit /> Edit Profile
          </button>
        </div>
      </div>

      <div className="manager-detail-content">
        <div className="detail-grid">
          {/* LEFT COLUMN: PROFILE SUMMARY */}
          <div className="detail-card profile-summary-card">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {manager.firstName.charAt(0)}{manager.lastName.charAt(0)}
              </div>
              <span className={`status-badge ${manager.status}`}>
                {manager.status === "active" ? <FaCheckCircle /> : <FaTimesCircle />}
                {manager.status.toUpperCase()}
              </span>
            </div>
            <h2 className="profile-name">{manager.fullName}</h2>
            <p className="profile-role">{manager.role}</p>
            
            <div className="quick-info">
              <div className="info-item">
                <FaEnvelope className="info-icon" />
                <span>{manager.email}</span>
              </div>
              <div className="info-item">
                <FaPhone className="info-icon" />
                <span>{manager.phone}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILED INFO */}
          <div className="detail-info-main">
            {/* PERSONAL INFORMATION */}
            <div className="detail-card">
              <h3 className="card-title">
                <FaUser /> Personal Information
              </h3>
              <div className="info-grid">
                <div className="info-field">
                  <label>First Name</label>
                  <p>{manager.firstName}</p>
                </div>
                <div className="info-field">
                  <label>Last Name</label>
                  <p>{manager.lastName}</p>
                </div>
                <div className="info-field">
                  <label>Account Status</label>
                  <p className={`status-text ${manager.status}`}>{manager.status.charAt(0).toUpperCase() + manager.status.slice(1)}</p>
                </div>
              </div>
            </div>

            {/* SYSTEM DETAILS */}
            <div className="detail-card">
              <h3 className="card-title">
                <FaShieldAlt /> Role & Permissions
              </h3>
              <div className="info-grid">
                <div className="info-field">
                  <label>Assigned Role</label>
                  <p className="role-tag">{manager.role}</p>
                </div>
                <div className="info-field">
                  <label>System Permissions</label>
                  <p>Full Access to Warehouse Management</p>
                </div>
                <div className="info-field">
                  <label>Created On</label>
                  <div className="icon-text">
                    <FaCalendarAlt />
                    <span>{manager.createdAt !== "N/A" ? new Date(manager.createdAt).toLocaleDateString() : "March 15, 2024"}</span>
                  </div>
                </div>
                <div className="info-field">
                  <label>Last Login</label>
                  <div className="icon-text">
                    <FaClock />
                    <span>Just now</span>
                  </div>
                </div>
              </div>
            </div>

            {/* WAREHOUSE ASSIGNMENT (PLACEHOLDER/EXTENDED) */}
            <div className="detail-card">
              <h3 className="card-title">
                <FaWarehouse /> Assigned Warehouse
              </h3>
              <div className="warehouse-assignment">
                <div className="warehouse-icon-box">
                  <FaWarehouse />
                </div>
                <div className="warehouse-details">
                  <h4>Secondary Warehouse A</h4>
                  <p>123 Industrial Dr, Silicon Valley, CA</p>
                  <span className="assignment-status">Primary Manager</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWarehouseManagerDetail;
