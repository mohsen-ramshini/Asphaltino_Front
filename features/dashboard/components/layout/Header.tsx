import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Breadcrumb,
  Typography,
  Button,
} from "antd";
import {
  MenuOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";

function Header({
  name,
  subName,
  onPress, // این برای Drawer موبایل
  toggleCollapsed, // این برای باز و بسته کردن Sidebar دسکتاپ
  collapsed, // وضعیت Sidebar
  handleSidenavColor,
  handleSidenavType,
  handleFixedNavbar,
}) {
  const { Title, Text } = Typography;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <Row gutter={[24, 0]} className="w-full items-center">
        <Col span={24} md={6} className="flex items-center gap-2">
          {/* دکمه toggle Sidebar */}
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={toggleCollapsed}
            className="mr-2"
          />
          <Breadcrumb
            items={[
              {
                title: <Link href="/" className="text-blue-600 hover:text-blue-800">Pages</Link>,
              },
              {
                title: (
                  <span className="capitalize text-gray-600">
                    {name.replace("/", "")}
                  </span>
                ),
              },
            ]}
          />
          <div className="mt-2">
            <span className="text-xl font-semibold text-gray-800 capitalize">
              {subName.replace("/", "")}
            </span>
          </div>
        </Col>
        {/* بخش سمت راست می‌تواند notification، search و دکمه Drawer موبایل باشد */}
      </Row>
    </>
  );
}

export default Header;
