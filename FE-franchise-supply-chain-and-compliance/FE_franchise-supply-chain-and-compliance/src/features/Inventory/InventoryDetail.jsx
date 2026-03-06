import { useState, useEffect } from "react";
import { Modal, Table, Descriptions, message } from "antd";
import inventoryApi from "./InventoryAPI/inventoryApi";

function InventoryItemDetailModal({ ID, open, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && ID) fetchDetail();
    else setDetails(null);
  }, [open, ID]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const data = await inventoryApi.detail(ID);
      console.log("Inventory detail:", data);
      setDetails(data);
    } catch (error) {
      console.error("Fetch failed:", error);
      message.error("Failed to load inventory detail");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Ingredient ID",
      dataIndex: "ingredientId",
      key: "ingredientId",
    },
    {
      title: "Ingredient Name",
      dataIndex: "ingredientName",
      key: "ingredientName",
    },
    {
      title: "Warehouse ID",
      dataIndex: "warehouseId",
      key: "warehouseId",
    },
    {
      title: "Warehouse Name",
      dataIndex: "warehouseName",
      key: "warehouseName",
    },
    {
      title: "Quantity Available",
      dataIndex: "quantityAvailable",
      key: "quantityAvailable",
    },
    {
      title: "Quantity Reserved",
      dataIndex: "quantityReserved",
      key: "quantityReserved",
    },
  ];

  return (
    <Modal
      open={open}
      title={`Inventory Item Detail #${ID}`}
      onCancel={onClose}
      footer={null}
      width={800}
      confirmLoading={loading}
    >
      {details && (
        <>
          <Descriptions bordered column={2} size="small" style={{ marginBottom: 20 }}>
            <Descriptions.Item label="Ingredient ID">{details.ingredientId}</Descriptions.Item>
            <Descriptions.Item label="Ingredient Name">{details.ingredientName}</Descriptions.Item>
            <Descriptions.Item label="Warehouse ID">{details.warehouseId}</Descriptions.Item>
            <Descriptions.Item label="Warehouse Name">{details.warehouseName}</Descriptions.Item>
            <Descriptions.Item label="Quantity Available">{details.quantityAvailable}</Descriptions.Item>
            <Descriptions.Item label="Quantity Reserved">{details.quantityReserved}</Descriptions.Item>
          </Descriptions>

          {/* If you have multiple items in the future, you can use Table */}
          {/* <Table
            columns={columns}
            dataSource={[details]}
            rowKey={(record) => record.ingredientId}
            pagination={false}
            size="small"
          /> */}
        </>
      )}
    </Modal>
  );
}

export default InventoryItemDetailModal;