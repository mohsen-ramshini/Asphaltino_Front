import {
  Card,
  Col,
  Row,
  Typography,
  Spin,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";

import { kpiCards } from "@/lib/constant/kpi-cards";



function Dashboard() {
  const { Title, Text } = Typography;
  
  // Fetch data from API endpoints
  // const { data: devices, isLoading: isLoadingDevices } = useGetDevices();
  // const { data: statsOverview, isLoading: isLoadingStats } = useGetDeviceStatsOverview();
  // const { data: systemAlerts, isLoading: isLoadingAlerts } = useGetSystemAlerts();
  
   const isLoading = false



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
                      <div className="text-gray-500 text-sm block mb-1">{card.title}</div>
                      <div className="flex items-end">
                        <h2  className={`mb-0 ${card.textColor}`}>
                          {card.value}{card.suffix || ''}
                        </h2>
                        <span className={`ml-2 mb-1 font-medium text-sm ${card.change > 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                          {card.change > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                          {Math.abs(card.change)}%
                        </span>
                      </div>
                      <div className="text-gray-500 text-xs block mt-1">{card.description}</div>
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
              box 1
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-6">
            <Card className="rounded-xl border-0 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
              box 2
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={16} className="mb-6">
            <Card className="rounded-xl border-0 shadow-sm hover:shadow-md transition-shadow duration-300 h-full p-6">
                box 3
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} className="mb-6">
            <Card className="rounded-xl border-0 shadow-sm hover:shadow-md transition-shadow duration-300 h-full p-6">
              box 4
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
