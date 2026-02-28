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
                        <Descriptions.Item label="Ngày dự kiến giao">{order.expectedDate}</Descriptions.Item>
                        <Descriptions.Item label="Ngày giao thực tế">{order.actualDate || "Chưa giao"}</Descriptions.Item>
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

                    <div style={{ background: "#f5f5f5", padding: 16, borderRadius: 8 }}>
                        <h4>Cập nhật trạng thái</h4>
                        <Form form={form} layout="inline" onFinish={handleUpdateStatus}>
                            <Form.Item name="status" rules={[{ required: true }]}>
                                <Select style={{ width: 150 }}>
                                    <Option value="PENDING">Chờ xử lý</Option>
                                    <Option value="APPROVED">Đã duyệt</Option>
                                    <Option value="DELIVERING">Đang giao</Option>
                                    <Option value="COMPLETED">Hoàn tất</Option>
                                    <Option value="CANCELLED">Đã hủy</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={updating}>
                                    Cập nhật
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </>
            ) : (
                <p>Không tìm thấy dữ liệu.</p>
            )}
        </Modal>
    );
};

export default InboundDetail;
