import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminPage from "./layouts/AdminPage";
import SupplierAdminManage from "./features/Supplier/SupplierAdminManage";
import SupplierAdminCategory from "./features/Supplier/SupplierAdminCategory";
import InboundList from "./features/Inbound/InboundList";
import OutboundList from "./features/Outbound/OutboundList";
import AdminWareHousePage from "./features/Warehouse/AdminManager/AdminWareHousePage";
import WarehouseLayout from "./features/Warehouse/WareHouseLayout";
import WareHouseDashboard from "./features/Warehouse/WareHouseDashboard";
import WareHouseInventory from "./features/Warehouse/WareHouseInventory";
import WareHouseOrders from "./features/Warehouse/WareHouseOrders";
import WareHouseShipments from "./features/Warehouse/WareHouseShipments";
import WareHouseReceiving from "./features/Warehouse/WareHouseReceiving";
import WareHouseReports from "./features/Warehouse/WareHouseReports";
import UpdateAdminWarehousePage from "./features/Warehouse/AdminManager/UpdateAdminWarehousePage";
import CreateAdminWarehouse from "./features/Warehouse/AdminManager/CreateAdminWarehouse";
import "leaflet/dist/leaflet.css";
import "./index.css";
import IngredientManage from "./features/Ingredient/IngredientManage";
import InboundPage from "./features/Inbound/components/InboundPage";
import CartPage from "./features/Inbound/components/CartPage";
import HomePage from "./layouts/HomePage/HomePage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* ================= ADMIN ================= */}

        <Route path="/admin" element={<AdminPage />}>
          <Route path="supplier" element={<SupplierAdminManage />} />
          <Route path="supplier-category" element={<SupplierAdminCategory />} />
          <Route path="inbound" element={<InboundList />} />
          <Route path="outbound" element={<OutboundList />} />
          <Route path="warehouse" element={<AdminWareHousePage />} />
          <Route path="warehouse/update/:id" element={<UpdateAdminWarehousePage />} />
          <Route path="warehouse/create" element={<CreateAdminWarehouse />} />
          <Route path="ingredient" element={< IngredientManage />} />
        </Route>

        {/* ================= WAREHOUSE ================= */}
        <Route path="/warehouse" element={<WarehouseLayout />}>
          <Route index element={<WareHouseDashboard />} />
          <Route path="inventory" element={<WareHouseInventory />} />
          <Route path="orders" element={<WareHouseOrders />} />
          <Route path="shipments" element={<WareHouseShipments />} />
          <Route path="receiving" element={<WareHouseReceiving />} />
          <Route path="reports" element={<WareHouseReports />} />
          <Route path="inbound" element={<InboundPage />} />
          <Route path="cart" element={<CartPage />} />
        </Route>

        {/* Global 404 */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />

      </Routes>
    </Router>
  );
}

export default App;