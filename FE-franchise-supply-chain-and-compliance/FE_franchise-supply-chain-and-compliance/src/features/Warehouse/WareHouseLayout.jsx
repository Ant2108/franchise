import "../../styles/warehouse.css";
import { Outlet } from "react-router-dom";
import { Bell } from "lucide-react";
import WarehouseSidebar from "./WarehouseSidebar";

const WarehouseLayout = () => {
  return (
    <div className="wh-layout">

      <WarehouseSidebar />

      <div className="wh-main">
        <header className="wh-header">
          <input
            className="wh-search"
            placeholder="Search inventory, orders..."
          />

          <div className="wh-header-right">
            <Bell size={18} />
            <div>
              <strong>Main Warehouse</strong>
              <p>Los Angeles, CA</p>
            </div>
          </div>
        </header>

        <div className="wh-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default WarehouseLayout;