import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { UserProfile, ApiError } from './use-get-user-profile';

export interface UpdateUserProfileData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  avatar_url?: string;
  settings?: {
    theme?: 'light' | 'dark' | 'system';
    notifications_enabled?: boolean;
    language?: string;
  };
}

// Update User Profile Hook
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, AxiosError<ApiError>, UpdateUserProfileData>({
    mutationFn: async (profileData) => {
      console.log('🔄 Starting profile update with data:', profileData);
      
      try {
        const response = await axiosInstance.put('/users/profile', profileData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('✅ Profile update successful:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Profile update failed:', error);
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
      toast.success('Profile updated successfully');
      console.log('🎉 Profile update successful, updating cache...');
      
      // Update the profile in cache
      queryClient.setQueryData(['user-profile'], data);
      
      // Invalidate any other related queries
      queryClient.invalidateQueries({ 
        queryKey: ['user'], 
        refetchType: 'none' 
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      console.error('❌ Failed to update profile:', error.response?.data?.message);
    },
    // Add retry capability
    retry: 1,
    retryDelay: 1000,
  });
};
