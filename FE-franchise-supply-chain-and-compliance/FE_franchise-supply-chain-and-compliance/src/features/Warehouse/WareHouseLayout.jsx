import "../../styles/warehouse.css";
import "../../styles/premium-warehouse.css";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { MapPin } from "lucide-react";
import WarehouseSidebar from "./WarehouseSidebar";
import { useState, useEffect, useCallback } from "react";
import WareHouseAdminAPI from "./AdminManager/AdminWareHousePageAPI/AdminWareHousePageAPI";
import cartApi from "../Inbound/InboundAPI/cartApi";
import { Badge, Button, Tooltip, Typography } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function WarehouseLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const id = "11111111-1111-1111-1111-111111111111";

  const fetchWarehouse = useCallback(async () => {
    try {
      const res = await WareHouseAdminAPI.getWarehouseDetail(id);
      setSelectedWarehouse(res);
    } catch (error) {
      console.log(error);
    }
  }, [id]);

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
                <p>{selectedWarehouse?.address || "Loading..."}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="pm-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

