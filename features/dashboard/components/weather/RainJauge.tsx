import React, { JSX } from 'react'
import { Typography } from 'antd'

const { Text } = Typography;

interface RainJaugeProps {
  minutely: Array<{
    precipitation: number
  }>
}

export default function RainJauge ({ minutely }: RainJaugeProps): JSX.Element {
  const getColorForPrecipitation = (precipitation: number): string => {
    if (precipitation > 1) {
      return 'bg-blue-500'
    } else if (precipitation > 0.5) {
      return 'bg-blue-400'
    } else if (precipitation > 0.2) {
      return 'bg-blue-300'
    } else if (precipitation > 0) {
      return 'bg-blue-200'
    } else {
      return 'bg-gray-100'
    }
  }

  const sections = minutely.map((item, index) => ({
    id: index,
    color: getColorForPrecipitation(item.precipitation),
    precipitation: +item.precipitation.toFixed(2)
  }))

  const totalPrecipitation = sections.reduce((acc, item) => acc + item.precipitation, 0)
  const averagePrecipitation = (totalPrecipitation / sections.length).toFixed(2)
  const hasPrecipitation = sections.some((item) => item.precipitation > 0)

  return (
    <div>
      <Typography.Title level={5} className="text-blue-600 mb-3">Precipitation Forecast</Typography.Title>
      
      {!hasPrecipitation ? (
        <div className="text-center py-4">
          <Text className="text-gray-600">No precipitation expected in the next hour</Text>
        </div>
      ) : (
        <>
          <div className="text-center mb-3">
            <Text className="text-gray-600">Expected precipitation in the next hour (avg: {averagePrecipitation} mm)</Text>
          </div>
          <div className="w-full h-8 mb-2 rounded-lg overflow-hidden border border-gray-200 flex">
            {sections.map((item) => (
              <div key={item.id} className={`flex-1 h-full ${item.color}`} />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <div>Now</div>
            <div>+30min</div>
            <div>+60min</div>
          </div>
        </>
      )}
    </div>
  )
}
