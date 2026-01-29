"use client";

import { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";

export default function HourlyProfileChart({ month }: { month: string }) {
  const chartRef = useRef<ReactECharts>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      chartRef.current?.getEchartsInstance().resize();
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const data = Array.from({ length: 24 }).map((_, h) =>
    Math.max(0, Math.round(120 * Math.sin((Math.PI * h) / 24))),
  );

  const option = {
    title: {
      text: month,
      left: "center",
      top: 8,
      textStyle: { fontSize: 12 },
    },
    grid: {
      left: 35,
      right: 15,
      top: 40,
      bottom: 25,
      containLabel: true, // 🔥
    },
    xAxis: {
      type: "category",
      data: Array.from({ length: 24 }, (_, i) => i),
    },
    yAxis: { type: "value" },
    series: [
      {
        type: "line",
        data,
        smooth: true,
        showSymbol: false,
        areaStyle: { opacity: 0.2 },
      },
    ],
  };

  return (
    <div
      className="w-full h-full overflow-hidden"
      style={{ minWidth: 0 }} // ⭐ خیلی مهم
    >
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
