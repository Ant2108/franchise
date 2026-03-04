import { useState, useEffect } from "react";
import { Modal, Form, Select, Input, Button, DatePicker, message, Space, Row, Col } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import outboundApi from "./OutboundAPI/outboundApi";
import metadataApi from "../../services/metadataService";

const { Option } = Select;

const OutboundCreate = ({ open, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [warehouses, setWarehouses] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const watchedItems = Form.useWatch('items', form);

    useEffect(() => {
        if (open) {
            metadataApi.getWarehouses().then(setWarehouses).catch(() => message.error("Lỗi tải kho"));
            metadataApi.getIngredients().then(setIngredients).catch(() => message.error("Lỗi tải nguyên liệu"));
        }
    }, [open]);

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                warehouseId: values.warehouseId,
                destinationFranchiseId: values.franchiseStoreId,
                items: values.items.map((item) => ({
                    ingredientId: item.ingredientId,
                    quantity: item.quantity,
                })),
            };

            await outboundApi.createOrder(payload);
            message.success("Tạo đơn xuất hàng thành công!");
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
            title="Tạo Yêu cầu Xuất hàng mới"
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
                            label="Từ Kho xuất"
                            rules={[{ required: true, message: "Vui lòng chọn kho" }]}
                        >
                            <Select placeholder="-- Chọn kho --">
                                {warehouses.map(w => <Option key={w.id} value={w.id}>{w.name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="franchiseStoreId"
                            label="Đến Cửa hàng nhận"
                            rules={[{ required: true, message: "Vui lòng chọn cửa hàng" }]}
                        >
                            <Select placeholder="-- Chọn cửa hàng đại lý --">
                                <Option value="12345678-1234-1234-1234-123456789abc">CH Quận 1</Option>
                                <Option value="abcdef12-abcd-abcd-abcd-abcdef123456">CH Tân Bình</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="expectedShippingDate"
                            label="Ngày dự kiến xuất"
                            rules={[{ required: true, message: "Vui lòng chọn ngày dự kiến" }]}
                        >
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                </Row>

                <div style={{ marginBottom: 16, fontWeight: "bold" }}>Danh sách mặt hàng xuất:</div>
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
                                            rules={[{ required: true, message: "Nhập số lượng xuất" }]}
                                        >
                                            <Input type="number" placeholder="Số lượng" min={1} style={{ width: 120 }} />
                                        </Form.Item>
                                        <span style={{ color: "#888", minWidth: 40 }}>{selectedIngredient?.unit || ""}</span>
                                        <MinusCircleOutlined onClick={() => remove(name)} style={{ color: "red" }} />
                                    </Space>
                                );
                            })}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Thêm mặt hàng xuất
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
                            Xác nhận tạo phiếu xuất
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default OutboundCreate;
