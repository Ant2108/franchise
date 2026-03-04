import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Progress,
  message,
  InputNumber,
} from "antd";
import { useNavigate } from "react-router-dom";
import {ArrowLeftOutlined} from "@ant-design/icons";
import "./CreateAdminWarehouse.css";
import WareHouseAdminAPI from "./AdminWareHousePageAPI/AdminWareHousePageAPI";

const { Option } = Select;

const CreateAdminWarehouse = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  

  const stepFields = {
    1: ["name", "description"],
    2: ["location","latitude","longitude"],
    3: ["status"],
  };

  const next = async () => {
    try {
      await form.validateFields(stepFields[currentStep]);
      setCurrentStep(currentStep + 1);
    } catch (err) {
      message.error("Vui lòng hoàn thành bước hiện tại trước khi tiếp tục.",err);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      console.log("==== FULL FORM VALUES ====");
      console.log(values);

      setLoading(true);

      await WareHouseAdminAPI.createWarehouse(values);

      message.success("Tạo kho hàng thành công!");
      navigate("/admin/warehouse");
    } catch (err) {
      console.error(err?.response?.data);
      message.error("Tạo kho hàng thất bại!",err);
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="create-page">

    {/* HERO HEADER */}
    <div className="create-hero">
      <div className="hero-content">
        <div className="header-top">
          <Button
            icon={<ArrowLeftOutlined />}
            className="back-button"
            onClick={() => navigate("/admin/warehouse")}
          >
            Trở Về Danh Sách
          </Button>
        </div>

        <h1>Tạo Kho Hàng Mới</h1>
        <p>Điền thông tin để tạo kho hàng mới</p>
      </div>
    </div>

    <div className="create-container">

      {/* PROGRESS CARD */}
      <Card className="progress-card">
        <Progress percent={(currentStep / 4) * 100} showInfo={false} />
        <div className="step-text">Bước {currentStep} của 4</div>
      </Card>

      {/* FORM CARD */}
      <Card className="form-card">
        <Form form={form} layout="vertical">

          {/* STEP 1 */}
          <div style={{ display: currentStep === 1 ? "block" : "none" }}>
            <div className="section-header">
              <div className="icon-box">🏬</div>
              <h2>Thông Tin Cơ Bản</h2>
              <p>Hãy bắt đầu với các thông tin cơ bản của kho hàng</p>
            </div>

            <Form.Item
              name="name"
              label="Tên Kho Hàng"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input />
            </Form.Item>


            <Form.Item name="description" label="Mô Tả">
              <Input.TextArea rows={3} />
            </Form.Item>
          </div>

          {/* STEP 2 */}
          <div style={{ display: currentStep === 2 ? "block" : "none" }}>
            <div className="section-header">
              <div className="icon-box">📍</div>
              <h2>Vị Trí</h2>
              <p>Cung cấp thông tin địa chỉ của kho hàng</p>
            </div>

            <Form.Item
              name="location"
              label="Địa Chỉ Kho Hàng"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="latitude"
              label="Vĩ Độ"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="longitude"
              label="Kinh Độ"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </div>


          {/* STEP 3 */}
          <div style={{ display: currentStep === 3 ? "block" : "none" }}>
            <div className="section-header">
              <div className="icon-box">⚙️</div>
              <h2>Trạng Thái Hoạt Động</h2>
              <p>Đặt trạng thái hoạt động hiện tại</p>
            </div>

            <Form.Item
              name="status"
              label="Trạng Thái Kho Hàng"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="ACTIVE">Hoạt động</Option>
                <Option value="INACTIVE">Ngừng hoạt động</Option>
                <Option value="MAINTAIN">Bảo trì</Option>
                <Option value="CLOSE">Đóng cửa</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="form-actions">
            {currentStep > 1 && (
              <Button onClick={prev}>Quay lại</Button>
            )}

            {currentStep < 4 && (
              <Button type="primary" onClick={next}>
                Bước Tiếp Theo
              </Button>
            )}

            {currentStep === 4 && (
              <Button
                type="primary"
                loading={loading}
                onClick={handleSubmit}
              >
                Tao Kho Hàng
              </Button>
            )}
          </div>

        </Form>
      </Card>
    </div>
  </div>
);
};

export default CreateAdminWarehouse;