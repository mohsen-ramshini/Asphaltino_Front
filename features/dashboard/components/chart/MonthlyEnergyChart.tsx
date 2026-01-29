"use client";

import { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";

export default function MonthlyEnergyChart() {
  const chartRef = useRef<ReactECharts>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const raf = requestAnimationFrame(() => {
      chartRef.current?.getEchartsInstance().resize();
    });

    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  if (!mounted) return null; // 🔥 کلید حل hydration

  const option = {
    grid: {
      left: 50,
      right: 20,
      top: 30,
      bottom: 30,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yAxis: { type: "value" },
    series: [
      {
        type: "bar",
        data: [
          62000, 72000, 98000, 120000, 145000, 162000, 168000, 160000, 138000,
          110000, 82000, 65000,
        ],
        barWidth: "45%",
      },
    ],
  };

  return (
    <div className="w-full h-full overflow-hidden" style={{ minWidth: 0 }}>
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
