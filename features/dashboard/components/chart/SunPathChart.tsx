"use client";

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";

interface SunPathLineChartProps {
  sunAngleData?: {
    summer?: [number, number][];
    equinox?: [number, number][];
    winter?: [number, number][];
    horizon?: [number, number][];
  };
}

const generateSunPath = (maxAltitude: number, shift = 0): [number, number][] =>
  Array.from({ length: 37 }).map((_, i) => {
    const azimuth = i * 10; // 0 → 360
    const rad = ((azimuth - 180 + shift) * Math.PI) / 180;
    const altitude = Math.max(0, maxAltitude * Math.cos(rad));
    return [azimuth, Number(altitude.toFixed(1))];
  });

const generateHorizonProfile = (): [number, number][] =>
  Array.from({ length: 37 }).map((_, i) => {
    const azimuth = i * 10;
    const noise = Math.sin(i / 3) * 2 + Math.cos(i / 5);
    return [azimuth, Math.max(0, 5 + noise)];
  });

const SunPathLineChart: React.FC<SunPathLineChartProps> = ({
  sunAngleData,
}) => {
  const data = useMemo(() => {
    return {
      summer: sunAngleData?.summer ?? generateSunPath(78), // summer high sun
      equinox: sunAngleData?.equinox ?? generateSunPath(55),
      winter: sunAngleData?.winter ?? generateSunPath(32), // winter low sun
      horizon: sunAngleData?.horizon ?? generateHorizonProfile(),
    };
  }, [sunAngleData]);

  const option = {
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const p = params[0];
        return `
          <b>${p.seriesName}</b><br/>
          Azimuth: ${p.value[0]}°<br/>
          Altitude: ${p.value[1]}°
        `;
      },
    },

    legend: {
      top: 20,
      left: "center",
      itemGap: 16,
      textStyle: {
        fontSize: 12,
        color: "#374151",
      },
    },

    grid: {
      left: 50,
      right: 30,
      top: 80,
      bottom: 40,
      containLabel: true,
    },

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
        lineStyle: { width: 2, color: "#f97316" },
      },
      {
        name: "Equinox Sun Path",
        type: "line",
        smooth: true,
        data: data.equinox,
        lineStyle: { width: 2, type: "dashed", color: "#3b82f6" },
      },
      {
        name: "Winter Sun Path",
        type: "line",
        smooth: true,
        data: data.winter,
        lineStyle: { width: 2, type: "dotted", color: "#6366f1" },
      },
      {
        name: "Horizon Profile",
        type: "line",
        data: data.horizon,
        lineStyle: { width: 3, color: "#6b7280" },
        areaStyle: { opacity: 0.1 },
      },
    ],
  };

  return (
    <div className="w-full overflow-hidden" style={{ minWidth: 0 }}>
      <ReactECharts option={option} style={{ height: 380, width: "100%" }} />
    </div>
  );
};

export default SunPathLineChart;
