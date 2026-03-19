import React from "react";
import { Tag, Button, Popconfirm } from "antd";
import { StarOutlined, DeleteOutlined, PictureOutlined } from "@ant-design/icons";

/**
 * Component for individual supplier card.
 * @param {Object} supplier - Supplier data.
 * @param {Function} onView - Callback for viewing details.
 * @param {Function} onDelete - Callback for deleting.
 */
const SupplierCard = ({ supplier, onView, onDelete }) => (
  <div className="supplier-card">
    {/* Card Image Section */}
    <div className="supplier-card-image" onClick={() => onView(supplier.id)} style={{ cursor: "pointer" }}>
      {supplier.imageUrl || supplier.image ? (
        <img src={supplier.imageUrl || supplier.image} alt={supplier.name} className="supplier-image" />
      ) : (
        <div className="supplier-image-placeholder">
          <PictureOutlined />
        </div>
      )}
    </div>

    {/* Card Header with Status */}
    <div className="supplier-card-header" onClick={() => onView(supplier.id)}>
      <div className="supplier-status-badge">
        <Tag color={supplier.status === "ACTIVE" ? "success" : "default"} className="supplier-status-tag">
          {supplier.status}
        </Tag>
      </div>
      <div className="supplier-rating-badge">
        <StarOutlined className="star-icon" />
        <span className="rating-text">{(supplier.avgRating || 0).toFixed(1)}</span>
      </div>
    </div>

    {/* Card Body */}
    <div className="supplier-card-body">
      <h3 className="supplier-name" title={supplier.name} style={{ cursor: "pointer" }}>
        {supplier.name}
      </h3>

      {/* ID Display */}
      <div className="supplier-id">
        ID: {typeof supplier.id === "string" ? supplier.id.slice(0, 8) : supplier.id}
      </div>

      {/* Contact Information */}
      <div className="supplier-info">
        <div className="info-row">
          <span className="info-label">Người liên hệ:</span>
          <span className="info-value">{supplier.contactName || "—"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Email:</span>
          <span className="info-value email-text">{supplier.email || "—"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Điện thoại:</span>
          <span className="info-value">{supplier.phone || "—"}</span>
        </div>
      </div>
    </div>

    {/* Card Actions */}
    <div className="supplier-card-actions">
      <Popconfirm
        title="Bạn có chắc chắn muốn xóa nhà cung cấp này?"
        onConfirm={(e) => { e.stopPropagation(); onDelete(supplier.id); }}
        okText="Có"
        cancelText="Không"
      >
        <Button danger size="small" icon={<DeleteOutlined />} className="delete-btn">
          Xóa
        </Button>
      </Popconfirm>
    </div>
  </div>
);

export default SupplierCard;
