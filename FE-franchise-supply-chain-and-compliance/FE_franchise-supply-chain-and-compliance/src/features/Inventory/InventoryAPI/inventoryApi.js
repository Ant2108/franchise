import axiosClient from "../../../services/axiosClient";

const inventoryApi = {
  getAll: () => axiosClient.get("/inventory"),

  track: (params) =>
    axiosClient.get("/inventory/track", { params }),
  update: (id, info) =>
    axiosClient.post(`/inventory/update/${id}`, info),
  detail: (id) =>
    axiosClient.get(`/inventory/detailed/${id}`),
  getLowStock: (warehouseId) =>
    axiosClient.get(`/inventory/low-stock/warehouse/${warehouseId}`)
};


export default inventoryApi;