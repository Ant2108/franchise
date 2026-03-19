import { useMemo } from 'react';
import { getSuppliers, deleteSupplier } from '../SupplierAPI/supplierApi';
import { useTableCrud } from '../../../hooks/useTableCrud';

const ITEMS_PER_PAGE = 8;

/**
 * Custom hook for managing supplier list logic using the global useTableCrud.
 * @returns {Object} - states and handlers for supplier management.
 */
export const useSupplierSearch = () => {
  // Wrap the API to support pagination format expected by useTableCrud
  const fetchApi = async (page, pageSize, keyword) => {
    // getSuppliers internally returns the array of suppliers
    const data = await getSuppliers(keyword);
    const start = (page - 1) * pageSize;
    return {
      data: data.slice(start, start + pageSize),
      total: data.length,
    };
  };

  const {
    data: paginatedSuppliers,
    loading,
    total,
    keyword,
    setKeyword,
    currentPage,
    setCurrentPage,
    handleDelete,
  } = useTableCrud({
    fetchApi,
    deleteApi: deleteSupplier,
    featureName: 'nhà cung cấp',
    initialPageSize: ITEMS_PER_PAGE,
  });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return {
    suppliers: paginatedSuppliers, // Keep for compatibility if needed, though SupplierAdminManage uses paginatedSuppliers mostly
    loading,
    keyword,
    setKeyword,
    currentPage,
    setCurrentPage,
    paginatedSuppliers,
    totalPages,
    handleDelete,
    totalCount: total,
    itemsPerPage: ITEMS_PER_PAGE,
  };
};
