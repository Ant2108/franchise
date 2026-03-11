import "../../styles/warehouse.css";
import "../../styles/premium-warehouse.css";
import { Outlet } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import WarehouseSidebar from "./WarehouseSidebar";

const WarehouseLayout = () => {
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
                <strong>Aroma Central Hub</strong>
                <p>Quận 1, TP. HCM</p>
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

export default WarehouseLayout;