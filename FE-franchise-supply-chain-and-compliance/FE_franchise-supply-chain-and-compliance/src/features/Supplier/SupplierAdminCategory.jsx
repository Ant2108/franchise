import { useEffect, useState } from "react"
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Popconfirm,
  Tabs,
  Tag,
  Empty,
  Tooltip,
} from "antd"
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UndoOutlined,
  FolderOutlined,
} from "@ant-design/icons"

import "./SupplierAdminCategory.css";

const AdminCategory = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [activeTab, setActiveTab] = useState("active")

  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  })
  useEffect(() => {
    setPagination(prev => ({ ...prev, current: 1 }))
    fetchCategories()
  }, [activeTab])


  /* ================= LOAD DATA ================= */
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data =
        activeTab === "active"
          ? await getActiveCategories()
          : await getInactiveCategories()
      setCategories(data)
    } catch (err) {
      message.error("Không tải được danh mục")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [activeTab])

  /* ================= OPEN MODAL ================= */
  const handleOpenCreate = () => {
    setEditingCategory(null)
    form.resetFields()
    setOpenModal(true)
  }

  const handleOpenEdit = (record) => {
    setEditingCategory(record)
    form.setFieldsValue({
      categoryName: record.name,
    })
    setOpenModal(true)
  }

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      const values = await form.validateFields()

      if (editingCategory) {
        await updateCategory(editingCategory.id, values.categoryName)
        message.success("Cập nhật danh mục thành công")
      } else {
        await createCategory(values.categoryName) // path param
        message.success("Tạo danh mục thành công")
      }

      setOpenModal(false)
      fetchCategories()
    } catch (err) {
      if (err?.errorFields) return
      message.error("Lưu danh mục thất bại")
    }
  }

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await deleteCategory(id)
      message.success("Xóa danh mục thành công")
      fetchCategories()
    } catch (err) {
      message.error("Xóa danh mục thất bại")
    }
  }

  /* ================= RESTORE ================= */
  const handleRestore = async (id) => {
    try {
      await restoreCategory(id)
      message.success("Khôi phục danh mục thành công")
      fetchCategories()
    } catch (err) {
      message.error("Khôi phục thất bại")
    }
  }

  /* ================= TABLE ================= */
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
      render: (val) => (
        <span style={{
          fontFamily: "'SF Mono', Monaco, monospace",
          fontSize: 12,
          color: "#6b7280",
          fontWeight: 600,
        }}>
          #{val}
        </span>
      ),
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      render: (val) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "rgba(198, 113, 23, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <FolderOutlined style={{ color: "#c67117", fontSize: 14 }} />
          </div>
          <span style={{ fontWeight: 600, color: "#1a1a2e", fontSize: 14 }}>
            {val}
          </span>
        </div>
      ),
    },
    {
      title: "Hành động",
      width: 240,
      render: (_, record) => (
        <Space size={8}>
          {activeTab === "active" ? (
            <>
              <Tooltip title="Chỉnh sửa">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => handleOpenEdit(record)}
                  style={{ borderRadius: 10 }}
                >
                  Sửa
                </Button>
              </Tooltip>
              <Popconfirm
                title="Bạn chắc chắn muốn xóa?"
                description="Danh mục sẽ được chuyển vào mục đã xóa"
                onConfirm={() => handleDelete(record.id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Tooltip title="Xóa danh mục">
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    style={{ borderRadius: 10 }}
                  >
                    Xóa
                  </Button>
                </Tooltip>
              </Popconfirm>
            </>
          ) : (
            <Tooltip title="Khôi phục danh mục">
              <Button
                icon={<UndoOutlined />}
                onClick={() => handleRestore(record.id)}
                style={{
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #10b981, #34d399)",
                  border: "none",
                  color: "white",
                  fontWeight: 600,
                }}
              >
                Khôi phục
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="admin-category">
      <h2>Quản lý danh mục</h2>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24, marginTop: -4, fontWeight: 500 }}>
        Tạo và quản lý các danh mục nguyên liệu
      </p>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "active",
            label: (
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                Đang hoạt động
                <Tag color="success" style={{ marginLeft: 4, borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                  {activeTab === "active" ? categories.length : ""}
                </Tag>
              </span>
            ),
          },
          {
            key: "inactive",
            label: (
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                Đã xóa
                <Tag color="default" style={{ marginLeft: 4, borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                  {activeTab === "inactive" ? categories.length : ""}
                </Tag>
              </span>
            ),
          },
        ]}
      />

      {activeTab === "active" && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ marginBottom: 20 }}
          onClick={handleOpenCreate}
        >
          Thêm danh mục
        </Button>
      )}

      <Table
        rowKey="id"
        columns={columns}
        dataSource={categories}
        loading={loading}
        locale={{
          emptyText: (
            <Empty
              description={activeTab === "active" ? "Chưa có danh mục nào" : "Không có danh mục đã xóa"}
              style={{ padding: "40px 0" }}
            />
          ),
        }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: categories.length,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50],
          showTotal: (total) => (
            <span style={{ fontWeight: 600, color: "#6b7280", fontSize: 13 }}>
              Tổng {total} danh mục
            </span>
          ),
          onChange: (page, pageSize) => {
            setPagination({
              current: page,
              pageSize: pageSize,
            })
          },
        }}
      />


      {/* ================= MODAL ================= */}
      <Modal
        open={openModal}
        title={editingCategory ? "Cập nhật danh mục" : "Thêm danh mục mới"}
        onCancel={() => setOpenModal(false)}
        onOk={handleSave}
        okText="Lưu"
        cancelText="Hủy"
        width={480}
      >
        <div style={{ padding: "8px 0" }}>
          <Form form={form} layout="vertical">
            <Form.Item
              name="categoryName"
              label="Tên danh mục"
              rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
            >
              <Input placeholder="Nhập tên danh mục" />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  )
}

export default AdminCategory
