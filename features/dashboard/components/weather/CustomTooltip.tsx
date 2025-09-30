import React, { JSX } from 'react'
import { Card, Typography, Space, Divider } from 'antd'

const { Text } = Typography

interface PayloadItem {
  payload: {
    temp: number
    humidity: number
    pressure: number
    wind: number
    windDeg: number
    precipitation: number
    rain: number
    uvi: number
  }
}

interface CustomTooltipProps {
  payload?: PayloadItem[]
  label?: string
  temperature?: string
  getImage?: (id: number, sunDown: string, sunUp: string, time: string, main: boolean) => {
    imgSrc: string
    backgroundColor: string
  }
}

export default function CustomTooltip({
  payload = [],
  label = '',
  temperature = '0°C',
}: CustomTooltipProps): JSX.Element | null {
  if (Array.isArray(payload) && payload.length > 0) {
    const {
      temp,
      humidity,
      pressure,
      wind,
      windDeg,
      precipitation,
      rain,
      uvi,
    } = payload[0].payload

    return (
      <Card className="shadow-md border-0" size="small" style={{ maxWidth: 200 }}>
        <div className="mb-1 font-semibold">{label}</div>
        <Divider className="my-2" />
        
        <Space direction="vertical" size={2} className="w-full">
          <div className="flex justify-between">
            <Text className="text-gray-600">Temperature:</Text>
            <Text className="font-medium">
              {temp}{temperature.endsWith('C') ? '°C' : '°F'}
            </Text>
          </div>
          
          <div className="flex justify-between">
            <Text className="text-gray-600">Humidity:</Text>
            <Text className="font-medium">{humidity}%</Text>
          </div>
          
          <div className="flex justify-between">
            <Text className="text-gray-600">Wind:</Text>
            <Text className="font-medium flex items-center">
              <svg width="14" height="14" viewBox="0 0 50 50" className="mr-1">
                <path
                  d="M25 5 L40 45 L25 35 L10 45 Z"
                  fill="currentColor"
                  transform={`rotate(${windDeg + 180}, 25, 25)`}
                />
              </svg>
              {wind}{temperature.endsWith('C') ? 'km/h' : 'mph'}
            </Text>
          </div>
          
          <div className="flex justify-between">
            <Text className="text-gray-600">Pressure:</Text>
            <Text className="font-medium">{pressure} hPa</Text>
          </div>
          
          <div className="flex justify-between">
            <Text className="text-gray-600">Rain Chance:</Text>
            <Text className="font-medium">{rain}%</Text>
          </div>
          
          <div className="flex justify-between">
            <Text className="text-gray-600">Precipitation:</Text>
            <Text className="font-medium">{precipitation} mm</Text>
          </div>
          
          <div className="flex justify-between">
            <Text className="text-gray-600">UV Index:</Text>
            <Text className="font-medium">{uvi}</Text>
          </div>
        </Space>
      </Card>
    )
  }
  return null
}
