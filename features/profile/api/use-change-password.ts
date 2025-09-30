import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface ApiError {
  message: string;
  statusCode: number;
}

// Change Password Hook
export const useChangePassword = () => {
  return useMutation<ChangePasswordResponse, AxiosError<ApiError>, ChangePasswordRequest>({
    mutationFn: async (data) => {
      try {
        const response = await axiosInstance.post('/users/change-password', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('✅ Password change successful');
        return response.data;
      } catch (error) {
        console.error('❌ Password change failed:', error);
        if (error instanceof AxiosError) {
          console.error('📊 Error details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
          });
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Password changed successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  });
};

interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export type { ChangePasswordResponse };
