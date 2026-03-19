import React from "react";
import { FaWarehouse, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

/**
 * Individual Manager Card component.
 * @param {Object} manager - Manager data.
 * @param {Function} onClick - Action on click.
 */
const ManagerCard = ({ manager, onClick }) => (
  <div
    className="warehouse-manager-card"
    onClick={onClick}
    style={{ cursor: "pointer" }}
  >
    <div className="warehouse-manager-card-top"></div>

    <div className="warehouse-manager-card-header">
      <div className="warehouse-manager-card-title">
        <div className="warehouse-manager-card-icon">
          <FaWarehouse />
        </div>
        <div>
          <h3>{manager.name}</h3>
          <p>{manager.description}</p>
        </div>
      </div>
      <span className={`warehouse-manager-badge ${manager.status}`}>
        {manager.status}
      </span>
    </div>

    <div className="warehouse-manager-info">
      <FaPhone />
      {manager.phone}
    </div>

    <div className="warehouse-manager-info">
      <FaMapMarkerAlt />
      {manager.role}
    </div>
  </div>
);

export default ManagerCard;
