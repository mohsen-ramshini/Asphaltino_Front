import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { toast } from 'sonner';
import { UserProfile } from './use-get-profile';

interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
}

// Update profile function
const updateProfile = async (profileData: UpdateProfileData): Promise<UserProfile> => {
  const response = await axiosInstance.put<UserProfile>('/users/profile', profileData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== 200) {
    throw new Error('Profile update failed');
  }

  return response.data;
};

// Update profile hook
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, UpdateProfileData>({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success('Profile updated successfully');
      // Update the profile in cache
      queryClient.setQueryData(['user-profile'], data);

      console.log('✅ Profile updated successfully:', data);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
      console.error('❌ Profile update error:', error);
    },
  });
};

export type { UpdateProfileData };
