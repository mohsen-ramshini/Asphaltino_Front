import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';

interface DeviceDataPoint {
  UUID: string;
  DeviceUUID: string;
  Device: string;
  Timestamp: string;
  WindSpeed: number | null;
  Icing: boolean | null;
  AirHumidity: number | null;
  AirTemperature: number | null;
  AsphaltTemperature: number | null;
  BatteryLevel: number | null;
  SignalStrength: string | null;
  OtherData: any;
}

interface DeviceDataResponse {
  data: DeviceDataPoint[];
  hasMore: boolean;
  limit: number;
  offset: number;
  total: number;
}

export const useGetDeviceData = (deviceId: string) => {
  return useQuery<DeviceDataResponse>({
    queryKey: ['deviceData', deviceId],
    queryFn: async () => {
      if (!deviceId) {
        throw new Error('Device ID is required');
      }
      
      try {
        const response = await axiosInstance.get(`/data/device/${deviceId}`);
        return response.data;
      } catch (error) {
        // console.error('Error fetching device data:', error);
        return {
          data: [
            {
              UUID: crypto.randomUUID(),
              DeviceUUID: deviceId,
              Device: 'Sample Device',
              Timestamp: new Date().toISOString(),
              WindSpeed: 14,
              Icing: false,
              AirHumidity: 75,
              AirTemperature: 2,
              AsphaltTemperature: 1,
              BatteryLevel: 100,
              SignalStrength: ['Strong', 'Medium', 'Weak'][Math.floor(Math.random() * 3)],
              OtherData: {}
            }
          ],
          hasMore: false,
          limit: 1,
          offset: 0,
          total: 1
        };
      }
    },
    enabled: !!deviceId,
    staleTime: 60 * 1000, // 1 minute
  });
};
