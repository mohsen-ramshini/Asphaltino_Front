"use client";
import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Radio,
  Spin,
  Statistic,
  Select,
  Button,
  Timeline,
} from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

import LineChart from "../components/chart/LineChart";
import EChart from "../components/chart/EChart";
import WeatherComponent from "./weather/WeatherComponent";
import HeatMapLeaflet from "@/features/map/components/HeatMap";
import SunPathLineChart from "./chart/SunPathChart";
import { Sun, Thermometer, Mountain, Compass, TrendingUp } from "lucide-react";

// mock data
import { kpiCards } from "@/lib/constant/kpi-cards";
import { mockDeviceData } from "@/lib/mockDevice";

const { Title, Text } = Typography;

function Dashboard() {
  const [reverse, setReverse] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(
    mockDeviceData[0]?.id || null
  );
  const [selectedDevice, setSelectedDevice] = useState(mockDeviceData[0]);

  const solarMetricIcons: Record<string, any> = {
    DNI: Sun,
    GHI: TrendingUp,
    DHI: Sun,
    "GTI (Opt)": TrendingUp,
    "Opt Tilt": Compass,
    "Air Temp": Thermometer,
    Elevation: Mountain,
  };

  useEffect(() => {
    const device = mockDeviceData.find((d) => d.id === selectedDeviceId);
    if (device) setSelectedDevice(device);
  }, [selectedDeviceId]);

  const isLoading = false;

  const solarMetrics = selectedDevice
    ? [
        {
          label: "DNI",
          value: selectedDevice.solar_metrics.irradiation.dni,
          suffix: "kWh/m²",
        },
        {
          label: "GHI",
          value: selectedDevice.solar_metrics.irradiation.ghi,
          suffix: "kWh/m²",
        },
        {
          label: "DHI",
          value: selectedDevice.solar_metrics.irradiation.dhi,
          suffix: "kWh/m²",
        },
        {
          label: "GTI (Opt)",
          value: selectedDevice.solar_metrics.irradiation.gti_opt,
          suffix: "kWh/m²",
        },
        {
          label: "Opt Tilt",
          value: `${selectedDevice.solar_metrics.optimal_panel_position.tilt_deg}° / ${selectedDevice.solar_metrics.optimal_panel_position.azimuth_deg}°`,
        },
        {
          label: "Air Temp",
          value:
            selectedDevice.solar_metrics.environmental_context
              .avg_air_temperature_c,
          suffix: "°C",
        },
        {
          label: "Elevation",
          value: selectedDevice.solar_metrics.environmental_context.elevation_m,
          suffix: "m",
        },
      ]
    : [];

  const normalizedDevice = {
    ...selectedDevice,
    energy: {
      ...selectedDevice.energy,
      generation: selectedDevice.energy.generation.map((g) => ({
        type: g.type,
        value: g.max_power_w,
      })),
    },
  };

  const currentHour = new Date().getHours();

  const filteredAlerts =
    selectedDevice?.notifications_daily.filter((n) => n.hour <= currentHour) ||
    [];

  const timelineListAlert = (
    reverse ? filteredAlerts.slice(0, 8) : filteredAlerts.slice(-5)
  ).map((n) => ({
    title: n.message,
    time: `${n.hour}:00`,
    color: n.type === "warning" ? "red" : "blue",
  }));

  return (
    <div className="p-6 overflow-x-hidden space-y-6">
      {/* KPI CARDS */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
          <span className="ml-3 text-gray-600">Loading dashboard data...</span>
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {kpiCards.map((card, index) => (
            <Col key={index} xs={24} sm={12} md={12} lg={6} xl={6}>
              <Card
                className="rounded-xl border-0 shadow-sm hover:shadow-md transition-shadow duration-300 h-full"
                style={{ padding: 24 }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Text className="text-gray-500 text-sm block mb-1">
                      {card.title}
                    </Text>

                    <div className="flex items-end flex-wrap">
                      <Title level={2} className={`mb-0 ${card.textColor}`}>
                        {card.value}
                        {card.suffix || ""}
                      </Title>
                      <span
                        className={`ml-2 mb-1 font-medium text-sm ${
                          card.change > 0 ? "text-green-500" : "text-red-500"
                        } flex items-center`}
                      >
                        {card.change > 0 ? (
                          <ArrowUpOutlined />
                        ) : (
                          <ArrowDownOutlined />
                        )}
                        {Math.abs(card.change)}%
                      </span>
                    </div>

                    <Text className="text-gray-500 text-xs block mt-1">
                      {card.description}
                    </Text>
                  </div>

                  <div
                    className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg text-white shrink-0`}
                  >
                    {card.icon}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} sm={12} md={8}>
          <Select
            value={selectedDeviceId!}
            onChange={(value) => setSelectedDeviceId(value)}
            options={mockDeviceData.map((d) => ({
              label: d.name,
              value: d.id,
            }))}
            className="w-full"
            placeholder="Select a device"
          />
        </Col>
      </Row>

      {/* HEAT MAP */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card
            className="rounded-xl border-0 shadow-sm bg-white"
            style={{ padding: 12 }}
          >
            <div className="h-[400px] w-full bg-white rounded-lg overflow-hidden">
              {selectedDevice && (
                <HeatMapLeaflet
                  points={[
                    [
                      selectedDevice.location.latitude,
                      selectedDevice.location.longitude,
                      1,
                    ],
                  ]}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* SOLAR METRICS + SUN PATH */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            className="rounded-xl border-0 shadow-sm bg-white h-full"
            style={{ padding: 24 }}
          >
            <Row gutter={[16, 16]}>
              {solarMetrics.map((item, index) => {
                const Icon = solarMetricIcons[item.label];

                return (
                  <Col key={index} xs={24} sm={12} md={8}>
                    <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 hover:shadow-sm transition">
                      {/* Icon */}
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        {Icon && <Icon size={20} />}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">
                          {item.label}
                        </span>

                        <div className="flex items-end gap-1">
                          <span className="text-lg font-semibold text-gray-900">
                            {item.value}
                          </span>
                          {item.suffix && (
                            <span className="text-xs text-gray-400">
                              {item.suffix}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className="rounded-xl border-0 shadow-sm bg-white h-full">
            {selectedDevice && (
              <SunPathLineChart
                sunAngleData={{
                  summer: selectedDevice.sun_angle_daily.map((item) => [
                    item.hour,
                    item.angle_deg,
                  ]),
                }}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* CHARTS */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card className="rounded-xl border-0 shadow-sm bg-white">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 min-w-0">
                <LineChart device={normalizedDevice} />
              </div>
              <div className="flex-1 min-w-0">
                <EChart deviceData={selectedDevice} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* WEATHER + ALERTS */}
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} xl={16}>
          <Card className="rounded-xl border-0 shadow-sm h-full p-6 bg-white">
            <WeatherComponent />
          </Card>
        </Col>

        <Col xs={24} md={12} xl={8}>
          <Card className="rounded-xl border-0 shadow-sm h-full p-6 bg-white">
            <div>
              <div className="flex justify-between items-center mb-4">
                <Title level={5} className="mb-0">
                  Alerts
                </Title>
                <Radio.Group
                  defaultValue="a"
                  buttonStyle="solid"
                  size="small"
                  onChange={(e) => setReverse(e.target.value === "b")}
                >
                  <Radio.Button value="a">Newest</Radio.Button>
                  <Radio.Button value="b">Oldest</Radio.Button>
                </Radio.Group>
              </div>

              <Timeline
                className="mb-6"
                reverse={reverse}
                items={timelineListAlert.map((t) => ({
                  color: t.color,
                  children: (
                    <>
                      <div className="mb-1 font-medium text-gray-900">
                        {t.title}
                      </div>
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
  );
}

export default Dashboard;
