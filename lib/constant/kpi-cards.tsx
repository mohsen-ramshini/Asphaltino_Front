import { BsSnow } from 'react-icons/bs';
import { MdDeviceUnknown } from 'react-icons/md';
import {
  // ThermometerOutlined,
  AlertOutlined,
  ToolOutlined,
} from "@ant-design/icons";



// Calculate KPI metrics
  const totalDevices = 3;
  // const activeDevices = devices?.filter(device => device.status === 'online')?.length || 0;
  const activeDevices = 0;
  // const maintenanceNeeded = statsOverview?.maintenanceCount || 0;
  const maintenanceNeeded = 0;
  // const criticalAlerts = systemAlerts?.filter(alert => alert.severity === 'critical')?.length || 0;
  const criticalAlerts = 0;
  // const icingPoints = statsOverview?.icingCount || 0;
  const icingPoints = 1;
  
  // Percent changes (simulated - in a real app these would come from API)
  const icingChange = icingPoints > 20 ? 30 : -10;
  const maintenanceChange = maintenanceNeeded > 3 ? 20 : -15;
  const activeChange = activeDevices > (totalDevices * 0.8) ? 5 : -20;
  const alertsChange = criticalAlerts > 3 ? 10 : -5;

  // const isLoading = isLoadingDevices  || isLoadingAlerts || isLoadingStats;
  const isLoading = false
  
export  const kpiCards = [
    {
      title: "Active Icing Points",
      value: icingPoints,
      change: icingChange,
      icon: <BsSnow className="text-2xl" />,
      color: "from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      description: "Locations with detected ice formation"
    },
    {
      title: "Devices Needing Maintenance",
      value: maintenanceNeeded,
      change: maintenanceChange,
      icon: <ToolOutlined className="text-2xl" />,
      color: "from-amber-500 to-amber-600",
      textColor: "text-amber-600",
      description: "Sensors requiring attention"
    },
    {
      title: "Active Devices",
      value: activeDevices,
      suffix: `/${totalDevices}`,
      change: activeChange,
      icon: <MdDeviceUnknown className="text-2xl" />,
      color: "from-emerald-500 to-emerald-600",
      textColor: "text-emerald-600",
      description: "Online sensors transmitting data"
    },
    {
      title: "Critical Alerts",
      value: criticalAlerts,
      change: alertsChange,
      icon: <AlertOutlined className="text-2xl" />,
      color: "from-red-500 to-red-600",
      textColor: "text-red-600", 
      description: "High priority system warnings"
    },
  ];
