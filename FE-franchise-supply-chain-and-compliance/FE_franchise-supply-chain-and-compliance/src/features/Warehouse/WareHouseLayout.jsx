import "../../styles/warehouse.css";
import "../../styles/premium-warehouse.css";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { MapPin } from "lucide-react";
import WarehouseSidebar from "./WarehouseSidebar";
import { useState, useEffect, useCallback } from "react";
import { getCookie, setCookie } from "../../utils/cookieUtils";
import WareHouseAdminAPI from "./AdminManager/AdminWareHousePageAPI/AdminWareHousePageAPI";
import cartApi from "../Inbound/InboundAPI/cartApi";
import { Badge, Button, Tooltip, Typography } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import apiClient from "../../services/axiosClient";

const { Title, Text } = Typography;

export default function WarehouseLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  // const warehouseId = localStorage.getItem("warehouse_id"); // Original line, now replaced by getCookie logic

  const fetchWarehouse = useCallback(async () => {
    try {
      // 1. Luôn lấy thông tin user hiện tại để đảm bảo chính xác
      const userData = await apiClient.get('/auth/me');
      const user = userData.result || userData;
      
      if (!user || !user.id) {
        throw new Error("Không tìm thấy thông tin người dùng");
      }

      // 2. Lấy kho dựa trên ID của manager (user hiện tại)
      const warehouseRes = await apiClient.get(`/warehouses/by-manager/${user.id}`);
      
      // Xử lý trường hợp trả về mảng hoặc object đơn lẻ
      let warehouse = null;
      if (Array.isArray(warehouseRes)) {
        warehouse = warehouseRes[0];
      } else if (warehouseRes?.result && Array.isArray(warehouseRes.result)) {
        warehouse = warehouseRes.result[0];
      } else {
        warehouse = warehouseRes.result || warehouseRes;
      }

      if (warehouse && warehouse.id) {
        // 3. Cập nhật Cookie để các trang khác (Reports, Inventory) dùng chung
        setCookie('warehouse_id', warehouse.id, 7);
        setSelectedWarehouse(warehouse);
      } else {
        setSelectedWarehouse({ name: "Không có kho", address: "Tài khoản chưa được gán quản lý kho nào" });
      }
    } catch (error) {
      console.error("Fetch Warehouse Error:", error);
      const msg = error.response?.data?.message || error.message;
      setSelectedWarehouse({ name: "Lỗi kết nối", address: msg || "Không thể tải thông tin kho" });
    }
  }, []); // Dependency array is empty as currentId is determined internally

  const fetchCart = useCallback(async () => {
    try {
      const data = await cartApi.getCart();
      setCartCount(data?.totalItems ?? 0);
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    fetchWarehouse();
  }, [fetchWarehouse]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const onCartUpdated = () => fetchCart();
    window.addEventListener("warehouse-cart-updated", onCartUpdated);
    return () => window.removeEventListener("warehouse-cart-updated", onCartUpdated);
  }, [fetchCart]);

  return (
    <div className="pm-layout">
      <WarehouseSidebar />
      <div className="pm-main">
        <header className="pm-header">
          {location.pathname === "/warehouse/inbound" && (
            <div className="pm-header-left">
              <Title level={3} style={{ margin: 0, color: "#1677ff" }}>
                Inbound Suppliers
              </Title>
              <Text type="secondary">Franchise Supply Marketplace</Text>
            </div>
          )}
          <div className="pm-header-right">
            <Tooltip title="Xem giỏ hàng">
              <Badge count={cartCount} overflowCount={99}>
                <Button
                  type="text"
                  icon={<ShoppingCartOutlined style={{ fontSize: 22, color: "#1677ff" }} />}
                  onClick={() => navigate("/warehouse/cart")}
                  className="pm-header-cart-btn"
                />
              </Badge>
            </Tooltip>
            <div className="pm-location-badge">
              <MapPin size={16} />
              <div>
                <strong>{selectedWarehouse?.name || "Loading..."}</strong>
              </div>
            </div>
          </div>
        </header>

        <main className="pm-content">
          <Outlet context={{ selectedWarehouse }} />
        </main>
      </div>
    </div>
  );
};

