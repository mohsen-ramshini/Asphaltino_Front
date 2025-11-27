import { Menu } from "antd";
import { LogoutOutlined } from "@ant-design/icons"

import { useRouter } from "next/navigation";

import { menuItems } from "@/lib/constant/menu-items"
import { useLogout } from "@/features/auth/api";

interface SidenavProps {
  color?: string;
  currentPage: string;
  collapsed?: boolean;
}

function Sidenav({ color = "#1890ff", currentPage, collapsed = false }: SidenavProps) {
  const router = useRouter();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };



  return (
    <div className="h-full flex flex-col bg-white">
      {/* Brand / Logo */}
      <div className={`h-16 flex items-center justify-center border-b border-gray-100 px-2`}>
        Logo
      </div>

      {/* Menu */}
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[currentPage]}
          className="flex-1 border-none mt-4"
          inlineCollapsed={collapsed}
          onClick={({ key }) => {
            const item = menuItems.find(m => m.key === key);
            if (item?.href) router.push(item.href);
          }}
          items={menuItems.map(item => ({
            key: item.key,
            icon: (
              <span
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200`}
                style={{
                  background: currentPage === item.key ? "rgba(24,144,255,0.2)" : "rgba(24,144,255,0.05)",
                  color: currentPage === item.key ? color : "#666",
                  fontSize: "18px",
                }}
              >
                {item.icon}
              </span>
            ),
            label: item.label,
            style: collapsed ? { paddingLeft: 15, paddingRight: 0 } : {},
          }))}
        />



      {/* Footer */}
      <div className="p-4 border-t border-gray-100 mt-auto flex flex-col items-center">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200 mb-3
            ${collapsed 
              ? 'justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50 bg-white' // حالت collapsed: فقط آیکون وسط
              : 'justify-center bg-blue-500 text-white hover:bg-blue-600'} // حالت باز: متن و آیکون وسط
          `}
          disabled={logout.isPending}
        >
          <span className="flex items-center gap-2">
            <LogoutOutlined />
            {!collapsed && <span>{logout.isPending ? "Logging out..." : "Logout"}</span>}
          </span>
        </button>

        
        {!collapsed && (
          <div className="text-center text-xs text-gray-500">
            <p className="font-medium">Asphaltino v1.0</p>
            <p className="mt-1">© 2024 All Rights Reserved</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidenav;
