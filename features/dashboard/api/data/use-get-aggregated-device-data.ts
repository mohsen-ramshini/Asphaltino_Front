import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'
import { AxiosError } from 'axios'

interface AggregatedDataPoint {
  timestamp: string
  temperature: {
    avg: number
    min: number
    max: number
    count: number
  }
  battery_level: {
    avg: number
    min: number
    max: number
  }
  humidity?: {
    avg: number
    min: number
    max: number
  }
  status_distribution: {
    online: number
    offline: number
    maintenance: number
    warning: number
  }
  signal_strength_avg: number
}

interface AggregationFilters {
  startDate?: string
  endDate?: string
  aggregation: 'hourly' | 'daily' | 'weekly' | 'monthly'
  metrics?: string[] // ['temperature', 'battery', 'humidity']
}

interface AggregatedDeviceDataResponse {
  device_id: string
  aggregation_type: string
  period: {
    start: string
    end: string
  }
  data: AggregatedDataPoint[]
  summary: {
    total_periods: number
    data_completeness: number
    avg_temperature: number
    avg_battery_level: number
    uptime_percentage: number
  }
}

interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

// Get Aggregated Device Data Hook
export const useGetAggregatedDeviceData = (deviceUUID: string, filters: AggregationFilters) => {
  return useQuery<AggregatedDeviceDataResponse, AxiosError<ApiError>>({
    queryKey: ['aggregatedDeviceData', deviceUUID, filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.startDate) params.append('start_date', filters.startDate)
      if (filters.endDate) params.append('end_date', filters.endDate)
      params.append('aggregation', filters.aggregation)
      if (filters.metrics) {
        filters.metrics.forEach(metric => params.append('metrics', metric))
      }

      const response = await axiosInstance.get(`/data/device/${deviceUUID}/aggregate?${params.toString()}`)
      return response.data
    },
    enabled: !!deviceUUID && !!filters.aggregation,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  })
}

export type { 
  AggregatedDataPoint, 
  AggregationFilters, 
  AggregatedDeviceDataResponse 
}
