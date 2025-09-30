import { useState, useEffect } from "react";

import {
  Row,
  Col,
  Breadcrumb,
  Badge,
  Dropdown,
  Button,
  Avatar,
  Input,
  Drawer,
  Typography,
  Switch,
} from "antd";

import {
  SearchOutlined,
  StarOutlined,
  TwitterOutlined,
  FacebookFilled,
  BellOutlined,
  SpotifyOutlined,
  CreditCardOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";

import Link from "next/link";

const menu = {
  items: [
    {
      key: '1',
      label: (
        <div className="flex items-center gap-3 p-2">
          <Avatar shape="square" src="/assets/images/team-2.jpg" />
          <div className="flex flex-col">
            <div className="font-medium text-gray-800">New message from Sophie</div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <ClockCircleOutlined /> 2 days ago
            </div>
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div className="flex items-center gap-3 p-2">
          <Avatar shape="square" className="bg-green-500"><SpotifyOutlined /></Avatar>
          <div className="flex flex-col">
            <div className="font-medium text-gray-800">New album by Travis Scott</div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <ClockCircleOutlined /> 2 days ago
            </div>
          </div>
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div className="flex items-center gap-3 p-2">
          <Avatar shape="square" className="bg-blue-500"><CreditCardOutlined /></Avatar>
          <div className="flex flex-col">
            <div className="font-medium text-gray-800">Payment completed</div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <ClockCircleOutlined /> 2 days ago
            </div>
          </div>
        </div>
      ),
    },
  ],
};

function Header({
  placement,
  name,
  subName,
  onPress,
  handleSidenavColor,
  handleSidenavType,
  handleFixedNavbar,
}) {
  const { Title, Text } = Typography;

  const [visible, setVisible] = useState(false);
  const [sidenavType, setSidenavType] = useState("transparent");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  });

  const showDrawer = () => setVisible(true);
  const hideDrawer = () => setVisible(false);

  return (
    <>
      <Row gutter={[24, 0]} className="w-full">
        <Col span={24} md={6}>
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
        {/* <Col span={24} md={18} className="flex items-center justify-end gap-4">
          <Badge size="small" count={4}>
            <Dropdown menu={menu} trigger={["click"]} placement="bottomRight">
              <a href="#pablo" className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={(e) => e.preventDefault()}>
                <BellOutlined />
              </a>
            </Dropdown>
          </Badge>
          <Button
            type="link"
            className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-blue-600 block lg:hidden"
            onClick={() => onPress()}
          >
            <MenuOutlined />
          </Button>
          <Input
            className="w-48 bg-gray-50 border-gray-200 rounded-lg hidden sm:block"
            placeholder="Type here..."
            prefix={<SearchOutlined />}
          />
        </Col> */}
      </Row>
    </>
  );
}

export default Header;