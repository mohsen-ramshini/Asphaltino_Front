"use client"

import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Modal,
  Input,
  Select,
  Button,
  Row,
  Col,
  Space,
} from 'antd'
import { PlusOutlined, LoadingOutlined, SaveOutlined } from '@ant-design/icons'
import { useCreateDevice } from '../api/use-create-device'
import type { CreateDeviceData } from '../api/use-create-device'

const { Option } = Select

interface CreateDeviceModalProps {
  open: boolean
  onCancel: () => void
}

const CreateDeviceModal: React.FC<CreateDeviceModalProps> = ({ open, onCancel }) => {
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateDeviceData>()
  const createDevice = useCreateDevice()
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>('')

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

  // Generate random coordinates based on location for demo purposes
  const getLocationCoordinates = (location: string) => {
    // Simple hash function to generate consistent coordinates for same location
    let hash = 0
    for (let i = 0; i < location.length; i++) {
      const char = location.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    // Generate coordinates in a reasonable range (example for Iran/Middle East region)
    const latitude = 32 + (Math.abs(hash) % 1000) / 100 // Range: 32-42
    const longitude = 48 + (Math.abs(hash) % 2000) / 100 // Range: 48-68
    
    return { latitude: parseFloat(latitude.toFixed(6)), longitude: parseFloat(longitude.toFixed(6)) }
  }

  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 })

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value)
    const coords = getLocationCoordinates(value)
    setCoordinates(coords)
  }

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      reset()
      setSelectedDeviceType('')
      setSelectedLocation('')
      setCoordinates({ latitude: 0, longitude: 0 })
    }
  }, [open, reset])

  const onSubmit = async (values: CreateDeviceData) => {
    try {
      // Add coordinates to the form values
      const dataWithCoordinates = {
        ...values,
        coordinates
      }
      
      await createDevice.mutateAsync(dataWithCoordinates)
      reset()
      setSelectedDeviceType('')
      setSelectedLocation('')
      setCoordinates({ latitude: 0, longitude: 0 })
      onCancel()
    } catch (error: any) {
      console.error('Failed to create device:', error)
    }
  }

  const handleCancel = () => {
    reset()
    setSelectedDeviceType('')
    setSelectedLocation('')
    setCoordinates({ latitude: 0, longitude: 0 })
    onCancel()
  }

  const handleDeviceTypeChange = (value: string) => {
    setSelectedDeviceType(value)
    setValue('model', '') // Clear model selection when type changes
  }

  // Only render the form if modal is open
  if (!open) {
    return null
  }

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <SaveOutlined className="text-blue-600" />
          <span className="text-xl font-semibold" >Add New Device</span>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      width={600}
      footer={null}
      destroyOnHidden
      className="create-device-modal"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <Row gutter={16}>
          <Col span={12}>
            <div className="mb-4">
              <label className="block font-semibold text-gray-700 mb-2">Device Name</label>
              <Controller
                name="name"
                control={control}
                rules={{ 
                  required: 'Please enter device name',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' }
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter device name"
                    size="large"
                    className="rounded-lg"
                    status={errors.name ? 'error' : ''}
                  />
                )}
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </div>
          </Col>
          <Col span={12}>
            <div className="mb-4">
              <label className="block font-semibold text-gray-700 mb-2">Device Type</label>
              <Controller
                name="type"
                control={control}
                rules={{ required: 'Please select device type' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select device type"
                    size="large"
                    className="w-full rounded-lg"
                    onChange={(value) => {
                      field.onChange(value)
                      handleDeviceTypeChange(value)
                    }}
                    status={errors.type ? 'error' : ''}
                  >
                    {deviceTypes.map(type => (
                      <Option key={type.value} value={type.value}>
                        {type.label}
                      </Option>
                    ))}
                  </Select>
                )}
              />
              {errors.type && <span className="text-red-500 text-sm">{errors.type.message}</span>}
            </div>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <div className="mb-4">
              <label className="block font-semibold text-gray-700 mb-2">Device Model</label>
              <Controller
                name="model"
                control={control}
                rules={{ required: 'Please select device model' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select device model"
                    size="large"
                    className="w-full rounded-lg"
                    disabled={!selectedDeviceType}
                    status={errors.model ? 'error' : ''}
                  >
                    {selectedDeviceType && 
                      deviceModels[selectedDeviceType as keyof typeof deviceModels]?.map(model => (
                        <Option key={model} value={model}>
                          {model}
                        </Option>
                      ))
                    }
                  </Select>
                )}
              />
              {errors.model && <span className="text-red-500 text-sm">{errors.model.message}</span>}
            </div>
          </Col>
          <Col span={12}>
            <div className="mb-4">
              <label className="block font-semibold text-gray-700 mb-2">Installation Location</label>
              <Controller
                name="location"
                control={control}
                rules={{ required: 'Please select location' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select installation location"
                    size="large"
                    className="w-full rounded-lg"
                    showSearch
                    onChange={(value) => {
                      field.onChange(value)
                      handleLocationChange(value)
                    }}
                    filterOption={(input, option) =>
                      (option?.children as unknown as string)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    status={errors.location ? 'error' : ''}
                  >
                    {locations.map(location => (
                      <Option key={location} value={location}>
                        {location}
                      </Option>
                    ))}
                  </Select>
                )}
              />
              {errors.location && <span className="text-red-500 text-sm">{errors.location.message}</span>}
            </div>
          </Col>
        </Row>

        {selectedLocation && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h4 className="text-sm font-semibold text-blue-700 mb-2">Location Coordinates</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Latitude:</span>
                <span className="ml-2 text-blue-600 font-medium">{coordinates.latitude}</span>
              </div>
              <div>
                <span className="text-gray-500">Longitude:</span>
                <span className="ml-2 text-blue-600 font-medium">{coordinates.longitude}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Device Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Status:</span>
              <span className="ml-2 text-blue-600 font-medium">Will be set to 'Pending'</span>
            </div>
            <div>
              <span className="text-gray-500">Battery:</span>
              <span className="ml-2 text-green-600 font-medium">Will be initialized</span>
            </div>
            <div>
              <span className="text-gray-500">Installation:</span>
              <span className="ml-2 text-gray-700 font-medium">Today's date</span>
            </div>
            <div>
              <span className="text-gray-500">Maintenance:</span>
              <span className="ml-2 text-gray-700 font-medium">Scheduled</span>
            </div>
          </div>
        </div>

        <div className="mb-0">
          <Space className="w-full justify-end">
            <Button
              onClick={handleCancel}
              size="large"
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={createDevice.isPending}
              icon={createDevice.isPending ? <LoadingOutlined /> : <PlusOutlined />}
              className="bg-blue-600 hover:bg-blue-700 px-6"
            >
              {createDevice.isPending ? 'Creating...' : 'Create Device'}
            </Button>
          </Space>
        </div>
      </form>
    </Modal>
  )
}

export default CreateDeviceModal
