import { useState } from "react";
import { useAddressSearch } from "../../../../hooks/useAddressSearch";

/**
 * Hook to manage warehouse form state and location logic.
 * Delegates common location logic to the global useAddressSearch hook.
 */
export const useWarehouseForm = (initialData = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);

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
    handleChange("location", value); // Warehouse uses 'location' field name
    globalSearchAddress(value);
  };

  return {
    formData,
    setFormData,
    loading,
    setLoading,
    addressOptions,
    position,
    setPosition,
    fetchCoordinates,
    searchAddress,
    handleChange,
  };
};