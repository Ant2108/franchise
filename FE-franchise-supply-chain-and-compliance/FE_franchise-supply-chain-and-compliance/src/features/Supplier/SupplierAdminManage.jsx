import React from "react";
import { Input, Button, Spin, Empty, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import "./SupplierAdminManage.css";

// Hooks and Components
import { useSupplierSearch } from "./hooks/useSupplierSearch";
import SupplierCard from "./components/SupplierCard";

export default function SupplierAdminManage() {
  const navigate = useNavigate();

  // Use modular hook
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
      {!loading && totalCount === 0 && (
        <div className="supplier-empty">
          <Empty description="Không có nhà cung cấp" style={{ marginTop: 48 }} />
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

