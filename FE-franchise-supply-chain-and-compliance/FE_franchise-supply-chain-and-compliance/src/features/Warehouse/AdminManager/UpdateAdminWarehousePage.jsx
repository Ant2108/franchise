import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WareHouseAdminAPI from "./AdminWareHousePageAPI/AdminWareHousePageAPI";
import "./UpdateAdminWarehousePage.css";
import { Button, AutoComplete, Input, message } from "antd";
import {
  DashboardOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { getStatusLabel, getStatusClass } from "../../../utils/statusUtils";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";

function ChangeMapView({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords[0] && coords[1]) {
      map.setView(coords, 15);
    }
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

export default function UpdateAdminWarehousePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    location: "",
    description: "",
    status: "ACTIVE",
    longitude: "",
    latitude: "",
  });

  const [position, setPosition] = useState([16.047079, 108.20623]);
  const [addressOptions, setAddressOptions] = useState([]);
  const debounceTimer = useRef(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await WareHouseAdminAPI.getWarehouseDetail(id);

        setFormData({
          code: res?.code || "",
          name: res?.name || "",
          location: res?.location || "",
          description: res?.description || "",
          status: res?.status || "ACTIVE",
          longitude: res?.longitude || "",
          latitude: res?.latitude || "",
        });

        if (res?.latitude && res?.longitude) {
          setPosition([parseFloat(res.latitude), parseFloat(res.longitude)]);
        }
      } catch (err) {
        setError("Lỗi khi tải chi tiết kho hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      location: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...formData,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      };
      await WareHouseAdminAPI.updateWarehouse(id, payload);
      message.success("Cập nhật thành công!");
      navigate("/admin/warehouse", {
        state: { internalNavigation: true },
      });
    } catch (err) {
      message.error("Cập nhật thất bại!");
    } finally {
      setSaving(false);
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
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lon,
      }));
      message.success("Đã tìm thấy vị trí");
    } catch (err) {
      message.error("Không thể lấy tọa độ");
    }
  };

  const searchAddress = (value) => {
    handleLocationChange(value);

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
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lon,
      location: value,
    }));
  };

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (error) return <p style={{ padding: 40 }}>{error}</p>;

  return (
    <div className="warehouseupdate-page">
      {/* HEADER */}
      <div className="page-header">
        <div className="header-inner">
          <div className="header-top">
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
          </div>
          <h1>
            Cập Nhật Thông Tin Kho Hàng <span className="code-pill">{formData.code}</span>
          </h1>
          <p>Cập nhật thông tin và cài đặt kho hàng</p>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="page-content">
        {/* SUMMARY */}
        <div className="summary-card">
          <div className="summary-item">
            <div className="summary-icon purple">
              <DashboardOutlined />
            </div>
            <div>
              <p>Mã Kho</p>
              <h2>{formData.code}</h2>
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-icon blue">
              <DatabaseOutlined />
            </div>
            <div>
              <p>Tên Kho</p>
              <h2>{formData.name}</h2>
            </div>
          </div>

          <div className="summary-item">
            <div className="summary-icon green">
              <CheckCircleOutlined />
            </div>
            <div>
              <p>Trạng Thái</p>
              <h2>
                <span className={`status ${getStatusClass(formData.status)}`}>
                  {getStatusLabel(formData.status)}
                </span>
              </h2>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Thông tin cơ bản */}
          <div className="section-card">
            <div className="section-header">Thông Tin Cơ Bản</div>
            <div className="section-body grid-2">
              <div>
                <label>* Tên Kho</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="full-width">
                <label>* Mô Tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Vị Trí */}
          <div className="section-card">
            <div className="section-header">Bản Đồ Vị Trí</div>
            <div className="section-body" style={{ paddingBottom: 0 }}>
              <div className="map-card" style={{ height: "360px", width: "100%", borderRadius: "12px", overflow: "hidden", marginBottom: "20px" }}>
                <MapContainer
                  center={position}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                  whenCreated={(map) => {
                    map.on("click", (e) => {
                      const { lat, lng } = e.latlng;
                      setPosition([lat, lng]);
                      setFormData((prev) => ({
                        ...prev,
                        latitude: lat,
                        longitude: lng,
                      }));
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
                        setFormData((prev) => ({
                          ...prev,
                          latitude: latlng.lat,
                          longitude: latlng.lng,
                        }));
                      },
                    }}
                  />
                </MapContainer>
              </div>
            </div>

            <div className="section-body">
              <div style={{ marginBottom: "16px" }}>
                <label>* Địa Chỉ</label>
                <AutoComplete
                  options={addressOptions}
                  onSearch={searchAddress}
                  onSelect={onSelectAddress}
                  value={formData.location}
                  style={{ width: "100%" }}
                >
                  <Input
                    name="location"
                    placeholder="Nhập địa chỉ"
                    onChange={handleChange}
                    addonAfter={
                      <Button onClick={() => fetchCoordinates(formData.location)}>
                        Tìm Tọa Độ
                      </Button>
                    }
                  />
                </AutoComplete>
              </div>

              <div className="grid-2">
                <div>
                  <label>* Vĩ Độ</label>
                  <input
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    type="number"
                    step="0.000001"
                    required
                  />
                </div>

                <div>
                  <label>* Kinh Độ</label>
                  <input
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    type="number"
                    step="0.000001"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header">Trạng Thái</div>
            <div className="section-body grid-2">
              <div>
                <label>* Trạng Thái</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="ACTIVE">Hoạt Động</option>
                  <option value="INACTIVE">Không Hoạt Động</option>
                  <option value="MAINTAIN">Bảo Trì</option>
                  <option value="CLOSE">Đóng</option>
                </select>
              </div>
            </div>
          </div>

          <div className="action-area">
            <button
              type="button"
              className="btn-cancel"
              onClick={() =>
                navigate("/admin/warehouse", {
                  state: { internalNavigation: true },
                })
              }
            >
              Hủy Bỏ
            </button>

            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "Đang Lưu..." : "Lưu Thay Đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}