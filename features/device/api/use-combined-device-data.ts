import { useQuery } from '@tanstack/react-query';
import { useGetDevices } from './use-get-devices';
import axiosInstance from '@/api/axiosInstance';

export const useCombinedDeviceData = () => {
  // گرفتن لیست دستگاه‌ها
  const { data: deviceList, isLoading: isLoadingDevices, error: devicesError, refetch: refetchDevices } = useGetDevices();

  const result = useQuery({
    queryKey: ['combinedDeviceData', deviceList],
    queryFn: async () => {
      if (!deviceList || !deviceList.length) return [];

      // برای هر دستگاه، از اندپوینت جدید استفاده کن
      const enrichedDevices = await Promise.all(
        deviceList.map(async (device) => {
          const deviceUuid = device.uuid || device.id?.toString();
          if (!deviceUuid) return null;

          try {
            // گرفتن اطلاعات کامل دستگاه از اندپوینت جدید
            const deviceRes = await axiosInstance.get(`/devices?uuid=${deviceUuid}`);
            return deviceRes.data;
          } catch (error) {
            console.error(`Error fetching device data for ${deviceUuid}:`, error);
            return device; // در صورت خطا، دستگاه اصلی را برگردان
          }
        })
      );

      return enrichedDevices.filter(Boolean);
    },
    enabled: !!deviceList && deviceList.length > 0,
    staleTime: 60 * 1000
  });

  return {
    data: result.data || [],
    isLoading: isLoadingDevices || result.isLoading,
    error: devicesError || result.error,
    refetch: async () => {
      await refetchDevices();
      await result.refetch();
    }
  };
};
