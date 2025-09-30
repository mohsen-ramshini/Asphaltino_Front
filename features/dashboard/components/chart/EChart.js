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
import { Row, Col, Typography, Skeleton } from "antd";
import eChart from "./configs/eChart";

function EChart() {
  const { Title, Paragraph } = Typography;
  const [ReactApexChart, setReactApexChart] = useState(null);

  useEffect(() => {
    // Dynamically import ReactApexChart only on client side
    import("react-apexcharts").then((mod) => {
      setReactApexChart(() => mod.default);
    });
  }, []);

  const items = [
    {
      Title: "8%",
      user: "Current",
      color: "text-blue-600",
    },
    {
      Title: "75%",
      user: "Peak",
      color: "text-red-500",
    },
    {
      Title: "32%",
      user: "Average",
      color: "text-amber-500",
    },
    {
      Title: "5°C",
      user: "Min Temp",
      color: "text-blue-400",
    },
  ];

  if (!ReactApexChart) {
    return (
      <div className="space-y-4">
        <div className="mb-4">
          <Skeleton.Node
            active
            style={{ width: "100%", height: 220 }}
          >
            <div className="flex items-center justify-center h-[220px] bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-6 h-6 text-amber-500 animate-pulse"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">
                  Loading Probability Chart...
                </p>
              </div>
            </div>
          </Skeleton.Node>
        </div>

        <div className="chart-visitor">
          <Skeleton.Input
            style={{ width: 250, height: 20 }}
            active
            className="mb-2"
          />
          <div className="space-y-2 mb-4">
            <Skeleton.Input
              style={{ width: 200, height: 16 }}
              active
            />
            <Skeleton.Input
              style={{ width: 350, height: 14 }}
              active
            />
            <Skeleton.Input
              style={{ width: 320, height: 14 }}
              active
            />
          </div>

          <Row gutter>
            {[1, 2, 3, 4].map((index) => (
              <Col xs={6} xl={6} sm={6} md={6} key={index}>
                <div className="chart-visitor-count">
                  <Skeleton.Input
                    style={{ width: 40, height: 24 }}
                    active
                    className="mb-1"
                  />
                  <Skeleton.Input
                    style={{ width: 60, height: 14 }}
                    active
                  />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="chart">
        <ReactApexChart
          className="bar-chart"
          options={eChart.options}
          series={eChart.series}
          type="bar"
          height={220}
        />
      </div>
      <div className="chart-vistior">
        <Title level={5}>Black Ice Formation Probability</Title>
        <Paragraph className="lastweek">
          Risk level is{" "}
          <span className="text-amber-500 font-medium">moderate</span> for the
          next 24 hours
        </Paragraph>
        <Paragraph className="lastweek text-gray-500 text-sm">
          Black ice typically forms when temperatures are near freezing and
          roadways are wet, becoming especially dangerous during nighttime and
          early morning hours.
        </Paragraph>
        <Row gutter>
          {items.map((v, index) => (
            <Col xs={6} xl={6} sm={6} md={6} key={index}>
              <div className="chart-visitor-count">
                <Title level={4} className={v.color}>
                  {v.Title}
                </Title>
                <span className="text-gray-600">{v.user}</span>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default EChart;
