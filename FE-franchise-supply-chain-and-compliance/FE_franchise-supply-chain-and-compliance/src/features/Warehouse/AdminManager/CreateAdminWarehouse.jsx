import React, { useState,useEffect, useRef  } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Progress,
  message,
  InputNumber,
  AutoComplete
  
} from "antd";
import { useNavigate } from "react-router-dom";
import {ArrowLeftOutlined} from "@ant-design/icons";
import "./CreateAdminWarehouse.css";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import WareHouseAdminAPI from "./AdminWareHousePageAPI/AdminWareHousePageAPI";

const { Option } = Select;

const CreateAdminWarehouse = () => {
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
    }, [coords]);

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

        // remove code nếu có
        const payload = {
          name: values.name,
          description: values.description,
          location: values.location,
          latitude: values.latitude,
          longitude: values.longitude,
          status: values.status
        };

        console.log("Payload gửi lên BE:", payload);

        setLoading(true);

        await WareHouseAdminAPI.createWarehouse(payload);

        message.success("Tạo kho hàng thành công!");

        navigate("/admin/warehouse", {
          state: { internalNavigation: true }
        });

      } catch (err) {
        console.error(err?.response?.data);
        message.error("Tạo kho hàng thất bại!");
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
    const query = address + ", Vietnam";

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn&limit=1`
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

      const query = value + ", Vietnam";

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn&limit=5`
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
    latitude: lat,
    longitude: lon,
    location: value
  });
};

return (
  <div className="create-page">

    {/* HEADER */}
    <div className="create-hero">
      <div className="hero-content">

        <Button
          icon={<ArrowLeftOutlined />}
          className="back-button"
          onClick={() =>
            navigate("/admin/warehouse", {
              state: { internalNavigation: true },
            })
          }
        >
          Trở Về Danh Sách
        </Button>

        <h1>Tạo Kho Hàng Mới</h1>
        <p>Điền thông tin để tạo kho hàng mới</p>

      </div>
    </div>


    <div className="create-container">

      <Card className="form-card">

        <Form form={form} layout="vertical">

          {/* GRID TOP */}
          <div className="form-grid">

            {/* LEFT */}
            <div className="form-left">

              <div className="section-title">
                Thông Tin Cơ Bản
              </div>

              <Form.Item
                name="name"
                label="Tên Kho Hàng"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="Nhập tên kho hàng" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Mô Tả"
              >
                <Input.TextArea rows={3} />
              </Form.Item>

              <Form.Item
                name="status"
                label="Trạng Thái"
                rules={[{ required: true, message: "Required" }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="ACTIVE">Active</Option>
                  <Option value="INACTIVE">Inactive</Option>
                  <Option value="MAINTAIN">Maintain</Option>
                  <Option value="CLOSE">Close</Option>
                </Select>
              </Form.Item>

            </div>


            {/* RIGHT MAP */}
            <div className="form-right">

              <div className="section-title">
                Bản Đồ Vị Trí
              </div>

              <div className="map-card">

                <MapContainer
                  center={[16.047079, 108.20623]}
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

                        setPosition([
                          latlng.lat,
                          latlng.lng
                        ]);

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


          {/* DIVIDER */}
          <div className="section-divider" />


          {/* LOCATION */}
          <div className="section-title">
            Vị Trí Kho Hàng
          </div>


          <Form.Item
            name="location"
            label="Địa Chỉ"
            rules={[{ required: true, message: "Required" }]}
          >
            <AutoComplete
              options={addressOptions}
              onSearch={searchAddress}
              onSelect={onSelectAddress}
              style={{ width: "100%" }}
            >
              <Input
                placeholder="Nhập địa chỉ"
                addonAfter={
                  <Button
                    onClick={() =>
                      fetchCoordinates(form.getFieldValue("location"))
                    }
                  >
                    Tìm Tọa Độ
                  </Button>
                }
              />
            </AutoComplete>
          </Form.Item>


          <div className="coordinate-grid">

            <Form.Item
              name="latitude"
              label="Vĩ Độ"
            >
              <InputNumber
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name="longitude"
              label="Kinh Độ"
            >
              <InputNumber
                style={{ width: "100%" }}
              />
            </Form.Item>

          </div>


          {/* ACTIONS */}
          <div className="form-actions">

            <Button
              className="cancel-btn"
              onClick={() =>
                navigate("/admin/warehouse", {
                  state: { internalNavigation: true },
                })
              }
            >
              Hủy Bỏ
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