import React, { useState, useEffect, useMemo } from "react";
import { Modal, Form, Select, Button, InputNumber, Space, message, Input } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import outboundApi from "./OutboundAPI/outboundApi";
import apiClient from "../../services/axiosClient";

const { Option } = Select;

const CreateOutboundModal = ({ open, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [ingredients, setIngredients] = useState([]);

    const ingredientMap = useMemo(() => {
        return new Map(ingredients.map((ingredient) => [ingredient.ingredientId, ingredient]));
    }, [ingredients]);

    useEffect(() => {
        if (open) {
            form.resetFields();
            fetchInventoryIngredients();
        }
    }, [open, form]);

    const fetchInventoryIngredients = async () => {
        try {
            // Lấy danh sách inventory của kho hiện tại (đã được đính kèm qua header X-Warehouse-Id)
            const data = await apiClient.get('/inventory');
            setIngredients(data || []);
        } catch (error) {
            message.error("Không tải được danh sách tồn kho");
        }
    };

    const handleFinish = async (values) => {
        if (!values.items || values.items.length === 0) {
            message.error("Vui lòng thêm ít nhất một nguyên liệu");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                destinationFranchiseId: values.destinationFranchiseId,
                items: values.items.map(item => ({
                    ingredientId: item.ingredientId,
                    quantity: item.quantity
                }))
            };

            await outboundApi.createOrder(payload);
            message.success("Tạo đơn xuất hàng thành công");
            onSuccess();
            onClose();
        } catch (error) {
            message.error("Tạo đơn xuất hàng thất bại: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Tạo Đơn Xuất Kho Mới"
            open={open}
            onCancel={onClose}
            width={800}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
                    Tạo đơn
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    name="destinationFranchiseId"
                    label="Mã Cửa hàng/Đại lý nhận (UUID)"
                    rules={[{ required: true, message: "Vui lòng nhập mã cửa hàng nhận" }]}
                >
                    <Input placeholder="Nhập UUID của cửa hàng nhận" />
                </Form.Item>

                <div style={{ marginTop: 16, marginBottom: 16 }}>
                    <h3>Danh sách xuất kho</h3>
                    <Form.List name="items">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'ingredientId']}
                                            rules={[{ required: true, message: 'Thiếu nguyên liệu' }]}
                                            style={{ width: 350, margin: 0 }}
                                        >
                                            <Select
                                                placeholder="Chọn nguyên liệu từ kho"
                                                showSearch
                                                optionFilterProp="children"
                                            >
                                                {ingredients.map(inv => (
                                                    <Option key={inv.ingredientId} value={inv.ingredientId}>
                                                        {inv.ingredientName} (Tồn: {inv.quantityAvailable})
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'quantity']}
                                            rules={[{ required: true, message: 'Thiếu số lượng' }]}
                                            style={{ margin: 0 }}
                                        >
                                            <InputNumber placeholder="Số lượng" min={1} style={{ width: 150 }} />
                                        </Form.Item>
                                        <Form.Item
                                            noStyle
                                            shouldUpdate={(prevValues, currentValues) =>
                                                prevValues?.items?.[name]?.ingredientId !== currentValues?.items?.[name]?.ingredientId
                                            }
                                        >
                                            {({ getFieldValue }) => {
                                                const selectedIngredientId = getFieldValue(['items', name, 'ingredientId']);
                                                const selectedIngredient = ingredientMap.get(selectedIngredientId);
                                                return (
                                                    <span style={{ minWidth: 45, color: '#666' }}>
                                                        {selectedIngredient?.unit || ''}
                                                    </span>
                                                );
                                            }}
                                        </Form.Item>
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => remove(name)}
                                        />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        Thêm nguyên liệu
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </div>
            </Form>
        </Modal>
    );
};

export default CreateOutboundModal;
