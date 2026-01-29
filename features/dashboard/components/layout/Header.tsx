import { useEffect } from "react";
import { Row, Col, Breadcrumb, Typography, Button, Tooltip } from "antd";
import {
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  GlobalOutlined,
  BulbOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import Link from "next/link";

interface HeaderProps {
  name: string;
  toggleCollapsed: () => void;
  collapsed: boolean;
  isDarkMode?: boolean;
}

function Header({ name, toggleCollapsed, collapsed, isDarkMode = false }: HeaderProps) {


  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <Row
      className="w-full items-center justify-between px-4 py-2 bg-white shadow-sm"
    >
      <Col className="flex items-center gap-3">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
          className="text-xl"
        />

        <Breadcrumb
          items={[
            {
              title: <Link href="/" className="text-blue-600 hover:text-blue-800">Pages</Link>,
            },
            {
              title: <span className="capitalize text-gray-600">{name.replace("/", "")}</span>,
            },
          ]}
        />

      </Col>


      <Col className="flex items-center gap-4">
        <Tooltip title="Notifications">
          <Button type="text" icon={<BellOutlined />} className="text-xl" disabled/>
        </Tooltip>

        <Tooltip title="Language">
          <Button type="text" icon={<GlobalOutlined />} className="text-xl" disabled/>
        </Tooltip>

        <Tooltip title="Theme">
          <Button type="text" icon={isDarkMode ? <MoonOutlined /> : <BulbOutlined />} className="text-xl" disabled/>
        </Tooltip>
      </Col>
    </Row>
  );
}

export default Header;
