"use client"

import React, { useState, useEffect } from 'react'
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  Row,
  Col,
  Space,
  Spin,
} from 'antd'
import { SaveOutlined, LoadingOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { useUpdateDevice } from '../api/use-update-device'
import { useGetDeviceById } from '../api/use-get-device-by-id'
import type { UpdateDeviceData } from '../api/use-update-device'
import type { DeviceData } from '../api/use-get-devices'

const { Option } = Select

interface UpdateDeviceModalProps {
  open: boolean
  onCancel: () => void
  deviceId?: string
}

const UpdateDeviceModal: React.FC<UpdateDeviceModalProps> = ({ open, onCancel, deviceId }) => {
  const [form] = Form.useForm() // Create form instance
  const updateDevice = useUpdateDevice()
  const { data: deviceData, isLoading: isLoadingDevice } = useGetDeviceById(deviceId || '')
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>('')

  // Same location data as in CreateDeviceModal
  const locations = [
    'Highway A1 - KM 15',
    'Highway A1 - KM 32',
    'Highway B2 - KM 8',
    'Highway B2 - KM 45',
    'Highway C3 - KM 12',
    'Highway C3 - KM 28',
    'Highway D4 - KM 5',
    'Highway D4 - KM 35',
    'City Center - Main St',
    'Industrial Zone - North',
  ]

  const deviceTypes = [
    { value: 'temperature', label: 'Temperature Sensor' },
    { value: 'humidity', label: 'Humidity Monitor' },
    { value: 'ice_detection', label: 'Ice Detection Unit' },
    { value: 'weather_station', label: 'Weather Station' },
    { value: 'road_surface', label: 'Road Surface Sensor' },
    { value: 'traffic', label: 'Traffic Monitor' },
  ]

  const deviceModels = {
    temperature: ['TempSense Pro 3000', 'ThermoMax Elite', 'ColdGuard X1'],
    humidity: ['HumidPro V2', 'MoistureMax 2024', 'HygroSense Ultra'],
    ice_detection: ['IceSense X1', 'FrostAlert Pro', 'IceGuard Elite'],
    weather_station: ['WeatherMax 2024', 'MeteoStation Pro', 'ClimateMonitor X3'],
    road_surface: ['RoadSense Ultra', 'SurfaceWatch Pro', 'PavementGuard V2'],
    traffic: ['TrafficEye Pro', 'VehicleCount Max', 'FlowMonitor Elite'],
  }

  // Set form values when device data is loaded
  useEffect(() => {
    if (deviceData && open) {
      form.setFieldsValue({
        name: deviceData.name,
        // Handle location whether it's a string or an object with address
        location: typeof deviceData.location === 'string' 
          ? deviceData.location 
          : deviceData.location?.address || '',
      })
      setSelectedDeviceType(deviceData.type || '')
    }
  }, [deviceData, form, open])

  const handleSubmit = async (values: any) => {
    if (!deviceId) return

    try {
      // Get the selected location from dropdown and prepare the location object
      const locationAddress = values.location
      
      // Create a transformed payload for the API - only include name and location
      const updateData: UpdateDeviceData = {
        name: values.name,
        // For the API we need a location object
        location: {
          address: locationAddress,
          // You could optionally extract coordinates from a map or use predefined values
          latitude: 80, // Will be handled by the API
          longitude: 60, // Will be handled by the API
        }
        // Note: We no longer send type and model to the API
      }

      await updateDevice.mutateAsync({ 
        id: deviceId,
        data: updateData
      })
      
      message.success('Device updated successfully!')
      onCancel()
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update device')
    }
  }

  const handleDeviceTypeChange = (value: string) => {
    setSelectedDeviceType(value)
    form.setFieldValue('model', undefined)
  }

  // Only render the form if modal is open
  if (!open) {
    return null
  }

  // Show loading state while fetching device data
  if (isLoadingDevice) {
    return (
      <Modal
        title="Update Device"
        open={open}
        onCancel={onCancel}
        footer={null}
        destroyOnHidden
      >
        <div className="flex justify-center items-center py-12">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          <span className="ml-2">Loading device information...</span>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <SaveOutlined className="text-amber-600" />
          <span className="text-xl font-semibold">Update Device</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={600}
      footer={null}
      destroyOnHidden
      className="update-device-modal"
    >
      <Form
        form={form} // Ensure the form instance is connected here
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-6"
        requiredMark="optional"
        preserve={false}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label={<span className="font-semibold text-gray-700">Device Name</span>}
              rules={[
                { required: true, message: 'Please enter device name' },
                { min: 3, message: 'Name must be at least 3 characters' },
              ]}
            >
              <Input
                placeholder="Enter device name"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              label={<span className="font-semibold text-gray-700">Device Type</span>}
              rules={[{ required: true, message: 'Please select device type' }]}
            >
              <Select
                placeholder="Select device type"
                size="large"
                className="rounded-lg"
                onChange={handleDeviceTypeChange}
              >
                {deviceTypes.map(type => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="model"
              label={<span className="font-semibold text-gray-700">Device Model</span>}
              rules={[{ required: true, message: 'Please select device model' }]}
            >
              <Select
                placeholder="Select device model"
                size="large"
                className="rounded-lg"
                disabled={!selectedDeviceType}
              >
                {selectedDeviceType && 
                  deviceModels[selectedDeviceType as keyof typeof deviceModels]?.map(model => (
                    <Option key={model} value={model}>
                      {model}
                    </Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="location"
              label={
                <div className="flex items-center">
                  <EnvironmentOutlined className="mr-1 text-blue-500" />
                  <span className="font-semibold text-gray-700">Installation Location</span>
                </div>
              }
              rules={[{ required: true, message: 'Please select location' }]}
            >
              <Select
                placeholder="Select installation location"
                size="large"
                className="rounded-lg"
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {locations.map(location => (
                  <Option key={location} value={location}>
                    {location}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <div className="bg-amber-50 p-4 rounded-lg mb-6 border border-amber-100">
          <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center">
            <EnvironmentOutlined className="mr-2" /> Location Information
          </h4>
          <p className="text-sm text-amber-700 mb-2">
            The selected location will be converted to geographical coordinates automatically.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-amber-700">Address:</span>
              <span className="ml-2 text-amber-900 font-medium">{form.getFieldValue('location')}</span>
            </div>
            <div>
              <span className="text-amber-700">Coordinates:</span>
              <span className="ml-2 text-amber-900 font-medium">Will be determined</span>
            </div>
          </div>
        </div>

        <Form.Item className="mb-0">
          <Space className="w-full justify-end">
            <Button
              onClick={onCancel}
              size="large"
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={updateDevice.isPending}
              icon={updateDevice.isPending ? <LoadingOutlined /> : <SaveOutlined />}
              className="bg-amber-600 hover:bg-amber-700 px-6 border-amber-600 hover:border-amber-700"
            >
              {updateDevice.isPending ? 'Updating...' : 'Update Device'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateDeviceModal
