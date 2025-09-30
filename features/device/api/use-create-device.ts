import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import type { DeviceData, ApiError } from './use-get-devices'

// Keep this interface as is for form data collection
interface CreateDeviceData {
  name: string
  type: string
  location: string
  model: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  // Additional optional fields
  description?: string
  serial_number?: string
  firmware_version?: string
}

// Create Device Hook
export const useCreateDevice = () => {
  const queryClient = useQueryClient()

  return useMutation<DeviceData, AxiosError<ApiError>, CreateDeviceData>({
    mutationFn: async (deviceData) => {
      console.log('🚀 Starting device creation with data:', deviceData)
      
      // Use provided coordinates or generate them if not available
      const coordinates = deviceData.coordinates || {
        latitude: 35.6892,
        longitude: 51.3890
      }
      
      // Transform the form data to match the required API format
      const payload = {
        name: deviceData.name,
        location: {
          address: deviceData.location,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        }
        // Note: type and model are removed as they're not in the required API format
      }
      
      console.log('📦 Sending payload to API:', payload)
      
      try {
        const response = await axiosInstance.post('/devices', payload)
        console.log('✅ API Response received:', response.status, response.data)
        return response.data
      } catch (error) {
        console.error('❌ API Request failed:', error)
        if (error instanceof AxiosError) {
          console.error('📊 Error details:', {
            status: error.response?.status,
            data: error.response?.data
          })
        }
        throw error
      }
    },
    onSuccess: (data) => {
      toast.success('Device created successfully');
      console.log('🎉 Device creation successful, invalidating queries...')
      queryClient.invalidateQueries({ queryKey: ['devices'] })
      queryClient.invalidateQueries({ queryKey: ['deviceStats'] })
      console.log('✅ Device created successfully:', data)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create device');
      console.error('❌ Mutation onError triggered:', error)
      console.error('📋 Error response data:', error.response?.data)
    }
  })
}

export type { CreateDeviceData }

