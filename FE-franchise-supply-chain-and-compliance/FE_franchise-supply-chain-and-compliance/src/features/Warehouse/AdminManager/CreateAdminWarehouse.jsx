import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  message,
  InputNumber,
  AutoComplete
} from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./CreateAdminWarehouse.css";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useWarehouseWizad } from "./hooks/useWarehouseWizad";
import { useWarehouseForm } from "./hooks/useWarehouseForm";

const { Option } = Select;

const CreateAdminWarehouse = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { loading,createWarehouse} = useWarehouseWizad();
  const [position, setPosition] = useState([10.8231, 106.6297]);

  const {
    addressOptions,
    fetchCoordinates,
    searchAddress
  } = useWarehouseForm();

  function ChangeMapView({ coords }) {
    const map = useMap();
    useEffect(() => {
      map.setView(coords, 15);
    }, [coords]);
    return null;
  }

  const createIcon = () => {
    const html = `
      <div class="marker-wrapper">
        <div class="radar-ring radar-active"></div>
        <div class="bounce">
          <svg width="36" height="48" viewBox="0 0 36 48">
            <path d="M18 0C8 0 0 8 0 18c0 13 18 30 18 30s18-17 18-30C36 8 28 0 18 0z" fill="#22c55e" />
            <circle cx="18" cy="18" r="7" fill="white"/>
            <circle cx="18" cy="18" r="4" fill="#22c55e"/>
          </svg>
        </div>
      </div>
    `;
    return L.divIcon({ className: "", html, iconSize: [36, 48], iconAnchor: [18, 48] });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createWarehouse(values);
      navigate("/admin/warehouse", { state: { internalNavigation: true } });
    } catch (err) {
      console.error(err);
      // Note: Error message and state loading are already handled perfectly by useWarehouseWizad!
    }
  };

  const handleFetchCoords = async () => {
    const address = form.getFieldValue("location");
    const coords = await fetchCoordinates(address);
    if (coords) {
      const [lat, lon] = coords;
      setPosition([lat, lon]);
      form.setFieldsValue({ latitude: lat, longitude: lon });
    }
  };

  const onSelectAddress = (value, option) => {
    const { lat, lon } = option;
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    setPosition([latNum, lonNum]);
    form.setFieldsValue({
      latitude: latNum,
      longitude: lonNum,
      location: value
    });
  };

  return (
    <div className="create-page">
      <div className="create-container">
        <div className="create-header">
          <div>
            <h1 className="create-title">Tạo Kho Hàng</h1>
          </div>
          <Button
            icon={<ArrowLeftOutlined />}
            className="back-button12"
            onClick={() => navigate("/admin/warehouse", { state: { internalNavigation: true } })}
          >
            Quay Lại
          </Button>
        </div>

        <Card className="form-card">
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <div className="form-grid">
              {/* LEFT FORM */}
              <div>
                <div className="section-title">Thông Tin Cơ Bản</div>
                <Form.Item name="name" label="Tên Kho Hàng" rules={[{ required: true, message: "Vui lòng nhập tên kho" }]}>
                  <Input placeholder="Nhập tên kho hàng" />
                </Form.Item>
                <Form.Item name="description" label="Mô Tả">
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item name="status" label="Trạng Thái" rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}>
                  <Select placeholder="Chọn trạng thái">
                    <Option value="ACTIVE">Hoạt động</Option>
                    <Option value="INACTIVE">Ngừng hoạt động</Option>
                    <Option value="MAINTAIN">Bảo trì</Option>
                    <Option value="CLOSE">Đóng cửa</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* RIGHT MAP */}
              <div>
                <div className="section-title">Vị Trí Kho</div>
                <div className="map-card">
                  <MapContainer
                    center={position}
                    zoom={15}
                    style={{ height: "360px", width: "100%" }}
                    whenReady={(mapInstance) => {
                      mapInstance.target.on("click", (e) => {
                        const { lat, lng } = e.latlng;
                        setPosition([lat, lng]);
                        form.setFieldsValue({ latitude: lat, longitude: lng });
                      });
                    }}
                  >
                    <TileLayer
                      attribution="&copy; OpenStreetMap"
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />
                    <ChangeMapView coords={position} />
                    <Marker
                      position={position}
                      draggable
                      icon={createIcon()}
                      eventHandlers={{
                        dragend: (e) => {
                          const latlng = e.target.getLatLng();
                          setPosition([latlng.lat, latlng.lng]);
                          form.setFieldsValue({ latitude: latlng.lat, longitude: latlng.lng });
                        }
                      }}
                    />
                  </MapContainer>
                </div>
              </div>
            </div>

            <div className="section-divider" />
            <div className="section-title">Địa Chỉ Kho</div>
            <Form.Item name="location" label="Địa Chỉ" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
              <AutoComplete
                options={addressOptions}
                onSearch={searchAddress}
                onSelect={onSelectAddress}
                style={{ width: "100%" }}
              >
                <Input
                  placeholder="Nhập địa chỉ"
                  addonAfter={<Button onClick={handleFetchCoords}>Tìm</Button>}
                />
              </AutoComplete>
            </Form.Item>

            <div className="coordinate-grid">
              <Form.Item name="latitude" label="Vĩ Độ">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="longitude" label="Kinh Độ">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </div>

            <div className="form-actions">
              <Button
                className="cancel-btn"
                onClick={() => navigate("/admin/warehouse", { state: { internalNavigation: true } })}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                className="create-btn"
                loading={loading}
                onClick={handleSubmit}
              >
                Tạo Kho Hàng
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateAdminWarehouse;