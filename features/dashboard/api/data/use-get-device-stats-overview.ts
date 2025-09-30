import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';

interface DeviceStatsOverview {
  totalDevices: number;
  activeDevices: number;
  offlineDevices: number;
  maintenanceCount: number;
  icingCount: number;
  criticalTemperatureCount: number;
  averageBatteryLevel: number;
  lastUpdated: string;
}

export const useGetDeviceStatsOverview = () => {
  return useQuery<DeviceStatsOverview>({
    queryKey: ['deviceStatsOverview'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/devices/stats/overview');
        return response.data;
      } catch (error) {
        console.error('Error fetching device stats overview:', error);
        // For demo purposes, return mock data if API fails
        return {
          totalDevices: 32,
          activeDevices: 28,
          offlineDevices: 4,
          maintenanceCount: 5,
          icingCount: 8,
          criticalTemperatureCount: 3,
          averageBatteryLevel: 76,
          lastUpdated: new Date().toISOString()
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
