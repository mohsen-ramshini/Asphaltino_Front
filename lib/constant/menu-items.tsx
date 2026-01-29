import {
  DashboardOutlined,
  UserOutlined,
  MobileOutlined,
  AreaChartOutlined,
  TableOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

export const menuItems = [
  {
    key: "dashboard",
    icon: <AreaChartOutlined />,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    key: "map",
    icon: <EnvironmentOutlined />,
    label: "Map",
    href: "/dashboard/map",
  },
  {
    key: "devices",
    icon: <MobileOutlined />,
    label: "Devices",
    href: "/dashboard/devices",
  },
  {
    key: "profile",
    icon: <UserOutlined />,
    label: "Profile",
    href: "/dashboard/profile",
  },
];
