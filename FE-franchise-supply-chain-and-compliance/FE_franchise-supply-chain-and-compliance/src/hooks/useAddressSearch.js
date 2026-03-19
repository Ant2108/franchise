import { useState, useRef } from "react";
import { message } from "antd";

/**
 * Global custom hook for address search and coordinate fetching (via Nominatim API).
 * Useful for any form involving locations/maps.
 */
export const useAddressSearch = (initialPosition = [10.8231, 106.6297]) => {
  const [position, setPosition] = useState(initialPosition);
  const [addressOptions, setAddressOptions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef(null);

  /**
   * Search address using Nominatim (OpenStreetMap) with a debounce.
   * @param {string} value - User input address string.
   */
  const searchAddress = (value) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      if (!value || value.length < 3) {
        setAddressOptions([]);
        return;
      }

      setIsSearching(true);
      try {
        const query = `${value}, Vietnam`;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn&limit=5`
        );
        const data = await res.json();

        setAddressOptions(
          data.map((item) => ({
            value: item.display_name,
            label: item.display_name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
          }))
        );
      } catch (err) {
        console.error("Nominatim Search Error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  /**
   * Manually fetch coordinates for a specific address string.
   * @param {string} address - The address to geocode.
   * @returns {Array|null} - [lat, lon] or null.
   */
  const fetchCoordinates = async (address) => {
    if (!address) {
      message.warning("Vui lòng nhập địa chỉ");
      return null;
    }

    try {
      const query = `${address}, Vietnam`;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn&limit=1`
      );
      const data = await res.json();

      if (!data || data.length === 0) {
        message.error("Không tìm thấy địa chỉ");
        return null;
      }

      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      setPosition([lat, lon]);
      message.success("Đã tìm thấy vị trí");
      return [lat, lon];
    } catch (err) {
      console.error("Geocoding Error:", err);
      message.error("Không thể lấy tọa độ");
      return null;
    }
  };

  /**
   * Helper for when an address is selected from AutoComplete.
   * @param {string} value - Selected label.
   * @param {Object} option - The option object containing lat/lon.
   */
  const handleAddressSelect = (value, option) => {
    const latNum = parseFloat(option.lat);
    const lonNum = parseFloat(option.lon);
    setPosition([latNum, lonNum]);
    return { lat: latNum, lon: lonNum, address: value };
  };

  return {
    position,
    setPosition,
    addressOptions,
    isSearching,
    searchAddress,
    fetchCoordinates,
    handleAddressSelect,
  };
};
