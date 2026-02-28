import { useState, useEffect } from "react";
import { Modal, Form, Select, Input, Button, DatePicker, message, Space, Row, Col } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import inboundApi from "./InboundAPI/inboundApi";
import metadataApi from "../../services/metadataService";

const { Option } = Select;

const InboundCreate = ({ open, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [warehouses, setWarehouses] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const watchedItems = Form.useWatch('items', form);

    useEffect(() => {
        if (open) {
            metadataApi.getWarehouses().then(setWarehouses).catch(() => message.error("Lỗi tải kho"));
            metadataApi.getSuppliers().then(setSuppliers).catch(() => message.error("Lỗi tải NCC"));
            metadataApi.getIngredients().then(setIngredients).catch(() => message.error("Lỗi tải nguyên liệu"));
        }
    }, [open]);

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                warehouseId: values.warehouseId,
                supplierId: values.supplierId,
                expectedDate: values.expectedDeliveryDate.format("YYYY-MM-DDT00:00:00"),
                items: values.items.map((item) => ({
                    ingredientId: item.ingredientId,
                    quantity: item.quantity,
                })),
            };

            await inboundApi.createOrder(payload);
            message.success("Tạo đơn nhập hàng thành công!");
            form.resetFields();
            onSuccess();
        } catch (error) {
            message.error("Lỗi khi tạo đơn: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Tạo Yêu cầu Nhập hàng mới"
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="warehouseId"
                            label="Chọn Kho"
                            rules={[{ required: true, message: "Vui lòng chọn kho" }]}
                        >
                            <Select placeholder="-- Chọn kho --">
                                {warehouses.map(w => <Option key={w.id} value={w.id}>{w.name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="supplierId"
                            label="Chọn Nhà cung cấp"
                            rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp" }]}
                        >
                            <Select placeholder="-- Chọn nhà cung cấp --">
                                {suppliers.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="expectedDeliveryDate"
                            label="Ngày dự kiến giao"
                            rules={[{ required: true, message: "Vui lòng chọn ngày dự kiến" }]}
                        >
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                </Row>

                <div style={{ marginBottom: 16, fontWeight: "bold" }}>Danh sách mặt hàng:</div>
                <Form.List
                    name="items"
                    rules={[
                        {
                            validator: async (_, items) => {
                                if (!items || items.length < 1) {
                                    return Promise.reject(new Error("Phải có ít nhất 1 mặt hàng"));
                                }
                            },
                        },
                    ]}
                >
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => {
                                const selectedIngredientId = watchedItems?.[name]?.ingredientId;
                                const selectedIngredient = ingredients.find(i => i.id === selectedIngredientId);
                                return (
                                    <Space
                                        key={key}
                                        style={{ display: "flex", marginBottom: 8 }}
                                        align="baseline"
                                    >
                                        <Form.Item
                                            {...restField}
                                            name={[name, "ingredientId"]}
                                            rules={[{ required: true, message: "Chọn nguyên liệu" }]}
                                        >
                                            <Select placeholder="Nguyên liệu" style={{ width: 250 }}>
                                                {ingredients.map(i => <Option key={i.id} value={i.id}>{i.name}</Option>)}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            {...restField}
                                            name={[name, "quantity"]}
                                            rules={[{ required: true, message: "Nhập số lượng" }]}
                                        >
                                            <Input type="number" placeholder="Số lượng" min={1} style={{ width: 120 }} />
                                        </Form.Item>
                                        <span style={{ color: "#888", minWidth: 40 }}>{selectedIngredient?.unit || ""}</span>
                                        <MinusCircleOutlined onClick={() => remove(name)} style={{ color: "red", marginLeft: 8 }} />
                                    </Space>
                                );
                            })}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Thêm mặt hàng
                                </Button>
                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Form.Item style={{ textAlign: "right", marginTop: 24 }}>
                    <Space>
                        <Button onClick={onClose}>Hủy</Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Xác nhận tạo
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default InboundCreate;
