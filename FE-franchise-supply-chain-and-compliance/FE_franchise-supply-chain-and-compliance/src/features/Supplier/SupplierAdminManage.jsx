import React from "react";
import { Input, Button, Spin, Empty, Pagination, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, SearchOutlined, ShopOutlined } from "@ant-design/icons";
import "./SupplierAdminManage.css";

// Hooks and Components
import { useSupplierSearch } from "./hooks/useSupplierSearch";
import SupplierCard from "./components/SupplierCard";

export default function SupplierAdminManage() {
  const navigate = useNavigate();

  const {
    suppliers,
    loading,
    keyword,
    setKeyword,
    currentPage,
    setCurrentPage,
    paginatedSuppliers,
    totalPages,
    handleDelete,
    itemsPerPage,
    totalCount
  } = useSupplierSearch();

  const handleViewDetail = (id) => navigate(`/admin/supplier/${id}/view`);

  return (
    <div className="supplier-page-grid">
      {/* Header Section */}
      <div className="supplier-header">
        <div className="supplier-header-content">
          <div>
            <h1 className="supplier-title">Quản lý Nhà cung cấp</h1>
            <p className="supplier-subtitle">
              Quản lý danh sách và thông tin các nhà cung cấp
              {!loading && totalCount > 0 && (
                <Badge
                  count={totalCount}
                  style={{
                    backgroundColor: "rgba(198, 113, 23, 0.1)",
                    color: "#c67117",
                    fontWeight: 700,
                    fontSize: 12,
                    marginLeft: 10,
                    boxShadow: "none",
                  }}
                />
              )}
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/supplier/create")}
            className="btn-add-supplier"
          >
            Thêm Supplier
          </Button>
        </div>

        {/* Search Section */}
        <div className="supplier-search-section">
          <Input
            prefix={<SearchOutlined style={{ color: "#c67117", fontSize: 16 }} />}
            placeholder="Tìm kiếm nhà cung cấp theo tên, email, SĐT..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="supplier-search-input"
            size="large"
            allowClear
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="supplier-loading">
          <Spin size="large" tip="Đang tải danh sách..." />
        </div>
      )}

      {/* Empty State */}
      {!loading && totalCount === 0 && (
        <div className="supplier-empty">
          <Empty
            image={<ShopOutlined style={{ fontSize: 64, color: "#e8c595" }} />}
            description={
              <div>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
                  {keyword ? "Không tìm thấy kết quả" : "Chưa có nhà cung cấp"}
                </p>
                <p style={{ fontSize: 13, color: "#9ca3af" }}>
                  {keyword
                    ? `Không tìm thấy nhà cung cấp phù hợp với "${keyword}"`
                    : "Bắt đầu bằng cách thêm nhà cung cấp đầu tiên"}
                </p>
              </div>
            }
          >
            {!keyword && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/admin/supplier/create")}
                className="btn-add-supplier"
              >
                Thêm Supplier đầu tiên
              </Button>
            )}
          </Empty>
        </div>
      )}

      {/* Supplier Cards Grid */}
      {!loading && totalCount > 0 && (
        <>
          <div className="supplier-grid-container">
            {paginatedSuppliers.map((supplier) => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                onView={handleViewDetail}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination Section */}
          {totalPages > 1 && (
            <div className="supplier-pagination-section">
              <Pagination
                current={currentPage}
                total={totalCount}
                pageSize={itemsPerPage}
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
