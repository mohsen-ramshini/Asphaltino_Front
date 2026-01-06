"use client";

import { Card, Col, Row, Typography, Spin } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

import { kpiCards } from "@/lib/constant/kpi-cards";
import DeviceComponent from "@/features/device/components/DeviceComponent";
import MapComonent from "./components/MapComponent";

const { Title, Text } = Typography;

function Map() {
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-40">
        <Spin size="large" />
        <span className="ml-3 text-gray-600">Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* DEVICE COMPONENT (FULL WIDTH, ALIGNED) */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <MapComonent />
        </Col>
      </Row>
    </div>
  );
}

export default Map;
