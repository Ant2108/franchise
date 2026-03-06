import { useEffect, useState } from "react";
import inventoryApi from "./InventoryAPI/inventoryApi";
import InventoryUpdateForm from "./InventoryUpdateForm.jsx";


import { Button } from "antd";
import InventoryItemForm from "./InventoryDetail.jsx";


const InventoryList = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [UpdateModalID, setIsUpdateModalID] = useState(null)
  const [DetailModalID, setIsDetailModalID] = useState(null)
  
  const fetchInventories = async () => {
    try {
      setLoading(true);
      const res = await inventoryApi.getAll();
      setInventories(res|| []);
    } catch (err) {
      console.error("Fetch inventory error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.title}>Inventory List</h2>
        <span style={styles.countBadge}>
          Total: {inventories.length}
        </span>
      </div>

      {loading ? (
        <div style={styles.loadingBox}>
          <div style={styles.spinner} />
          <p>Loading inventory...</p>
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>Inventory ID</th>
                <th style={styles.th}>Warehouse</th>
                <th style={styles.th}>Ingredient</th>
                <th style={styles.th}>Available</th>
                <th style={styles.th}>Reserved</th>
                <th style={styles.th}>Last Updated</th>
                <th style={styles.th}>Actons</th>
              </tr>
            </thead>

            <tbody>
              {inventories.length === 0 ? (
                <tr>
                  <td colSpan="6" style={styles.empty}>
                    No inventory found
                  </td>
                </tr>
              ) : (
                inventories.map((item) => (
                  <tr key={item.inventoryId} style={styles.tr}>
                    <td style={styles.mono}>{item.inventoryId}</td>
                    <td style={styles.td}>{item.warehouseId}</td>
                    <td style={styles.td}>{item.ingredientId}</td>
                    <td style={styles.available}>
                      {item.quantityAvailable}
                    </td>
                    <td style={styles.reserved}>
                      {item.quantityReserved}
                    </td>
                    <td style={styles.td}>{item.lastUpdated}</td>
                    <td><Button 
                    type="primary"
                    onClick={()=>setIsUpdateModalID(item.inventoryId)}
                    size="small">Update</Button>
                    <Button type="default"
                    onClick={()=> setIsDetailModalID(item.inventoryId)}
                    size="small">Detail</Button>
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
  onSuccess={fetchInventories} />
  <InventoryItemForm
  ID={DetailModalID}
  open={!!DetailModalID}
  onClose={()=>setIsDetailModalID(null)}
  onSuccess={fetchInventories}/>
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
};

export default InventoryList;