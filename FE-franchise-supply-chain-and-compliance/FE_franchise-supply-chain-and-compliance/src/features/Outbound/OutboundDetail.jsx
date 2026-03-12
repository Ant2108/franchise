import { useEffect, useState } from "react";
import { Modal, Descriptions, Table, Tag, Form, Select, Button, message, Popconfirm } from "antd";
import outboundApi from "./OutboundAPI/outboundApi";
import { getOutboundStatusMeta } from "../../utils/orderStatus";

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

    const renderStatusTag = (status) => {
        const statusMeta = getOutboundStatusMeta(status);
        if (!statusMeta) return <Tag>{status}</Tag>;
        return <Tag color={statusMeta.color}>{statusMeta.label}</Tag>;
    };

    const isCompleted = ["DELIVERED", "CANCELED", "CANCELLED"].includes(String(order?.status || "").toUpperCase());

    const statusOptions = [
        { value: "PENDING", label: "Chờ xử lý" },
        { value: "PACKING", label: "Đang chuẩn bị hàng" },
        { value: "SHIPPING", label: "Đang giao hàng" },
        { value: "DELIVERED", label: "Đã giao hàng" },
        { value: "CANCELED", label: "Đã hủy" },
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
                            {renderStatusTag(order.status)}
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

                    {!isCompleted && (
                        <Form form={form} layout="vertical" onFinish={handleUpdateStatus}>
                            <Form.Item
                                name="status"
                                label="Cập nhật trạng thái"
                                rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                            >
                                <Select options={statusOptions} placeholder="Chọn trạng thái" />
                            </Form.Item>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Popconfirm
                                    title="Xác nhận cập nhật"
                                    description="Bạn có chắc muốn đổi trạng thái đơn xuất kho không?"
                                    okText="Chắc chắn"
                                    cancelText="Hủy"
                                    onConfirm={() => form.submit()}
                                >
                                    <Button type="primary" loading={updating}>
                                        Lưu trạng thái
                                    </Button>
                                </Popconfirm>
                            </div>
                        </Form>
                    )}
                </>
            ) : (
                <p>Không tìm thấy dữ liệu.</p>
            )}
        </Modal>
    );
};

export default OutboundDetail;
