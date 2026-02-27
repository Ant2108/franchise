import WareHouseLayout from "./WareHouseLayout";

function WareHouseOrders() {
  return (
    <WareHouseLayout>
      <h1 className="warehouse-title">Orders</h1>

      <table className="warehouse-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#1001</td>
            <td>Nguyen Van A</td>
            <td>$1,200</td>
            <td>
              <span className="status status-available">Completed</span>
            </td>
          </tr>
          <tr>
            <td>#1002</td>
            <td>Tran Thi B</td>
            <td>$850</td>
            <td>
              <span className="status status-low">Pending</span>
            </td>
          </tr>
        </tbody>
      </table>
    </WareHouseLayout>
  );
}

export default WareHouseOrders;