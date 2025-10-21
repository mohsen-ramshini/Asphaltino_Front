"use client"
import { useEffect, useState } from "react";

import {
  Card,
  Col,
  Row,
  Typography,
  Tooltip,
  Progress,
  Button,
  Timeline,
  Radio,
  Spin,
  Statistic,
} from "antd";
import {
  // ThermometerOutlined,
  AlertOutlined,
  WarningOutlined,
  ToolOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import Paragraph from "antd/lib/typography/Paragraph";
import { BsSnow, BsDroplet } from 'react-icons/bs';
import { MdDeviceUnknown } from 'react-icons/md';

import LineChart from "../components/chart/LineChart";
import MapComponent from "./map/MapComponent";
import EChart from "../components/chart/EChart";
import WeatherComponent from "./weather/WeatherComponent";
import { useGetDevices } from "@/features/device/api/use-get-devices";
import { useGetDeviceStatsOverview } from "@/features/dashboard/api/data/use-get-device-stats-overview";
import { useGetSystemAlerts } from "@/features/dashboard/api/alerts/use-get-system-alerts";

function Dashboard() {
  const { Title, Text } = Typography;
  const [reverse, setReverse] = useState(false);
  
  // Fetch data from API endpoints
  const { data: devices, isLoading: isLoadingDevices } = useGetDevices();
  // const { data: statsOverview, isLoading: isLoadingStats } = useGetDeviceStatsOverview();
  // const { data: systemAlerts, isLoading: isLoadingAlerts } = useGetSystemAlerts();
  
  // Calculate KPI metrics
  const totalDevices = devices?.length || 0;
  // const activeDevices = devices?.filter(device => device.status === 'online')?.length || 0;
  const activeDevices = 0;
  // const maintenanceNeeded = statsOverview?.maintenanceCount || 0;
  const maintenanceNeeded = 0;
  // const criticalAlerts = systemAlerts?.filter(alert => alert.severity === 'critical')?.length || 0;
  const criticalAlerts = 0;
  // const icingPoints = statsOverview?.icingCount || 0;
  const icingPoints = 1;
  
  // Percent changes (simulated - in a real app these would come from API)
  const icingChange = icingPoints > 20 ? 30 : -10;
  const maintenanceChange = maintenanceNeeded > 3 ? 20 : -15;
  const activeChange = activeDevices > (totalDevices * 0.8) ? 5 : -20;
  const alertsChange = criticalAlerts > 3 ? 10 : -5;

  // const isLoading = isLoadingDevices  || isLoadingAlerts || isLoadingStats;
  const isLoading = false
  
  const kpiCards = [
    {
      title: "Active Icing Points",
      value: icingPoints,
      change: icingChange,
      icon: <BsSnow className="text-2xl" />,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      description: "Locations with detected ice formation"
    },
    {
      title: "Devices Needing Maintenance",
      value: maintenanceNeeded,
      change: maintenanceChange,
      icon: <ToolOutlined className="text-2xl" />,
      color: "from-amber-500 to-amber-600",
      textColor: "text-amber-600",
      description: "Sensors requiring attention"
    },
    {
      title: "Active Devices",
      value: activeDevices,
      suffix: `/${totalDevices}`,
      change: activeChange,
      icon: <MdDeviceUnknown className="text-2xl" />,
      color: "from-emerald-500 to-emerald-600",
      textColor: "text-emerald-600",
      description: "Online sensors transmitting data"
    },
    {
      title: "Critical Alerts",
      value: criticalAlerts,
      change: alertsChange,
      icon: <AlertOutlined className="text-2xl" />,
      color: "from-red-500 to-red-600",
      textColor: "text-red-600", 
      description: "High priority system warnings"
    },
  ];

  // Format alerts for timeline
  // const formatAlerts = () => {
  //   if (!systemAlerts || systemAlerts.length === 0) return [];
    
  //   return systemAlerts.slice(0, 6).map(alert => ({
  //     title: alert.message,
  //     time: new Date(alert.timestamp).toLocaleString(),
  //     color: alert.severity === 'critical' ? 'red' : 
  //            alert.severity === 'warning' ? 'orange' : 
  //            alert.severity === 'info' ? 'blue' : 'gray'
  //   }));
  // };

const timelineList = [
  {
    title: "Icing detected at Ardabil Airport sensor",
    time: "10 Bahman 1403, 7:20 AM",
    color: "red",
  },
  {
    title: "Low battery detected at Ardabil Airport sensor",
    time: "9 Bahman 1403, 12:20 PM",
    color: "orange",
  },
  {
    title: "Temperature below threshold at Ardabil Airport sensor",
    time: "9 Bahman 1403, 3:10 PM",
    color: "red",
  },
  {
    title: "Maintenance completed on Ardabil Airport sensor",
    time: "8 Bahman 1403, 2:45 PM",
    color: "green",
  },
  {
    title: "New calibration applied to Ardabil Airport sensor",
    time: "7 Bahman 1403, 1:30 PM",
    color: "blue",
  },
  {
    title: "System update completed for Ardabil Airport sensor",
    time: "5 Bahman 1403, 3:30 PM",
    color: "gray",
  },
];


  return (
    <>
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" />
            <span className="ml-3 text-gray-600">Loading dashboard data...</span>
          </div>
        ) : (
          <Row className="gap-y-6" gutter={[24, 0]}>
            {kpiCards.map((card, index) => (
              <Col
                key={index}
                xs={24}
                sm={12}
                md={12}
                lg={6}
                xl={6}
                className="mb-6"
              >
                <Card 
                  className="rounded-xl border-0 shadow-sm hover:shadow-md transition-shadow duration-300"
                  styles={{ body: { padding: "24px" } }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Text className="text-gray-500 text-sm block mb-1">{card.title}</Text>
                      <div className="flex items-end">
                        <Title level={2} className={`mb-0 ${card.textColor}`}>
                          {card.value}{card.suffix || ''}
                        </Title>
                        <span className={`ml-2 mb-1 font-medium text-sm ${card.change > 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                          {card.change > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                          {Math.abs(card.change)}%
                        </span>
                      </div>
                      <Text className="text-gray-500 text-xs block mt-1">{card.description}</Text>
                    </div>
                    <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg text-white`}>
                      {card.icon}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-6">
            <Card className="rounded-xl border-0 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
              <LineChart /> 
              <EChart />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-6">
            <Card className="rounded-xl border-0 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
              <MapComponent/>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={16} className="mb-6">
            <Card className="rounded-xl border-0 shadow-sm hover:shadow-md transition-shadow duration-300 h-full p-6">
                <WeatherComponent />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-6">
            <Card className="rounded-xl border-0 shadow-sm hover:shadow-md transition-shadow duration-300 h-full p-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Title level={5} className="mb-0">Alerts</Title>
                  <Radio.Group 
                    defaultValue="a" 
                    buttonStyle="solid" 
                    size="small"
                    onChange={(e) => setReverse(e.target.value === 'b')}
                  >
                    <Radio.Button value="a">Newest</Radio.Button>
                    <Radio.Button value="b">Oldest</Radio.Button>
                  </Radio.Group>
                </div>
                
                <Timeline
                  className="mb-6"
                  reverse={reverse}
                  items={timelineList.map((t) => ({
                    color: t.color,
                    children: (
                      <>
                        <div className="mb-1 font-medium text-gray-900">{t.title}</div>
                        <div className="text-gray-500 text-xs">{t.time}</div>
                      </>
                    ),
                  }))}
                />
                <Button
                  disabled
                  type="primary"
                  className="w-full bg-blue-500 border-blue-500 hover:bg-blue-600"
                >
                  View All Alerts
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
