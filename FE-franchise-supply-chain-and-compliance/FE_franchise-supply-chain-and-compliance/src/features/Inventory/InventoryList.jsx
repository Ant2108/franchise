import { useEffect, useState } from "react";
import inventoryApi from "./InventoryAPI/inventoryApi";
import InventoryUpdateForm from "./InventoryUpdateForm.jsx";


import { Button } from "antd";
import InventoryItemForm from "./InventoryDetail.jsx";


import { getCookie } from "../../utils/cookieUtils";

const InventoryList = ({ data, loading: externalLoading, isDashboard = false }) => {
  const [inventories, setInventories] = useState([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [UpdateModalID, setIsUpdateModalID] = useState(null);
  const [DetailModalID, setIsDetailModalID] = useState(null);

  // Ưu tiên dùng dữ liệu từ props nếu có, không thì dùng state nội bộ
  const displayData = data || inventories;
  const isLoading = externalLoading ?? internalLoading;
  
  const fetchInventories = async () => {
    try {
      setInternalLoading(true);
      // Gọi qua axiosClient để tận dụng Header X-Warehouse-Id (đã code trong interceptor)
      // Nếu không dùng axiosClient, hãy lấy warehouseId từ cookie:
      const warehouseId = getCookie("warehouse_id");
      
      const res = await inventoryApi.getAll(); 
      // Giả sử API trả về list filter theo warehouse thông qua header
      setInventories(res || []);
    } catch (err) {
      console.error("Fetch inventory error:", err);
    } finally {
      setInternalLoading(false);
    }
  };

  useEffect(() => {
    // Chỉ fetch nếu bên ngoài không truyền data vào
    if (!data) {
      fetchInventories();
    }
  }, [data]);

  return (
    <div style={isDashboard ? styles.dashboardCard : styles.card}>
      {!isDashboard && (
        <div style={styles.header}>
          <h2 style={styles.title}>Quản lý tồn kho</h2>
          <span style={styles.countBadge}>
            Tổng số mặt hàng: {displayData.length}
          </span>
        </div>
      )}

      {isLoading ? (
        <div style={styles.loadingBox}>
          <div style={styles.spinner} />
          <p>Đang tải dữ liệu tồn kho...</p>
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>Nguyên liệu</th>
                {!isDashboard && <th style={styles.th}>Kho</th>}
                <th style={styles.th}>Sẵn có</th>
                {isDashboard && <th style={styles.th}>Mức tối thiểu</th>}
                <th style={styles.th}>Dự trữ</th>
                <th style={styles.th}>Cập nhật</th>
                <th style={styles.th}>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {displayData.length === 0 ? (
                <tr>
                  <td colSpan={isDashboard ? "6" : "7"} style={styles.empty}>
                    Không tìm thấy dữ liệu tồn kho
                  </td>
                </tr>
              ) : (
                displayData.map((item) => (
                  <tr key={item.inventoryId} style={styles.tr}>
                    <td style={styles.td}>
                      <strong>{item.ingredientName}</strong>
                    </td>
                    {!isDashboard && <td style={styles.td}>{item.warehouseName}</td>}
                    <td style={styles.available}>
                      {item.quantityAvailable}
                    </td>
                    {isDashboard && <td style={styles.td}>{item.minimumQuantity || 0}</td>}
                    <td style={styles.reserved}>
                      {item.quantityReserved}
                    </td>
                    <td style={styles.td}>{item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button 
                          type="primary"
                          onClick={()=>setIsUpdateModalID(item.inventoryId)}
                          size="small">Sửa</Button>
                        {!isDashboard && (
                          <Button type="default"
                            onClick={()=> setIsDetailModalID(item.inventoryId)}
                            size="small">Chi tiết</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      
      <InventoryUpdateForm 
        ID={UpdateModalID}
        open={!!UpdateModalID}
        onClose={() => setIsUpdateModalID(null)}
        onSuccess={data ? undefined : fetchInventories} 
      />
      <InventoryItemForm
        ID={DetailModalID}
        open={!!DetailModalID}
        onClose={()=>setIsDetailModalID(null)}
        onSuccess={data ? undefined : fetchInventories}
      />
    </div>
  );
};

const styles = {
  card: {
    marginTop: 24,
    padding: 24,
    background: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    width: "100%",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 12,
  },

  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 600,
  },

  countBadge: {
    background: "#eef2ff",
    color: "#3730a3",
    padding: "6px 12px",
    borderRadius: 999,
    fontWeight: 600,
    fontSize: 13,
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },

  thead: {
    background: "#f9fafb",
  },

  th: {
    textAlign: "left",
    padding: 12,
    fontWeight: 600,
    color: "#374151",
    borderBottom: "2px solid #e5e7eb",
  },

  td: {
    padding: 12,
    borderBottom: "1px solid #f1f5f9",
  },

  tr: {
    transition: "0.2s",
  },

  mono: {
    fontFamily: "monospace",
    fontSize: 12,
    padding: 12,
    borderBottom: "1px solid #f1f5f9",
  },

  available: {
    color: "#059669",
    fontWeight: 600,
    padding: 12,
    borderBottom: "1px solid #f1f5f9",
  },

  reserved: {
    color: "#dc2626",
    fontWeight: 600,
    padding: 12,
    borderBottom: "1px solid #f1f5f9",
  },

  empty: {
    textAlign: "center",
    padding: 24,
    color: "#9ca3af",
  },

  loadingBox: {
    textAlign: "center",
    padding: 40,
  },

  spinner: {
    width: 36,
    height: 36,
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    margin: "0 auto 12px",
    animation: "spin 1s linear infinite",
  },
  dashboardCard: {
    marginTop: 24,
    padding: "20px",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    width: "100%",
  }
};

export default InventoryList;