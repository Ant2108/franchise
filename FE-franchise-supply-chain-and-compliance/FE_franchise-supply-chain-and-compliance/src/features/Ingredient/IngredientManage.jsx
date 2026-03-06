import {
  Table,
  Input,
  Button,
  Space,
  Typography,
  Card,
  Tag,
  Row,
  Col
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import ingredientAPI from "./IngredientAPI/IngredientAPI";
import "./IngredientManage.css";

const { Title, Text } = Typography;

const IngredientManage = () => {

  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

 const fetchIngredients = async () => {
  try {
    setLoading(true);

    const res = await ingredientAPI.getIngredient();

    console.log("FULL RESPONSE:", res);
    console.log("DATA:", res.data);

    setIngredients(res || []);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchIngredients();
  }, []);

  const columns = [
  
  {
    title: "Ingredient",
    dataIndex: "ingredientName"
  },
  {
    title: "Unit",
    dataIndex: "unit"
  },
  {
    title: "Alert Threshold",
    dataIndex: "alertThreshold"
  },
  {
    title: "Description",
    dataIndex: "description"
  },
  {
    title: "Status",
    render: () => <Tag color="green">Active</Tag>
  }
];

  return (
    <div className="ingredient-page">

      {/* HEADER */}
      <div className="ingredient-header">

        <div>
          <Title level={3} className="ingredient-title">
            Ingredient Management
          </Title>
          <Text type="secondary">Quản lý nguyên liệu</Text>
        </div>

        <Button type="primary" icon={<PlusOutlined />}>
          Thêm Ingredient
        </Button>

      </div>

      {/* SEARCH */}
      <div className="ingredient-search">
        <Input
          placeholder="Tìm theo tên ingredient..."
          prefix={<SearchOutlined />}
          size="large"
        />
      </div>

      {/* TABLE */}
      <Card className="ingredient-table-card">
        <Table
          columns={columns}
          dataSource={ingredients}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

    </div>
  );
};

export default IngredientManage;