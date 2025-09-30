import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import axiosInstance from '@/api/axiosInstance';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: 'admin' | 'patient' | 'caregiver';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

// Get user profile function
const getUserProfile = async (): Promise<UserProfile> => {
  const response = await axiosInstance.get<UserProfile>('/users/profile');
  return response.data;
};

// Get profile hook
export const useGetProfile = () => {
  const accessToken = Cookies.get('access_token');

  return useQuery<UserProfile, Error>({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
    enabled: !!accessToken, // Only run if token exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401/403 errors
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });
};

export type { UserProfile };
