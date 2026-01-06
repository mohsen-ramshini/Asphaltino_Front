import React from "react";
import ReactECharts from "echarts-for-react";

interface SunPathLineChartProps {
  sunAngleData?: {
    summer?: [number, number][];
    equinox?: [number, number][];
    winter?: [number, number][];
    horizon?: [number, number][];
  };
}

const SunPathLineChart: React.FC<SunPathLineChartProps> = ({
  sunAngleData,
}) => {
  const data = { ...sunAngleData };

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "line" },
    },
    legend: { top: 8 },
    grid: { left: 40, right: 20, top: 50, bottom: 40 },
    xAxis: {
      type: "value",
      min: 0,
      max: 360,
      name: "Azimuth (°)",
      axisLabel: { formatter: "{value}°" },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 90,
      name: "Solar Altitude (°)",
      axisLabel: { formatter: "{value}°" },
    },
    series: [
      {
        name: "Summer Sun Path",
        type: "line",
        smooth: true,
        data: data.summer,
        lineStyle: { width: 2 },
      },
      {
        name: "Equinox Sun Path",
        type: "line",
        smooth: true,
        data: data.equinox,
        lineStyle: { width: 2, type: "dashed" },
      },
      {
        name: "Winter Sun Path",
        type: "line",
        smooth: true,
        data: data.winter,
        lineStyle: { width: 2, type: "dotted" },
      },
      {
        name: "Horizon Profile",
        type: "line",
        data: data.horizon,
        lineStyle: { width: 3 },
        areaStyle: { opacity: 0.08 },
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ height: 380, width: "100%" }} />
  );
};

export default SunPathLineChart;
