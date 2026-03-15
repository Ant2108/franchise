import { useEffect, useState } from "react";
import {
  Input,
  Button,
  Tag,
  Spin,
  message,
  Popconfirm,
  Empty,
  Pagination,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  getSuppliers,
  deleteSupplier,
} from "./SupplierAPI/supplierApi";
import { StarOutlined, DeleteOutlined, PictureOutlined } from "@ant-design/icons";
const ITEMS_PER_PAGE = 8;

import "./SupplierAdminManage.css";

export default function SupplierAdminManage() {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);



  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await getSuppliers(keyword);
      setSuppliers(data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Supplier page error:", {
        url: error?.response?.config?.url,
        status: error?.response?.status,
        data: error?.response?.data,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchSuppliers();
    }, 400);

    return () => clearTimeout(timeout);
  }, [keyword]);

  // Pagination logic
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSuppliers = suppliers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(suppliers.length / ITEMS_PER_PAGE);

  const handleDelete = async (id) => {
    try {
      await deleteSupplier(id);
      message.success("Xóa thành công");
      await fetchSuppliers();
    } catch (error) {
      console.error(error);
      message.error("Xóa thất bại");
    }
  };

  return (
    <div className="supplier-page-grid">
      {/* Header Section */}
      <div className="supplier-header">
        <div className="supplier-header-content">
          <div>
            <h1 className="supplier-title">Quản lý Nhà cung cấp</h1>
            <p className="supplier-subtitle">Danh sách và quản lý các nhà cung cấp</p>
          </div>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/admin/supplier/create")}
            className="btn-add-supplier"
          >
            + Thêm Supplier
          </Button>
        </div>

        {/* Search Section */}
        <div className="supplier-search-section">
          <Input
            placeholder="🔍 Tìm kiếm nhà cung cấp..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="supplier-search-input"
            size="large"
            prefix={null}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="supplier-loading">
          <Spin size="large" />
        </div>
      )}

      {/* Empty State */}
      {!loading && suppliers.length === 0 && (
        <div className="supplier-empty">
          <Empty
            description="Không có nhà cung cấp"
            style={{ marginTop: 48 }}
          />
        </div>
      )}

      {/* Supplier Cards Grid */}
      {!loading && suppliers.length > 0 && (
        <>
          <div className="supplier-grid-container">
            {paginatedSuppliers.map((supplier, index) => (
              <div key={supplier.id} className="supplier-card" >
                {/* Card Image Section */}
                <div
                  className="supplier-card-image"
                  onClick={() => navigate(`/admin/supplier/${supplier.id}/view`)}
                  style={{ cursor: "pointer" }}
                >
                  {supplier.imageUrl || supplier.image ? (
                    <img 
                      src={supplier.imageUrl || supplier.image} 
                      alt={supplier.name} 
                      className="supplier-image" 
                    />
                  ) : (
                    <div className="supplier-image-placeholder">
                      <PictureOutlined />
                    </div>
                  )}
                </div>

                {/* Card Header with Status */}
                <div className="supplier-card-header" onClick={() => navigate(`/admin/supplier/${supplier.id}/view`) }>
                  <div className="supplier-status-badge">
                    <Tag
                      color={supplier.status === "ACTIVE" ? "success" : "default"}
                      className="supplier-status-tag"
                    >
                      {supplier.status}
                    </Tag>
                  </div>
                  <div className="supplier-rating-badge">
                    <StarOutlined className="star-icon" />
                    <span className="rating-text">
                      {(supplier.avgRating || 0).toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="supplier-card-body">
                  <h3
                    className="supplier-name"
                    title={supplier.name}
                    style={{ cursor: "pointer" }}
                  >
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
                  <Popconfirm>
                    <Button
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      className="delete-btn"
                      onClick={(e) => { e.stopPropagation(); handleDelete(supplier.id) }} 
                    >
                      Xóa
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Section */}
          {totalPages > 1 && (
            <div className="supplier-pagination-section">
              <Pagination
                current={currentPage}
                total={suppliers.length}
                pageSize={ITEMS_PER_PAGE}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                showQuickJumper
                align="center"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
