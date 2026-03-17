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
  FaSignOutAlt,
} from "react-icons/fa";
import "./AdminWarehouseManagerDetail.css";
import { AdminWareHouseManager } from "./AdminWareHousePageAPI/AdminWareHouseManager";
import WareHouseAdminAPI from "./AdminWareHousePageAPI/AdminWareHousePageAPI";
import { message } from "antd";

const AdminWarehouseManagerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [allWarehouses, setAllWarehouses] = useState([]);
  const [assignedWarehouse, setAssignedWarehouse] = useState(null);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [managersRes, warehousesRes] = await Promise.all([
          AdminWareHouseManager.getWarehouseManagers(),
          WareHouseAdminAPI.getAllWarehouses()
        ]);

        const rawData = managersRes?.result?.content || [];
        const warehousesList = Array.isArray(warehousesRes) ? warehousesRes : [];
        setAllWarehouses(warehousesList);

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
            createdAt: selectedManager.createdAt || "N/A",
          });

          // Find assigned warehouse
          const assigned = warehousesList.find(w => String(w.managerId) === String(id));
          setAssignedWarehouse(assigned);
          if (assigned) setSelectedWarehouseId(assigned.id);
        } else {
          setError("Manager not found");
        }
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const refreshData = async () => {
    try {
      const [managersRes, warehousesRes] = await Promise.all([
        AdminWareHouseManager.getWarehouseManagers(),
        WareHouseAdminAPI.getAllWarehouses()
      ]);

      const rawData = managersRes?.result?.content || [];
      const warehousesList = Array.isArray(warehousesRes) ? warehousesRes : [];
      setAllWarehouses(warehousesList);

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
          createdAt: selectedManager.createdAt || "N/A",
        });

        const assigned = warehousesList.find(w => String(w.managerId) === String(id));
        setAssignedWarehouse(assigned);
        if (assigned) setSelectedWarehouseId(assigned.id);
      }
    } catch (err) {
      console.error("❌ Error refreshing data:", err);
    }
  };

  const handleAssign = async (confirmReplace = false) => {
    if (!selectedWarehouseId) return;

    // Chặn đứng mọi khả năng gây lỗi 500/409 trước khi gọi API
    if (!confirmReplace) {
      const targetWarehouse = allWarehouses.find(w => String(w.id) === String(selectedWarehouseId));
      const targetManagerId = targetWarehouse?.managerId ? String(targetWarehouse.managerId) : null;
      const currentManagerId = String(id);

      // 1. Check Kho đích đã có Manager khác chưa
      const isWarehouseOccupied = targetManagerId && targetManagerId !== currentManagerId;
      
      // 2. Check Manager hiện tại đã quản lý kho nào chưa (Switching logic)
      const isManagerAlreadyAssigned = assignedWarehouse && String(assignedWarehouse.id) !== String(selectedWarehouseId);

      if (isWarehouseOccupied || isManagerAlreadyAssigned) {
        setShowReplaceConfirm(true);
        return; // Dừng lại ở đây, không gọi API -> Console sạch sẽ
      }
    }

    setIsAssigning(true);
    try {
      await WareHouseAdminAPI.assignManager(
        selectedWarehouseId,
        id,
        confirmReplace
      );

      await refreshData();
      setIsModalOpen(false);
      setShowReplaceConfirm(false);
      message.success("Warehouse assigned successfully!");

    } catch (err) {
      const status = err.response?.status;
      // Nếu vẫn lọt qua (do data local chưa update kịp), vẫn chặn log lỗi conflict
      if (status === 409 || status === 500) {
        setShowReplaceConfirm(true);
      } else {
        console.error("❌ Assignment Error:", err);
        message.error(err.response?.data?.message || "Something went wrong");
      }
    } finally {
      setIsAssigning(false);
    }
  };
  const handleUnassign = async () => {
    if (!assignedWarehouse) return;

    try {
      setIsAssigning(true);

      await WareHouseAdminAPI.assignManager(
        assignedWarehouse.id,
        null, 
        false
      );

      await refreshData();

      await refreshData();

      message.success("Unassigned successfully!");
    } catch (err) {
      console.error("❌ Unassign Error:", err);
      message.error(err.response?.data?.message || "Unassign failed");
    } finally {
      setIsAssigning(false);
    }
  };

  const cancelReplace = () => {
    setShowReplaceConfirm(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
    if (assignedWarehouse) setSelectedWarehouseId(assignedWarehouse.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowReplaceConfirm(false);
    setSearchTerm("");
  };

  const handleSelectWarehouse = (warehouseId) => {
    setSelectedWarehouseId(warehouseId);
    setShowReplaceConfirm(false);
  };

  const filteredWarehouses = allWarehouses.filter(w => 
    w.status === "ACTIVE" && 
    (w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     w.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

            {/* WAREHOUSE ASSIGNMENT */}
            <div className="detail-card assignment-overview-card">
              <h3 className="card-title">
                <FaWarehouse /> Warehouse Assignment
              </h3>
              
              <div className="assignment-overview">
                {assignedWarehouse ? (
                  <div className="assigned-display">
                    <div className="warehouse-icon-box active">
                      <FaWarehouse />
                    </div>
                    <div className="warehouse-details">
                      <span className="tiny-label">Current Assignment</span>
                      <h4>{assignedWarehouse.name}</h4>
                      <p>{assignedWarehouse.code} • {assignedWarehouse.location}</p>
                    </div>
                    <button 
                      className="unassign-action-btn" 
                      onClick={handleUnassign}
                      title="Remove assignment"
                      disabled={isAssigning}
                    >
                      <FaSignOutAlt />
                      <span>Unassign</span>
                    </button>
                  </div>
                ) : (
                  <div className="no-assignment">
                    <p>Not currently assigned to any warehouse.</p>
                  </div>
                )}
                <button className="manage-assignment-btn" onClick={openModal}>
                  {assignedWarehouse ? "Switch Warehouse" : "Assign to Warehouse"}
                </button>
              </div>
            </div>

            {/* ASSIGNMENT MODAL */}
            {isModalOpen && (
              <div className="modal-overlay">
                <div className="assignment-modal">
                  <div className="modal-header">
                    <h3>Manage Warehouse Assignment</h3>
                    <button className="close-modal-btn" onClick={closeModal}>&times;</button>
                  </div>
                  
                  <div className="modal-body">
                    <div className="dual-pane">
                      {/* LEFT PANE: CURRENT */}
                      <div className="pane current-pane">
                        <h4 className="pane-title">Current Allocation</h4>
                        {assignedWarehouse ? (
                          <div className="pane-card active">
                            <div className="pane-icon"><FaWarehouse /></div>
                            <div className="pane-info">
                              <h5>{assignedWarehouse.name}</h5>
                              <p>{assignedWarehouse.code}</p>
                              <p className="loc">{assignedWarehouse.location}</p>
                              <span className="status-tag">Assigned</span>
                            </div>
                          </div>
                        ) : (
                          <div className="pane-card empty">
                            <p>No warehouse currently assigned</p>
                          </div>
                        )}
                        
                        {selectedWarehouseId && selectedWarehouseId !== assignedWarehouse?.id && (
                          <div className="selection-preview animate-in">
                            <div className="preview-arrow">→</div>
                            <div className="preview-content">
                              <p>Assigning to:</p>
                              <strong>{allWarehouses.find(w => w.id === selectedWarehouseId)?.name}</strong>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* RIGHT PANE: AVAILABLE */}
                      <div className="pane list-pane">
                        <h4 className="pane-title">Active Warehouses</h4>
                        <div className="search-wrapper">
                          <input 
                            type="text" 
                            placeholder="Search warehouse..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <div className="warehouse-list">
                          {filteredWarehouses.map(w => (
                            <div 
                              key={w.id} 
                              className={`list-item ${selectedWarehouseId === w.id ? 'selected' : ''}`}
                              onClick={() => handleSelectWarehouse(w.id)}
                            >
                              <div className="item-meta">
                                <h6>{w.name}</h6>
                                <span>{w.code}</span>
                              </div>
                              {selectedWarehouseId === w.id && <FaCheckCircle className="check-icon" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="modal-footer">
                    <button className="modal-btn-secondary" onClick={closeModal}>Cancel</button>
                    <button 
                      className="modal-btn-primary" 
                      onClick={() => handleAssign(false)}
                      disabled={!selectedWarehouseId || isAssigning || selectedWarehouseId === assignedWarehouse?.id}
                    >
                      {isAssigning ? "Assigning..." : "Apply Assignment"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CONFLICT / REPLACE POPUP */}
            {showReplaceConfirm && (
              <div className="modal-overlay secondary-overlay">
                <div className="conflict-popup animate-in">
                  <div className="conflict-icon-box">
                    <FaShieldAlt />
                  </div>
                  <h3>Management Conflict</h3>
                  <p>
                    This warehouse already has an assigned manager. 
                    Do you want to <strong>replace</strong> the existing manager with <strong>{manager.fullName}</strong>?
                  </p>
                  <div className="conflict-actions">
                    <button className="btn-cancel" onClick={() => setShowReplaceConfirm(false)}>
                      Go Back
                    </button>
                    <button 
                      className="btn-replace" 
                      onClick={() => {
                        handleAssign(true);
                        setShowReplaceConfirm(false);
                      }}
                      disabled={isAssigning}
                    >
                      {isAssigning ? "Processing..." : "Confirm & Replace"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWarehouseManagerDetail;
