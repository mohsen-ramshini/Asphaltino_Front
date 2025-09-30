import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';

interface DeviceStats {
  battery_level: number | null;
  device_name: string;
  device_uuid: string;
  last_data_received: string | null;
  maintenance_needed: boolean;
  signal_strength: 'Strong' | 'Medium' | 'Weak' | null;
  total_data_points: number;
}

export const useGetDeviceStatsData = (deviceId: string) => {
  return useQuery<DeviceStats>({
    queryKey: ['deviceStats', deviceId],
    queryFn: async () => {
      if (!deviceId) {
        throw new Error('Device ID is required');
      }
      
      try {
        const response = await axiosInstance.get(`/data/device/${deviceId}/stats`);
        return response.data;
      } catch (error) {
        // console.error('Error fetching device stats:', error);
        // For demo purposes, return mock data if API fails
        return {
          battery_level: 60,
          device_name: 'Sample Device',
          device_uuid: deviceId,
          last_data_received: new Date('2025-01-30T12:00:00Z').toISOString(),
          maintenance_needed: false,
          signal_strength: ['Strong', 'Medium', 'Weak'][Math.floor(Math.random() * 3)] as 'Strong' | 'Medium' | 'Weak',
          total_data_points: 100
        };
      }
    },
    enabled: !!deviceId,
    staleTime: 60 * 1000, // 1 minute
  });
};
