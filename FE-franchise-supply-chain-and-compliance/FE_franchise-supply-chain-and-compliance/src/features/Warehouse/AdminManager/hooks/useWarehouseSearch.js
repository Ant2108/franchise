import { useState, useMemo } from "react";

/**
 * Custom hook to filter warehouses based on search term and status.
 * @param {Array} warehouses - List of all warehouses.
 * @returns {Object} - Filter logic states and filtered list.
 */
export const useWarehouseSearch = (warehouses) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const filteredWarehouses = useMemo(() => {
    if (!Array.isArray(warehouses)) return [];
    
    return warehouses
      .filter((wh) => {
        const matchesSearch = 
          wh.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          wh.code?.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesStatus = true;
        if (filterStatus === "ALL") {
          matchesStatus = wh.status !== "CLOSE";
        } else {
          matchesStatus = wh.status === filterStatus;
        }
        
        return matchesSearch && matchesStatus;
      });
  }, [warehouses, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    if (!Array.isArray(warehouses)) return { total: 0, active: 0 };
    
    const activeList = warehouses.filter(wh => wh.status !== "CLOSE");
    return {
      total: activeList.length,
      active: warehouses.filter(wh => wh.status === "ACTIVE").length,
    };
  }, [warehouses]);

  return {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filteredWarehouses,
    stats,
  };
};
