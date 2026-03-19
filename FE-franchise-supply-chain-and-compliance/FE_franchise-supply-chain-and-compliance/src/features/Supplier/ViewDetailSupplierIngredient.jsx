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
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined, SettingOutlined, PlusOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, StarOutlined, DeleteOutlined, EditOutlined, EyeOutlined, UserOutlined} from "@ant-design/icons";
import "./ViewDetailSupplierIngredient.css";
import { Box } from "lucide-react";
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
  const actionMenu = (
    <Menu
      items={[
        {
          key: "edit",
          icon: <EditOutlined />,
          label: "Chỉnh sửa supplier",
          onClick: () => navigate(`/admin/supplier/${id}/edit`),
        },
      ]}
    />
  );

  const columns = [
    {
      title: "Hình ảnh",
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
            style={{ borderRadius: 8 }}
          />
        );
      },
    },
    {
      title: "Tên nguyên liệu",
      render: (_, record) =>
        record?.ingredient?.ingredientName ||
        record?.ingredient?.name ||
        record?.ingredientName ||
        "—",
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      render: (val) => (val != null ? `${val}` : "—"),
    },
    {
      title: "Số lượng đặt hàng tối thiểu",
      dataIndex: "minimumOrderQuantity",
      render: (val) => (val != null ? val : "—"),
    },
    {
      title: "Tồn kho",
      dataIndex: "stockQuantity",
      render: (val) => (val != null ? val : "—"),
    },
    {
      title: "Lead Time (ngày)",
      dataIndex: "leadTimeDays",
      render: (val) => (val != null ? val : "—"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : "default"}>
          {status || "—"}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
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
            Quay lại
          </Button>

          <div className="detail-title-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Avatar 
                src={supplier?.imageUrl || supplier?.image} 
                size={64} 
                shape="square" 
                icon={<UserOutlined />} 
                style={{ border: '1px solid #d9d9d9', borderRadius: '8px' }}
              />
              <div>
                <h1 className="detail-title">{supplier?.name || "—"}</h1>
                <p className="detail-subtitle">Quản lý thông tin nhà cung cấp và danh sách nguyên liệu</p>
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
            <span className="info-card-label" style={{ display: "block", marginBottom: "12px" }}>Người liên hệ</span>
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
            <p className="info-card-value">{supplier?.email || "—"}</p>
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

          {/* Address Card */}
          <div className="info-card">
            <div className="info-card-header">
              <div className="info-card-icon secondary">
                <Box />
              </div>
              <span className="info-card-label">Tổng Nguyên Liệu Trong Kho</span>
            </div>
            <p className="info-card-value">{ingredients.length}</p>
          </div>
        </div>

        {/* Ingredients Table Section */}
        <div className="table-section">
          <div className="table-header">
            <h2 className="table-title">Danh sách nguyên liệu</h2>
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
              pagination={{ pageSize: 10 }}
              className="premium-table"
            />
          </div>
        </div>
      </div>

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
      >
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
      >
        <Form form={createIngredientForm} layout="vertical">
          <Form.Item
            label="Tên nguyên liệu"
            name="ingredientName"
            rules={[{ required: true, message: "Vui lòng nhập tên nguyên liệu" }]}
          >
            <Input placeholder="Ví dụ: Sữa tươi" />
          </Form.Item>

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

          <Form.Item label="Mô tả" name="description">
            <TextArea rows={4} placeholder="Nhập mô tả nguyên liệu" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ViewDetailSupplierIngredient;
