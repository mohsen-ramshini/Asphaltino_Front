"use client";

import React, { useState, useEffect } from "react";
import { Layout, Drawer, theme } from "antd";
import { usePathname } from "next/navigation";
import Sidenav from "./Sidenav";
import Header from "./Header";

const { Header: AntHeader, Content, Sider } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  const pathname = usePathname();

  const getCurrentPage = () => {
    if (pathname === "/dashboard") return "dashboard";
    if (pathname.startsWith("/dashboard/devices")) return "devices";
    if (pathname.startsWith("/dashboard/profile")) return "profile";
    return "dashboard";
  };

  const currentPage = getCurrentPage();

  const toggleSidebar = () => setCollapsed(!collapsed);
  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 992;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* موبایل Drawer */}
      {isMobile && (
        <Drawer
          title={false}
          placement="left"
          closable={false}
          onClose={closeDrawer}
          open={drawerVisible}
          width={250}
          style={{ padding: 0 }}
          zIndex={1001}
        >
          <Sidenav color="#1890ff" currentPage={currentPage} />
        </Drawer>
      )}

      {/* دسکتاپ Sidebar */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          collapsedWidth={80}
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
          <Sidenav color="#1890ff" currentPage={currentPage} collapsed={collapsed} />
        </Sider>
      )}

      {/* Layout اصلی */}
      <Layout
        style={{
          marginLeft: !isMobile ? (collapsed ? 80 : 280) : 0,
          transition: "margin-left 0.2s",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <AntHeader style={{ padding: 0, background: colorBgContainer, width: '100%' }}>
          <Header
            toggleCollapsed={isMobile ? openDrawer : toggleSidebar}
            collapsed={collapsed}
            name={currentPage}
          />
        </AntHeader>


        {/* Content */}
        <Content
          style={{
            flex: 1,
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          map
          {/* {children} */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
