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
} from "antd"


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
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
    },
    {
      title: "Hành động",
      width: 220,
      render: (_, record) => (
        <Space>
          {activeTab === "active" ? (
            <>
              <Button type="primary" onClick={() => handleOpenEdit(record)}>
                Sửa
              </Button>
              <Popconfirm
                title="Bạn chắc chắn muốn xóa?"
                onConfirm={() => handleDelete(record.id)}
              >
                <Button danger>Xóa</Button>
              </Popconfirm>
            </>
          ) : (
            <Button onClick={() => handleRestore(record.id)}>Khôi phục</Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="admin-category">
      <h2>Quản lý danh mục</h2>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: "active", label: "Đang hoạt động" },
          { key: "inactive", label: "Đã xóa" },
        ]}
      />

      {activeTab === "active" && (
        <Button
          type="primary"
          style={{ marginBottom: 16 }}
          onClick={handleOpenCreate}
        >
          + Thêm danh mục
        </Button>
      )}

      <Table
        rowKey="id"
        columns={columns}
        dataSource={categories}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: categories.length,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50],
          showTotal: (total) => `Tổng ${total} danh mục`,
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
        title={editingCategory ? "Cập nhật danh mục" : "Thêm danh mục"}
        onCancel={() => setOpenModal(false)}
        onOk={handleSave}
        okText="Lưu"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="categoryName"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AdminCategory
