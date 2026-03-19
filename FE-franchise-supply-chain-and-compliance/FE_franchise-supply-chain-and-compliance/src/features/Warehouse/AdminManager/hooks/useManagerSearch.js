import { useState, useMemo } from "react";

const ITEMS_PER_PAGE = 8;

/**
 * Custom hook to handle search and pagination for managers.
 * @param {Array} managers - List of all managers.
 * @returns {Object} - Search/Pagination states and processed lists.
 */
export const useManagerSearch = (managers) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredManagers = useMemo(() => {
    if (!Array.isArray(managers)) return [];
    return managers.filter(
      (m) =>
        (m.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.phone || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [managers, searchTerm]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredManagers.length / ITEMS_PER_PAGE));
  }, [filteredManagers]);

  const paginatedManagers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredManagers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredManagers, currentPage]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return {
    searchTerm,
    setSearchTerm: handleSearchChange,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredManagers,
    paginatedManagers,
    totalCount: managers.length,
    activeCount: managers.filter((m) => m.status === "active").length,
  };
};
