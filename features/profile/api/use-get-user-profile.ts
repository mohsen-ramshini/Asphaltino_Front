import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: 'admin' | 'user' | 'manager';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  settings?: {
    theme: 'light' | 'dark' | 'system';
    notifications_enabled: boolean;
    language: string;
  };
}

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Get User Profile Hook
export const useGetUserProfile = () => {
  const accessToken = Cookies.get('access_token');

  return useQuery<UserProfile, AxiosError<ApiError>>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      console.log('🔍 Fetching user profile data');
      
      try {
        const response = await axiosInstance.get('/users/profile');
        console.log('✅ User profile fetched successfully');
        return response.data;
      } catch (error) {
        console.error('❌ Failed to fetch user profile:', error);
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
    enabled: !!accessToken, // Only run if token exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // Don't retry on 401/403 errors
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export type { ApiError };
