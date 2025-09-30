// api/use-sign-in.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import axiosInstance from '@/api/axiosInstance';
import { LoginFormValues, LoginResponse } from '../types/auth';

// ✅ تابع loginUser برای ارسال داده به صورت JSON
const loginUser = async (credentials: LoginFormValues): Promise<LoginResponse> => {
  const payload = {
    username: credentials.username,
    password: credentials.password,
  };

  const response = await axiosInstance.post<LoginResponse>('/login', payload, {
    headers: {
      'Content-Type': 'application/json', // ✅ ارسال به صورت JSON
    },
  });

  if (response.status !== 200) {
    throw new Error('Login failed');
  }

  return response.data;
};

// ✅ Hook سفارشی React Query
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginFormValues>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // ذخیره توکن‌ها در کوکی
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

      toast.success('Login successful!');
      console.log('✅ Login successful:', data);

      // invalidate داده‌های حساس به ورود
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });

      // هدایت به صفحه اصلی
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Login failed!');
      console.error('❌ Login error:', error);
    },
  });
};
