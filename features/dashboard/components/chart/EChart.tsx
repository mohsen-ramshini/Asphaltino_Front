"use client";

import { useEffect, useState } from "react";
import { Row, Col, Typography, Skeleton } from "antd";

const { Title, Paragraph } = Typography;

interface IcingProbability {
  hour: number;
  probability: number; // 0 → 1
}

interface DeviceData {
  icing_probability_daily?: IcingProbability[];
}

interface EChartProps {
  deviceData?: DeviceData;
}

const EChart: React.FC<EChartProps> = ({ deviceData }) => {
  const [ReactApexChart, setReactApexChart] = useState<any>(null);

  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setReactApexChart(() => mod.default);
    });
  }, []);

  if (!ReactApexChart) {
    return (
      <Skeleton.Node active style={{ width: "100%", height: 260 }}>
        <div className="h-[260px] bg-gray-50 rounded-lg" />
      </Skeleton.Node>
    );
  }

  // ---------- DATA ----------
  const probabilities =
    deviceData?.icing_probability_daily?.map((d) =>
      Math.round(d.probability * 100)
    ) || [];

  const hours =
    deviceData?.icing_probability_daily?.map((d) => `${d.hour}:00`) || [];

  const max = Math.max(...probabilities);
  const avg =
    probabilities.reduce((a, b) => a + b, 0) / (probabilities.length || 1);
  const current = probabilities[0] ?? 0;

  // ---------- CHART ----------
  const series = [
    {
      name: "Icing Probability (%)",
      data: probabilities,
    },
  ];

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "55%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: hours,
      title: { text: "Hour of Day" },
    },
    yaxis: {
      max: 100,
      title: { text: "Probability (%)" },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`,
      },
    },
    colors: ["#f59e0b"],
  };

  return (
    <section className="h-full flex flex-col justify-between">
      {/* CHART */}
      <div>
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={220}
        />
      </div>

      {/* SUMMARY */}
      <div className="mt-4">
        <Title level={5}>Black Ice Formation Probability</Title>
        <Paragraph className="text-gray-600">
          Based on environmental conditions in the next 24 hours
        </Paragraph>

        <Row gutter={16} className="mt-3">
          <Col span={8}>
            <Title level={4} className="text-blue-500">
              {current}%
            </Title>
            <span className="text-gray-500 text-sm">Current</span>
          </Col>

          <Col span={8}>
            <Title level={4} className="text-red-500">
              {max}%
            </Title>
            <span className="text-gray-500 text-sm">Peak</span>
          </Col>

          <Col span={8}>
            <Title level={4} className="text-amber-500">
              {avg.toFixed(0)}%
            </Title>
            <span className="text-gray-500 text-sm">Average</span>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default EChart;
