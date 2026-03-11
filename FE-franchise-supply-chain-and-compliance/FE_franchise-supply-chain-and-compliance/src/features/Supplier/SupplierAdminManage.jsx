import { useEffect, useState } from "react";
import {Table,Input,Button,Modal,Tag,Spin,message,Form,Select,Space,Popconfirm,} from "antd";
import {getSuppliers,getSupplierDetail,createSupplier,updateSupplier,deleteSupplier,} from "./SupplierAPI/supplierApi";
import "./SupplierAdminManage.css";

export default function SupplierAdminManage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editingSupplier, setEditingSupplier] = useState(null);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  /* ================= FETCH ================= */

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await getSuppliers(keyword);
      setSuppliers(data || []);
    } catch {
      message.error("Không tải được supplier");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(fetchSuppliers, 400);
    return () => clearTimeout(timeout);
  }, [keyword]);

  /* ================= CREATE ================= */

const handleOpenCreate = () => {
  createForm.resetFields();
  setIsCreateOpen(true);
};

const handleCreate = async (values) => {
  try {
    await createSupplier(values);

    message.success("Tạo supplier thành công");

    setIsCreateOpen(false);
    fetchSuppliers();

  } catch (error) {

    console.error(error);

    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Tạo supplier thất bại";

    message.error(msg);
  }
};

  /* ================= EDIT ================= */

  const handleOpenEdit = (record) => {
    setEditingSupplier(record);
    editForm.setFieldsValue({
      name: record.name,
      email: record.email,
      phone: record.phone,
      status: record.status,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (values) => {
    try {
      await updateSupplier(editingSupplier.id, values);
      message.success("Cập nhật thành công");
      setIsEditOpen(false);
      setEditingSupplier(null);
      fetchSuppliers();
    } catch (error) {
      console.error(error);
      message.error("Cập nhật thất bại");
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    try {
      await deleteSupplier(id);
      message.success("Xóa thành công");
      fetchSuppliers();
    } catch {
      message.error("Xóa thất bại");
    }
  };

  /* ================= DETAIL ================= */

  const handleViewDetail = async (record) => {
    try {
      setIsDetailOpen(true);
      setLoadingDetail(true);
      const data = await getSupplierDetail(record.id);
      setDetail(data);
    } catch {
      message.error("Không tải được chi tiết");
    } finally {
      setLoadingDetail(false);
    }
  };

  /* ================= TABLE ================= */

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 100,
      render: (id) => id?.slice(0, 8),
    },
    {
      title: "Supplier",
      dataIndex: "name",
    },
    {
      title: "Nguyên liệu",
      dataIndex: "categoriesSupplied",
      render: (val) =>
        val && val.length > 0 ? val.join(", ") : "—",
    },
    {
      title: "Rating",
      dataIndex: "avgRating",
      render: (val) => <span>⭐ {val || 0}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : "default"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => handleViewDetail(record)}>
            Xem
          </Button>

          <Button
            size="small"
            type="primary"
            onClick={() => handleOpenEdit(record)}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /* ================= RENDER ================= */

  return (
    <div className="supplier-page">
      <div className="header-row">
        <div>
          <h2>Supplier Management</h2>
          <p>Quản lý supplier và đánh giá</p>
        </div>

        <Button type="primary" onClick={handleOpenCreate}>
          + Thêm Supplier
        </Button>
      </div>

      <Input
        placeholder="Tìm theo tên supplier..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="search-input"
      />

      <Table
        rowKey="id"
        columns={columns}
        dataSource={suppliers}
        loading={loading}
      />

      {/* ================= DETAIL MODAL ================= */}
      <Modal
        open={isDetailOpen}
        onCancel={() => setIsDetailOpen(false)}
        footer={null}
        title="Chi Tiết Supplier"
      >
        {loadingDetail ? (
          <Spin />
        ) : (
          detail && (
            <>
              <p><b>Name:</b> {detail.name}</p>
              <p><b>Email:</b> {detail.email}</p>
              <p><b>Phone:</b> {detail.phone}</p>
              <p><b>Status:</b> {detail.status}</p>
            </>
          )
        )}
      </Modal>

      {/* ================= CREATE MODAL ================= */}
      <Modal
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        footer={null}
        title="Thêm Supplier"
        destroyOnClose
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{ status: "ACTIVE" }}
        >
          <Form.Item
            name="name"
            label="Tên Supplier"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="ACTIVE">ACTIVE</Select.Option>
              <Select.Option value="INACTIVE">INACTIVE</Select.Option>
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Lưu
          </Button>
        </Form>
      </Modal>

      {/* ================= EDIT MODAL ================= */}
      <Modal
        open={isEditOpen}
        onCancel={() => setIsEditOpen(false)}
        footer={null}
        title="Sửa Supplier"
        destroyOnClose
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            name="name"
            label="Tên Supplier"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="ACTIVE">ACTIVE</Select.Option>
              <Select.Option value="INACTIVE">INACTIVE</Select.Option>
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Cập nhật
          </Button>
        </Form>
      </Modal>
    </div>
  );
}