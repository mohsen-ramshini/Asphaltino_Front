import React, { useEffect, useState, forwardRef } from 'react';
import { Card, Typography, Descriptions, Tag, Statistic, Button as AntdButton, Spin, Progress, Divider } from 'antd';
import { EditOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { useGetDeviceStatsData } from '@/features/dashboard/api/data/use-get-device-stats-data';
import { useGetDeviceData } from '@/features/dashboard/api/data/use-get-device-data';

const { Title, Text } = Typography;

interface DeviceDetailsSidebarProps {
  deviceId: string;
  deviceInfo: any;
  onClose: () => void;
  scenarioMode?: boolean;
}

function formatDate(dateString?: string) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString('en-US');
}



const DeviceDetailsSidebar: React.FC<DeviceDetailsSidebarProps> = ({
  deviceId,
  deviceInfo,
  onClose,
  scenarioMode = true,
}) => {
  // Scenario state
  const [step, setStep] = useState(0);
  const [customData, setCustomData] = useState({
    AirTemperature: deviceInfo?.airTemp ?? 20,
    AsphaltTemperature: deviceInfo?.asphaltTemp ?? 20,
    Icing: deviceInfo?.iceDetected ?? false,
  });

  const { data: deviceStatsData } = useGetDeviceStatsData(deviceId);
  const { data: deviceData } = useGetDeviceData(deviceId);

  let finalDeviceData = deviceData;
  let finalDeviceStats = deviceStatsData;

  useEffect(() => {
    if (!scenarioMode) return;
    setStep(0);
    setCustomData({
      AirTemperature: deviceInfo?.airTemp ?? 20,
      AsphaltTemperature: deviceInfo?.asphaltTemp ?? 20,
      Icing: deviceInfo?.iceDetected ?? false,
    });

    const t1 = setTimeout(() => {
      setStep(1);
      setCustomData({
        AirTemperature: -5,
        AsphaltTemperature: 0,
        Icing: true,
      });

      const t2 = setTimeout(() => {
        setStep(2);

        const t3 = setTimeout(() => {
          setStep(3);
          setCustomData({
            AirTemperature: -10,
            AsphaltTemperature: 1,
            Icing: false,
          });

          const t4 = setTimeout(() => {
            setStep(4);

            const t5 = setTimeout(() => {
              setStep(5);
              setCustomData({
                AirTemperature: -10,
                AsphaltTemperature: 1,
                Icing: false,
              });
            }, 15000000);
            return () => clearTimeout(t5);
          }, 5000000);
          return () => clearTimeout(t4);
        }, 5000000);
        return () => clearTimeout(t3);
      }, 15000000);
      return () => clearTimeout(t2);
    }, 35000000);

    return () => {
      clearTimeout(t1);
    };
  }, [deviceId, scenarioMode, deviceInfo]);

  if (scenarioMode && (step === 1 || step === 3 || step === 5)) {
    finalDeviceData = {
      ...deviceData,
      data: [{
        ...deviceData?.data?.[0],
        UUID: deviceData?.data?.[0]?.UUID ?? '',
        DeviceUUID: deviceData?.data?.[0]?.DeviceUUID ?? '',
        Device: deviceData?.data?.[0]?.Device ?? '',
        Timestamp: deviceData?.data?.[0]?.Timestamp ?? '',
        AirTemperature: customData.AirTemperature,
        AsphaltTemperature: customData.AsphaltTemperature,
        Icing: customData.Icing,
        WindSpeed: deviceData?.data?.[0]?.WindSpeed !== undefined ? deviceData.data[0].WindSpeed : null,
        AirHumidity: deviceData?.data?.[0]?.AirHumidity !== undefined ? deviceData.data[0].AirHumidity : null,
        BatteryLevel: deviceData?.data?.[0]?.BatteryLevel !== undefined ? deviceData.data[0].BatteryLevel : null,
        SignalStrength: deviceData?.data?.[0]?.SignalStrength !== undefined ? deviceData.data[0].SignalStrength : null,
        OtherData: deviceData?.data?.[0]?.OtherData !== undefined ? deviceData.data[0].OtherData : null,
      }],
      hasMore: deviceData?.hasMore ?? false,
      limit: deviceData?.limit ?? 0,
      offset: deviceData?.offset ?? 0,
      total: deviceData?.total ?? 0,
    };
  }

  if (scenarioMode && (step === 2 || step === 4)) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <Spin size="large" />
        <div className="mt-8 text-xl text-blue-700 font-semibold text-center">
          {step === 2
            ? 'Relay is activating the heating element...'
            : 'Software is instructing the relay to activate the water pump...'}
        </div>
        <div className="mt-10 flex flex-col gap-2 text-center text-base text-gray-700 bg-white rounded-xl shadow p-6 w-full max-w-xs">
          <div>
            <span className="font-semibold">Air Temperature:</span> {customData.AirTemperature}°C
          </div>
          <div>
            <span className="font-semibold">Asphalt Temperature:</span> {customData.AsphaltTemperature}°C
          </div>
          <div>
            <span className="font-semibold">Ice Detected:</span> {customData.Icing ? 'Yes' : 'No'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-white to-blue-50 rounded-l-xl shadow-lg">
      <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-white rounded-tl-xl">
        <div className="font-bold text-xl text-blue-900">{deviceInfo?.title || 'Device Details'}</div>
        <button onClick={onClose} className="text-gray-400 hover:text-blue-600 text-2xl transition-colors">&times;</button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="mb-6 grid grid-cols-2 gap-4">
          <Card className="col-span-2 bg-gradient-to-r from-blue-50 to-white shadow-none">
            <Descriptions size="small" column={1} bordered>
              <Descriptions.Item label="Device ID">
                <span className="font-mono text-blue-700">{deviceId}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {deviceInfo?.address || 'Unknown location'}
              </Descriptions.Item>
              <Descriptions.Item label="Last Seen">
                {formatDate(finalDeviceStats?.last_data_received ?? undefined)}
              </Descriptions.Item>
              <Descriptions.Item label="Data Points">
                {finalDeviceStats?.total_data_points || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    deviceInfo?.status === 'online'
                      ? 'success'
                      : deviceInfo?.status === 'maintenance'
                      ? 'processing'
                      : deviceInfo?.status === 'warning'
                      ? 'warning'
                      : 'error'
                  }
                >
                  {deviceInfo?.status ? deviceInfo.status.charAt(0).toUpperCase() + deviceInfo.status.slice(1) : 'Offline'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>

        <Divider orientation="left" className="text-blue-900 font-semibold">
          Current Readings
        </Divider>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {finalDeviceData?.data && finalDeviceData.data.length > 0 ? (
            <>
              {finalDeviceData.data[0].AirTemperature !== undefined && (
                <Card className="text-center border border-blue-100 rounded-xl shadow-sm bg-white">
                  <Statistic 
                    title="Air Temperature" 
                    value={finalDeviceData.data[0].AirTemperature?.toFixed(1)} 
                    suffix="°C"
                    valueStyle={{ color: '#2563eb' }}
                  />
                </Card>
              )}
              {finalDeviceData.data[0].AsphaltTemperature !== undefined && (
                <Card className="text-center border border-yellow-100 rounded-xl shadow-sm bg-white">
                  <Statistic 
                    title="Asphalt Temperature" 
                    value={finalDeviceData.data[0].AsphaltTemperature?.toFixed(1)} 
                    suffix="°C"
                    valueStyle={{ color: '#f59e0b' }}
                  />
                </Card>
              )}
              {finalDeviceData.data[0].AirHumidity !== undefined && (
                <Card className="text-center border border-green-100 rounded-xl shadow-sm bg-white">
                  <Statistic 
                    title="Humidity" 
                    value={finalDeviceData.data[0].AirHumidity?.toFixed(1)} 
                    suffix="%"
                    valueStyle={{ color: '#10b981' }}
                  />
                </Card>
              )}
              {finalDeviceData.data[0].Icing !== undefined && (
                <Card className="text-center border border-red-100 rounded-xl shadow-sm bg-white">
                  <Statistic 
                    title="Ice Detected" 
                    value={finalDeviceData.data[0].Icing ? "Yes" : "No"} 
                    valueStyle={{ color: finalDeviceData.data[0].Icing ? '#ef4444' : '#10b981' }}
                  />
                </Card>
              )}
            </>
          ) : (
            <div className="col-span-2 text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <Text className="text-gray-400">No sensor data available</Text>
            </div>
          )}
        </div>

        <Divider orientation="left" className="text-blue-900 font-semibold">
          Device Status
        </Divider>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-1">
              <Text className="text-gray-500">Battery Level</Text>
              <Text className="text-gray-800 font-medium">{finalDeviceStats?.battery_level?.toFixed(0) || 'N/A'}%</Text>
            </div>
            <Progress 
              percent={finalDeviceStats?.battery_level || 0} 
              strokeColor={{
                '0%': '#10b981',
                '100%': '#3b82f6',
              }}
              size="small"
              showInfo={false}
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <Text className="text-gray-500">Signal Strength</Text>
              <Text className="text-gray-800 font-medium">{finalDeviceStats?.signal_strength || 'N/A'}</Text>
            </div>
            <Progress 
              percent={
                finalDeviceStats?.signal_strength === 'Strong' ? 90 :
                finalDeviceStats?.signal_strength === 'Medium' ? 60 :
                finalDeviceStats?.signal_strength === 'Weak' ? 30 : 0
              }
              strokeColor={{
                '0%': '#f59e0b',
                '100%': '#10b981',
              }}
              size="small"
              showInfo={false}
            />
          </div>
          <div className="flex justify-between items-center">
            <Text className="text-gray-500">Maintenance Needed</Text>
            <Tag color={finalDeviceStats?.maintenance_needed ? 'error' : 'success'}>
              {finalDeviceStats?.maintenance_needed ? 'Yes' : 'No'}
            </Tag>
          </div>
        </div>
      </div>
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
