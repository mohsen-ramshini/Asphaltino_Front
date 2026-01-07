"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Descriptions,
  Tag,
  Statistic,
  Button as AntdButton,
  Progress,
  Divider,
} from "antd";
import { EditOutlined, SettingOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface DeviceDetailsSidebarProps {
  deviceInfo: any;
  onClose: () => void;
  scenarioMode?: boolean;
}

function formatDate(dateString?: string) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-US");
}

const DeviceDetailsSidebar: React.FC<DeviceDetailsSidebarProps> = ({
  deviceInfo,
  onClose,
  scenarioMode = true,
}) => {
  const [currentAsphaltTemp, setCurrentAsphaltTemp] = useState(
    deviceInfo?.temperature_records?.asphalt_temperature?.[0]?.value_c ?? 0
  );
  const [heatingMessage, setHeatingMessage] = useState("");

  useEffect(() => {
    if (!scenarioMode || !deviceInfo?.temperature_records?.asphalt_temperature)
      return;

    const asphaltTemps = deviceInfo.temperature_records.asphalt_temperature;
    const heatingStatusDaily = deviceInfo.heating_status_daily;

    const updateTemperature = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const minutesIntoHour = now.getMinutes();
      const secondsIntoMinute = now.getSeconds();

      const currentTemp =
        asphaltTemps.find((t: any) => t.hour === currentHour)?.value_c ?? 0;

      const heaterStatus = heatingStatusDaily.find(
        (h: any) => h.hour === currentHour
      )?.status;

      // هدف دمای ساعت بعد
      let targetTemp = currentTemp;

      if (heaterStatus === "ON") {
        // اگر heater روشن است → هدف دما صفر
        targetTemp = 0;
        setHeatingMessage(
          `Heating active: ${
            heatingStatusDaily.find((h: any) => h.hour === currentHour)?.source ||
            "electric element"
          }`
        );
      } else {
        // heater OFF → هدف دمای ساعت بعد
        const nextHour = (currentHour + 1) % 24;
        targetTemp =
          asphaltTemps.find((t: any) => t.hour === nextHour)?.value_c ??
          currentTemp;
        setHeatingMessage("Heating inactive");
      }

      const tempDiff = targetTemp - currentAsphaltTemp;
      if (tempDiff === 0) return;

      const remainingMs =
        ((59 - minutesIntoHour) * 60 + (60 - secondsIntoMinute)) * 1000;

      const totalSteps = Math.abs(tempDiff * 10); // step 0.1°C
      const stepInterval = remainingMs / totalSteps;
      const stepValue = tempDiff > 0 ? 0.1 : -0.1;

      const intervalId = setInterval(() => {
        setCurrentAsphaltTemp((prev: number) => {
          const nextValue = +(prev + stepValue).toFixed(1);
          if (
            (stepValue > 0 && nextValue >= targetTemp) ||
            (stepValue < 0 && nextValue <= targetTemp)
          ) {
            clearInterval(intervalId);
            return +targetTemp.toFixed(1);
          }
          return nextValue;
        });
      }, stepInterval);

      return () => clearInterval(intervalId);
    };

    updateTemperature();
    const intervalHourly = setInterval(updateTemperature, 1000 * 60); // هر دقیقه چک کن
    return () => clearInterval(intervalHourly);
  }, [deviceInfo, scenarioMode, currentAsphaltTemp]);

  const latestAirTemp =
    deviceInfo?.temperature_records?.air_temperature?.find(
      (t: any) => t.hour === new Date().getHours()
    )?.value_c ?? null;

  const icingNow =
    deviceInfo?.icing_probability_daily?.find(
      (t: any) => t.hour === new Date().getHours()
    )?.probability ?? null;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-white to-blue-50 rounded-l-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-white rounded-tl-xl">
        <div className="font-bold text-xl text-blue-900">
          {deviceInfo?.name || "Device Details"}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-blue-600 text-2xl transition-colors"
        >
          &times;
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Device Info */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <Card className="col-span-2 bg-gradient-to-r from-blue-50 to-white shadow-none">
            <Descriptions size="small" column={1} bordered>
              <Descriptions.Item label="UUID">{deviceInfo?.uuid}</Descriptions.Item>
              <Descriptions.Item label="Location">
                {deviceInfo?.location?.address || "Unknown location"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    deviceInfo?.status === "online"
                      ? "success"
                      : deviceInfo?.status === "maintenance"
                      ? "processing"
                      : deviceInfo?.status === "warning"
                      ? "warning"
                      : "error"
                  }
                >
                  {deviceInfo?.status
                    ? deviceInfo.status.charAt(0).toUpperCase() +
                      deviceInfo.status.slice(1)
                    : "Offline"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>

        {/* Current Readings */}
        <Divider orientation="left" className="text-blue-900 font-semibold">
          Current Readings
        </Divider>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {latestAirTemp !== null && (
            <Card className="text-center border border-blue-100 rounded-xl shadow-sm bg-white">
              <Statistic
                title="Air Temperature"
                value={latestAirTemp.toFixed(1)}
                suffix="°C"
                valueStyle={{ color: "#2563eb" }}
              />
            </Card>
          )}
          <Card className="text-center border border-yellow-100 rounded-xl shadow-sm bg-white">
            <Statistic
              title="Asphalt Temperature"
              value={currentAsphaltTemp.toFixed(1)}
              suffix="°C"
              valueStyle={{ color: "#f59e0b" }}
            />
            <div className="text-center mt-2 text-blue-600 font-semibold">
              {heatingMessage}
            </div>
          </Card>
          {icingNow !== null && (
            <Card className="text-center border border-red-100 rounded-xl shadow-sm bg-white">
              <Statistic
                title="Icing Probability"
                value={(icingNow * 100).toFixed(0)}
                suffix="%"
                valueStyle={{ color: icingNow > 0.5 ? "#ef4444" : "#10b981" }}
              />
            </Card>
          )}
        </div>

        {/* Energy Status */}
        <Divider orientation="left" className="text-blue-900 font-semibold">
          Energy Status
        </Divider>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <Text className="text-gray-500">Battery Level</Text>
              <Text className="text-gray-800 font-medium">
                {deviceInfo?.energy?.storage?.current_level_percent || 0}%
              </Text>
            </div>
            <Progress
              percent={deviceInfo?.energy?.storage?.current_level_percent || 0}
              strokeColor={{ "0%": "#10b981", "100%": "#3b82f6" }}
              size="small"
              showInfo={false}
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <Text className="text-gray-500">Solar Max Power</Text>
              <Text className="text-gray-800 font-medium">
                {deviceInfo?.energy?.generation
                  ?.find((g: any) => g.type === "solar")
                  ?.max_power_w || 0}{" "}
                W
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-5 bg-white rounded-bl-xl">
        <div className="flex justify-between">
          <AntdButton
            type="primary"
            className="bg-blue-600 hover:bg-blue-700 border-blue-600"
            icon={<SettingOutlined />}
          >
            Configure
          </AntdButton>
          <AntdButton
            type="primary"
            className="bg-yellow-500 hover:bg-yellow-600 border-yellow-500"
            icon={<EditOutlined />}
          >
            Edit Device
          </AntdButton>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailsSidebar;
