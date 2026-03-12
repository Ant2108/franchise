import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  message,
  InputNumber,
  AutoComplete,
} from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { createSupplier } from "./SupplierAPI/supplierApi";
import "./SupplierCreatePage.css";

const { Option } = Select;
const { TextArea } = Input;

const SupplierCreatePage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [position, setPosition] = useState([10.8231, 106.6297]);
  const [addressOptions, setAddressOptions] = useState([]);
  const debounceTimer = useRef(null);

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
        <div class="radar-ring radar-active"></div>
        <div class="bounce">
          <svg width="36" height="48" viewBox="0 0 36 48">
            <path
              d="M18 0C8 0 0 8 0 18c0 13 18 30 18 30s18-17 18-30C36 8 28 0 18 0z"
              fill="#22c55e"
            />
            <circle cx="18" cy="18" r="7" fill="white"/>
            <circle cx="18" cy="18" r="4" fill="#22c55e"/>
          </svg>
        </div>
      </div>
    `;

    return L.divIcon({
      className: "",
      html,
      iconSize: [36, 48],
      iconAnchor: [18, 48],
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.name,
        contactName: values.contactName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        latitude: Number(values.latitude),
        longitude: Number(values.longitude),
        status: values.status,
      };

      console.log("Payload gửi lên BE:", payload);

      setLoading(true);
      await createSupplier(payload);

      message.success("Tạo supplier thành công!");
      navigate("/admin/supplier");
    } catch (err) {
      console.error(err?.response?.data || err);
      message.error("Tạo supplier thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoordinates = async (address) => {
    if (!address) {
      message.warning("Vui lòng nhập địa chỉ");
      return;
    }

    try {
      const query = `${address}, Vietnam`;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=vn&limit=1`
      );

      const data = await res.json();

      if (!data || data.length === 0) {
        message.error("Không tìm thấy địa chỉ");
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      setPosition([lat, lon]);

      form.setFieldsValue({
        latitude: lat,
        longitude: lon,
      });

      message.success("Đã tìm thấy vị trí");
    } catch (err) {
      console.error(err);
      message.error("Không thể lấy tọa độ");
    }
  };

  const searchAddress = (value) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      if (!value || value.length < 3) {
        setAddressOptions([]);
        return;
      }

      try {
        const query = `${value}, Vietnam`;

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&countrycodes=vn&limit=5`
        );

        const data = await res.json();

        const options = data.map((item) => ({
          value: item.display_name,
          label: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        }));

        setAddressOptions(options);
      } catch (err) {
        console.error(err);
      }
    }, 500);
  };

  const onSelectAddress = (value, option) => {
    const lat = option.lat;
    const lon = option.lon;

    setPosition([lat, lon]);

    form.setFieldsValue({
      address: value,
      latitude: lat,
      longitude: lon,
    });
  };

  return (
    <div className="create-page">
      <div className="create-hero">
        <div className="hero-content">
          <Button
            icon={<ArrowLeftOutlined />}
            className="back-button"
            onClick={() => navigate("/admin/supplier")}
          >
            Trở Về Danh Sách
          </Button>

          <h1>Tạo Supplier Mới</h1>
          <p>Điền thông tin để tạo supplier mới</p>
        </div>
      </div>

      <div className="create-container">
        <Card className="form-card">
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              status: "ACTIVE",
              latitude: position[0],
              longitude: position[1],
            }}
          >
            <div className="form-grid">
              <div className="form-left">
                <div className="section-title">Thông Tin Cơ Bản</div>

                <Form.Item
                  name="name"
                  label="Tên Supplier"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input placeholder="Nhập tên supplier" />
                </Form.Item>

                <Form.Item
                  name="contactName"
                  label="Người Liên Hệ"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input placeholder="Nhập tên người liên hệ" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Required" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Số Điện Thoại"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>

                <Form.Item
                  name="status"
                  label="Trạng Thái"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Select placeholder="Chọn trạng thái">
                    <Option value="ACTIVE">Active</Option>
                    <Option value="INACTIVE">Inactive</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="form-right">
                <div className="section-title">Bản Đồ Vị Trí</div>

                <div className="map-card">
                  <MapContainer
                    center={position}
                    zoom={15}
                    style={{ height: "360px", width: "100%" }}
                    whenCreated={(map) => {
                      map.on("click", (e) => {
                        const { lat, lng } = e.latlng;

                        setPosition([lat, lng]);

                        form.setFieldsValue({
                          latitude: lat,
                          longitude: lng,
                        });
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
                      draggable={true}
                      icon={createIcon()}
                      eventHandlers={{
                        dragend: (e) => {
                          const latlng = e.target.getLatLng();

                          setPosition([latlng.lat, latlng.lng]);

                          form.setFieldsValue({
                            latitude: latlng.lat,
                            longitude: latlng.lng,
                          });
                        },
                      }}
                    />
                  </MapContainer>
                </div>
              </div>
            </div>

            <div className="section-divider" />

            <div className="section-title">Vị Trí Supplier</div>

       <Form.Item
  label="Địa Chỉ"
  required
  style={{ marginBottom: 16 }}
>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 12 }}>
    <Form.Item
      name="address"
      noStyle
      rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
    >
      <AutoComplete
        options={addressOptions}
        onSearch={searchAddress}
        onSelect={onSelectAddress}
        style={{ width: "100%" }}
        placeholder="Nhập địa chỉ"
        filterOption={false}
      />
    </Form.Item>

    <Button onClick={() => fetchCoordinates(form.getFieldValue("address"))}>
      Tìm Tọa Độ
    </Button>
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
              <Button
                className="cancel-btn"
                onClick={() => navigate("/admin/supplier")}
              >
                Hủy Bỏ
              </Button>

              <Button
                type="primary"
                className="create-btn"
                loading={loading}
                onClick={handleSubmit}
              >
                Tạo Supplier
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default SupplierCreatePage;