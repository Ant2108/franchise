import { useEffect, useState } from "react";
import { Modal, Descriptions, Table, Tag, Form, Select, Input, Button, message, Space } from "antd";
import inboundApi from "./InboundAPI/inboundApi";

const { Option } = Select;

const InboundDetail = ({ orderId, open, onClose, onStatusUpdated }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (orderId && open) {
            fetchDetail();
        }
    }, [orderId, open]);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const data = await inboundApi.getOrderById(orderId);
            setOrder(data);
            form.setFieldsValue({ status: data.status });
        } catch (error) {
            message.error("Lỗi khi tải chi tiết đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (values) => {
        setUpdating(true);
        try {
            await inboundApi.updateOrderStatus(orderId, values.status, values.notes);
            message.success("Cập nhật trạng thái thành công");
            onStatusUpdated();
            onClose();
        } catch (error) {
            message.error("Lỗi khi cập nhật trạng thái");
        } finally {
            setUpdating(false);
        }
    };

    const itemColumns = [
        {
            title: "Nguyên liệu",
            key: "ingredient",
            render: (_, record) => record.ingredientName || `ID: ${record.ingredientId}`,
        },
        { title: "Đơn vị tính", dataIndex: "unit", key: "unit", render: (_, record) => record.unit || "" },
        { title: "Số lượng yêu cầu", dataIndex: "quantity", key: "quantity" },
        { title: "Số lượng thực nhận", dataIndex: "receivedQuantity", key: "receivedQuantity" }
    ];

    return (
        <Modal
            title={`Chi tiết đơn nhập kho #${orderId}`}
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            {loading ? (
                <p>Đang tải...</p>
            ) : order ? (
                <>
                    <Descriptions bordered size="small" column={2} style={{ marginBottom: 20 }}>
                        <Descriptions.Item label="Mã Đơn">{order.id}</Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color="blue">{order.status}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Kho hàng">{order.warehouseName}</Descriptions.Item>
                        <Descriptions.Item label="Nhà cung cấp">{order.supplierName}</Descriptions.Item>
                        <Descriptions.Item label="Tổng giá trị">
                            <span style={{ color: "red", fontWeight: "bold" }}>
                                {order.totalAmount
                                    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.totalAmount)
                                    : "0 ₫"}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày dự kiến giao">{order.expectedDate ? new Date(order.expectedDate).toLocaleString() : ""}</Descriptions.Item>
                        <Descriptions.Item label="Ngày giao thực tế">{order.actualDate ? new Date(order.actualDate).toLocaleString() : "Chưa giao"}</Descriptions.Item>
                    </Descriptions>

                    <h4 style={{ marginBottom: 10 }}>Danh sách nguyên liệu</h4>
                    <Table
                        rowKey="id"
                        columns={itemColumns}
                        dataSource={order.items || []}
                        pagination={false}
                        size="small"
                        style={{ marginBottom: 20 }}
                    />
                </>
            ) : (
                <p>Không tìm thấy dữ liệu.</p>
            )}
        </Modal>
    );
};

export default InboundDetail;
