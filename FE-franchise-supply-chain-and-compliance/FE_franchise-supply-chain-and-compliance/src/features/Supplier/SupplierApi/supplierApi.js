import axiosClient from "../../../services/axiosClient";

const BASE = "/suppliers";

export const getSuppliers = async (keyword = "") => {
  return await axiosClient.get(`${BASE}/search`, {
    keyword
  });
};

export const getSupplierDetail = async (id) => {
  return await axiosClient.get(`${BASE}/${id}`);
};

export const createSupplier = async (data) => {
  return await axiosClient.post(BASE, data);
};

export const updateSupplier = async (id, data) => {
  return await axiosClient.put(`/suppliers/${id}`, data);
};

export const deleteSupplier = async (id) => {
  return await axiosClient.delete(`/suppliers/${id}`);
};