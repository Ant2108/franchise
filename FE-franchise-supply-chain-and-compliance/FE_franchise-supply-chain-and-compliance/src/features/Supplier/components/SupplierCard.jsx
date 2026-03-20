import React from "react";
import { Tag, Button, Popconfirm, Tooltip } from "antd";
import { StarOutlined, DeleteOutlined, PictureOutlined, EyeOutlined } from "@ant-design/icons";

/**
 * Premium Supplier Card Component
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
          <span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af" }}>Chưa có ảnh</span>
        </div>
      )}
    </div>

    {/* Card Header with Status & Rating */}
    <div className="supplier-card-header" onClick={() => onView(supplier.id)} style={{ cursor: "pointer" }}>
      <div className="supplier-status-badge">
        <Tag
          color={supplier.status === "ACTIVE" ? "success" : "default"}
          className="supplier-status-tag"
        >
          {supplier.status === "ACTIVE" ? "● Hoạt động" : "○ Ngưng"}
        </Tag>
      </div>
      <div className="supplier-rating-badge">
        <StarOutlined className="star-icon" />
        <span className="rating-text">{(supplier.avgRating || 0).toFixed(1)}</span>
      </div>
    </div>

    {/* Card Body */}
    <div className="supplier-card-body" onClick={() => onView(supplier.id)} style={{ cursor: "pointer" }}>
      <h3 className="supplier-name" title={supplier.name}>
        {supplier.name}
      </h3>

      <div className="supplier-id">
        ID: {typeof supplier.id === "string" ? supplier.id.slice(0, 8) : supplier.id}
      </div>

      {/* Contact Information */}
      <div className="supplier-info">
        <div className="info-row">
          <span className="info-label">👤 Liên hệ</span>
          <span className="info-value">{supplier.contactName || "—"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">✉️ Email</span>
          <span className="info-value email-text">{supplier.email || "—"}</span>
        </div>
        <div className="info-row">
          <span className="info-label">📞 Điện thoại</span>
          <span className="info-value">{supplier.phone || "—"}</span>
        </div>
      </div>
    </div>

    {/* Card Actions */}
    <div className="supplier-card-actions">
      <Tooltip title="Xem chi tiết">
        <Button
          block
          icon={<EyeOutlined />}
          onClick={() => onView(supplier.id)}
          style={{
            height: 40,
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 13,
            border: "2px solid rgba(198, 113, 23, 0.12)",
            color: "#c67117",
            background: "rgba(198, 113, 23, 0.04)",
            transition: "all 0.3s ease",
          }}
        >
          Xem chi tiết
        </Button>
      </Tooltip>
      <Popconfirm
        title="Xóa nhà cung cấp"
        description="Bạn có chắc chắn muốn xóa nhà cung cấp này?"
        onConfirm={(e) => { e.stopPropagation(); onDelete(supplier.id); }}
        okText="Xóa"
        cancelText="Hủy"
      >
        <Button
          danger
          block
          icon={<DeleteOutlined />}
          className="delete-btn"
        >
          Xóa nhà cung cấp
        </Button>
      </Popconfirm>
    </div>
  </div>
);

export default SupplierCard;
