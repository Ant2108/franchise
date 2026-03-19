import useWarehouseData from "./useWarehouseData";
import useWarehouseMetrics from "./useWarehouseMetrics";

export default function useWarehouseDashboard(selectedWarehouse) {
  const data = useWarehouseData(selectedWarehouse);
  const metrics = useWarehouseMetrics(data);

  return {
    ...data,
    ...metrics,
  };
}