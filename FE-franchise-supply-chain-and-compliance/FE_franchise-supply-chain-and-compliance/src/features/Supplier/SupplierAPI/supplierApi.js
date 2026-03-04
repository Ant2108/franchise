
import axiosClient from "../../../services/axiosClient";

const BASE = "/suppliers"; // sửa nếu backend bạn khác

export const getSuppliers = async (keyword = "") => {
  const res = await axiosClient.get(BASE, {
    params: { keyword },
  });

  // hỗ trợ cả 2 kiểu backend
  return res.content || res.data || [];
};
/* Lấy chi tiết supplier theo ID*/
export const getSupplierDetail = async (id) => {
  return await axiosClient.get(`${BASE}/${id}`);
};

