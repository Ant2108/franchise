import { useState, useEffect, useCallback, useRef } from "react";
import { message } from "antd";

/**
 * Global generic hook for managing list data (CRUD - Read, Delete).
 * Handles: Fetching (with keyword & paging), Loading states, Total count, and Deletion.
 * 
 * @param {Object} options
 * @param {Function} options.fetchApi - Function(page, pageSize, keyword) that returns { data: [], total: number }
 * @param {Function} options.deleteApi - Function(id) that deletes an item.
 * @param {string} options.featureName - Human-readable name for logging/messages.
 * @param {number} options.pageSize - Default page size.
 */
export const useTableCrud = ({
  fetchApi,
  deleteApi,
  featureName = "dữ liệu",
  initialPageSize = 8,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debounceTimer = useRef(null);

  // Lưu trữ các hàm ở ref để tránh việc inline function làm thay đổi reference liên tục gây infinite loop
  const fetchApiRef = useRef(fetchApi);
  const deleteApiRef = useRef(deleteApi);
  const isFetchingRef = useRef(false); // Guard chống gọi cục bộ đè lên nhau

  // Cập nhật ref mỗi khi hàm từ bên ngoài thay đổi
  useEffect(() => {
    fetchApiRef.current = fetchApi;
    deleteApiRef.current = deleteApi;
  }, [fetchApi, deleteApi]);

  // Core fetch function
  const fetchData = useCallback(async (page, k) => {
    if (isFetchingRef.current) {
       console.warn(`[useTableCrud] 🚧 Guard: Đang xử lý tải dữ liệu ${featureName}, bỏ qua gọi lặp...`);
       return;
    }
    
    isFetchingRef.current = true;
    setLoading(true);
    try {
      console.log(`[useTableCrud] 🔄 Đang gọi API lấy danh sách ${featureName} (Trang: ${page}, Từ khóa: "${k}")`);
      // Thực thi hàm lấy dữ liệu từ Ref
      const res = await fetchApiRef.current(page, initialPageSize, k);
      
      // Adaptation for different possible API response shapes
      const items = res.data || res.content || res || [];
      const count = res.totalElements || res.total || items.length || 0;
      
      setData(items);
      setTotal(count);
      console.log(`[useTableCrud] ✅ Tải ${featureName} thành công! (${count} items)`);
    } catch (err) {
      console.error(`[useTableCrud] 🚨 Error fetching ${featureName}:`, err);
      message.error(`Không thể tải danh sách ${featureName}`);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [initialPageSize, featureName]);

  // Initial fetch and on page change
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    // Sử dụng setTimeout ngắn làm debounce để gom các thay đổi state (nếu có) vào 1 lần fetch duy nhất
    debounceTimer.current = setTimeout(() => {
       fetchData(currentPage, keyword);
    }, 100);

    return () => clearTimeout(debounceTimer.current);
  }, [currentPage, fetchData, keyword]); // Không loop nữa vì fetchData đã ổn định reference

  // Handle Search with debounce (optional, can be done at UI level too)
  const handleSearch = (val) => {
    setKeyword(val);
    setCurrentPage(1); // Reset to page 1 on new search
  };

  // Handle Deletion
  const handleDelete = async (id) => {
    try {
      console.log(`[useTableCrud] 🗑 Đang xóa ${featureName} ID: ${id}`);
      await deleteApiRef.current(id);
      message.success(`Xóa ${featureName} thành công!`);
      // Reload current page without guard block by forcefully setting isFetchingRef = false
      isFetchingRef.current = false; 
      fetchData(currentPage, keyword);
    } catch (err) {
      console.error(`[useTableCrud] 🚨 Error deleting ${featureName}:`, err);
      message.error(`Xóa ${featureName} thất bại!`);
    }
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return {
    data,
    loading,
    total,
    keyword,
    setKeyword: handleSearch,
    currentPage,
    setCurrentPage: onPageChange,
    handleDelete,
    refresh: () => fetchData(currentPage, keyword),
  };
};
