import axios, {
  AxiosInstance,
  AxiosError,
  type InternalAxiosRequestConfig,
  AxiosHeaders,
} from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://192.168.100.87:8080/api/v1';
// const API_BASE_URL = 'http://127.0.0.1:8080/api/v1';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: new AxiosHeaders({ 'Content-Type': 'application/json' }),
});

// گرفتن refreshToken از کوکی
const getRefreshToken = (): string | undefined => Cookies.get('refresh_token');

// ذخیره کردن توکن‌ها در کوکی
const saveTokens = (accessToken: string, refreshToken: string): void => {
  Cookies.set('access_token', accessToken);
  Cookies.set('refresh_token', refreshToken);
};

// اضافه کردن توکن به هدر درخواست‌ها
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('access_token');
    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// اضافه کردن فیلد _retry به تایپ config
interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// مدیریت پاسخ‌ها و رفرش توکن در صورت 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        console.log('📦 Sending refresh token:', refreshToken);

        if (!refreshToken) {
          throw new Error('❌ No refresh token found in cookies');
        }

        const refreshResponse = await axios.post(
          `${API_BASE_URL}/refresh-token/`,
          { refresh_token: refreshToken }
        );

        console.log('✅ Refresh response status:', refreshResponse.status);
        console.log('📥 Refresh response data:', refreshResponse.data);

        const newAccessToken = refreshResponse.data.access as string;
        const newRefreshToken = refreshResponse.data.refresh as string;

        saveTokens(newAccessToken, newRefreshToken);

        if (!originalRequest.headers) {
          originalRequest.headers = new AxiosHeaders();
        }
        originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('❌ Error refreshing token:', refreshError);
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.href = '/auth/sign-in';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
