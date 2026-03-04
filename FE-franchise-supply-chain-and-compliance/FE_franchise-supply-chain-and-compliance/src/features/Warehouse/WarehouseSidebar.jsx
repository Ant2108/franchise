import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Truck,
  Package,
  BarChart3
} from "lucide-react";

const WarehouseSidebar = () => {
  return (
    <aside className="wh-sidebar">

      <div className="wh-logo">
        <div className="cube" />
        <span>WarehouseOS</span>
      </div>

      <nav className="wh-menu">
        <NavLink to="/warehouse" end>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/warehouse/inventory">
          <Boxes size={18} />
          <span>Inventory</span>
        </NavLink>

        

        <NavLink to="/warehouse/shipments">
          <Truck size={18} />
          <span>Xuất Kho</span>
        </NavLink>

        <NavLink to="/warehouse/inbound">
          <Truck size={18} />
          <span>Đặt Hàng</span>
        </NavLink>


        <NavLink to="/warehouse/receiving">
          <Package size={18} />
          <span>Nhập Kho</span>
        </NavLink>

        <NavLink to="/warehouse/reports">
          <BarChart3 size={18} />
          <span>Reports</span>
        </NavLink>
      </nav>

      <div className="wh-admin">
        <div className="wh-avatar">A</div>
        <div>
          <strong>Admin User</strong>
          <p>admin@warehouse.com</p>
        </div>
      </div>

    </aside>
  );
};

export default WarehouseSidebar;