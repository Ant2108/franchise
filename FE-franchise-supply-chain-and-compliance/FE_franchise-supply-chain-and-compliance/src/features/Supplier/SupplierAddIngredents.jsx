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
  Upload
} from "antd";
import { ArrowLeftOutlined ,PlusOutlined} from "@ant-design/icons";
import { useSupplierAddIngredientWizard } from "./hooks/useSupplierAddIngredientWizard";
const { TextArea } = Input;
import { useImageUpload } from "../../hooks/useImageUpload";
export default function AddSupplierIngredientWizard() {
  const {
    id,
    current,
    setCurrent,
    ingredientForm,
    supplierForm,
    loading,
    next,
    finish,
    goBack,
  } = useSupplierAddIngredientWizard();
  const { fileList, onChange, beforeUpload, getFileForPayload } = useImageUpload();

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
            label="Hình ảnh"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
            rules={[{ required: true }]}
          >
            <Upload
              beforeUpload={() => false} 
              listType="picture-card"
              accept="image/*"
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
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
            label="Số lượng đặt hàng tối thiểu"
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
                onClick={goBack}
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
            onClick={finish}
            loading={loading}
          >
            Finish
          </Button>
        )}

      </Space>

    </Card>
  );
}

