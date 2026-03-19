import { useState, useEffect, useMemo, useCallback } from "react";
import { getCookie } from "../../../../utils/cookieUtils";
import inventoryApi from "../../../Inventory/InventoryAPI/inventoryApi";
import inboundApi from "../../../Inbound/InboundAPI/inboundApi";
import outboundApi from "../../../Outbound/OutboundAPI/outboundApi";
import WareHouseInventoryLogAPI from "../AdminWareHousePageAPI/AdminWareHouseInventoryLogAPI";

export default function useWarehouseDashboard(selectedWarehouse) {
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const [inventoryList, setInventoryList] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [inboundOrders, setInboundOrders] = useState([]);
  const [outboundOrders, setOutboundOrders] = useState([]);
  const [inventoryLogs, setInventoryLogs] = useState([]);

  const warehouseId =
    selectedWarehouse?.id || getCookie("warehouse_id");

  const fetchAllData = useCallback(async () => {
    if (!warehouseId) {
      setLoading(false);
      setIsLoaded(true);
      return;
    }

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
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
      setIsLoaded(true); // ✅ FIX
    }
  }, [warehouseId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ===== METRICS =====
  const totalQty = useMemo(() => {
    return inventoryList.reduce(
      (s, i) => s + (i.quantityOnHand || 0),
      0
    );
  }, [inventoryList]);

  const totalItemsCount = inventoryList.length;

  const activeInbound = useMemo(
    () =>
      inboundOrders.filter(
        (o) =>
          o.status !== "COMPLETED" &&
          o.status !== "CANCELLED"
      ),
    [inboundOrders]
  );

  const activeOutbound = useMemo(
    () =>
      outboundOrders.filter(
        (o) =>
          o.status !== "COMPLETED" &&
          o.status !== "CANCELLED"
      ),
    [outboundOrders]
  );

  const totalActiveOrders =
    activeInbound.length + activeOutbound.length;

  const lowStockCount = lowStockItems.length;
  const totalInboundCount = inboundOrders.length;

  // ===== CHART =====
  const pieChartData = useMemo(() => {
    const sorted = [...inventoryList].sort(
      (a, b) => (b.quantityOnHand || 0) - (a.quantityOnHand || 0)
    );

    const top = sorted.slice(0, 4);
    const other = sorted.slice(4);

    const data = top.map((i) => ({
      name: i.ingredient?.name || "Unknown",
      value: i.quantityOnHand || 0,
    }));

    const otherQty = other.reduce(
      (s, i) => s + (i.quantityOnHand || 0),
      0
    );

    if (otherQty > 0) {
      data.push({ name: "Khác", value: otherQty });
    }

    return data;
  }, [inventoryList]);

  const barChartData = useMemo(() => {
    return [...inventoryList]
      .sort((a, b) => (b.quantityOnHand || 0) - (a.quantityOnHand || 0))
      .slice(0, 8)
      .map((i) => ({
        name: i.ingredient?.name?.slice(0, 12) || "N/A",
        qty: i.quantityOnHand || 0,
        min: i.minimumQuantity || 0,
      }));
  }, [inventoryList]);

  // ===== LOGS =====
  const recentLogs = useMemo(() => {
    return inventoryLogs.slice(0, 5).map((log, idx) => {
      let text = "";

      if (log.transactionType === "IN") {
        text = `Nhập ${log.quantity || 0} ${log.ingredient?.name || ""}`;
      } else if (log.transactionType === "OUT") {
        text = `Xuất ${log.quantity || 0} ${log.ingredient?.name || ""}`;
      } else {
        text = `Cập nhật ${log.quantity || 0} ${log.ingredient?.name || ""}`;
      }

      return {
        id: log.id || idx,
        type: log.transactionType,
        text,
        time: log.createdAt
          ? new Date(log.createdAt).toLocaleString("vi-VN")
          : "N/A",
      };
    });
  }, [inventoryLogs]);

  const lowStockList = useMemo(() => {
    return lowStockItems.slice(0, 5).map((item, idx) => ({
      id: item.id || idx,
      name:
        item.ingredientName ||
        item.ingredient?.name ||
        "Unknown",
      current:
        item.currentQuantity || item.quantityOnHand || 0,
      minimum: item.minimumQuantity || 0,
    }));
  }, [lowStockItems]);

  return {
    loading,
    isLoaded, // ✅ FIX
    fetchAllData,

    totalQty,
    totalItemsCount,
    totalActiveOrders,
    lowStockCount,
    totalInboundCount,

    activeInbound,
    activeOutbound,
    inboundOrders, // ✅ FIX (để dashboard dùng)

    pieChartData,
    barChartData,
    recentLogs,
    lowStockList,
  };
}