import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import { HomeOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

/**
 * Renders the statistics cards for the warehouse list.
 * @param {Object} stats - The stats object containing total and active counts.
 */
const WarehouseStatCards = ({ stats }) => (
  <motion.div>
    <Row gutter={16} style={{ margin: "30px 0" }}>
      <Col xs={24} sm={12} md={6}>
        <Card className="dashboard-card">
          <Statistic
            title="Tổng Kho Hàng"
            value={stats.total}
            prefix={<HomeOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card className="dashboard-card">
          <Statistic
            title="Cơ sở hoạt động"
            value={stats.active}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
    </Row>
  </motion.div>
);

export default WarehouseStatCards;
