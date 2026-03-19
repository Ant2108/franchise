import { useState, useEffect, useCallback, useRef } from "react";
import { getCookie } from "../../../../utils/cookieUtils";
import inventoryApi from "../../../Inventory/InventoryAPI/inventoryApi";
import inboundApi from "../../../Inbound/InboundAPI/inboundApi";
import outboundApi from "../../../Outbound/OutboundAPI/outboundApi";
import WareHouseInventoryLogAPI from "../AdminWareHousePageAPI/AdminWareHouseInventoryLogAPI";

export default function useWarehouseData(selectedWarehouse) {
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const [inventoryList, setInventoryList] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [inboundOrders, setInboundOrders] = useState([]);
  const [outboundOrders, setOutboundOrders] = useState([]);
  const [inventoryLogs, setInventoryLogs] = useState([]);

  const isFetchingRef = useRef(false); 

  const warehouseId =
    selectedWarehouse?.id || getCookie("warehouse_id");

  const fetchAllData = useCallback(async () => {
    if (!warehouseId) {
      setLoading(false);
      setIsLoaded(true);
      return;
    }

    // 🚫 CHẶN LOOP
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      setLoading(true);

      const [
        invRes,
        lowStockRes,
        inboundRes,
        outboundRes,
        logsRes,
      ] = await Promise.allSettled([
        inventoryApi.getAll(),
        inventoryApi.getLowStock(warehouseId),
        inboundApi.getOrders(),
        outboundApi.getOrders(),
        WareHouseInventoryLogAPI.getInventoryLogs(warehouseId),
      ]);

      const extract = (res) =>
        res.status === "fulfilled"
          ? Array.isArray(res.value)
            ? res.value
            : res.value?.result || []
          : [];

      setInventoryList(extract(invRes));
      setLowStockItems(extract(lowStockRes));
      setInboundOrders(extract(inboundRes));
      setOutboundOrders(extract(outboundRes));
      setInventoryLogs(extract(logsRes));

    } catch (err) {
      console.error("Fetch dashboard error:", err);
    } finally {
      setLoading(false);
      setIsLoaded(true);
      isFetchingRef.current = false; 
    }
  }, [warehouseId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    loading,
    isLoaded,
    fetchAllData,
    inventoryList,
    lowStockItems,
    inboundOrders,
    outboundOrders,
    inventoryLogs,
  };
}