import React, { useState } from "react";
import { Input, Button, Card, Tag, Rate, Badge, Pagination } from "antd";
import { ShoppingCartOutlined, PlusOutlined } from "@ant-design/icons";
import "./InboundStyles.css";

const { Search } = Input;

const mockSuppliers = [
  {
    id: 1,
    name: "Arabica Coffee Beans",
    sku: "CF-AR01",
    category: "Coffee",
    price: 120000,
    stock: 1200,
    rating: 4.8,
    lowStock: false,
    image:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500",
  },
  {
    id: 2,
    name: "Fresh Milk Supplier",
    sku: "MK-FR02",
    category: "Dairy",
    price: 35000,
    stock: 120,
    rating: 4.6,
    lowStock: true,
    image:
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500",
  },
  {
    id: 3,
    name: "Premium Green Tea",
    sku: "TE-GR03",
    category: "Tea",
    price: 80000,
    stock: 560,
    rating: 4.7,
    lowStock: false,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500",
  },
  {
    id: 3,
    name: "Premium Green Tea",
    sku: "TE-GR03",
    category: "Tea",
    price: 80000,
    stock: 560,
    rating: 4.7,
    lowStock: false,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500",
  },
  {
    id: 3,
    name: "Premium Green Tea",
    sku: "TE-GR03",
    category: "Tea",
    price: 80000,
    stock: 560,
    rating: 4.7,
    lowStock: false,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500",
  },
  {
    id: 3,
    name: "Premium Green Tea",
    sku: "TE-GR03",
    category: "Tea",
    price: 80000,
    stock: 560,
    rating: 4.7,
    lowStock: false,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500",
  },
  {
    id: 3,
    name: "Premium Green Tea",
    sku: "TE-GR03",
    category: "Tea",
    price: 80000,
    stock: 560,
    rating: 4.7,
    lowStock: false,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500",
  },
  {
    id: 3,
    name: "Premium Green Tea",
    sku: "TE-GR03",
    category: "Tea",
    price: 80000,
    stock: 560,
    rating: 4.7,
    lowStock: false,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500",
  },

  {
    id: 3,
    name: "Premium Green Tea",
    sku: "TE-GR03",
    category: "Tea",
    price: 80000,
    stock: 560,
    rating: 4.7,
    lowStock: false,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500",
  },
  {
    id: 3,
    name: "Premium Green Tea",
    sku: "TE-GR03",
    category: "Tea",
    price: 80000,
    stock: 560,
    rating: 4.7,
    lowStock: false,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500",
  },
];

const categories = ["All", "Coffee", "Dairy", "Tea"];

const PAGE_SIZE = 16; 

const InboundPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter theo category
  const filteredSuppliers =
    selectedCategory === "All"
      ? mockSuppliers
      : mockSuppliers.filter(
          (item) => item.category === selectedCategory
        );

  // Logic phân trang
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedSuppliers = filteredSuppliers.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  return (
  <div className="inbound-layout">

    {/* HEADER */}
    <div className="inbound-header-section">
      <div className="inbound-header">
        <div>
          <h2>Inbound Suppliers</h2>
          <span className="sub-text">
            Franchise Supply Marketplace
          </span>
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
        placeholder="Search supplier..."
        className="search-bar"
      />

      <div className="category-filter">
        {categories.map((cat) => (
          <Tag
            key={cat}
            className={
              selectedCategory === cat
                ? "category-tag active"
                : "category-tag"
            }
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
          >
            {cat}
          </Tag>
        ))}
      </div>
    </div>

    {/* CONTENT (SCROLL ZONE) */}
    <div className="inbound-content-section">
      <div className="supplier-grid">
        {paginatedSuppliers.map((item) => (
          <Card
            key={item.id}
            hoverable
            className="supplier-card"
            cover={
              <div className="image-wrapper">
                {item.lowStock && (
                  <div className="low-stock-badge">
                    Low Stock
                  </div>
                )}
                <img src={item.image} alt="" />
              </div>
            }
          >
            <div className="card-header">
              <h3>{item.name}</h3>
              <Rate disabled allowHalf defaultValue={item.rating} />
            </div>

            <p className="sku">SKU: {item.sku}</p>
            <p className="category">{item.category}</p>

            <div className="price-stock">
              <span className="price">
                {item.price.toLocaleString()} VND
              </span>
              <span className="stock">
                {item.stock} pcs
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
    </div>

    {/* FOOTER */}
    <div className="inbound-footer">
      <Pagination
        current={currentPage}
        pageSize={PAGE_SIZE}
        total={filteredSuppliers.length}
        onChange={(page) => setCurrentPage(page)}
        showSizeChanger={false}
      />
    </div>

  </div>
);
};

export default InboundPage;