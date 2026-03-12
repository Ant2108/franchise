import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  Card,
  Badge,
  Pagination,
  Empty,
  Spin,
  message,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Tooltip,
} from "antd";
import {
  ShoppingCartOutlined,
  ShopOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import inboundApi from "../InboundAPI/inboundApi";
import cartApi from "../InboundAPI/cartApi";

const { Search } = Input;
const { Title, Text } = Typography;

const PAGE_SIZE = 16;
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500";

const InboundPage = () => {
  const navigate = useNavigate();
  const [marketItems, setMarketItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Cart state
  const [cartData, setCartData] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

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

  const fetchCart = useCallback(async () => {
    try {
      const data = await cartApi.getCart();
      setCartData(data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setCartData(null);
    }
  }, []);

  useEffect(() => {
    fetchMarketplaceItems();
    fetchCart();
  }, [fetchCart]);

  const handleAddToCart = async (item) => {
    const itemKey =
      item.supplierIngredientId || `${item.supplierId}-${item.ingredientId}`;
    setAddingToCart(itemKey);
    try {
      await cartApi.addToCart({
        supplierIngredientId: item.supplierIngredientId,
        quantity: item.minimumOrderQuantity || 1,
      });
      message.success(`Đã thêm "${item.ingredientName}" vào giỏ hàng`);
      fetchCart();
    } catch (error) {
      message.error(error.message || "Thêm vào giỏ hàng thất bại");
    } finally {
      setAddingToCart(null);
    }
  };

  const cartCount = cartData?.totalItems || 0;

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* HEADER */}
      <div style={{ flexShrink: 0, marginBottom: 20 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, color: "#1677ff" }}>
              Inbound Suppliers
            </Title>
            <Text type="secondary">Franchise Supply Marketplace</Text>
          </Col>
          <Col>
            <Tooltip title="Xem giỏ hàng">
              <Badge count={cartCount} overflowCount={99}>
                <Button
                  type="text"
                  icon={
                    <ShoppingCartOutlined
                      style={{ fontSize: 24, color: "#1677ff" }}
                    />
                  }
                  onClick={() => navigate("/warehouse/cart")}
                  style={{ width: 48, height: 48 }}
                />
              </Badge>
            </Tooltip>
          </Col>
        </Row>

        <Search
          placeholder="Search ingredient or supplier..."
          value={searchKeyword}
          allowClear
          size="large"
          style={{ marginTop: 16, maxWidth: "100%" }}
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

      {/* CONTENT */}
      <div style={{ flex: 1, paddingRight: 4, paddingBottom: 16 }}>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
            }}
          >
            <Spin size="large" />
          </div>
        ) : errorMessage ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 300,
              gap: 12,
            }}
          >
            <Text type="danger">{errorMessage}</Text>
            <Button onClick={() => fetchMarketplaceItems(searchKeyword.trim())}>
              Retry
            </Button>
          </div>
        ) : paginatedSuppliers.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
            }}
          >
            <Empty description="No marketplace item found" />
          </div>
        ) : (
          <Row gutter={[20, 20]}>
            {paginatedSuppliers.map((item) => {
              const itemKey =
                item.supplierIngredientId ||
                `${item.supplierId}-${item.ingredientId}`;
              return (
                <Col key={itemKey} xs={24} sm={12} md={8} lg={8} xl={6}>
                  <Card
                    hoverable
                    cover={
                      <div
                        style={{
                          height: 180,
                          overflow: "hidden",
                          borderRadius: "8px 8px 0 0",
                        }}
                      >
                        <img
                          src={DEFAULT_IMAGE}
                          alt={item.ingredientName || "ingredient"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.05)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />
                      </div>
                    }
                    styles={{
                      body: { padding: 16 },
                    }}
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Title
                        level={5}
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: 16,
                        }}
                        ellipsis={{ rows: 1 }}
                      >
                        {item.ingredientName}
                      </Title>

                      <Space direction="vertical" size={4} style={{ flex: 1 }}>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          <ShopOutlined style={{ marginRight: 6 }} />
                          {item.supplierName}
                        </Text>
                        <Tag color="blue" style={{ width: "fit-content" }}>
                          {item.unit || "N/A"}
                        </Tag>
                      </Space>

                      <Row
                        justify="space-between"
                        align="middle"
                        style={{ margin: "12px 0" }}
                      >
                        <Col>
                          <Text
                            strong
                            style={{ fontSize: 16, color: "#1677ff" }}
                          >
                            {formatPrice(item.unitPrice)} VND
                          </Text>
                        </Col>
                        <Col>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <EnvironmentOutlined style={{ marginRight: 4 }} />
                            {item.distanceKm != null
                              ? `${item.distanceKm} km`
                              : "N/A"}
                          </Text>
                        </Col>
                      </Row>

                      <Button
                        type="primary"
                        block
                        icon={<ShoppingCartOutlined />}
                        loading={addingToCart === itemKey}
                        onClick={() => handleAddToCart(item)}
                        style={{ borderRadius: 8 }}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </div>

      {/* FOOTER */}
      <div
        style={{
          flexShrink: 0,
          paddingTop: 16,
          display: "flex",
          justifyContent: "center",
          borderTop: "1px solid #e8e8e8",
          marginTop: 16,
        }}
      >
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