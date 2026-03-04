import WareHouseLayout from "./WareHouseLayout";

function WareHouseReceiving() {
  return (
    <WareHouseLayout>
      <h1 className="warehouse-title">Receiving Goods</h1>

      <div className="warehouse-form">
        <div className="warehouse-form-group">
          <label>Supplier Name</label>
          <input type="text" placeholder="Enter supplier name" />
        </div>

        <div className="warehouse-form-group">
          <label>Product Name</label>
          <input type="text" placeholder="Enter product name" />
        </div>

        <div className="warehouse-form-group">
          <label>Quantity</label>
          <input type="number" placeholder="Enter quantity" />
        </div>

        <button className="warehouse-btn">Submit</button>
      </div>
    </WareHouseLayout>
  );
}

export default WareHouseReceiving;