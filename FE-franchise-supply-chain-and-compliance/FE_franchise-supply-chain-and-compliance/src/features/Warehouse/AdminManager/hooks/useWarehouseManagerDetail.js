import { useState, useEffect, useCallback } from "react";
import { AdminWareHouseManager } from "../AdminWareHousePageAPI/AdminWareHouseManager";
import WareHouseAdminAPI from "../AdminWareHousePageAPI/AdminWareHousePageAPI";

export const useWarehouseManagerDetail = (id) => {
  const [manager, setManager] = useState(null);
  const [allWarehouses, setAllWarehouses] = useState([]);
  const [assignedWarehouse, setAssignedWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const [managerRes, warehousesRes] = await Promise.all([
        AdminWareHouseManager.getWarehouseManagerDetail(id),
        WareHouseAdminAPI.getAllWarehouses(),
      ]);

      const warehousesList = Array.isArray(warehousesRes) ? warehousesRes : [];
      setAllWarehouses(warehousesList);

      const selectedManager = managerRes?.result;

      if (selectedManager) {
        setManager({
          id: selectedManager.id,
          firstName: selectedManager.firstName || "N/A",
          lastName: selectedManager.lastName || "N/A",
          fullName: `${selectedManager.firstName || ""} ${selectedManager.lastName || ""}`.trim(),
          email: selectedManager.email || "N/A",
          phone: selectedManager.phoneNumber || "N/A",
          status: selectedManager.status?.toLowerCase() || "inactive",
          role: selectedManager.roles?.[0]?.name || "Warehouse Manager",
          createdAt: selectedManager.createdAt || "N/A",
        });

        // Find assigned warehouse
        const assigned = warehousesList.find((w) => String(w.managerId) === String(id));
        setAssignedWarehouse(assigned);
      } else {
        setError("Manager not found");
      }
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { manager, allWarehouses, assignedWarehouse, loading, error, refreshData: fetchData };
};
