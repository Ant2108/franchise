import { useState } from "react";
import axios from "axios";

function InventoryTrack() {
  const [warehouseId, setWarehouseId] = useState("");
  const [ingredientId, setIngredientId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!warehouseId || !ingredientId) {
      alert("Please enter warehouseId and ingredientId");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get("http://localhost:8080/api/inventory/track", {
        params: { warehouseId, ingredientId },
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Inventory not found");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Quantity Tracking</h2>

      <div style={styles.formRow}>
        <input
          style={styles.input}
          placeholder="Warehouse ID"
          value={warehouseId}
          onChange={(e) => setWarehouseId(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Ingredient ID"
          value={ingredientId}
          onChange={(e) => setIngredientId(e.target.value)}
        />

        <button
          style={loading ? styles.buttonDisabled : styles.button}
          onClick={handleTrack}
          disabled={loading}
        >
          {loading ? "Tracking..." : "Track"}
        </button>
      </div>

      {result && (
        <div style={styles.resultBox}>
          <div style={styles.resultItem}>
            <span style={styles.label}>Available</span>
            <span style={styles.value}>{result.quantityAvailable}</span>
          </div>

          <div style={styles.resultItem}>
            <span style={styles.label}>Reserved</span>
            <span style={styles.value}>{result.quantityReserved}</span>
          </div>

          <div style={styles.resultItem}>
            <span style={styles.label}>Last Updated</span>
            <span style={styles.value}>{result.lastUpdated}</span>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    marginTop: 24,
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    background: "#ffffff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "100%",
  },

  title: {
    marginBottom: 20,
    fontSize: 22,
    fontWeight: 600,
    color: "#111827",
  },

  formRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
  },

  input: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    outline: "none",
    minWidth: 220,
    fontSize: 14,
  },

  button: {
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.2s",
  },

  buttonDisabled: {
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    background: "#9ca3af",
    color: "white",
    fontWeight: 600,
    cursor: "not-allowed",
  },

  resultBox: {
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
  },

  resultItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px dashed #e5e7eb",
  },

  label: {
    color: "#6b7280",
    fontWeight: 500,
  },

  value: {
    color: "#111827",
    fontWeight: 600,
  },
};

export default InventoryTrack;
