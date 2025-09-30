import React from 'react'
import {
  Card,
  Typography,
  Radio,
  Upload,
  Button,
  Progress,
  Tooltip,
  Divider,
  Badge,
  Space,
} from "antd";
import { ToTopOutlined, CloudUploadOutlined, SettingOutlined } from "@ant-design/icons";
import Image from "next/image";

const { Title, Paragraph, Text } = Typography;

const DeviceTables = () => {
  const onChange = (e: any) => console.log(`radio checked:${e.target.value}`);

  const list = [
    {
      img: "/assets/images/logo-shopify.svg",
      Title: "Temperature Sensor Network",
      member: "45 Active Sensors",
      bud: "$2,400",
      progress: <Progress percent={85} size="small" strokeColor="#10b981" trailColor="#f3f4f6" />,
      status: "operational",
      location: "Highway Network A1-A5",
    },
    {
      img: "/assets/images/logo-atlassian.svg", 
      Title: "Ice Detection System",
      member: "12 Active Units",
      bud: "$5,000",
      progress: <Progress percent={60} size="small" strokeColor="#3b82f6" trailColor="#f3f4f6" />,
      status: "maintenance",
      location: "Critical Junction Points",
    },
    {
      img: "/assets/images/logo-slack.svg",
      Title: "Weather Monitoring Units",
      member: "8 Active Stations", 
      bud: "$1,800",
      progress: <Progress percent={95} size="small" strokeColor="#10b981" trailColor="#f3f4f6" />,
      status: "operational",
      location: "Regional Weather Grid",
    },
    {
      img: "/assets/images/logo-spotify.svg",
      Title: "Road Surface Sensors",
      member: "23 Active Sensors",
      bud: "$3,200", 
      progress: <Progress percent={75} size="small" strokeColor="#f59e0b" trailColor="#f3f4f6" />,
      status: "warning",
      location: "Main Highway Network",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge status="success" text="Operational" />;
      case 'maintenance':
        return <Badge status="processing" text="Maintenance" />;
      case 'warning':
        return <Badge status="warning" text="Attention Required" />;
      default:
        return <Badge status="default" text="Unknown" />;
    }
  };

  const uploadProps = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: "authorization-text",
    },
  };

  return (
    <Card className="rounded-2xl border-0 shadow-lg bg-white h-full">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 -m-6 mb-6 p-6 rounded-t-2xl border-b border-slate-200">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
              <Title level={4} className="mb-0 text-slate-800">Device Project Overview</Title>
            </div>
            <Title level={5} className="mb-2 text-blue-600 font-semibold">
              Infrastructure Monitoring Networks
            </Title>
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <span>
                Monthly Progress: <span className="font-semibold text-emerald-600">40% Complete</span>
              </span>
              <Divider type="vertical" />
              <span>
                Total Budget: <span className="font-semibold text-slate-800">$12,400</span>
              </span>
            </div>
          </div>
          
          <div className="ml-6">
            <Text className="text-xs text-slate-500 uppercase tracking-wide font-semibold block mb-2">
              Filter Networks
            </Text>
            <Radio.Group onChange={onChange} defaultValue="a" buttonStyle="solid" size="small">
              <Radio.Button value="a" className="text-xs font-medium">ALL</Radio.Button>
              <Radio.Button value="b" className="text-xs font-medium">ONLINE</Radio.Button>
              <Radio.Button value="c" className="text-xs font-medium">SENSORS</Radio.Button>
            </Radio.Group>
          </div>
        </div>
      </div>
      
      {/* Enhanced Table */}
      <div className="mb-6">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700 text-xs uppercase tracking-wide">
                  Network Infrastructure
                </th>
                <th className="text-left p-4 font-semibold text-slate-700 text-xs uppercase tracking-wide">
                  Active Devices
                </th>
                <th className="text-left p-4 font-semibold text-slate-700 text-xs uppercase tracking-wide">
                  Investment
                </th>
                <th className="text-left p-4 font-semibold text-slate-700 text-xs uppercase tracking-wide">
                  Deployment Status
                </th>
                <th className="text-left p-4 font-semibold text-slate-700 text-xs uppercase tracking-wide">
                  Network Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((d, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors duration-200">
                  <td className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Image
                          src={d.img}
                          alt=""
                          className="w-12 h-12 rounded-xl shadow-sm border border-slate-200"
                          width={48}
                          height={48}
                        />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h6 className="font-semibold text-slate-900 mb-1 truncate">{d.Title}</h6>
                        <p className="text-sm text-slate-500 truncate">{d.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600 mb-1">
                        {d.member.split(' ')[0]}
                      </div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                        {d.member.split(' ').slice(1).join(' ')}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-600">
                        {d.bud}
                      </div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                        Allocated
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-600 font-medium">Progress</span>
                        <span className="text-slate-800 font-semibold">
                          {d.progress.props.percent}%
                        </span>
                      </div>
                      <div className="w-full">
                        {d.progress}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-center">
                      {getStatusBadge(d.status)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Enhanced Upload Section */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Title level={5} className="mb-1 text-slate-800">
              Configuration Management
            </Title>
            <Text className="text-slate-600 text-sm">
              Upload device configurations and firmware updates
            </Text>
          </div>
          <SettingOutlined className="text-slate-400 text-xl" />
        </div>
        
        <Upload {...uploadProps}>
          <Button
            type="dashed"
            className="w-full h-14 flex items-center justify-center space-x-3 border-2 border-dashed border-blue-300 hover:border-blue-500 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all duration-200 rounded-xl"
            icon={<CloudUploadOutlined className="text-lg" />}
          >
            <span className="font-medium">Upload Device Configuration Files</span>
          </Button>
        </Upload>
        
        <div className="mt-3 text-center">
          <Text className="text-xs text-slate-500">
            Supports .json, .xml, .cfg files up to 10MB
          </Text>
        </div>
      </div>
    </Card>
  )
}

export default DeviceTables