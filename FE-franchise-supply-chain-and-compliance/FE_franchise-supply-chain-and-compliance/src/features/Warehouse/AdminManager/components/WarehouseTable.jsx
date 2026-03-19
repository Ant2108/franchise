import React from "react";
import { FaEdit } from "react-icons/fa";
import { getStatusLabel, getStatusClass } from "../../../../utils/statusUtils";

/**
 * Renders the table of warehouses.
 * @param {Array} warehouses - The filtered list to display.
 * @param {boolean} loading - Loading state for the table.
 * @param {Function} onRowClick - Action when a row is clicked (e.g. fly to map).
 * @param {Function} onEdit - Edit button callback.
 */
const WarehouseTable = ({ warehouses, loading, onRowClick, onEdit }) => {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Tên Kho</th>
            <th>Vị Trí</th>
            <th>Mô Tả</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>

        <tbody>
          {warehouses.length === 0 && !loading && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Không tìm thấy kho hàng nào
              </td>
            </tr>
          )}

          {warehouses.map((wh) => (
            <tr
              key={wh.id}
              onClick={() => onRowClick?.(wh)}
              style={{ cursor: "pointer" }}
            >
              <td style={{ verticalAlign: 'top' }}>{wh.code}</td>
              <td style={{ verticalAlign: 'top' }}>{wh.name}</td>
              <td style={{ verticalAlign: 'top' }}>
                <div className="scrollable-cell location-cell">
                  {wh.location}
                </div>
              </td>
              <td style={{ verticalAlign: 'top' }}>
                <div className="scrollable-cell desc-cell">
                  {wh.description}
                </div>
              </td>
              <td>
                <span className={`status ${getStatusClass(wh.status)}`}>
                  {getStatusLabel(wh.status)}
                </span>
              </td>
              <td>
                <button
                  className="action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(wh.id);
                  }}
                >
                  <FaEdit />
                  <span>Chỉnh Sửa</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WarehouseTable;
