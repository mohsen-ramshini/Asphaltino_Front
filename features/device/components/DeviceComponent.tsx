"use client"

import React, { useState } from 'react'
import {
  Card,
  Col,
  Row,
  Typography,
  Radio,
  Upload,
  Button,
  Table,
  Tag,
  Progress,
  Avatar,
  Tooltip,
  Input,
  Select,
  Space,
  Badge,
  Divider,
  Statistic,
  message,
  Modal,
} from "antd";
import {
  ToTopOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  WifiOutlined,
  DisconnectOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import DeviceTables from './DeviceTables';
import CreateDeviceModal from './CreateDeviceModal';
import UpdateDeviceModal from './UpdateDeviceModal';
import { useDeleteDevice } from '../api/use-delete-device';
import { useCombinedDeviceData } from '../api/use-combined-device-data';
import {mockDeviceData} from "@/lib/mockDevice";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// Mock data for device table
// const mockDeviceData = [
//   {
//     id: 1,
//     name: "asphalt sensors",
//     uuid: "abc123-xyz-789",
//     location: {
//       address: "Tehran Province, Tehran, District 4, 5th Golestan St, QF8J+674, Iran",
//       latitude: 35.7501,
//       longitude: 51.5255,
//     },
//     api_key: "APIKEY123456789",
//     sub_id: "SUB-001",
//     status: 'online',
//     count: 120,
//     avg_wind_speed: 5.2,
//     max_wind_speed: 12.1,
//     min_wind_speed: 1.0,
//     avg_humidity: 45.3,
//     avg_air_temperature: 22.5,
//     avg_asphalt_temperature: 28.1,
//     icing_occurrences: 0,
//     first_data_timestamp: "2024-05-01T08:00:00Z",
//     last_data_timestamp: "2024-06-01T12:30:00Z",
//   },
//   {
//     id: 2,
//     name: "Ice Detector Beta",
//     uuid: "def456-uvw-012",
//     location: {
//       address: "456 Highway A1, Isfahan",
//       latitude: 32.6539,
//       longitude: 51.6660,
//     },
//     api_key: "APIKEY987654321",
//     sub_id: "SUB-002",
//     count: 98,
//     avg_wind_speed: 3.8,
//     max_wind_speed: 8.5,
//     min_wind_speed: 0.5,
//     avg_humidity: 60.1,
//     avg_air_temperature: -2.3,
//     avg_asphalt_temperature: -1.0,
//     icing_occurrences: 3,
//     first_data_timestamp: "2024-05-10T09:15:00Z",
//     last_data_timestamp: "2024-06-01T11:00:00Z",
//   },
//   {
//     id: 3,
//     name: "Temperature Sensor Gamma",
//     uuid: "ghi789-rst-345",
//     location: {
//       address: "789 North Ave, Shiraz",
//       latitude: 29.5918,
//       longitude: 52.5837,
//     },
//     api_key: "APIKEY456789123",
//     sub_id: "SUB-003",
//     count: 150,
//     avg_wind_speed: 2.1,
//     max_wind_speed: 5.0,
//     min_wind_speed: 0.2,
//     avg_humidity: 30.0,
//     avg_air_temperature: 35.7,
//     avg_asphalt_temperature: 42.3,
//     icing_occurrences: 0,
//     first_data_timestamp: "2024-05-05T07:45:00Z",
//     last_data_timestamp: "2024-06-01T13:10:00Z",
//   },
//   {
//     id: 4,
//     name: "Multi-Sensor Delta",
//     uuid: "jkl012-mno-678",
//     location: {
//       address: "321 East Road, Mashhad",
//       latitude: 36.2605,
//       longitude: 59.6168,
//     },
//     api_key: "APIKEY111222333",
//     sub_id: "SUB-004",
//     count: 75,
//     avg_wind_speed: 7.3,
//     max_wind_speed: 15.2,
//     min_wind_speed: 2.1,
//     avg_humidity: 55.8,
//     avg_air_temperature: 18.9,
//     avg_asphalt_temperature: 25.4,
//     icing_occurrences: 1,
//     first_data_timestamp: "2024-05-15T06:30:00Z",
//     last_data_timestamp: "2024-06-01T14:45:00Z",
//   },
//   {
//     id: 5,
//     name: "Road Monitor Epsilon",
//     uuid: "pqr345-stu-901",
//     location: {
//       address: "654 South Bridge, Tabriz",
//       latitude: 38.0962,
//       longitude: 46.2738,
//     },
//     api_key: "APIKEY444555666",
//     sub_id: "SUB-005",
//     count: 200,
//     avg_wind_speed: 4.5,
//     max_wind_speed: 9.8,
//     min_wind_speed: 0.8,
//     avg_humidity: 40.2,
//     avg_air_temperature: 12.1,
//     avg_asphalt_temperature: 16.7,
//     icing_occurrences: 2,
//     first_data_timestamp: "2024-04-20T05:00:00Z",
//     last_data_timestamp: "2024-06-01T15:20:00Z",
//   },
// ];

const DeviceComponent = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deletingDeviceId, setDeletingDeviceId] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  // Get the deleteDevice mutation from the hook
  const deleteDevice = useDeleteDevice();

  // Replace API call with mock data
  const deviceData = mockDeviceData;
  const isLoading = false;
  const error = null;
  
  const refetch = async () => {
    console.log('Refreshing mock data...');
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'green';
      case 'offline': return 'red';
      case 'warning': return 'orange';
      case 'maintenance': return 'blue';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <WifiOutlined />;
      case 'offline': return <DisconnectOutlined />;
      case 'warning': return <WarningOutlined />;
      case 'maintenance': return <EditOutlined />;
      default: return <WifiOutlined />;
    }
  };

  const getMaintenanceColor = (maintenance: string) => {
    switch (maintenance) {
      case 'Good': return 'green';
      case 'Warning': return 'orange';
      case 'Needs Service': return 'red';
      case 'In Maintenance': return 'blue';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: (
        <div className="font-semibold text-gray-700 uppercase tracking-wide text-xs">
          Device Information
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      width: 280,
      render: (text: string, record: any) => (
        <div className="flex items-center space-x-4 py-2">
          <div className="relative">
            <Avatar 
              size={48} 
              className="bg-blue-500 shadow-md border-2 border-white"
            >
              {text ? text.charAt(0).toUpperCase() : 'D'}
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 text-sm truncate">{text || 'Unnamed Device'}</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">ID: {record.id}</div>
            <div className="text-xs text-gray-400 mt-1">UUID: {record.uuid}</div>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="font-semibold text-gray-700 uppercase tracking-wide text-xs">
          Location & Details
        </div>
      ),
      dataIndex: 'location',
      key: 'location',
      width: 250,
      render: (location: any, record: any) => (
        <div className="py-2">
          <div className="text-sm font-medium text-gray-900 mb-1">
            {location?.address || 'No address'}
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <div><span className="font-medium">Lat:</span> {location?.latitude?.toFixed(4) || '-'}</div>
            <div><span className="font-medium">Lng:</span> {location?.longitude?.toFixed(4) || '-'}</div>
            <div><span className="font-medium">API Key:</span> {record.api_key?.slice(0, 8) || 'N/A'}...</div>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="font-semibold text-gray-700 uppercase tracking-wide text-xs">
          Data Metrics
        </div>
      ),
      dataIndex: 'count',
      key: 'count',
      width: 120,
      align: 'center' as const,
      render: (count: number) => (
        <div className="text-center py-2">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {count || 0}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Records</div>
        </div>
      ),
    },
    {
      title: (
        <div className="font-semibold text-gray-700 uppercase tracking-wide text-xs">
          Wind Data
        </div>
      ),
      key: 'wind_data',
      width: 180,
      render: (record: any) => (
        <div className="py-2 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Avg:</span>
            <span className="font-medium text-cyan-600">
              {record.avg_wind_speed?.toFixed(1) || '-'} m/s
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Max:</span>
            <span className="font-medium text-red-500">
              {record.max_wind_speed?.toFixed(1) || '-'} m/s
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Min:</span>
            <span className="font-medium text-green-500">
              {record.min_wind_speed?.toFixed(1) || '-'} m/s
            </span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="font-semibold text-gray-700 uppercase tracking-wide text-xs">
          Temperature Data
        </div>
      ),
      key: 'temperature_data',
      width: 160,
      render: (record: any) => (
        <div className="py-2 space-y-2">
          <div>
            <div className="text-xs text-gray-500 mb-1">Air Temperature</div>
            <div className={`text-lg font-bold ${
              record.avg_air_temperature > 30 ? 'text-red-600' : 
              record.avg_air_temperature < 0 ? 'text-blue-600' : 
              'text-green-600'
            }`}>
              {record.avg_air_temperature?.toFixed(1) || '-'}°C
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Asphalt Temp</div>
            <div className="text-sm font-medium text-orange-600">
              {record.avg_asphalt_temperature?.toFixed(1) || '-'}°C
            </div>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="font-semibold text-gray-700 uppercase tracking-wide text-xs">
          Environmental
        </div>
      ),
      key: 'environmental',
      width: 140,
      render: (record: any) => (
        <div className="py-2 space-y-2">
          <div>
            <div className="text-xs text-gray-500 mb-1">Humidity</div>
            <div className="text-lg font-bold text-blue-600">
              {record.avg_humidity?.toFixed(1) || '-'}%
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Icing Events</div>
            <Tag 
              color={record.icing_occurrences > 0 ? 'red' : 'green'}
              className="rounded-full px-2"
            >
              {record.icing_occurrences || 0}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="font-semibold text-gray-700 uppercase tracking-wide text-xs">
          Data Timeline
        </div>
      ),
      key: 'timeline',
      width: 160,
      render: (record: any) => (
        <div className="py-2 space-y-2">
          <div>
            <div className="text-xs text-gray-500 mb-1">First Data</div>
            <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
              {record.first_data_timestamp ? 
                new Date(record.first_data_timestamp).toLocaleDateString() : 
                'No data'
              }
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Last Data</div>
            <div className="text-xs font-mono bg-blue-100 px-2 py-1 rounded text-blue-800">
              {record.last_data_timestamp ? 
                new Date(record.last_data_timestamp).toLocaleDateString() : 
                'No data'
              }
            </div>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="font-semibold text-gray-700 uppercase tracking-wide text-xs text-center">
          Actions
        </div>
      ),
      key: 'actions',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <div className="py-2">
          <Space direction="vertical" size="small">
            <Space size="small">
              <Tooltip title="View Details">
                <Button 
                  disabled
                  type="text" 
                  icon={<EyeOutlined />} 
                  size="small" 
                  className="hover:bg-blue-50 hover:text-blue-600"
                />
              </Tooltip>
              <Tooltip title="Edit Device">
                <Button 
                  disabled
                  type="text" 
                  icon={<EditOutlined />} 
                  size="small"
                  onClick={() => handleEditDevice(record.id)}
                  className="hover:bg-amber-50 hover:text-amber-600"
                />
              </Tooltip>
            </Space>
            <Tooltip title="Delete Device">
              <Button 
                disabled
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                size="small"
                onClick={() => handleDeleteClick(record)}
                className="hover:bg-red-50"
                loading={deletingDeviceId === record.id}
              />
            </Tooltip>
          </Space>
        </div>
      ),
    },
  ];


  const filteredData = deviceData.filter(device => {
    const matchesFilter = selectedFilter === 'all' || device.status === selectedFilter;
    const matchesSearch = (device.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
                          (device.location?.address || '').toLowerCase().includes(searchText.toLowerCase()) ||
                          (device.id !== undefined && device.id !== null ? String(device.id) : '').toLowerCase().includes(searchText.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: deviceData.length,
    online: deviceData.filter(d => d.status === 'online').length,
    offline: deviceData.filter(d => d.status === 'offline').length,
    warning: deviceData.filter(d => d.status === 'warning').length,
    maintenance: deviceData.filter(d => d.status === 'maintenance').length,
  };

  const handleFilterChange = (e: any) => {
    setSelectedFilter(e.target.value);
  };

  const handleCreateDevice = () => {
    setCreateModalOpen(true);
  };

  const handleCreateModalCancel = () => {
    setCreateModalOpen(false);
  };

  const handleRefreshData = async () => {
    try {
      await refetch();
      message.success('Data refreshed successfully');
    } catch (err) {
      message.error('Failed to refresh data');
    }
  };

  const handleDeleteClick = (record: any) => {
    // Use Modal.confirm from antd v5+ correctly
    Modal.confirm({
      title: 'Delete Device',
      content: `Are you sure you want to delete device "${record.name}"? This action cannot be undone.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      maskClosable: true,
      onOk: async () => {
        await handleDeleteDevice(record.id);
      },
    });
  };

  const handleDeleteDevice = async (deviceId: string) => {
    console.log('🗑️ Delete request initiated for device ID:', deviceId);
    
    try {
      setDeletingDeviceId(deviceId);
      await deleteDevice.mutateAsync(deviceId);
      console.log('✅ Device deleted successfully:', deviceId);
      message.success(`Device deleted successfully`);
      refetch(); // Refresh the device list
    } catch (error: any) {
      console.error('❌ Delete device error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      message.error(`Failed to delete device: ${error.response?.data?.message || error.message}`);
    } finally {
      setDeletingDeviceId(null);
    }
  };

  const handleEditDevice = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setUpdateModalOpen(true);
  };

  const handleUpdateModalCancel = () => {
    setUpdateModalOpen(false);
    setSelectedDeviceId('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Enhanced Header Section */}
        <div className="mb-8">
          <Card className="rounded-2xl border-0 shadow-lg bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <Title level={2} className="mb-2 text-white">
                    Device Management System
                  </Title>
                  <Text className="text-blue-100 text-base">
                    Enterprise IoT Device Monitoring & Control Center
                  </Text>
                </div>
                <Space size="middle">
                  <Button 
                    disabled
                    type="primary" 
                    icon={<PlusOutlined />} 
                    size="large"
                    onClick={handleCreateDevice}
                    className="bg-white text-blue-600 border-white hover:bg-blue-50 font-semibold px-6"
                  >
                    Add New Device
                  </Button>
                  <Button 
                    icon={<ReloadOutlined />} 
                    size="large"
                    loading={isLoading}
                    onClick={handleRefreshData}
                    className="border-blue-200 text-white hover:bg-blue-600"
                  >
                    {isLoading ? 'Loading...' : 'Refresh Data'}
                  </Button>
                </Space>
              </div>
            </div>

            {/* Enhanced Status Overview Cards */}
            <div className="p-8">
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} md={6} lg={4} xl={4}>
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <Statistic
                      title={<span className="text-gray-600 font-semibold">Total Devices</span>}
                      value={statusCounts.all}
                      prefix={<WifiOutlined className="text-blue-500" />}
                      valueStyle={{ color: '#1f2937', fontSize: '28px', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4} xl={4}>
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-emerald-500">
                    <Statistic
                      title={<span className="text-gray-600 font-semibold">Online Devices</span>}
                      value={statusCounts.online}
                      prefix={<Badge status="success" />}
                      valueStyle={{ color: '#059669', fontSize: '28px', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4} xl={4}>
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-red-500">
                    <Statistic
                      title={<span className="text-gray-600 font-semibold">Offline Devices</span>}
                      value={statusCounts.offline}
                      prefix={<Badge status="error" />}
                      valueStyle={{ color: '#dc2626', fontSize: '28px', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4} xl={4}>
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-amber-500">
                    <Statistic
                      title={<span className="text-gray-600 font-semibold">Warning Status</span>}
                      value={statusCounts.warning}
                      prefix={<Badge status="warning" />}
                      valueStyle={{ color: '#d97706', fontSize: '28px', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4} xl={4}>
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-purple-500">
                    <Statistic
                      title={<span className="text-gray-600 font-semibold">Maintenance</span>}
                      value={statusCounts.maintenance}
                      prefix={<Badge status="processing" />}
                      valueStyle={{ color: '#7c3aed', fontSize: '28px', fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
              </Row>

              <Divider className="my-8" />

              {/* Enhanced Filters and Search */}
              <Row gutter={[24, 16]} align="middle">
                <Col xs={24} lg={8}>
                  <div className="space-y-2">
                    <Text strong className="text-gray-700 text-sm uppercase tracking-wide">
                      Search Devices
                    </Text>
                    <Search
                      placeholder="Search by name, ID, or location..."
                      allowClear
                      enterButton={<SearchOutlined />}
                      size="large"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                </Col>
                <Col xs={24} lg={16}>
                  <div className="space-y-2">
                    <Text strong className="text-gray-700 text-sm uppercase tracking-wide">
                      Filter by Status
                    </Text>
                    <Radio.Group 
                      value={selectedFilter} 
                      onChange={handleFilterChange} 
                      buttonStyle="solid"
                      size="large"
                      className="w-full"
                    >
                      <Radio.Button value="all" className="flex-1 text-center">
                        All Devices ({statusCounts.all})
                      </Radio.Button>
                      <Radio.Button value="online" className="flex-1 text-center">
                        Online ({statusCounts.online})
                      </Radio.Button>
                      <Radio.Button value="offline" className="flex-1 text-center">
                        Offline ({statusCounts.offline})
                      </Radio.Button>
                      <Radio.Button value="warning" className="flex-1 text-center">
                        Warning ({statusCounts.warning})
                      </Radio.Button>
                      <Radio.Button value="maintenance" className="flex-1 text-center">
                        Maintenance ({statusCounts.maintenance})
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </div>

        {/* Enhanced Main Table Section */}
        <Card className="rounded-2xl border-0 shadow-lg bg-white">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <Title level={3} className="mb-2">
                  Device Inventory
                </Title>
                <Text className="text-gray-600">
                  Comprehensive overview of all registered devices
                  <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {filteredData.length} devices shown
                  </span>
                  {error && (
                    <span className="ml-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      Error loading data
                    </span>
                  )}
                </Text>
              </div>
              <Space>
                <Select defaultValue="all" size="large" className="w-40">
                  <Option value="all">All Types</Option>
                  <Option value="temperature">Temperature</Option>
                  <Option value="ice">Ice Detection</Option>
                  <Option value="weather">Weather Station</Option>
                </Select>
                <Button icon={<FilterOutlined />} size="large">
                  Advanced Filters
                </Button>
              </Space>
            </div>
          </div>
          
          <div className="p-6">
            <Table
              columns={columns}
              dataSource={filteredData}
              loading={isLoading}
              rowKey="id"
              pagination={{
                total: filteredData.length,
                pageSize: 8,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `Showing ${range[0]}-${range[1]} of ${total} devices`,
                className: "text-sm",
              }}
              scroll={{ x: 1400 }}
              className="professional-table"
              rowClassName="hover:bg-gray-50 transition-colors duration-200"
              size="middle"
            />
          </div>
        </Card>
      </div>

      {/* Create Device Modal */}
      <CreateDeviceModal
        open={createModalOpen}
        onCancel={handleCreateModalCancel}
      />
      
      {/* Update Device Modal */}
      <UpdateDeviceModal
        open={updateModalOpen}
        onCancel={handleUpdateModalCancel}
        deviceId={selectedDeviceId}
      />
    </div>
  )
}

export default DeviceComponent