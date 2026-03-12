import "../../styles/warehouse.css";
import "../../styles/premium-warehouse.css";
import { Outlet } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import WarehouseSidebar from "./WarehouseSidebar";
import { useState, useEffect } from "react";
import WareHouseAdminAPI from "./AdminManager/AdminWareHousePageAPI/AdminWareHousePageAPI"



export default function WarehouseLayout() {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const id = "11111111-1111-1111-1111-111111111111";
  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const res = await WareHouseAdminAPI.getWarehouseDetail(id);
        setSelectedWarehouse(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchWarehouse();
  }, [id]);
  return (
    <div className="pm-layout">
      <WarehouseSidebar />
      <div className="pm-main">
        <header className="pm-header">
          <div className="pm-search-box">
            <Search size={18} />
            <input
              className="pm-search-input"
              placeholder="Search inventory, orders, products..."
            />
          </div>

          <div className="pm-header-right">
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

