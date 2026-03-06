import axiosClient from "../../../services/axiosClient";

const inventoryApi = {
  getAll: () => axiosClient.get("/inventory"),

  track: (params) =>
    axiosClient.get("/inventory/track", { params }),
update: (id, info) =>
  axiosClient.post(`/inventory/update/${id}`, info)
};


export default inventoryApi;