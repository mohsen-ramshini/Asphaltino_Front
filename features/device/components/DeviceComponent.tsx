"use client";

import React, { useState } from "react";
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
import DeviceTables from "./DeviceTables";
import CreateDeviceModal from "./CreateDeviceModal";
import UpdateDeviceModal from "./UpdateDeviceModal";
import { useDeleteDevice } from "../api/use-delete-device";
import { useCombinedDeviceData } from "../api/use-combined-device-data";
import { mockDeviceData } from "@/lib/mockDevice";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const DeviceComponent = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deletingDeviceId, setDeletingDeviceId] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  // Get the deleteDevice mutation from the hook
  const deleteDevice = useDeleteDevice();

  const average = (arr?: { value_c: number }[]) => {
    if (!arr || arr.length === 0) return undefined;
    return arr.reduce((sum, item) => sum + item.value_c, 0) / arr.length;
  };

  const normalizeDeviceData = (devices: any[]) => {
    return devices.map((device) => {
      const airTemps = device.temperature_records?.air_temperature;
      const asphaltTemps = device.temperature_records?.asphalt_temperature;

      return {
        ...device,

        // ✅ Data Metrics
        count: airTemps?.length || asphaltTemps?.length || 0,

        // ✅ Temperature
        avg_air_temperature: average(airTemps),
        avg_asphalt_temperature: average(asphaltTemps),

        // ✅ Wind (mock نداریم → safe default)
        avg_wind_speed: undefined,
        max_wind_speed: undefined,
        min_wind_speed: undefined,

        // ✅ Environmental
        avg_humidity: 35,

        icing_occurrences:
          device.icing_probability_daily?.filter(
            (i: any) => i.probability > 0.9,
          ).length || 0,

        // ✅ API Key (fake for UI)
        api_key: device.api_key || "sadasdsadqwfwrgwflfl-123456",
      };
    });
  };

  // Replace API call with mock data
  const deviceData = normalizeDeviceData(mockDeviceData);

  const isLoading = false;
  const error = null;

  const refetch = async () => {
    console.log("Refreshing mock data...");
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "green";
      case "offline":
        return "red";
      case "warning":
        return "orange";
      case "maintenance":
        return "blue";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <WifiOutlined />;
      case "offline":
        return <DisconnectOutlined />;
      case "warning":
        return <WarningOutlined />;
      case "maintenance":
        return <EditOutlined />;
      default:
        return <WifiOutlined />;
    }
  };

  const getMaintenanceColor = (maintenance: string) => {
    switch (maintenance) {
      case "Good":
        return "green";
      case "Warning":
        return "orange";
      case "Needs Service":
        return "red";
      case "In Maintenance":
        return "blue";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: (
        <div className="font-semibold text-gray-700 uppercase tracking-wide text-xs">
          Device Information
        </div>
      ),
      dataIndex: "name",
      key: "name",
      width: 280,
      render: (text: string, record: any) => (
        <div className="flex items-center space-x-4 py-2">
          <div className="relative">
            <Avatar
              size={48}
              className="bg-blue-500 shadow-md border-2 border-white"
            >
              {text ? text.charAt(0).toUpperCase() : "D"}
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 text-sm truncate">
              {text || "Unnamed Device"}
            </div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              ID: {record.id}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              UUID: {record.uuid}
            </div>
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
      dataIndex: "location",
      key: "location",
      width: 250,
      render: (location: any, record: any) => (
        <div className="py-2">
          <div className="text-sm font-medium text-gray-900 mb-1">
            {location?.address || "No address"}
          </div>
          <div className="text-xs text-gray-500 space-y-1">
            <div>
              <span className="font-medium">Lat:</span>{" "}
              {location?.latitude?.toFixed(4) || "-"}
            </div>
            <div>
              <span className="font-medium">Lng:</span>{" "}
              {location?.longitude?.toFixed(4) || "-"}
            </div>
            <div>
              <span className="font-medium">API Key:</span>{" "}
              {record.api_key?.slice(0, 8) || "N/A"}...
            </div>
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
      dataIndex: "count",
      key: "count",
      width: 120,
      align: "center" as const,
      render: (count: number) => (
        <div className="text-center py-2">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {count || 0}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            Records
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
      key: "temperature_data",
      width: 160,
      render: (record: any) => (
        <div className="py-2 space-y-2">
          <div>
            <div className="text-xs text-gray-500 mb-1">Air Temperature</div>
            <div
              className={`text-lg font-bold ${
                record.avg_air_temperature > 30
                  ? "text-red-600"
                  : record.avg_air_temperature < 0
                    ? "text-blue-600"
                    : "text-green-600"
              }`}
            >
              {record.avg_air_temperature?.toFixed(1) || "-"}°C
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Asphalt Temp</div>
            <div className="text-sm font-medium text-orange-600">
              {record.avg_asphalt_temperature?.toFixed(1) || "-"}°C
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
      key: "environmental",
      width: 140,
      render: (record: any) => (
        <div className="py-2 space-y-2">
          <div>
            <div className="text-xs text-gray-500 mb-1">Humidity</div>
            <div className="text-lg font-bold text-blue-600">
              {record.avg_humidity?.toFixed(1) || "-"}%
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Icing Events</div>
            <Tag
              color={record.icing_occurrences > 0 ? "red" : "green"}
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
      key: "timeline",
      width: 160,
      render: (record: any) => (
        <div className="py-2 space-y-2">
          <div>
            <div className="text-xs text-gray-500 mb-1">First Data</div>
            <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
              {record.first_data_timestamp
                ? new Date(record.first_data_timestamp).toLocaleDateString()
                : "No data"}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Last Data</div>
            <div className="text-xs font-mono bg-blue-100 px-2 py-1 rounded text-blue-800">
              {record.last_data_timestamp
                ? new Date(record.last_data_timestamp).toLocaleDateString()
                : "No data"}
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
      key: "actions",
      width: 120,
      align: "center" as const,
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

  const filteredData = deviceData.filter((device) => {
    const matchesFilter =
      selectedFilter === "all" || device.status === selectedFilter;
    const matchesSearch =
      (device.name || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (device.location?.address || "")
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      (device.id !== undefined && device.id !== null ? String(device.id) : "")
        .toLowerCase()
        .includes(searchText.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: deviceData.length,
    online: deviceData.filter((d) => d.status === "online").length,
    offline: deviceData.filter((d) => d.status === "offline").length,
    warning: deviceData.filter((d) => d.status === "warning").length,
    maintenance: deviceData.filter((d) => d.status === "maintenance").length,
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
      message.success("Data refreshed successfully");
    } catch (err) {
      message.error("Failed to refresh data");
    }
  };

  const handleDeleteClick = (record: any) => {
    // Use Modal.confirm from antd v5+ correctly
    Modal.confirm({
      title: "Delete Device",
      content: `Are you sure you want to delete device "${record.name}"? This action cannot be undone.`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      maskClosable: true,
      onOk: async () => {
        await handleDeleteDevice(record.id);
      },
    });
  };

  const handleDeleteDevice = async (deviceId: string) => {
    console.log("🗑️ Delete request initiated for device ID:", deviceId);

    try {
      setDeletingDeviceId(deviceId);
      await deleteDevice.mutateAsync(deviceId);
      console.log("✅ Device deleted successfully:", deviceId);
      message.success(`Device deleted successfully`);
      refetch(); // Refresh the device list
    } catch (error: any) {
      console.error("❌ Delete device error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      message.error(
        `Failed to delete device: ${
          error.response?.data?.message || error.message
        }`,
      );
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
    setSelectedDeviceId("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        {/* Enhanced Header Section */}
        <div className="mb-8">
          <Card className="rounded-2xl border-0 shadow-lg bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-4xl mb-2 text-white">
                    Device Management
                  </h2>
                  <Text className="text-gray-100 text-base">
                    Enterprise IoT Device Monitoring & Control Center
                  </Text>
                </div>
                <Space size="middle">
                  <Button
                    disabled
                    icon={<PlusOutlined />}
                    size="large"
                    loading={isLoading}
                    onClick={handleRefreshData}
                    className="border-blue-200 text-white hover:bg-blue-600"
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
                    {isLoading ? "Loading..." : "Refresh Data"}
                  </Button>
                </Space>
              </div>
            </div>

            {/* Enhanced Status Overview Cards */}
            <div className="p-8">
              {/* Enhanced Filters and Search */}
              <Row gutter={[24, 16]} align="middle">
                <Col xs={24} lg={8}>
                  <div className="space-y-2">
                    <Text
                      strong
                      className="text-gray-700 text-sm uppercase tracking-wide"
                    >
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
                    <Text
                      strong
                      className="text-gray-700 text-sm uppercase tracking-wide"
                    >
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
                      <Radio.Button
                        value="online"
                        className="flex-1 text-center"
                      >
                        Online ({statusCounts.online})
                      </Radio.Button>
                      <Radio.Button
                        value="offline"
                        className="flex-1 text-center"
                      >
                        Offline ({statusCounts.offline})
                      </Radio.Button>
                      <Radio.Button
                        value="warning"
                        className="flex-1 text-center"
                      >
                        Warning ({statusCounts.warning})
                      </Radio.Button>
                      <Radio.Button
                        value="maintenance"
                        className="flex-1 text-center"
                      >
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
  );
};

export default DeviceComponent;
