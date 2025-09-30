import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import axiosInstance from '@/api/axiosInstance';
import { LoginResponse } from '../types/auth';

interface SignUpFormValues {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
}

// Sign up user function
const signUpUser = async (userData: SignUpFormValues): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/register', userData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status !== 201 && response.status !== 200) {
    throw new Error('Registration failed');
  }

  return response.data;
};

// Sign up hook
export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, SignUpFormValues>({
    mutationFn: signUpUser,
    onSuccess: (data) => {
      // Store tokens in cookies
      Cookies.set('access_token', data.access_token, {
        expires: 1,
        secure: false,
        sameSite: 'Lax',
      });
      Cookies.set('refresh_token', data.refresh_token, {
        expires: 7,
        secure: false,
        sameSite: 'Lax',
      });

      toast.success('Registration successful!');
      console.log('✅ Sign up successful:', data);

      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });

      // Redirect to dashboard
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Registration failed!');
      console.error('❌ Sign up error:', error);
    },
  });
};

export type { SignUpFormValues };
