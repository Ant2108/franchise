import React, { useState, useEffect } from "react";
import { Modal, Form, Select, DatePicker, Button, InputNumber, Space, message, Table } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import inboundApi from "./InboundAPI/inboundApi";
import { getSuppliers, getSupplierDetail } 
  from "../Supplier/SupplierAPI/supplierApi";

const { Option } = Select;

const CreateInboundModal = ({ open, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selectedSupplierId, setSelectedSupplierId] = useState(null);

    useEffect(() => {
        if (open) {
            fetchSuppliers();
            form.resetFields();
            setSelectedSupplierId(null);
            setIngredients([]);
        }
    }, [open, form]);

   const fetchSuppliers = async () => {
    try {
        const data = await getSuppliers();  // gọi trực tiếp
        setSuppliers(data);
    } catch (error) {
        message.error("Không tải được danh sách nhà cung cấp", error);
    }
};

    const fetchSupplierIngredients = async (supplierId) => {
        try {
            const data = await getSupplierDetail.getSupplierIngredients(supplierId);
            setIngredients(data || []);
        } catch (error) {
            message.error("Không tải được danh sách nguyên liệu của nhà cung cấp này", error);
            setIngredients([]);
        }
    };

    const handleSupplierChange = (value) => {
        setSelectedSupplierId(value);
        form.setFieldsValue({ items: [] }); // Reset items when supplier changes
        fetchSupplierIngredients(value);
    };

    const handleFinish = async (values) => {
        if (!values.items || values.items.length === 0) {
            message.error("Vui lòng thêm ít nhất một nguyên liệu");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                supplierId: values.supplierId,
                expectedDate: values.expectedDate.format("YYYY-MM-DDTHH:mm:ss"),
                items: values.items.map(item => ({
                    ingredientId: item.ingredientId,
                    quantity: item.quantity
                }))
            };

            await inboundApi.createOrder(payload);
            message.success("Tạo đơn nhập hàng thành công");
            onSuccess();
            onClose();
        } catch (error) {
            message.error("Tạo đơn nhập hàng thất bại: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Tạo Đơn Nhập Kho Mới"
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Form.Item
                        name="supplierId"
                        label="Nhà cung cấp"
                        rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp" }]}
                    >
                        <Select
                            placeholder="Chọn nhà cung cấp"
                            onChange={handleSupplierChange}
                            showSearch
                            optionFilterProp="children"
                        >
                            {suppliers.map(s => (
                                <Option key={s.id} value={s.id}>{s.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="expectedDate"
                        label="Ngày dự kiến giao"
                        rules={[{ required: true, message: "Vui lòng chọn ngày dự kiến" }]}
                    >
                        <DatePicker style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm" />
                    </Form.Item>
                </div>

                <div style={{ marginTop: 16, marginBottom: 16 }}>
                    <h3>Danh sách nguyên liệu</h3>
                    <Form.List name="items">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'ingredientId']}
                                            rules={[{ required: true, message: 'Thiếu nguyên liệu' }]}
                                            style={{ width: 300, margin: 0 }}
                                        >
                                            <Select
                                                placeholder="Chọn nguyên liệu"
                                                disabled={!selectedSupplierId}
                                                showSearch
                                                optionFilterProp="children"
                                            >
                                                {ingredients.map(ing => (
                                                    <Option key={ing.ingredientId || ing.id} value={ing.ingredientId || ing.id}>
                                                        {ing.ingredientName || ing.name}
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
                                        disabled={!selectedSupplierId}
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

export default CreateInboundModal;
