import WareHouseLayout from "./WareHouseLayout";

function WareHouseNotFound() {
  return (
    <WareHouseLayout>
      <h1 className="warehouse-title">404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </WareHouseLayout>
  );
}

export default WareHouseNotFound;