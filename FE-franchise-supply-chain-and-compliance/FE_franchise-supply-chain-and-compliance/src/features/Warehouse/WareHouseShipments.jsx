import WareHouseLayout from "./WareHouseLayout";

function WareHouseShipments() {
  return (
    <WareHouseLayout>
      <h1 className="warehouse-title">Shipments</h1>

      <table className="warehouse-table">
        <thead>
          <tr>
            <th>Shipment ID</th>
            <th>Carrier</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>SHIP-001</td>
            <td>DHL</td>
            <td>
              <span className="status status-available">Delivered</span>
            </td>
          </tr>
          <tr>
            <td>SHIP-002</td>
            <td>FedEx</td>
            <td>
              <span className="status status-low">In Transit</span>
            </td>
          </tr>
        </tbody>
      </table>
    </WareHouseLayout>
  );
}

export default WareHouseShipments;