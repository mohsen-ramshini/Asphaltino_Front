import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';

interface SystemAlert {
  id: string;
  deviceId?: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  acknowledged: boolean;
  category: 'icing' | 'temperature' | 'maintenance' | 'system' | 'battery' | 'other';
}

export const useGetSystemAlerts = (limit = 10) => {
  return useQuery<SystemAlert[]>({
    queryKey: ['systemAlerts', limit],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/api/v1/alerts?limit=${limit}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching system alerts:', error);
        // For demo purposes, return mock data if API fails
        return [
          {
            id: '1',
            deviceId: 'dev-001',
            message: 'Icing detected on Highway A1 - KM 32',
            severity: 'critical',
            timestamp: new Date().toISOString(),
            acknowledged: false,
            category: 'icing'
          },
          {
            id: '2',
            deviceId: 'dev-003',
            message: 'Low battery on sensor #3654',
            severity: 'warning',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            acknowledged: false,
            category: 'battery'
          },
          {
            id: '3',
            deviceId: 'dev-007',
            message: 'Temperature below threshold on Bridge B',
            severity: 'critical',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            acknowledged: true,
            category: 'temperature'
          },
          {
            id: '4',
            deviceId: 'dev-014',
            message: 'Maintenance completed on sensor #4826',
            severity: 'info',
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            acknowledged: true,
            category: 'maintenance'
          },
          {
            id: '5',
            message: 'System update completed',
            severity: 'info',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            acknowledged: true,
            category: 'system'
          }
        ];
      }
    },
    staleTime: 60 * 1000, // 1 minute
  });
};
