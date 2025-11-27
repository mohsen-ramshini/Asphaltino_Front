"use client";

import React, { useState } from "react";
import { Drawer, Layout, theme, Affix } from "antd";
import { usePathname } from "next/navigation";
import Sidenav from "./Sidenav";
import Header from "./Header";

const { Header: AntHeader, Content, Sider } = Layout;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(false); // موبایل
  const [sidenavColor, setSidenavColor] = useState("#1890ff");
  const [sidenavType, setSidenavType] = useState("transparent");
  const [fixed, setFixed] = useState(false);

  const pathname = usePathname();

  const getCurrentPage = () => {
    if (pathname === "/dashboard") return "dashboard";
    if (pathname.startsWith("/dashboard/devices")) return "devices";
    if (pathname.startsWith("/dashboard/profile")) return "profile";
    return "dashboard";
  };

  const currentPage = getCurrentPage();

  const toggleSidebar = () => setCollapsed(!collapsed);
  const openDrawer = () => setVisible(!visible);
  const handleSidenavType = (type: string) => setSidenavType(type);
  const handleSidenavColor = (color: string) => setSidenavColor(color);
  const handleFixedNavbar = (type: boolean) => setFixed(type);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="min-h-screen">
      {/* Mobile Drawer */}
      <Drawer
        title={false}
        placement="left"
        closable={false}
        onClose={() => setVisible(false)}
        open={visible}
        width={250}
        className="drawer-sidebar"
        zIndex={1001}
      >
        <div className="h-full" style={{ background: sidenavType }}>
          <Sidenav color={sidenavColor} currentPage={currentPage} />
        </div>
      </Drawer>

      {/* Desktop Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth={80}
        onBreakpoint={(broken) => setCollapsed(broken)}
        width={280}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          background: "white",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
          transition: "all 0.2s",
        }}
      >
        <Sidenav color={sidenavColor} currentPage={currentPage} collapsed={collapsed} />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 280, transition: "margin-left 0.2s" }}>
        {/* Header */}
        {fixed ? (
          <Affix>
            <AntHeader style={{ padding: 0, background: colorBgContainer }}>
              <Header
                onPress={openDrawer}
                toggleCollapsed={toggleSidebar}
                collapsed={collapsed}
                name={currentPage}
                subName={currentPage}
                handleSidenavColor={handleSidenavColor}
                handleSidenavType={handleSidenavType}
                handleFixedNavbar={handleFixedNavbar}
              />
            </AntHeader>
          </Affix>
        ) : (
          <AntHeader style={{ padding: 0, background: colorBgContainer }}>
            <Header
              onPress={openDrawer}
              toggleCollapsed={toggleSidebar}
              collapsed={collapsed}
              name={currentPage}
              subName={currentPage}
              handleSidenavColor={handleSidenavColor}
              handleSidenavType={handleSidenavType}
              handleFixedNavbar={handleFixedNavbar}
            />
          </AntHeader>
        )}

        {/* Content */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          box
          {/* {children} */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
