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
  Upload,
  Divider,
} from "antd";
import { ArrowLeftOutlined, PlusOutlined, CheckOutlined } from "@ant-design/icons";
import { useSupplierAddIngredientWizard } from "./hooks/useSupplierAddIngredientWizard";
import "./SupplierAddIngredents.css";
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
    <div className="supplier-ingredients-container fade-in">
      <Card
        className="premium-card"
        title={
          <div className="card-header">
            <span className="card-title">Thêm nguyên liệu cho Supplier</span>
          </div>
        }
      >
        <Steps
          current={current}
          items={[
            { title: "Tạo nguyên liệu", icon: current > 0 ? <CheckOutlined /> : undefined },
            { title: "Thiết lập Supplier Ingredient" },
          ]}
          style={{ marginBottom: 48 }}
        />

        {current === 0 && (
          <Form form={ingredientForm} layout="vertical" className="premium-form">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
              <Form.Item
                label="Tên nguyên liệu"
                name="ingredientName"
                rules={[{ required: true, message: "Vui lòng nhập tên nguyên liệu" }]}
              >
                <Input placeholder="Ví dụ: Sữa tươi" className="premium-input" />
              </Form.Item>

              <Form.Item
                label="Đơn vị"
                name="unit"
                rules={[{ required: true, message: "Vui lòng nhập đơn vị" }]}
              >
                <Input placeholder="kg, lít..." className="premium-input" />
              </Form.Item>
            </div>

            <Form.Item
              label="Hình ảnh"
              name="image"
              valuePropName="fileList"
              getValueFromEvent={(e) => e.fileList}
              rules={[{ required: true, message: "Vui lòng chọn hình ảnh" }]}
            >
              <Upload
                beforeUpload={() => false}
                listType="picture-card"
                accept="image/*"
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8, fontWeight: 600, fontSize: 13 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item
              label="Alert Threshold"
              name="alertThreshold"
              rules={[{ required: true, message: "Vui lòng nhập ngưỡng cảnh báo" }]}
            >
              <InputNumber
                className="premium-input-number"
                style={{ width: "100%" }}
                min={0}
                placeholder="Nhập ngưỡng cảnh báo"
              />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
              <TextArea
                rows={4}
                className="premium-textarea"
                placeholder="Nhập mô tả nguyên liệu..."
              />
            </Form.Item>
          </Form>
        )}

        {current === 1 && (
          <Form form={supplierForm} layout="vertical" className="premium-form">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
              <Form.Item
                label="Đơn giá"
                name="unitPrice"
                rules={[{ required: true, message: "Vui lòng nhập đơn giá" }]}
              >
                <InputNumber
                  className="premium-input-number"
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Nhập đơn giá"
                />
              </Form.Item>

              <Form.Item
                label="Số lượng đặt hàng tối thiểu"
                name="minimumOrderQuantity"
                rules={[{ required: true, message: "Vui lòng nhập MOQ" }]}
              >
                <InputNumber
                  className="premium-input-number"
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Nhập MOQ"
                />
              </Form.Item>

              <Form.Item
                label="Tồn kho"
                name="stockQuantity"
                rules={[{ required: true, message: "Vui lòng nhập tồn kho" }]}
              >
                <InputNumber
                  className="premium-input-number"
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Nhập tồn kho"
                />
              </Form.Item>

              <Form.Item
                label="Lead Time (ngày)"
                name="leadTimeDays"
                rules={[{ required: true, message: "Vui lòng nhập lead time" }]}
              >
                <InputNumber
                  className="premium-input-number"
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Nhập lead time"
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Status"
              name="status"
              initialValue="ACTIVE"
            >
              <Select
                className="premium-select"
                options={[
                  { label: "ACTIVE", value: "ACTIVE" },
                  { label: "INACTIVE", value: "INACTIVE" },
                ]}
              />
            </Form.Item>
          </Form>
        )}

        <Divider style={{ borderColor: "rgba(198, 113, 23, 0.08)" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            {current === 0 && (
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={goBack}
                className="btn-secondary"
              >
                Quay lại
              </Button>
            )}
            {current === 1 && (
              <Button onClick={() => setCurrent(0)} className="btn-secondary">
                Quay lại
              </Button>
            )}
          </div>
          <div>
            {current === 0 && (
              <Button
                type="primary"
                onClick={next}
                loading={loading}
                className="btn-primary-gradient"
              >
                Tiếp theo →
              </Button>
            )}
            {current === 1 && (
              <Button
                type="primary"
                onClick={finish}
                loading={loading}
                className="btn-primary-gradient"
                icon={<CheckOutlined />}
              >
                Hoàn thành
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
