import React, { useState } from "react";
import {
  FaWarehouse,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaBoxes,
  FaMapMarkerAlt,
  FaPhone,
  FaChartLine,
} from "react-icons/fa";
import "./AdminWareHouseManager.css";

const ITEMS_PER_PAGE = 8;

const AdminWareHouseManager = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [warehouses, setWarehouses] = useState([
    {
      id: 1,
      name: "Central Warehouse",
      description: "Main warehouse serving downtown area",
      address: "District 1, Ho Chi Minh City",
      phone: "028-1234-5678",
      capacity: 10000,
      currentStock: 7500,
      status: "active",
    },
    {
      id: 2,
      name: "Central Warehouse",
      description: "Main warehouse serving downtown area",
      address: "District 1, Ho Chi Minh City",
      phone: "028-1234-5678",
      capacity: 10000,
      currentStock: 7500,
      status: "active",
    },
    {
      id: 3,
      name: "Central Warehouse",
      description: "Main warehouse serving downtown area",
      address: "District 1, Ho Chi Minh City",
      phone: "028-1234-5678",
      capacity: 10000,
      currentStock: 7500,
      status: "active",
    },
    {
      id: 4,
      name: "Central Warehouse",
      description: "Main warehouse serving downtown area",
      address: "District 1, Ho Chi Minh City",
      phone: "028-1234-5678",
      capacity: 10000,
      currentStock: 7500,
      status: "active",
    },
    {
      id: 5,
      name: "Central Warehouse",
      description: "Main warehouse serving downtown area",
      address: "District 1, Ho Chi Minh City",
      phone: "028-1234-5678",
      capacity: 10000,
      currentStock: 7500,
      status: "active",
    },
    {
      id: 6,
      name: "Central Warehouse",
      description: "Main warehouse serving downtown area",
      address: "District 1, Ho Chi Minh City",
      phone: "028-1234-5678",
      capacity: 10000,
      currentStock: 7500,
      status: "active",
    },
    {
      id: 7,
      name: "Central Warehouse",
      description: "Main warehouse serving downtown area",
      address: "District 1, Ho Chi Minh City",
      phone: "028-1234-5678",
      capacity: 10000,
      currentStock: 7500,
      status: "active",
    },
    {
      id: 8,
      name: "Central Warehouse",
      description: "Main warehouse serving downtown area",
      address: "District 1, Ho Chi Minh City",
      phone: "028-1234-5678",
      capacity: 10000,
      currentStock: 7500,
      status: "active",
    },
    {
      id: 9,
      name: "Central Warehouse",
      description: "Main warehouse serving downtown area",
      address: "District 1, Ho Chi Minh City",
      phone: "028-1234-5678",
      capacity: 10000,
      currentStock: 7500,
      status: "active",
    },
  ]);

  /* FILTER */

  const filteredWarehouses = warehouses.filter(
    (w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* PAGINATION */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredWarehouses.length / ITEMS_PER_PAGE)
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedWarehouses = filteredWarehouses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* STATS */

  const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
  const totalStock = warehouses.reduce((sum, w) => sum + w.currentStock, 0);
  const activeWarehouses = warehouses.filter(
    (w) => w.status === "active"
  ).length;

  /* DELETE */

  const handleDelete = (id) => {
    if (confirm("Delete this warehouse?")) {
      setWarehouses(warehouses.filter((w) => w.id !== id));
    }
  };

  return (
    <div className="warehouse-manager-page">

      {/* HEADER */}
      <div className="warehouse-manager-header">

        <div className="warehouse-manager-title">

          <div>
            <h1>Warehouse Management</h1>
            <p>Manage and monitor system warehouses</p>
          </div>

        </div>

        <button className="warehouse-manager-add-btn">
          <FaPlus /> Add Warehouse
        </button>

      </div>

      {/* STATS */}

      <div className="warehouse-manager-stats">

        <div className="warehouse-manager-stat-card stat-blue">
          <div>
            <p>Total Warehouses</p>
            <h3>{warehouses.length}</h3>
          </div>
          <FaWarehouse />
        </div>

        <div className="warehouse-manager-stat-card stat-green">
          <div>
            <p>Active</p>
            <h3>{activeWarehouses}</h3>
          </div>
          <FaChartLine />
        </div>

        <div className="warehouse-manager-stat-card stat-purple">
          <div>
            <p>Total Capacity</p>
            <h3>{(totalCapacity / 1000).toFixed(0)}K</h3>
          </div>
          <FaBoxes />
        </div>

        <div className="warehouse-manager-stat-card stat-orange">
          <div>
            <p>Current Stock</p>
            <h3>{(totalStock / 1000).toFixed(1)}K</h3>
          </div>
          <FaBoxes />
        </div>

      </div>

      {/* CONTENT AREA (scroll) */}

      <div className="warehouse-manager-content">

        {/* SEARCH */}

        <div className="warehouse-manager-search">

          <FaSearch className="warehouse-manager-search-icon" />

          <input
            type="text"
            placeholder="Search warehouse by name or address..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

        </div>

        {/* GRID */}

        <div className="warehouse-manager-grid">

          {paginatedWarehouses.map((warehouse) => {

            const percent =
              (warehouse.currentStock / warehouse.capacity) * 100;

            return (
              <div className="warehouse-manager-card" key={warehouse.id}>

                {/* CARD TOP */}
                <div className="warehouse-manager-card-top"></div>

                {/* CARD HEADER */}

                <div className="warehouse-manager-card-header">

                  <div className="warehouse-manager-card-title">

                    <div className="warehouse-manager-card-icon">
                      <FaWarehouse />
                    </div>

                    <div>
                      <h3>{warehouse.name}</h3>
                      <p>{warehouse.description}</p>
                    </div>

                  </div>

                  <span
                    className={`warehouse-manager-badge ${warehouse.status}`}
                  >
                    {warehouse.status}
                  </span>

                </div>

                {/* INFO */}

                <div className="warehouse-manager-info">
                  <FaMapMarkerAlt />
                  {warehouse.address}
                </div>

                <div className="warehouse-manager-info">
                  <FaPhone />
                  {warehouse.phone}
                </div>

                {/* CAPACITY */}

                <div className="warehouse-manager-capacity">

                  <div className="warehouse-manager-capacity-top">
                    <span>Capacity</span>

                    <span>
                      {warehouse.currentStock.toLocaleString()} /{" "}
                      {warehouse.capacity.toLocaleString()}
                    </span>

                  </div>

                  <div className="warehouse-manager-bar">

                    <div
                      className="warehouse-manager-bar-fill"
                      style={{ width: `${percent}%` }}
                    />

                  </div>

                  <p className="warehouse-manager-percent">
                    {percent.toFixed(1)}% utilized
                  </p>

                </div>

                {/* BUTTONS */}

                <div className="warehouse-manager-buttons">

                  <button className="warehouse-manager-btn">
                    <FaEdit /> Edit
                  </button>

                  <button
                    className="warehouse-manager-btn delete"
                    onClick={() => handleDelete(warehouse.id)}
                  >
                    <FaTrash /> Delete
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* FOOTER PAGINATION */}

      <div className="warehouse-manager-pagination">

        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>

      </div>

    </div>
  );
};

export default AdminWareHouseManager;