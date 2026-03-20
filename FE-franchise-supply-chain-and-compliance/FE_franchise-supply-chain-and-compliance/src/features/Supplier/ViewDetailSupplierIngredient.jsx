import { useEffect, useRef, useState } from "react";
import {
  Table,
  Tag,
  Spin,
  Button,
  message,
  Modal,
  Form,
  Select,
  InputNumber,
  Input,
  Space,
  Popconfirm,
  Dropdown,
  Menu,
  Tooltip,
  Avatar,
  Divider,
  Empty,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftOutlined,
  SettingOutlined,
  PlusOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  StarOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  UserOutlined,
  BoxPlotOutlined,
} from "@ant-design/icons";
import "./ViewDetailSupplierIngredient.css";
import { useViewDetailSupplierIngredient } from "./hooks/useViewDetailSupplierIngredient";

const { TextArea } = Input;

const ViewDetailSupplierIngredient = () => {
  const navigate = useNavigate();

  const {
    id,
    supplier,
    ingredients,
    loading,
    addForm,
    createIngredientForm,
    ingredientOptions,
    loadingIngredientOptions,
    openAddModal,
    openCreateIngredientModal,
    submittingAdd,
    submittingCreateIngredient,
    handleOpenAddModal,
    handleCloseAddModal,
    handleOpenCreateIngredientModal,
    handleCloseCreateIngredientModal,
    handleAddIngredient,
    handleCreateIngredient,
  } = useViewDetailSupplierIngredient();

  const columns = [
    {
      title: "Hình ảnh",
      width: 80,
      render: (_, record) => {
        const img =
          record?.ingredient?.imageUrl ||
          record?.ingredient?.image ||
          record?.imageUrl ||
          record?.image;

        return (
          <Avatar
            src={img}
            shape="square"
            size={50}
            style={{ borderRadius: 12, border: "1px solid rgba(198,113,23,0.1)" }}
          />
        );
      },
    },
    {
      title: "Tên nguyên liệu",
      render: (_, record) => (
        <span style={{ fontWeight: 700, color: "#1a1a2e", fontSize: 14 }}>
          {record?.ingredient?.ingredientName ||
            record?.ingredient?.name ||
            record?.ingredientName ||
            "—"}
        </span>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      render: (val) => (
        <span style={{ fontWeight: 800, color: "#c67117" }}>
          {val != null ? `${Number(val).toLocaleString("vi-VN")} ₫` : "—"}
        </span>
      ),
    },
    {
      title: "MOQ",
      dataIndex: "minimumOrderQuantity",
      render: (val) => (
        <span style={{ fontWeight: 600 }}>
          {val != null ? val : "—"}
        </span>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "stockQuantity",
      render: (val) => (
        <Tag
          color={val > 0 ? "success" : "error"}
          style={{ borderRadius: 20, fontWeight: 700, fontSize: 12, padding: "2px 12px" }}
        >
          {val != null ? val : "—"}
        </Tag>
      ),
    },
    {
      title: "Lead Time",
      dataIndex: "leadTimeDays",
      render: (val) => (
        <span style={{ fontWeight: 500, color: "#6b7280" }}>
          {val != null ? `${val} ngày` : "—"}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag
          color={status === "ACTIVE" ? "success" : "default"}
          style={{
            borderRadius: 20,
            fontWeight: 700,
            fontSize: 11,
            padding: "3px 12px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {status === "ACTIVE" ? "● Active" : "○ Inactive"}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="detail-container">
        {/* Header */}
        <div className="detail-header">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/supplier")}
            className="detail-back-btn"
          >
            Quay lại danh sách
          </Button>

          <div className="detail-title-section">
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <Avatar
                src={supplier?.imageUrl || supplier?.image}
                size={68}
                shape="square"
                icon={<UserOutlined />}
                style={{
                  border: "2px solid rgba(198,113,23,0.12)",
                  borderRadius: 16,
                  boxShadow: "0 4px 12px rgba(198,113,23,0.08)",
                }}
              />
              <div>
                <h1 className="detail-title">{supplier?.name || "—"}</h1>
                <p className="detail-subtitle">
                  Quản lý thông tin nhà cung cấp và danh sách nguyên liệu
                </p>
              </div>
            </div>
            <Tooltip title="Chỉnh sửa supplier" placement="left">
              <Button
                shape="circle"
                icon={<SettingOutlined />}
                className="supplier-setting-btn"
                onClick={() => navigate(`/admin/supplier/${id}/edit`)}
              />
            </Tooltip>
          </div>
        </div>

        {/* Supplier Info Grid */}
        <div className="info-grid">
          {/* Contact Name Card */}
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon primary">
                <UserOutlined />
              </div>
              <span className="info-card-label">Người liên hệ</span>
            </div>
            <p className="info-card-value">{supplier?.contactName || "—"}</p>
          </div>

          {/* Email Card */}
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon primary">
                <MailOutlined />
              </div>
              <span className="info-card-label">Email</span>
            </div>
            <p className="info-card-value" style={{ color: "#c67117" }}>
              {supplier?.email || "—"}
            </p>
          </div>

          {/* Phone Card */}
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon accent">
                <PhoneOutlined />
              </div>
              <span className="info-card-label">Số điện thoại</span>
            </div>
            <p className="info-card-value">{supplier?.phone || "—"}</p>
          </div>

          {/* Ingredients Count Card */}
          <div className="info-card info-card-gradient">
            <div className="info-card-header">
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                <BoxPlotOutlined />
              </div>
              <span className="info-card-label">Tổng Nguyên Liệu</span>
            </div>
            <p className="info-card-value-large">{ingredients.length}</p>
          </div>
        </div>

        {/* Ingredients Table Section */}
        <div className="table-section">
          <div className="table-header">
            <div>
              <h2 className="table-title">Danh sách nguyên liệu</h2>
              <p style={{ color: "#9ca3af", margin: "4px 0 0", fontSize: 13, fontWeight: 500 }}>
                Quản lý các nguyên liệu của nhà cung cấp
              </p>
            </div>
            <div className="ingredient-actions">
              <Button
                icon={<PlusOutlined />}
                className="table-btn btn-add"
                onClick={() => navigate(`/admin/supplier/${id}/add-ingredient`)}
              >
                Thêm nguyên liệu
              </Button>
            </div>
          </div>
          <div className="table-wrapper">
            <Table
              rowKey="id"
              columns={columns}
              dataSource={ingredients}
              pagination={{
                pageSize: 10,
                showTotal: (total) => (
                  <span style={{ fontWeight: 600, color: "#6b7280", fontSize: 13 }}>
                    Tổng {total} nguyên liệu
                  </span>
                ),
              }}
              className="premium-table"
              locale={{
                emptyText: (
                  <Empty
                    description={
                      <span style={{ fontWeight: 600, color: "#6b7280" }}>
                        Chưa có nguyên liệu nào
                      </span>
                    }
                    style={{ padding: "40px 0" }}
                  />
                ),
              }}
            />
          </div>
        </div>
      </div>

      {/* Add Ingredient Modal */}
      <Modal
        title="Thêm nguyên liệu cho supplier"
        open={openAddModal}
        onCancel={submittingAdd ? undefined : handleCloseAddModal}
        onOk={handleAddIngredient}
        okText="Thêm"
        cancelText="Hủy"
        confirmLoading={submittingAdd}
        maskClosable={!submittingAdd}
        keyboard={!submittingAdd}
        okButtonProps={{
          disabled: submittingAdd || ingredientOptions.length === 0,
        }}
        cancelButtonProps={{ disabled: submittingAdd }}
        width={520}
      >
        <Divider style={{ margin: "0 0 20px", borderColor: "rgba(198,113,23,0.08)" }} />
        <Form form={addForm} layout="vertical">
          <Form.Item
            label="Nguyên liệu"
            name="ingredientId"
            rules={[{ required: true, message: "Vui lòng chọn nguyên liệu" }]}
          >
            <Select
              showSearch
              placeholder={
                ingredientOptions.length === 0
                  ? "Không còn nguyên liệu để thêm"
                  : "Chọn nguyên liệu"
              }
              options={ingredientOptions}
              loading={loadingIngredientOptions}
              optionFilterProp="label"
            />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Form.Item
              label="Đơn giá"
              name="unitPrice"
              rules={[{ required: true, message: "Vui lòng nhập đơn giá" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} placeholder="Nhập đơn giá" />
            </Form.Item>

            <Form.Item
              label="MOQ"
              name="minimumOrderQuantity"
              rules={[{ required: true, message: "Vui lòng nhập MOQ" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} placeholder="Nhập MOQ" />
            </Form.Item>

            <Form.Item
              label="Tồn kho"
              name="stockQuantity"
              rules={[{ required: true, message: "Vui lòng nhập tồn kho" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} placeholder="Nhập tồn kho" />
            </Form.Item>

            <Form.Item
              label="Lead Time (ngày)"
              name="leadTimeDays"
              rules={[{ required: true, message: "Vui lòng nhập lead time" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} placeholder="Nhập lead time" />
            </Form.Item>
          </div>

          <Form.Item
            label="Trạng thái"
            name="status"
            initialValue="ACTIVE"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select
              options={[
                { label: "ACTIVE", value: "ACTIVE" },
                { label: "INACTIVE", value: "INACTIVE" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Ingredient Modal */}
      <Modal
        title="Tạo nguyên liệu mới"
        open={openCreateIngredientModal}
        onCancel={submittingCreateIngredient ? undefined : handleCloseCreateIngredientModal}
        onOk={handleCreateIngredient}
        okText="Tạo"
        cancelText="Hủy"
        confirmLoading={submittingCreateIngredient}
        maskClosable={!submittingCreateIngredient}
        keyboard={!submittingCreateIngredient}
        okButtonProps={{ disabled: submittingCreateIngredient }}
        cancelButtonProps={{ disabled: submittingCreateIngredient }}
        width={520}
      >
        <Divider style={{ margin: "0 0 20px", borderColor: "rgba(198,113,23,0.08)" }} />
        <Form form={createIngredientForm} layout="vertical">
          <Form.Item
            label="Tên nguyên liệu"
            name="ingredientName"
            rules={[{ required: true, message: "Vui lòng nhập tên nguyên liệu" }]}
          >
            <Input placeholder="Ví dụ: Sữa tươi" />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Form.Item
              label="Đơn vị"
              name="unit"
              rules={[{ required: true, message: "Vui lòng nhập đơn vị" }]}
            >
              <Input placeholder="Ví dụ: kg, lít, gói" />
            </Form.Item>

            <Form.Item
              label="Ngưỡng cảnh báo"
              name="alertThreshold"
              rules={[{ required: true, message: "Vui lòng nhập ngưỡng cảnh báo" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="Nhập alert threshold"
              />
            </Form.Item>
          </div>

          <Form.Item label="Mô tả" name="description">
            <TextArea rows={4} placeholder="Nhập mô tả nguyên liệu" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ViewDetailSupplierIngredient;
