import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import type { DeviceData, ApiError } from './use-get-devices'

interface UpdateDeviceData {
  name?: string;
  location?: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  // We're removing type and model as they're not needed for the API
}

// Update Device Hook
export const useUpdateDevice = () => {
  const queryClient = useQueryClient()

  return useMutation<DeviceData, AxiosError<ApiError>, { id: string; data: UpdateDeviceData }>({
    mutationFn: async ({ id, data }) => {
      console.log('🔄 Starting device update with data:', data)
      
      // Removing type and model if they exist in the data
      const payload = {
        name: data.name,
        location: data.location
      }
      
      console.log('📦 Sending payload to API:', payload)
      
      try {
        const response = await axiosInstance.put(`/devices/${id}`, payload)
        console.log('✅ API Response received:', response.status, response.data)
        return response.data
      } catch (error) {
        console.error('❌ API Request failed:', error)
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
    onSuccess: (data, variables) => {
      toast.success('Device updated successfully');
      // Update the specific device in cache
      queryClient.setQueryData(['device', variables.id], data)
      // Invalidate devices list
      queryClient.invalidateQueries({ queryKey: ['devices'] })
      console.log('✅ Device updated successfully:', data)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update device');
      console.error('❌ Failed to update device:', error.response?.data?.message)
    },
    // Add retry capability
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000)
  })
}

export type { UpdateDeviceData }
