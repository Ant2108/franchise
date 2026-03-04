import { useEffect, useState } from "react";
import { Table, Button, Tag, Space, Select, Input, message } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import inboundApi from "./InboundAPI/inboundApi";
import InboundDetail from "./InboundDetail";
import { INBOUND_FILTER_STATUS_OPTIONS, getInboundStatusMeta } from "../../utils/orderStatus";

const { Option } = Select;
const { Search } = Input;

const InboundList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState("ALL");
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
        const statusMeta = getInboundStatusMeta(status);
        if (!statusMeta) return <Tag>{status}</Tag>;
        return <Tag color={statusMeta.color}>{statusMeta.label}</Tag>;
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
                        {INBOUND_FILTER_STATUS_OPTIONS.map((statusOption) => (
                            <Option key={statusOption.value} value={statusOption.value}>
                                {statusOption.label}
                            </Option>
                        ))}
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
