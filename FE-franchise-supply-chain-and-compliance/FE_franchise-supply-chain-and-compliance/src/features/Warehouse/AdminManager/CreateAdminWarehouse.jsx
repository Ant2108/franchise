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
    1: ["name", "code", "description"],
    2: ["location"],
    3: ["status"],
  };

  const next = async () => {
    try {
      await form.validateFields(stepFields[currentStep]);
      setCurrentStep(currentStep + 1);
    } catch {
      message.error("Please complete this step before proceeding.");
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

      message.success("Warehouse created successfully!");
      navigate("/admin/warehouse");
    } catch (err) {
      console.error(err?.response?.data);
      message.error("Create failed!");
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
            Back to Warehouses
          </Button>
        </div>

        <h1>Create New Warehouse</h1>
        <p>Fill in the details to add a new warehouse to your system</p>
      </div>
    </div>

    <div className="create-container">

      {/* PROGRESS CARD */}
      <Card className="progress-card">
        <Progress percent={(currentStep / 4) * 100} showInfo={false} />
        <div className="step-text">Step {currentStep} of 4</div>
      </Card>

      {/* FORM CARD */}
      <Card className="form-card">
        <Form form={form} layout="vertical">

          {/* STEP 1 */}
          <div style={{ display: currentStep === 1 ? "block" : "none" }}>
            <div className="section-header">
              <div className="icon-box">🏬</div>
              <h2>Basic Information</h2>
              <p>Let's start with the essential details of your warehouse</p>
            </div>

            <Form.Item
              name="name"
              label="Warehouse Name"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="code"
              label="Warehouse Code"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>
          </div>

          {/* STEP 2 */}
          <div style={{ display: currentStep === 2 ? "block" : "none" }}>
            <div className="section-header">
              <div className="icon-box">📍</div>
              <h2>Location</h2>
              <p>Provide the warehouse address information</p>
            </div>

            <Form.Item
              name="location"
              label="Warehouse Location"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input />
            </Form.Item>
          </div>


          {/* STEP 3 */}
          <div style={{ display: currentStep === 3 ? "block" : "none" }}>
            <div className="section-header">
              <div className="icon-box">⚙️</div>
              <h2>Operational Status</h2>
              <p>Set the current operational state</p>
            </div>

            <Form.Item
              name="status"
              label="Warehouse Status"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select placeholder="Select status">
                <Option value="ACTIVE">Active</Option>
                <Option value="INACTIVE">Inactive</Option>
                <Option value="MAINTAIN">Maintain</Option>
                <Option value="CLOSE">Close</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="form-actions">
            {currentStep > 1 && (
              <Button onClick={prev}>Previous</Button>
            )}

            {currentStep < 4 && (
              <Button type="primary" onClick={next}>
                Next Step
              </Button>
            )}

            {currentStep === 4 && (
              <Button
                type="primary"
                loading={loading}
                onClick={handleSubmit}
              >
                Create Warehouse
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