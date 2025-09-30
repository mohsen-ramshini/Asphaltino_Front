"use client";

import { useState, useEffect } from "react";
import { Layout, Drawer, Affix } from "antd";
import { usePathname } from "next/navigation";
import Sidenav from "./Sidenav";
import Header from "./Header";

const { Header: AntHeader, Content, Sider } = Layout;

function Main({ children }) {
  const [visible, setVisible] = useState(false);
  const [sidenavColor, setSidenavColor] = useState("#1890ff");
  const [sidenavType, setSidenavType] = useState("transparent");
  const [fixed, setFixed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  
  // Get current pathname
  const pathname = usePathname();
  
  // Extract current page from pathname
  const getCurrentPage = () => {
    if (pathname === "/dashboard") return "dashboard";
    if (pathname.startsWith("/dashboard/devices")) return "devices";
    if (pathname.startsWith("/dashboard/profile")) return "profile";
    return "dashboard";
  };

  const currentPage = getCurrentPage();

  const openDrawer = () => setVisible(!visible);
  const handleSidenavType = (type) => setSidenavType(type);
  const handleSidenavColor = (color) => setSidenavColor(color);
  const handleFixedNavbar = (type) => setFixed(type);

  return (
    <Layout className="layout-dashboard min-h-screen">
      {/* Mobile Drawer */}
      <Drawer
        title={false}
        placement="left"
        closable={false}
        onClose={() => setVisible(false)}
        open={visible}
        width={250}
        className="drawer-sidebar"
        styles={{ body: { padding: 0 } }}
        zIndex={1001}
      >
        <div className="h-full" style={{ background: sidenavType }}>
          <Sidenav color={sidenavColor} currentPage={currentPage} />
        </div>
      </Drawer>

      {/* Desktop Sidebar */}
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log("Sidebar collapsed:", collapsed, type);
          setCollapsed(collapsed);
        }}
        trigger={null}
        width={280}
        theme="light"
        className={`sider-primary ${
          sidenavType === "#fff" ? "active-route" : ""
        }`}
        style={{
          background: "white",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
        }}
        hidden={false}
      >
        <Sidenav color={sidenavColor} currentPage={currentPage} />
      </Sider>

      {/* Main Layout */}
      <Layout
        className="main-layout"
        style={{
          marginLeft: collapsed ? 0 : 280,
          transition: "margin-left 0.2s",
        }}
      >
        {fixed ? (
          <Affix>
            <AntHeader
              className={`ant-header-custom ${
                fixed ? "ant-header-fixed" : ""
              }`}
            >
              <Header
                onPress={openDrawer}
                name={currentPage}
                subName={currentPage}
                handleSidenavColor={handleSidenavColor}
                handleSidenavType={handleSidenavType}
                handleFixedNavbar={handleFixedNavbar}
              />
            </AntHeader>
          </Affix>
        ) : (
          <AntHeader
            className={`ant-header-custom ${
              fixed ? "ant-header-fixed" : ""
            }`}
          >
            <Header
              onPress={openDrawer}
              name={currentPage}
              subName={currentPage}
              handleSidenavColor={handleSidenavColor}
              handleSidenavType={handleSidenavType}
              handleFixedNavbar={handleFixedNavbar}
            />
          </AntHeader>
        )}
        <Content className={`content-ant ${fixed ? 'header-fixed' : ''}`}>{children}</Content>
      </Layout>
    </Layout>
  );
}

export default Main;
