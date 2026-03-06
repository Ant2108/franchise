import { useState, useEffect } from "react";
import { Modal, Button, Form, Input, message, Select } from "antd";
import inventoryApi from "./InventoryAPI/inventoryApi";

const { Option } = Select;

function InventoryItemForm({ ID, open, onClose, onSuccess }) {

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    if (open) {
      form.resetFields();
      fetchIngredients();
    }
  }, [open, form]);

  // fetch ingredients list
  const fetchIngredients = async () => {
    try {
      const res = await inventoryApi.getAll();
      setIngredients(res || []);
    } catch (error) {
      message.error("Không tải được danh sách nguyên liệu");
    }
  };

  const handleFinish = async (values) => {
    setLoading(true);

    try {
      const payload = {
        ingredientId: values.ingredientId,
        quantityAvailable: values.quantityAvailable,
        quantityReserved: values.quantityReserved,
      };

      await inventoryApi.update(ID, payload);
      message.success("Update thành công");

      if (onSuccess) {
        onSuccess();
      }

      onClose();

    } catch (error) {
      message.error(
        "Update thất bại: " +
        (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Update Inventory"
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          Update
        </Button>,
      ]}
    >

      <Form form={form} layout="vertical" onFinish={handleFinish}>

        <Form.Item>
          Inventory ID: <b>{ID}</b>
        </Form.Item>

        <Form.Item
          label="Ingredient"
          name="ingredientId"
          rules={[{ required: true, message: "Please select ingredient" }]}
        >
          <Select
            placeholder="Chọn nguyên liệu"
            showSearch
          >
            {(ingredients || []).map((inv) => (
              <Option key={inv.ingredientId} value={inv.ingredientId}>
                {inv.ingredientName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Available Quantity"
          name="quantityAvailable"
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="Reserved Quantity"
          name="quantityReserved"
        >
          <Input type="number" />
        </Form.Item>

      </Form>
    </Modal>
  );
}

export default InventoryItemForm;