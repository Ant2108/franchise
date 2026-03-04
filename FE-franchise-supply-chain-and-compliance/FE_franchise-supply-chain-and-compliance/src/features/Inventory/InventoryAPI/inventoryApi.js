import axiosClient from "../../../services/axiosClient";

const inventoryApi = {
  getAll: () => axiosClient.get("/inventory"),

  track: (params) =>
    axiosClient.get("/inventory/track", { params }),
};

export default inventoryApi;