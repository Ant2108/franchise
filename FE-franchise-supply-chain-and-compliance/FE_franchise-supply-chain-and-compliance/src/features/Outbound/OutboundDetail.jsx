import { useEffect, useState } from "react";
import { Modal, Descriptions, Table, Tag, Form, Select, Input, Button, message } from "antd";
import outboundApi from "./OutboundAPI/outboundApi";

const { Option } = Select;

const OutboundDetail = ({ orderId, open, onClose, onStatusUpdated }) => {
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
            const data = await outboundApi.getOrderById(orderId);
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
            await outboundApi.updateOrderStatus(orderId, values.status, values.notes);
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
        { title: "Đơn vị tính", dataIndex: "unit", key: "unit" },
        { title: "Số lượng xuất", dataIndex: "quantity", key: "quantity" },
    ];

    return (
        <Modal
            title={`Chi tiết đơn xuất kho #${orderId}`}
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
                            <Tag color="cyan">{order.status}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Kho xuất">{order.warehouseName}</Descriptions.Item>
                        <Descriptions.Item label="CH nhận">{order.destinationFranchiseName}</Descriptions.Item>
                        <Descriptions.Item label="Ngày xuất dự kiến">{new Date(order.createdAt).toLocaleDateString()}</Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">{new Date(order.updatedAt).toLocaleDateString()}</Descriptions.Item>
                    </Descriptions>

                    <h4 style={{ marginBottom: 10 }}>Danh sách nguyên liệu xuất</h4>
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

export default OutboundDetail;
