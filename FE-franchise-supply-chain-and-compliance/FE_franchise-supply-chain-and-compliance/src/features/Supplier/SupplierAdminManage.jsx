import { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Tag,
  Spin,
  message,
  Space,
  Popconfirm,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  getSuppliers,
  
  deleteSupplier,
} from "./SupplierAPI/supplierApi";
import "./SupplierAdminManage.css";

export default function SupplierAdminManage() {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

 
  

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await getSuppliers(keyword);
      setSuppliers(data || []);
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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 100,
      render: (id) => (typeof id === "string" ? id.slice(0, 8) : id),
    },
    {
      title: "Supplier",
      dataIndex: "name",
    },
    {
      title: "Người liên hệ",
      dataIndex: "contactName",
      render: (val) => val || "—",
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (val) => val || "—",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      render: (val) => val || "—",
    },
    {
      title: "Nguyên liệu",
      dataIndex: "categoriesSupplied",
      render: (val) => (val && val.length > 0 ? val.join(", ") : "—"),
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
          <Button size="small" onClick={() => navigate(`/admin/supplier/${record.id}/view`)}>
            Xem
          </Button>

          <Button
            size="small"
            type="primary"
            onClick={() => navigate(`/admin/supplier/${record.id}/edit`)}
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

  return (
    <div className="supplier-page">
      <div className="header-row">
        <div>
          <h2>Supplier Management</h2>
          <p>Quản lý supplier và đánh giá</p>
        </div>

        <Button
          type="primary"
          onClick={() => navigate("/admin/supplier/create")}
        >
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

      
    </div>
  );
}