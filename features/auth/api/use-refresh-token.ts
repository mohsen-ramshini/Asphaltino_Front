import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import axiosInstance from '@/api/axiosInstance';

interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
}

// Refresh token function
const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const refreshToken = Cookies.get('refresh_token');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axiosInstance.post<RefreshTokenResponse>('/refresh', {
    refresh_token: refreshToken
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== 200) {
    throw new Error('Token refresh failed');
  }

  return response.data;
};

// Refresh token hook
export const useRefreshToken = () => {
  return useMutation<RefreshTokenResponse, Error, void>({
    mutationFn: refreshToken,
    onSuccess: (data) => {
      // Update access token
      Cookies.set('access_token', data.access_token, {
        expires: 1,
        secure: false,
        sameSite: 'Lax',
      });

      // Update refresh token if provided
      if (data.refresh_token) {
        Cookies.set('refresh_token', data.refresh_token, {
          expires: 7,
          secure: false,
          sameSite: 'Lax',
        });
      }

      // Not showing toast for refresh token success as it's a background operation
      console.log('✅ Token refreshed successfully');
    },
    onError: (error) => {
      toast.error('Your session has expired. Please sign in again.');
      console.error('❌ Token refresh error:', error);
      
      // Clear tokens if refresh fails
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/sign-in';
      }
    },
  });
};
