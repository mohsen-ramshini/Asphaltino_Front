import { Menu } from "antd";
import Link from "next/link";
import { 
  DashboardOutlined, 
  UserOutlined, 
  MobileOutlined,
  LogoutOutlined 
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useLogout } from "@/features/auth/api";

function Sidenav({ color, currentPage }) {
  const router = useRouter();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      // Call the logout mutation
      await logout.mutateAsync();
      // Note: The hook itself handles clearing cookies, localStorage, 
      // and redirecting to the sign-in page
    } catch (error) {
      // Error handling is already managed in the hook
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="brand">
        <span>IntAsphalt</span>
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[currentPage]}
        className="flex-1 border-none"
        items={[
          {
            key: "dashboard",
            icon: (
              <span 
                className="icon" 
                style={{ 
                  background: currentPage === "dashboard" ? "rgba(255,255,255,0.2)" : "rgba(24,144,255,0.1)",
                  color: currentPage === "dashboard" ? "#fff" : "#666",
                }}
              >
                <DashboardOutlined />
              </span>
            ),
            label: (
              <Link 
                href="/dashboard"
                style={{
                  fontWeight: currentPage === "dashboard" ? "600" : "500",
                  color: currentPage === "dashboard" ? "white" : "#666"
                }}
              >
                Dashboard
              </Link>
            ),
          },
          {
            key: "devices",
            icon: (
              <span 
                className="icon" 
                style={{ 
                  background: currentPage === "devices" ? "rgba(255,255,255,0.2)" : "rgba(24,144,255,0.1)",
                  color: currentPage === "devices" ? "#fff" : "#666",
                }}
              >
                <MobileOutlined />
              </span>
            ),
            label: (
              <Link 
                href="/dashboard/devices"
                style={{
                  fontWeight: currentPage === "devices" ? "600" : "500",
                  color: currentPage === "devices" ? "white" : "#666"
                }}
              >
                Devices
              </Link>
            ),
          },
          {
            key: "profile",
            icon: (
              <span 
                className="icon" 
                style={{ 
                  background: currentPage === "profile" ? "rgba(255,255,255,0.2)" : "rgba(24,144,255,0.1)",
                  color: currentPage === "profile" ? "#fff" : "#666",
                }}
              >
                <UserOutlined />
              </span>
            ),
            label: (
              <Link 
                href="/dashboard/profile"
                style={{
                  fontWeight: currentPage === "profile" ? "600" : "500",
                  color: currentPage === "profile" ? "white" : "#666"
                }}
              >
                Profile
              </Link>
            ),
          },
        ]}
      />
      
      {/* Footer section with logout */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 mb-3"
          disabled={logout.isPending}
        >
          <LogoutOutlined />
          <span>{logout.isPending ? "Logging out..." : "Logout"}</span>
        </button>
        
        <div className="text-center text-xs text-gray-500">
          <p className="font-medium">Asphaltino v1.0</p>
          <p className="mt-1">© 2024 All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
}

export default Sidenav;
