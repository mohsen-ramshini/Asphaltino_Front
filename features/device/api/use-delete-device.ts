import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import type { ApiError } from './use-get-devices'

// Delete Device Hook
export const useDeleteDevice = () => {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosError<ApiError>, string>({
    mutationFn: async (deviceId) => {
      console.log('🔄 Starting delete request for device:', deviceId)

      try {
        const response = await axiosInstance.delete(`/devices/${deviceId}`)
        console.log('✅ Delete API response:', response.status, response.statusText)
        return response.data
      } catch (error) {
        console.error('❌ Delete API request failed:', error)
        if (error instanceof AxiosError) {
          console.error('Error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            config: {
              url: error.config?.url,
              method: error.config?.method,
              baseURL: error.config?.baseURL
            }
          })
        }
        throw error
      }
    },
    onSuccess: (_, deviceId) => {
      toast.success(`Device deleted successfully`)
      console.log('🎉 Device deletion successful, updating cache...')

      // Remove from cache
      queryClient.removeQueries({ queryKey: ['device', deviceId] })
      console.log('🧹 Removed device from cache:', deviceId)

      // Invalidate devices list
      queryClient.invalidateQueries({ queryKey: ['devices'] })
      console.log('🔄 Invalidated devices list query')
    },
    onError: (error, deviceId) => {
      toast.error(error.response?.data?.message || `Failed to delete device`)
      console.error(`❌ Failed to delete device ${deviceId}:`, error)
      console.error('Error response:', error.response?.data)
    }
  })
}
