import { useState } from "react";
import {
  Card,
  Steps,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  message,
  Space,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  createIngredient,
  createSupplierIngredients,
} from "./SupplierAPI/supplierApi";
const { TextArea } = Input;

export default function AddSupplierIngredientWizard() {

  const { id } = useParams();

  const [current, setCurrent] = useState(0);
  const [ingredientId, setIngredientId] = useState(null);
  const navigate = useNavigate();

  const [ingredientForm] = Form.useForm();
  const [supplierForm] = Form.useForm();

  const [loading, setLoading] = useState(false);

    const next = async () => {

        if (current === 0) {

            try {

                const values = await ingredientForm.validateFields();

                setLoading(true);

                const payload = {
                    ingredientName: values.ingredientName,
                    unit: values.unit,
                    alertThreshold: values.alertThreshold,
                    description: values.description,
                };

                const res = await createIngredient(payload);

                const created = res?.data ?? res;

                setIngredientId(created?.id);

                message.success("Tạo nguyên liệu thành công");

                setCurrent(1);

            } catch (error) {

                console.error("createIngredient error:", error);

                if (!error?.errorFields) {

                    const errMsg =
                        error?.response?.data?.message ||
                        error?.response?.data ||
                        error?.message;

                    message.error(errMsg || "Không thể tạo nguyên liệu");
                }

            } finally {
                setLoading(false);
            }

        }
    };

    const finish = async () => {

        try {

            const values = await supplierForm.validateFields();

            setLoading(true);

            const payload = {
                supplierId: id,
                ingredientId: ingredientId,
                unitPrice: values.unitPrice,
                minimumOrderQuantity: values.minimumOrderQuantity,
                stockQuantity: values.stockQuantity,
                leadTimeDays: values.leadTimeDays,
                status: values.status,
            };

            await createSupplierIngredients(payload);

            message.success("Thêm nguyên liệu cho supplier thành công");

            ingredientForm.resetFields();
            supplierForm.resetFields();

            setIngredientId(null);
            setCurrent(0);

        } catch (error) {

            console.error("createSupplierIngredients error:", error);

            if (!error?.errorFields) {
                message.error("Không thể thêm nguyên liệu cho supplier");
            }

        } finally {
            setLoading(false);
        }
    };

  return (
    
    <Card title="Thêm nguyên liệu cho Supplier">

      <Steps
        current={current}
        items={[
          { title: "Tạo nguyên liệu" },
          { title: "Thiết lập Supplier Ingredient" },
        ]}
        style={{ marginBottom: 40 }}
      />

      {current === 0 && (

        <Form form={ingredientForm} layout="vertical">

          <Form.Item
            label="Tên nguyên liệu"
            name="ingredientName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Ví dụ: Sữa tươi" />
          </Form.Item>

          <Form.Item
            label="Đơn vị"
            name="unit"
            rules={[{ required: true }]}
          >
            <Input placeholder="kg, lít..." />
          </Form.Item>

          <Form.Item
            label="Alert Threshold"
            name="alertThreshold"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
          >
            <TextArea rows={4} />
          </Form.Item>

        </Form>

      )}

      {current === 1 && (

        <Form form={supplierForm} layout="vertical">

          <Form.Item
            label="Đơn giá"
            name="unitPrice"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            label="MOQ"
            name="minimumOrderQuantity"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            label="Tồn kho"
            name="stockQuantity"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            label="Lead Time"
            name="leadTimeDays"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            initialValue="ACTIVE"
          >
            <Select
              options={[
                { label: "ACTIVE", value: "ACTIVE" },
                { label: "INACTIVE", value: "INACTIVE" },
              ]}
            />
          </Form.Item>

        </Form>

      )}

      <Space style={{ marginTop: 30 }}>

        {current === 1 && (
          <Button onClick={() => setCurrent(0)}>
            Back
          </Button>
        )}
        {current === 0 && (
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(`/admin/supplier/${id}/view`)}
                style={{ marginBottom: 16 }}
            >
                Quay lại
            </Button>
        )}
        {current === 0 && (
          <Button
            type="primary"
            onClick={next}
            loading={loading}
          >
            Next
          </Button>
        )}
        {current === 1 && (
          <Button
            type="primary"
            onClick={() => navigate(`/admin/supplier/${id}/view`)}
            loading={loading}
          >
            Finish
          </Button>
        )}

      </Space>

    </Card>
  );
}

