import { useState, useCallback } from "react";
import { message } from "antd";
import WareHouseAdminAPI from "../AdminWareHousePageAPI/AdminWareHousePageAPI";

/**
 * Custom Hook: useWarehouseWizad
 * Quản lý toàn bộ các tác vụ CRUD (Create, Read, Update, Delete/Status) liên quan đến Warehouse.
 */
export const useWarehouseWizad = () => {
  const [loading, setLoading] = useState(false);
  const [fetchingDetail, setFetchingDetail] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseDetail, setWarehouseDetail] = useState(null);

  // Read: Lấy danh sách kho
  const fetchWarehouses = useCallback(async (params = {}, config = {}) => {
    try {
      setLoading(true);
      const res = await WareHouseAdminAPI.getAllWarehouses(params, config);
      setWarehouses(Array.isArray(res) ? res : res?.data || []);
      return res;
    } catch (error) {
      if (error?.name !== "CanceledError" && error?.code !== "ERR_CANCELED") {
        console.error("Lỗi khi tải danh sách warehouse:", error);
        message.error("Không thể tải danh sách kho. Vui lòng thử lại!");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Read: Lấy chi tiết kho
  const fetchWarehouseDetail = useCallback(async (id) => {
    try {
      setFetchingDetail(true);
      const res = await WareHouseAdminAPI.getWarehouseDetail(id);
      const data = res?.data ?? res;
      setWarehouseDetail(data);
      return data;
    } catch (error) {
      console.error(`Lỗi khi tải chi tiết warehouse ID ${id}:`, error);
      message.error("Không thể tải chi tiết kho. Vui lòng thử lại!");
      return null;
    } finally {
      setFetchingDetail(false);
    }
  }, []);

  // Create: Tạo mới kho
  const createWarehouse = async (data) => {
    try {
      setLoading(true);
      const res = await WareHouseAdminAPI.createWarehouse(data);
      message.success("Tạo kho hàng thành công!");
      return res?.data ?? res;
    } catch (error) {
      console.error("Lỗi khi tạo warehouse:", error);
      const errMsg = error?.response?.data?.message || error?.message || "Tạo kho hàng thất bại!";
      message.error(errMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update: Cập nhật thông tin kho toàn diện
  const updateWarehouse = async (id, data) => {
    try {
      setLoading(true);
      const res = await WareHouseAdminAPI.updateWarehouse(id, data);
      message.success("Cập nhật thông tin kho thành công!");
      return res?.data ?? res;
    } catch (error) {
      console.error(`Lỗi khi cập nhật warehouse ID ${id}:`, error);
      const errMsg = error?.response?.data?.message || error?.message || "Cập nhật kho hàng thất bại!";
      message.error(errMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update: Cập nhật Trạng thái kho
  const updateWarehouseStatus = async (id, status, notes = "") => {
    try {
      setLoading(true);
      const res = await WareHouseAdminAPI.updateWarehouseStatus(id, status, notes);
      message.success("Cập nhật trạng thái kho thành công!");
      return res?.data ?? res;
    } catch (error) {
      console.error(`Lỗi khi cập nhật trạng thái kho ID ${id}:`, error);
      const errMsg = error?.response?.data?.message || error?.message || "Cập nhật trạng thái thất bại!";
      message.error(errMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Assign Manager: Cấp quyền quản lý kho cho Manager
  const assignManagerToWarehouse = async (warehouseId, managerId, confirmReplace = false) => {
    try {
      setLoading(true);
      const res = await WareHouseAdminAPI.assignManager(warehouseId, managerId, confirmReplace);
      message.success(managerId ? "Gán Trưởng kho thành công!" : "Gỡ Trưởng kho thành công!");
      return res?.data ?? res;
    } catch (error) {
      console.error(`Lỗi khi gán quản lý cho kho ID ${warehouseId}:`, error);
      const errMsg = error?.response?.data?.message || error?.message || "Gán quản lý thất bại!";
      message.error(errMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Tiện ích để reset Detail data
  const clearWarehouseDetail = () => {
    setWarehouseDetail(null);
  };

  return {
    loading,
    fetchingDetail,
    warehouses,
    warehouseDetail,
    fetchWarehouses,
    fetchWarehouseDetail,
    createWarehouse,
    updateWarehouse,
    updateWarehouseStatus,
    assignManagerToWarehouse,
    clearWarehouseDetail,
  };
};
