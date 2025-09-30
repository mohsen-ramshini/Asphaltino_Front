import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'
import { AxiosError } from 'axios'
import type { DeviceApiResponse, ApiError } from './use-get-devices'

// Get Device By ID Hook
export const useGetDeviceById = (deviceId: string) => {
  return useQuery<DeviceApiResponse, AxiosError<ApiError>>({
    queryKey: ['device', deviceId],
    queryFn: async () => {
      if (!deviceId) {
        throw new Error('Device ID is required')
      }

      console.log('🔍 Fetching device details for:', deviceId)
      
      try {
        const response = await axiosInstance.get(`/devices/${deviceId}`)
        console.log('✅ Device details fetched:', response.data)
        return response.data
      } catch (error) {
        console.error('❌ Failed to fetch device details:', error)
        if (error instanceof AxiosError) {
          console.error('📊 Error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
          })
        }
        throw error
      }
    },
    enabled: !!deviceId,
    staleTime: 30 * 1000, // 30 seconds
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  })
}
