import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import axiosInstance from '@/api/axiosInstance';

interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface ChangePasswordResponse {
  detail: string;
}

// Change password function
const changePassword = async (passwordData: ChangePasswordData): Promise<ChangePasswordResponse> => {
  const response = await axiosInstance.post<ChangePasswordResponse>('/users/change-password', passwordData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== 200) {
    throw new Error('Password change failed');
  }

  return response.data;
};

// Change password hook
export const useChangePassword = () => {
  return useMutation<ChangePasswordResponse, Error, ChangePasswordData>({
    mutationFn: changePassword,
    onSuccess: (data) => {
      toast.success('Password changed successfully');
      console.log('✅ Password changed successfully:', data);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to change password');
      console.error('❌ Password change error:', error);
    },
  });
};

export type { ChangePasswordData };
