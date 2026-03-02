import { useEffect, useState } from "react";
import { Table, Button, Tag, Space, Select, Input, message } from "antd";
import { EyeOutlined, PlusOutlined } from "@ant-design/icons";
import outboundApi from "../Outbound/OutboundAPI/outboundApi";
import OutboundDetail from "../Outbound/OutboundDetail";
import CreateOutboundModal from "../Outbound/CreateOutboundModal";

const { Option } = Select;
const { Search } = Input;

function WareHouseShipments() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [detailOrderId, setDetailOrderId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus && filterStatus !== "ALL") {
        params.status = filterStatus;
      }
      const data = await outboundApi.getOrders(params);
      setOrders(data);
    } catch (error) {
      message.error("Không tải được danh sách đơn xuất kho: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const getStatusTag = (status) => {
    switch (status) {
      case "PENDING":
        return <Tag color="orange">Chờ xử lý</Tag>;
      case "APPROVED":
        return <Tag color="blue">Đã duyệt</Tag>;
      case "SHIPPING":
        return <Tag color="cyan">Đang giao hàng</Tag>;
      case "DELIVERED":
        return <Tag color="green">Đã giao</Tag>;
      case "CANCELLED":
        return <Tag color="red">Đã hủy</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    { title: "Mã đơn", dataIndex: "id", key: "id", width: 280 },
    {
      title: "Cửa hàng nhận",
      key: "franchiseStore",
      render: (_, record) => record.destinationFranchiseName || "N/A",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Ngày xuất",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleString() : ""),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => setDetailOrderId(record.id)}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 className="warehouse-title" style={{ margin: 0 }}>Xuất Kho</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsCreateModalOpen(true)}
          size="large"
        >
          Tạo đơn xuất
        </Button>
      </div>

      <div style={{ background: "#fff", padding: 24, borderRadius: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <Space>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 170 }}
            >
              <Option value="ALL">Tất cả trạng thái</Option>
              <Option value="PENDING">Chờ xử lý</Option>
              <Option value="APPROVED">Đã duyệt</Option>
              <Option value="SHIPPING">Đang giao hàng</Option>
              <Option value="DELIVERED">Đã giao</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>
            <Search placeholder="Tìm theo mã đơn..." style={{ width: 250 }} />
          </Space>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={orders}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {detailOrderId && (
        <OutboundDetail
          orderId={detailOrderId}
          open={!!detailOrderId}
          onClose={() => setDetailOrderId(null)}
          onStatusUpdated={() => fetchOrders()}
        />
      )}

      <CreateOutboundModal 
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchOrders()}
      />
    </>
  );
}

export default WareHouseShipments;