import { useEffect, useState } from "react";
import { Modal, Descriptions, Table, Tag, Button, message, Checkbox, InputNumber, Popconfirm } from "antd";
import inboundApi from "./InboundAPI/inboundApi";
import { getInboundStatusMeta } from "../../utils/orderStatus";

const InboundDetail = ({ orderId, open, onClose, onStatusUpdated }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [itemReceipts, setItemReceipts] = useState({});

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

            const dataIsDelivering = String(data.status || "").toUpperCase() === "DELIVERING";
            const receiptsState = {};
            (data.items || []).forEach((item) => {
                const requestedQuantity = Number(item.quantity || 0);
                const receivedQuantity = item.receivedQuantity ?? 0;
                receiptsState[item.id] = {
                    // Mặc định cho trạng thái DELIVERING: chưa tick "Đã nhận", SL thực nhận = SL yêu cầu
                    received: false,
                    receivedQuantity: dataIsDelivering
                        ? requestedQuantity
                        : (Number(receivedQuantity) || 0),
                };
            });
            setItemReceipts(receiptsState);
        } catch (error) {
            message.error("Lỗi khi tải chi tiết đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveReceipts = async () => {
        if (!order) return;

        const outboundItems = order.items || [];
        const receiptsPayload = outboundItems.map((item) => {
            const receiptState = itemReceipts[item.id] || { received: false, receivedQuantity: 0 };
            const requestedQty = Number(item.quantity || 0);
            const receivedQty = Number(receiptState.receivedQuantity || 0);

            return {
                itemId: item.id,
                received: Boolean(receiptState.received),
                receivedQuantity: receiptState.received ? receivedQty : 0,
                requestedQty,
            };
        });

        const invalidReceipt = receiptsPayload.find(
            (receipt) =>
                receipt.received &&
                (Number.isNaN(receipt.receivedQuantity) ||
                    receipt.receivedQuantity < 0 ||
                    receipt.receivedQuantity > receipt.requestedQty)
        );

        if (invalidReceipt) {
            message.error("Số lượng thực nhận phải từ 0 đến số lượng yêu cầu");
            return;
        }

        setUpdating(true);
        try {
            await inboundApi.updateOrderStatus(
                orderId,
                order.status,
                "",
                receiptsPayload.map(({ requestedQty, ...payload }) => payload)
            );
            message.success("Cập nhật số lượng thực nhận thành công");
            onStatusUpdated();
            fetchDetail();
        } catch (error) {
            message.error("Lỗi khi cập nhật số lượng thực nhận");
        } finally {
            setUpdating(false);
        }
    };

    const isDelivering = String(order?.status || "").toUpperCase() === "DELIVERING";
    const isPending = String(order?.status || "").toUpperCase() === "PENDING";

    const handleCancelOrder = async () => {
        setUpdating(true);
        try {
            await inboundApi.updateOrderStatus(orderId, "CANCELLED");
            message.success("Hủy đơn hàng thành công");
            onStatusUpdated();
            fetchDetail();
        } catch (error) {
            message.error("Lỗi khi hủy đơn hàng: " + (error.response?.data?.message || error.message));
        } finally {
            setUpdating(false);
        }
    };

    const updateItemReceipt = (itemId, partialState) => {
        setItemReceipts((prevState) => ({
            ...prevState,
            [itemId]: {
                ...(prevState[itemId] || { received: false, receivedQuantity: 0 }),
                ...partialState,
            },
        }));
    };

    const itemColumns = [
        {
            title: "Nguyên liệu",
            key: "ingredient",
            render: (_, record) => record.ingredientName || `ID: ${record.ingredientId}`,
        },
        { title: "Số lượng yêu cầu", dataIndex: "quantity", key: "quantity" },
        { title: "Đơn vị tính", dataIndex: "unit", key: "unit", render: (_, record) => record.unit || "" },
        {
            title: "Đã nhận",
            key: "received",
            render: (_, record) => {
                const receiptState = itemReceipts[record.id] || { received: false, receivedQuantity: 0 };
                if (!isDelivering) {
                    return Number(record.receivedQuantity || 0) > 0 ? "Đã nhận" : "Chưa nhận";
                }
                return (
                    <Checkbox
                        checked={Boolean(receiptState.received)}
                        onChange={(event) =>
                            updateItemReceipt(record.id, {
                                received: event.target.checked,
                                receivedQuantity: event.target.checked
                                    ? Number(receiptState.receivedQuantity || record.quantity || 0)
                                    : 0,
                            })
                        }
                    >
                        Đã nhận
                    </Checkbox>
                );
            },
        },
        {
            title: "Số lượng thực nhận",
            dataIndex: "receivedQuantity",
            key: "receivedQuantity",
            render: (_, record) => {
                const receiptState = itemReceipts[record.id] || { received: false, receivedQuantity: 0 };
                if (!isDelivering) {
                    return record.receivedQuantity ?? 0;
                }
                return (
                    <InputNumber
                        min={0}
                        max={Number(record.quantity || 0)}
                        disabled={!receiptState.received}
                        value={Number(receiptState.receivedQuantity || 0)}
                        onChange={(value) => updateItemReceipt(record.id, { receivedQuantity: Number(value || 0) })}
                    />
                );
            },
        },
    ];

    const renderStatusTag = (status) => {
        const statusMeta = getInboundStatusMeta(status);
        if (!statusMeta) return <Tag>{status}</Tag>;
        return <Tag color={statusMeta.color}>{statusMeta.label}</Tag>;
    };

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
                            {renderStatusTag(order.status)}
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

                    {(isDelivering || isPending) && (
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                            {isPending && (
                                <Popconfirm
                                    title="Xác nhận hủy đơn"
                                    description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
                                    okText="Có"
                                    cancelText="Không"
                                    onConfirm={handleCancelOrder}
                                >
                                    <Button danger loading={updating}>
                                        Hủy đơn
                                    </Button>
                                </Popconfirm>
                            )}
                            {isDelivering && (
                                <Popconfirm
                                    title="Xác nhận cập nhật"
                                    description="Bạn có chắc không?"
                                    okText="Chắc chắn"
                                    cancelText="Hủy"
                                    onConfirm={handleSaveReceipts}
                                >
                                    <Button type="primary" loading={updating}>
                                        Lưu số lượng thực nhận
                                    </Button>
                                </Popconfirm>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <p>Không tìm thấy dữ liệu.</p>
            )}
        </Modal>
    );
};

export default InboundDetail;
