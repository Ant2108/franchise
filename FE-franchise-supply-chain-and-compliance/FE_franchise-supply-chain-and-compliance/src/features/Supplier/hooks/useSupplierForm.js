import { useState } from "react";
import { useAddressSearch } from "../../../hooks/useAddressSearch";

/**
 * Hook to manage supplier form logic (Create/Update).
 * Delegates common location search logic to useAddressSearch.
 */
export const useSupplierForm = (initialData = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  // Use the global location hook
  const {
    position,
    setPosition,
    addressOptions,
    searchAddress: globalSearchAddress,
    fetchCoordinates: globalFetchCoordinates,
  } = useAddressSearch();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fetchCoordinates = async (address) => {
    const coords = await globalFetchCoordinates(address);
    if (coords) {
      setFormData((prev) => ({ ...prev, latitude: coords[0], longitude: coords[1] }));
      return coords;
    }
    return null;
  };

  const searchAddress = (value) => {
    handleChange("address", value);
    globalSearchAddress(value);
  };

  return {
    formData, setFormData,
    loading, setLoading,
    addressOptions,
    position,
    setPosition,
    handleChange,
    fetchCoordinates,
    searchAddress
  };
};
