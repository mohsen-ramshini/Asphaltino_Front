"use client";

import { useState, useEffect } from "react";
import { Typography, Skeleton } from "antd";

interface Device {
  id: number;
  name: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  status: string;
  energy: {
    storage: {
      type: string;
      capacity_wh: number;
      current_level_percent: number;
    };
    generation: {
      type: string;
      value: number;
    }[];
  };
  temperature_asphalt?: { hour: number; value: number }[];
  temperature_air?: { hour: number; value: number }[];
  [key: string]: any; // بقیه فیلدها
}

interface LineChartProps {
  device?: Device;
}

const LineChart: React.FC<LineChartProps> = ({ device }) => {
  const { Title, Paragraph } = Typography;
  const [ReactApexChartComponent, setReactApexChartComponent] =
    useState<any>(null);

  useEffect(() => {
    import("react-apexcharts").then((mod) =>
      setReactApexChartComponent(() => mod.default)
    );
  }, []);

  if (!ReactApexChartComponent) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  const series = [
    {
      name: "Asphalt Temp",
      data:
        device?.temperature_records?.asphalt_temperature?.map((d: any) => [
          d.hour,
          d.value_c,
        ]) || [],
    },
    {
      name: "Air Temp",
      data:
        device?.temperature_records?.air_temperature?.map((d: any) => [
          d.hour,
          d.value_c,
        ]) || [],
    },
  ];

  const options = {
    chart: { type: "area", toolbar: { show: true }, zoom: { enabled: true } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    xaxis: { type: "category", title: { text: "Hour" } },
    yaxis: { title: { text: "Temperature (°C)" } },
    tooltip: { shared: true, intersect: false },
    colors: ["#f59e0b", "#3b82f6"],
  };

  return (
    <>
      <div className="linechart mb-4">
        <div>
          <Title level={5}>Temperature Monitoring</Title>
          <Paragraph>
            Critical conditions when asphalt temp is{" "}
            <span className="text-red-500 font-medium">below 0°C</span> and air
            temp is{" "}
            <span className="text-blue-500 font-medium">below freezing</span>
          </Paragraph>
        </div>
      </div>

      <ReactApexChartComponent
        options={options}
        series={series}
        type="area"
        height={350}
        width="100%"
      />
    </>
  );
};

export default LineChart;
