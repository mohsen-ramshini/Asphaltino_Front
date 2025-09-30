/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

"use client";

import { useState, useEffect } from "react";
import { Typography, Skeleton, Card } from "antd";
import { MinusOutlined } from "@ant-design/icons";
import lineChart from "./configs/lineChart";

function LineChart() {
  const { Title, Paragraph } = Typography;
  const [ReactApexChart, setReactApexChart] = useState(null);

  useEffect(() => {
    // Dynamically import ReactApexChart only on client side
    import("react-apexcharts").then((mod) => {
      setReactApexChart(() => mod.default);
    });
  }, []);

  if (!ReactApexChart) {
    return (
      <div className="space-y-4">
        <div className="linechart">
          <div>
            <Skeleton.Input style={{ width: 200, height: 20 }} active />
            <div className="mt-2">
              <Skeleton.Input style={{ width: 300, height: 16 }} active />
            </div>
          </div>
          <div className="sales mt-4">
            <div className="flex space-x-4">
              <Skeleton.Input style={{ width: 120, height: 16 }} active />
              <Skeleton.Input style={{ width: 100, height: 16 }} active />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Skeleton.Node
            active
            style={{ width: "100%", height: 350 }}
          >
            <div className="flex items-center justify-center h-[350px] bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-6 h-6 text-blue-500 animate-pulse"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">
                  Loading Temperature Chart...
                </p>
              </div>
            </div>
          </Skeleton.Node>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>Temperature Monitoring</Title>
          <Paragraph className="lastweek">
            Critical conditions when asphalt temp is{" "}
            <span className="text-red-500 font-medium">below 0°C</span> and air
            temp is{" "}
            <span className="text-blue-500 font-medium">below freezing</span>
          </Paragraph>
        </div>
        <div className="sales">
          <ul>
            <li>
              <span className="w-3 h-3 inline-block bg-amber-500 rounded-full mr-2"></span>
              Asphalt Temp
            </li>
            <li>
              <span className="w-3 h-3 inline-block bg-blue-500 rounded-full mr-2"></span>
              Air Temp
            </li>
          </ul>
        </div>
      </div>

      <ReactApexChart
        className="full-width"
        options={lineChart.options}
        series={lineChart.series}
        type="area"
        height={350}
        width={"100%"}
      />
    </>
  );
}

export default LineChart;
