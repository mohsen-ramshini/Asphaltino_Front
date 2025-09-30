import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import axiosInstance from '@/api/axiosInstance';
import { LogoutResponse } from '../types/auth';

// Logout user function
const logoutUser = async (): Promise<LogoutResponse> => {
  const response = await axiosInstance.post<LogoutResponse>('/logout', {}, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

// Logout hook
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<LogoutResponse, Error, void>({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      // Clear tokens from cookies
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.clear();
      }

      toast.success('Logged out successfully');
      console.log('✅ Logout successful:', data);

      // Clear all cached queries
      queryClient.clear();

      // Redirect to sign-in page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/sign-in';
      }
    },
    onError: (error) => {
      toast.error('Logout failed, but you have been signed out locally');
      console.error('❌ Logout error:', error);
      
      // Even if logout fails on server, clear local data
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      
      if (typeof window !== 'undefined') {
        localStorage.clear();
        window.location.href = '/auth/sign-in';
      }
    },
  });
};
