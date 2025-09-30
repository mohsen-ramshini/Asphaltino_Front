import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'
import { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'sonner'

interface DeleteAccountData {
  password: string
  confirmation?: string
}

interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

// Delete Account Hook
export const useDeleteAccount = () => {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosError<ApiError>, DeleteAccountData>({
    mutationFn: async (data) => {
      const response = await axiosInstance.delete('/users/account', {
        data: data
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('Your account has been deleted')
      // Clear all authentication data
      Cookies.remove('access_token')
      Cookies.remove('refresh_token')
      localStorage.removeItem('user')
      
      // Clear all cached queries
      queryClient.clear()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete account')
      console.error('Failed to delete account:', error.response?.data?.message)
    }
  })
}

export type { DeleteAccountData }
