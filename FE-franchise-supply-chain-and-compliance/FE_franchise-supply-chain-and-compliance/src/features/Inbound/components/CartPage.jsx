import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    Table,
    InputNumber,
    Button,
    Typography,
    Space,
    Tag,
    Empty,
    Spin,
    Popconfirm,
    message,
    Row,
    Col,
    Statistic,
    Divider,
    Result,
} from "antd";
import {
    ShoppingCartOutlined,
    DeleteOutlined,
    ClearOutlined,
    ArrowLeftOutlined,
    ShoppingOutlined,
    DollarOutlined,
    InboxOutlined,
} from "@ant-design/icons";
import cartApi from "../InboundAPI/cartApi";

const { Title, Text } = Typography;

const CartPage = () => {
    const navigate = useNavigate();
    const [cartData, setCartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [updatingItemId, setUpdatingItemId] = useState(null);

    const fetchCart = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await cartApi.getCart();
            setCartData(data);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
            setCartData(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const formatPrice = (value) =>
        Number(value || 0).toLocaleString("vi-VN");

    // Cập nhật số lượng
    const handleUpdateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity <= 0) return;
        setUpdatingItemId(cartItemId);
        try {
            await cartApi.updateCartItemQuantity(cartItemId, newQuantity);
            fetchCart();
        } catch (error) {
            message.error(error.message || "Cập nhật số lượng thất bại");
        } finally {
            setUpdatingItemId(null);
        }
    };

    // Xóa một sản phẩm
    const handleRemoveItem = async (cartItemId) => {
        try {
            await cartApi.removeCartItem(cartItemId);
            message.success("Đã xóa sản phẩm khỏi giỏ hàng");
            fetchCart();
        } catch (error) {
            message.error(error.message || "Xóa sản phẩm thất bại");
        }
    };

    // Xóa toàn bộ giỏ hàng
    const handleClearCart = async () => {
        try {
            await cartApi.clearCart();
            message.success("Đã xóa toàn bộ giỏ hàng");
            fetchCart();
        } catch (error) {
            message.error(error.message || "Xóa giỏ hàng thất bại");
        }
    };

    // Checkout
    const handleCheckout = async () => {
        setCheckoutLoading(true);
        try {
            const orders = await cartApi.checkoutCart();
            message.success(
                `Đặt hàng thành công! Đã tạo ${orders.length} đơn nhập kho.`
            );
            fetchCart();
        } catch (error) {
            message.error(error.message || "Checkout thất bại");
        } finally {
            setCheckoutLoading(false);
        }
    };

    const suppliers = cartData?.cartBySuppliers || [];
    const grandTotal = cartData?.grandTotal || 0;
    const totalItems = cartData?.totalItems || 0;
    const hasItems = suppliers.length > 0 && totalItems > 0;

    // Cột cho Table bên trong mỗi nhóm supplier
    const columns = [
        {
            title: "Nguyên liệu",
            dataIndex: "ingredientName",
            key: "ingredientName",
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: "Đơn vị",
            dataIndex: "unit",
            key: "unit",
            width: 100,
            render: (text) => <Tag>{text}</Tag>,
        },
        {
            title: "Đơn giá (VND)",
            dataIndex: "unitPrice",
            key: "unitPrice",
            width: 150,
            align: "right",
            render: (val) => <Text>{formatPrice(val)}</Text>,
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            width: 140,
            align: "center",
            render: (val, record) => (
                <InputNumber
                    min={1}
                    value={Number(val)}
                    disabled={updatingItemId === record.cartItemId}
                    onChange={(newVal) => {
                        if (newVal && newVal > 0)
                            handleUpdateQuantity(record.cartItemId, newVal);
                    }}
                    size="small"
                    style={{ width: 80 }}
                />
            ),
        },
        {
            title: "Thành tiền (VND)",
            dataIndex: "lineTotal",
            key: "lineTotal",
            width: 160,
            align: "right",
            render: (val) => (
                <Text strong style={{ color: "#1677ff" }}>
                    {formatPrice(val)}
                </Text>
            ),
        },
        {
            title: "",
            key: "actions",
            width: 60,
            align: "center",
            render: (_, record) => (
                <Popconfirm
                    title="Xóa sản phẩm này?"
                    onConfirm={() => handleRemoveItem(record.cartItemId)}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
            ),
        },
    ];

    if (isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 400,
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
            {/* Header */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Space>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate("/warehouse/inbound")}
                        >
                            Tiếp tục mua hàng
                        </Button>
                        <Title level={3} style={{ margin: 0 }}>
                            <ShoppingCartOutlined style={{ marginRight: 8 }} />
                            Giỏ hàng
                        </Title>
                        <Tag color="blue" style={{ fontSize: 14, padding: "2px 12px" }}>
                            {totalItems} sản phẩm
                        </Tag>
                    </Space>
                </Col>
                <Col>
                    {hasItems && (
                        <Popconfirm
                            title="Bạn muốn xóa toàn bộ giỏ hàng?"
                            onConfirm={handleClearCart}
                            okText="Xóa hết"
                            cancelText="Hủy"
                        >
                            <Button icon={<ClearOutlined />} danger>
                                Xóa toàn bộ giỏ hàng
                            </Button>
                        </Popconfirm>
                    )}
                </Col>
            </Row>

            {!hasItems ? (
                <Card>
                    <Result
                        icon={<InboxOutlined style={{ color: "#bfbfbf" }} />}
                        title="Giỏ hàng trống"
                        subTitle="Bạn chưa thêm sản phẩm nào vào giỏ hàng."
                        extra={
                            <Button
                                type="primary"
                                icon={<ShoppingOutlined />}
                                onClick={() => navigate("/warehouse/inbound")}
                            >
                                Đi mua hàng
                            </Button>
                        }
                    />
                </Card>
            ) : (
                <Row gutter={24}>
                    {/* Danh sách sản phẩm theo nhà cung cấp */}
                    <Col xs={24} lg={17}>
                        <Space direction="vertical" size={16} style={{ width: "100%" }}>
                            {suppliers.map((supplier) => (
                                <Card
                                    key={supplier.supplierId}
                                    title={
                                        <Space>
                                            <Tag color="blue" style={{ fontSize: 14 }}>
                                                {supplier.supplierName}
                                            </Tag>
                                            <Text type="secondary">
                                                Tạm tính: {formatPrice(supplier.subTotal)} VND
                                            </Text>
                                        </Space>
                                    }
                                    size="small"
                                >
                                    <Table
                                        dataSource={supplier.items}
                                        columns={columns}
                                        rowKey="cartItemId"
                                        pagination={false}
                                        size="small"
                                        bordered
                                    />
                                </Card>
                            ))}
                        </Space>
                    </Col>

                    {/* Panel tổng cộng + Checkout */}
                    <Col xs={24} lg={7}>
                        <Card
                            style={{
                                position: "sticky",
                                top: 24,
                            }}
                        >
                            <Title level={4} style={{ marginTop: 0 }}>
                                Tổng đơn hàng
                            </Title>

                            <Divider />

                            <Statistic
                                title="Tổng sản phẩm"
                                value={totalItems}
                                prefix={<ShoppingCartOutlined />}
                                style={{ marginBottom: 16 }}
                            />

                            <Statistic
                                title="Số nhà cung cấp"
                                value={suppliers.length}
                                prefix={<InboxOutlined />}
                                style={{ marginBottom: 16 }}
                            />

                            <Divider />

                            <Statistic
                                title="Tổng cộng"
                                value={formatPrice(grandTotal)}
                                suffix="VND"
                                prefix={<DollarOutlined />}
                                valueStyle={{
                                    color: "#1677ff",
                                    fontSize: 28,
                                    fontWeight: 700,
                                }}
                            />

                            <Divider />

                            <Button
                                type="primary"
                                size="large"
                                block
                                loading={checkoutLoading}
                                onClick={handleCheckout}
                                icon={<ShoppingOutlined />}
                                style={{ height: 48, fontSize: 16, fontWeight: 600 }}
                            >
                                Checkout - Tạo đơn nhập kho
                            </Button>

                            <Text
                                type="secondary"
                                style={{
                                    display: "block",
                                    textAlign: "center",
                                    marginTop: 12,
                                    fontSize: 12,
                                }}
                            >
                                Mỗi nhà cung cấp sẽ tạo 1 đơn nhập kho riêng
                            </Text>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default CartPage;
