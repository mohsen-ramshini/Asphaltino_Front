import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'
import { AxiosError } from 'axios'

// Updated types to match actual API response
interface DeviceApiResponse {
  type: string
  api_key: string
  id: number
  location: {
    address: string
    id: number
    latitude: number
    longitude: number
  }
  name: string
  sub_id: string
  uuid: string
}

// Keeping the original DeviceData interface for the table display
interface DeviceData {
  id: string
  name: string
  type: string
  location: string
  status: 'online' | 'offline' | 'maintenance' | 'warning'
  battery_level: number
  signal_strength: string
  temperature?: number
  humidity?: number
  last_seen: string
  model: string
  install_date: string
  maintenance_status: string
}

interface DeviceFilters {
  status?: string
  type?: string
  location?: string
  search?: string
  page?: number
  limit?: number
}

interface DeviceResponse {
  devices: DeviceData[]
  total: number
  page: number
  limit: number
}

interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

// Get All Devices Hook - updated to handle the actual API response format
export const useGetDevices = (filters?: DeviceFilters) => {
  return useQuery<DeviceApiResponse[], AxiosError<ApiError>>({
    queryKey: ['devices', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.type) params.append('type', filters.type)
      if (filters?.location) params.append('location', filters.location)
      if (filters?.search) params.append('search', filters.search)
      if (filters?.page) params.append('page', filters.page.toString())
      if (filters?.limit) params.append('limit', filters.limit.toString())

      console.log('🔍 Fetching devices with params:', Object.fromEntries(params.entries()))
      const response = await axiosInstance.get(`/devices?${params.toString()}`)
      console.log('✅ Devices fetched:', response.data)
      return response.data
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute for real-time updates
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  })
}

export type { DeviceApiResponse, DeviceData, DeviceFilters, DeviceResponse, ApiError }
