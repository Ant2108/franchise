import { useEffect, useState } from "react";
import { Table, Button, Tag, Space, Select, Input, DatePicker, message } from "antd";
import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import inboundApi from "./InboundAPI/inboundApi";
import InboundCreate from "./InboundCreate";
import InboundDetail from "./InboundDetail";

const { Option } = Select;
const { Search } = Input;

const InboundList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [detailOrderId, setDetailOrderId] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filterStatus && filterStatus !== "ALL") {
                params.status = filterStatus;
            }
            const data = await inboundApi.getOrders(params);
            setOrders(data);
        } catch (error) {
            message.error("Không tải được danh sách đơn nhập hàng: " + error.message);
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
            case "DELIVERING":
                return <Tag color="cyan">Đang giao</Tag>;
            case "COMPLETED":
                return <Tag color="green">Hoàn tất</Tag>;
            case "CANCELLED":
                return <Tag color="red">Đã hủy</Tag>;
            default:
                return <Tag>{status}</Tag>;
        }
    };

    const columns = [
        { title: "Mã đơn", dataIndex: "id", key: "id" },
        {
            title: "Kho nhận",
            key: "warehouse",
            render: (_, record) => record.warehouseName || "N/A",
        },
        {
            title: "Nhà cung cấp",
            key: "supplier",
            render: (_, record) => record.supplierName || "N/A",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => getStatusTag(status),
        },
        {
            title: "Ngày dự kiến",
            dataIndex: "expectedDate",
            key: "expectedDate",
            render: (date) => (date ? new Date(date).toLocaleDateString() : ""),
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
        <div style={{ padding: 24, background: "#fff", borderRadius: 8, minHeight: "calc(100vh - 40px)" }}>
            <h2>Quản lý Nhập hàng (Inbound)</h2>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <Space>
                    <Select
                        value={filterStatus}
                        onChange={setFilterStatus}
                        style={{ width: 150 }}
                    >
                        <Option value="ALL">Tất cả trạng thái</Option>
                        <Option value="PENDING">Chờ xử lý</Option>
                        <Option value="APPROVED">Đã duyệt</Option>
                        <Option value="DELIVERING">Đang giao</Option>
                        <Option value="COMPLETED">Hoàn tất</Option>
                        <Option value="CANCELLED">Đã hủy</Option>
                    </Select>
                    <Search placeholder="Tìm theo mã đơn..." style={{ width: 250 }} />
                </Space>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Tạo đơn nhập
                </Button>
            </div>

            <Table
                rowKey="id"
                columns={columns}
                dataSource={orders}
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <InboundCreate
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    setIsCreateModalOpen(false);
                    fetchOrders();
                }}
            />

            {detailOrderId && (
                <InboundDetail
                    orderId={detailOrderId}
                    open={!!detailOrderId}
                    onClose={() => setDetailOrderId(null)}
                    onStatusUpdated={() => {
                        fetchOrders();
                    }}
                />
            )}
        </div>
    );
};

export default InboundList;
