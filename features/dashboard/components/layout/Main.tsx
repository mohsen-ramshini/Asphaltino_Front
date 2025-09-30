import React from "react";
import Header from "./Header";
import Sidenav from "./Sidenav";
import { Layout } from "antd";
import { Toaster } from 'sonner';

const { Content } = Layout;

import { ReactNode } from "react";

interface MainProps {
  children: ReactNode;
  currentPage?: string;
}

function Main({ children, currentPage = 'dashboard' }: MainProps) {
  return (
    <Layout className="main-layout">
      <Sidenav currentPage={currentPage} color="default" />
      <Layout>
        <Header
          placement="top"
          name="Dashboard"
          subName=""
          onPress={() => {}}
          handleSidenavColor={() => {}}
          handleSidenavType={() => {}}
          handleFixedNavbar={() => {}}
        />
        <Content className="site-layout-background">
          {children}
        </Content>
      </Layout>
      <Toaster position="top-right" richColors />
    </Layout>
  );
}

export default Main;