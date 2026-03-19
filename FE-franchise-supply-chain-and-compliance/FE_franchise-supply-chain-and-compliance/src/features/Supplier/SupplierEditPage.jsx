import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  message,
  InputNumber,
  AutoComplete,
  Spin,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { getSupplierDetail, updateSupplier } from "./SupplierAPI/supplierApi";
import "./SupplierCreatePage.css";

// Import the custom hook
import { useSupplierForm } from "./hooks/useSupplierForm";
import { useImageUpload } from "../../../src/hooks/useImageUpload";
import { Upload } from "antd";

const { Option } = Select;
const { TextArea } = Input;

const SupplierEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [position, setPosition] = useState([10.8231, 106.6297]);
  const [loadingDetail, setLoadingDetail] = useState(true);

  const {
    loading,
    setLoading,
    addressOptions,
    fetchCoordinates,
    searchAddress
  } = useSupplierForm();

  const [imageUrl, setImageUrl] = useState(null);
  const { fileList, onChange, beforeUpload, getFileForPayload } = useImageUpload(imageUrl);

  function ChangeMapView({ coords }) {
    const map = useMap();
    useEffect(() => {
      map.setView(coords, 15);
    }, [coords, map]);
    return null;
  }

  const createIcon = () => {
    const html = `
      <div class="marker-wrapper">
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

  useEffect(() => {
    const loadSupplierDetail = async () => {
      try {
        setLoadingDetail(true);
        const data = await getSupplierDetail(id);
        form.setFieldsValue({
          name: data.name,
          contactName: data.contactName,
          email: data.email,
          phone: data.phone,
          description: data.description,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          status: data.status || "ACTIVE",
          image: data.image,
        });

        const lat = Number(data.latitude);
        const lon = Number(data.longitude);
        if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
          setPosition([lat, lon]);
        }
        
        // Truyền ảnh từ Backend xuống hook ImageUpload
        setImageUrl(data.imageUrl || data.image || null);
      } catch (error) {
        message.error("Không tải được thông tin supplier");
      } finally {
        setLoadingDetail(false);
      }
    };
    loadSupplierDetail();
  }, [id, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("contactName", values.contactName);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("latitude", values.latitude);
      formData.append("longitude", values.longitude);
      formData.append("status", values.status);
      if (values.description) formData.append("description", values.description);

      const newImageFile = getFileForPayload();
      if (newImageFile) {
        formData.append("image", newImageFile);
      }

      setLoading(true);
      await updateSupplier(id, formData);
      message.success("Cập nhật supplier thành công!");
      navigate(`/admin/supplier/${id}/view`);
    } catch (err) {
      message.error("Cập nhật supplier thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchCoords = async () => {
    const address = form.getFieldValue("address");
    const coords = await fetchCoordinates(address);
    if (coords) {
      setPosition(coords);
      form.setFieldsValue({ latitude: coords[0], longitude: coords[1] });
    }
  };

  const onSelectAddress = (value, option) => {
    const { lat, lon } = option;
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    setPosition([latNum, lonNum]);
    form.setFieldsValue({
      address: value,
      latitude: latNum,
      longitude: lonNum,
    });
  };

  if (loadingDetail) {
    return (
      <div className="create-page">
        <div className="create-container" style={{ paddingTop: 80 }}>
          <Card className="form-card">
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
              <Spin size="large" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="create-page">
      <div className="create-hero">
        <div className="hero-content">
          <Button
            icon={<ArrowLeftOutlined />}
            className="back-button"
            onClick={() => navigate(`/admin/supplier/${id}/view`)}
          >
            Trở Về
          </Button>
          <h1>Chỉnh Sửa Supplier</h1>
          <p>Cập nhật thông tin supplier</p>
        </div>
      </div>

      <div className="create-container">
        <Card className="form-card">
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <div className="form-grid">
              <div className="form-left">
                <div className="section-title">Thông Tin Cơ Bản</div>
                <Form.Item name="name" label="Tên Supplier" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
                  <Input placeholder="Nhập tên supplier" />
                </Form.Item>
                <Form.Item name="contactName" label="Người Liên Hệ" rules={[{ required: true, message: "Vui lòng nhập người liên hệ" }]}>
                  <Input placeholder="Nhập tên người liên hệ" />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập email" }, { type: "email", message: "Email không hợp lệ" }]}>
                  <Input placeholder="Nhập email" />
                </Form.Item>
                <Form.Item name="phone" label="Số Điện Thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item name="description" label="Mô Tả">
                  <TextArea rows={3} placeholder="Nhập mô tả" />
                </Form.Item>
                <Form.Item name="status" label="Trạng Thái" rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}>
                  <Select placeholder="Chọn trạng thái">
                    <Option value="ACTIVE">Active</Option>
                    <Option value="INACTIVE">Inactive</Option>
                  </Select>
                </Form.Item>
                <div style={{ marginTop: 16 }}>
                  <label>Hình Ảnh Supplier (Không bắt buộc)</label>
                  <div style={{ marginTop: 8 }}>
                    <Upload
                      listType="picture-card"
                      maxCount={1}
                      fileList={fileList}
                      onChange={onChange}
                      beforeUpload={beforeUpload}
                    >
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                      </div>
                    </Upload>
                  </div>
                </div>
              </div>

              <div className="form-right">
                <div className="section-title">Bản Đồ Vị Trí</div>
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
                    <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    <ChangeMapView coords={position} />
                    <Marker
                      position={position}
                      draggable={true}
                      icon={createIcon()}
                      eventHandlers={{
                        dragend: (e) => {
                          const latlng = e.target.getLatLng();
                          setPosition([latlng.lat, latlng.lng]);
                          form.setFieldsValue({ latitude: latlng.lat, longitude: latlng.lng });
                        },
                      }}
                    />
                  </MapContainer>
                </div>
              </div>
            </div>

            <div className="section-divider" />
            <div className="section-title">Vị Trí Supplier</div>
            <Form.Item label="Địa Chỉ" required style={{ marginBottom: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 12 }}>
                <Form.Item name="address" noStyle rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
                  <AutoComplete
                    options={addressOptions}
                    onSearch={searchAddress}
                    onSelect={onSelectAddress}
                    style={{ width: "100%" }}
                    placeholder="Nhập địa chỉ"
                    allowClear
                  />
                </Form.Item>
                <Button onClick={handleFetchCoords}>Tìm Tọa Độ</Button>
              </div>
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
              <Button onClick={() => navigate(`/admin/supplier/${id}/view`)}>Hủy Bỏ</Button>
              <Button type="primary" loading={loading} onClick={handleSubmit}>Cập Nhật Supplier</Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default SupplierEditPage;