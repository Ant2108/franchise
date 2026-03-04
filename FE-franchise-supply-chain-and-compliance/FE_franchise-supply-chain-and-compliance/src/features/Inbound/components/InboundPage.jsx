import React, { useEffect, useState } from "react";
import { Input, Button, Card, Badge, Pagination, Empty, Spin } from "antd";
import { ShoppingCartOutlined, PlusOutlined } from "@ant-design/icons";
import inboundApi from "../InboundAPI/inboundApi";
import "./InboundStyles.css";

const { Search } = Input;

const PAGE_SIZE = 16;
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500";

const InboundPage = () => {
  const [marketItems, setMarketItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMarketplaceItems = async (keyword = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const result = await inboundApi.getMarketplaceItems({ keyword });
      setMarketItems(Array.isArray(result) ? result : []);
    } catch (error) {
      setErrorMessage(error.message || "Failed to load marketplace items.");
      setMarketItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketplaceItems();
  }, []);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedSuppliers = marketItems.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const formatPrice = (unitPrice) => {
    const value = Number(unitPrice || 0);
    return value.toLocaleString("vi-VN");
  };

  return (
    <div className="inbound-layout">
      {/* HEADER */}
      <div className="inbound-header-section">
        <div className="inbound-header">
          <div>
            <h2>Inbound Suppliers</h2>
            <span className="sub-text">Franchise Supply Marketplace</span>
          </div>

          <div className="header-actions">
            <Badge count={cartCount}>
              <ShoppingCartOutlined className="cart-icon" />
            </Badge>

            <Button type="primary" icon={<PlusOutlined />}>
              Add Supplier
            </Button>
          </div>
        </div>

        <Search
          placeholder="Search ingredient or supplier..."
          className="search-bar"
          value={searchKeyword}
          allowClear
          onChange={(event) => {
            const value = event.target.value;
            setSearchKeyword(value);
            if (!value.trim()) {
              setCurrentPage(1);
              fetchMarketplaceItems("");
            }
          }}
          onSearch={(value) => {
            setCurrentPage(1);
            fetchMarketplaceItems(value.trim());
          }}
        />
      </div>

      {/* CONTENT (SCROLL ZONE) */}
      <div className="inbound-content-section">
        {isLoading ? (
          <div className="center-content">
            <Spin />
          </div>
        ) : errorMessage ? (
          <div className="center-content">
            <p className="error-text">{errorMessage}</p>
            <Button onClick={() => fetchMarketplaceItems(searchKeyword.trim())}>
              Retry
            </Button>
          </div>
        ) : paginatedSuppliers.length === 0 ? (
          <div className="center-content">
            <Empty description="No marketplace item found" />
          </div>
        ) : (
          <div className="supplier-grid">
            {paginatedSuppliers.map((item) => (
              <Card
                key={
                  item.supplierIngredientId ||
                  `${item.supplierId}-${item.ingredientId}`
                }
                hoverable
                className="supplier-card"
                cover={
                  <div className="image-wrapper">
                    <img
                      src={DEFAULT_IMAGE}
                      alt={item.ingredientName || "ingredient"}
                    />
                  </div>
                }
              >
                <div className="card-header">
                  <h3>{item.ingredientName}</h3>
                </div>

                <p className="sku">Supplier: {item.supplierName}</p>
                <p className="category">Unit: {item.unit || "N/A"}</p>

                <div className="price-stock">
                  <span className="price">
                    {formatPrice(item.unitPrice)} VND
                  </span>
                  <span className="stock">
                    {item.distanceKm != null
                      ? `${item.distanceKm} km`
                      : "Distance N/A"}
                  </span>
                </div>

                <Button
                  type="primary"
                  block
                  onClick={() => setCartCount(cartCount + 1)}
                >
                  Add to Cart
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="inbound-footer">
        <Pagination
          current={currentPage}
          pageSize={PAGE_SIZE}
          total={marketItems.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default InboundPage;