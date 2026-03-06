import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WareHouseAdminAPI from "./AdminWareHousePageAPI/AdminWareHousePageAPI";
import "./UpdateAdminWarehousePage.css";
import { Button } from "antd";
import {
  DashboardOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import {getStatusLabel, getStatusClass} from "../../../utils/statusUtils";
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
      } catch (err) {
        setError("Lỗi khi tải chi tiết kho hàng",err);
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

      navigate("/admin/warehouse", {
        state: { internalNavigation: true },
      });

    } catch (err) {
      alert("Cập nhật thất bại!",err);
    } finally {
      setSaving(false);
    }
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
            onClick={() => navigate("/admin/warehouse", {
              state: { internalNavigation: true },
            })}
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
              <h2><span className={`status ${getStatusClass(formData.status)}`}>
                {getStatusLabel(formData.status)}
              </span></h2>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="section-card">
            <div className="section-header">Thông Tin Cơ Bản</div>
            <div className="section-body grid-2">
              <div>
                <label>* Tên Kho</label>
                <input name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="full-width">
                <label>* Mô Tả</label>
                <textarea name="description" value={formData.description} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="section-card">
            <div className="section-header">Thông Tin Vị Trí</div>
            <div className="section-body">
              <label>* Địa Chỉ</label>
              <input name="location" value={formData.location} onChange={handleChange} required />
              </div>
              <div className="section-body grid-2">
              <div>
                <label>* Vĩ Độ</label>
                <input name="latitude" value={formData.latitude} onChange={handleChange} type="number" step="0.000001" required />
              </div>

              <div>
                <label>* Kinh Độ</label>
                <input name="longitude" value={formData.longitude} onChange={handleChange} type="number" step="0.000001" required />
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
            <button type="button" className="btn-cancel" onClick={() => navigate("/admin/warehouse", {
              state: { internalNavigation: true },
            })}>
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