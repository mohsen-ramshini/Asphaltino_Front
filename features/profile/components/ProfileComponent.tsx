"use client"

import React, { useState, useEffect } from 'react'
import { Card, Avatar, Typography, Descriptions, Button, Divider, Spin, message, Form, Input, Modal, Space } from 'antd'
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined, LockOutlined } from '@ant-design/icons'
import { useChangePassword } from '../api/use-change-password'

const { Title, Text } = Typography

interface ProfileData {
  email: string
  id: number
  lastname: string
  name: string
  user_code: string
  username: string
  uuid: string
}

const ProfileComponent: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [changePasswordVisible, setChangePasswordVisible] = useState(false)
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()
  const changePassword = useChangePassword()

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockProfile: ProfileData = {
          email: "john.doe@example.com",
          id: 1,
          lastname: "Doe",
          name: "John",
          user_code: "JD001",
          username: "johndoe",
          uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
        }
        
        setTimeout(() => {
          setProfile(mockProfile)
          setLoading(false)
        }, 800) // Simulate API delay
      } catch (error) {
        console.error("Error fetching profile:", error)
        message.error("Failed to load profile data")
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // Start editing profile
  const handleEditProfile = () => {
    setEditing(true)
    form.setFieldsValue({
      name: profile?.name,
      lastname: profile?.lastname,
      email: profile?.email,
      username: profile?.username
    })
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditing(false)
    form.resetFields()
  }

  // Submit profile updates
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true)
      
      // In a real app, this would be an API call to update the profile
      console.log("Updating profile with:", values)
      
      // Simulate API call
      setTimeout(() => {
        setProfile((prev: ProfileData | null) => {
          if (!prev) return null
          return {
            ...prev,
            name: values.name,
            lastname: values.lastname,
            email: values.email,
            username: values.username
          }
        })
        
        setEditing(false)
        setLoading(false)
        message.success("Profile updated successfully")
      }, 800)
    } catch (error) {
      console.error("Error updating profile:", error)
      message.error("Failed to update profile")
      setLoading(false)
    }
  }

  // Handle change password
  const handleChangePasswordClick = () => {
    setChangePasswordVisible(true)
    passwordForm.resetFields()
  }

  const handleChangePasswordCancel = () => {
    setChangePasswordVisible(false)
    passwordForm.resetFields()
  }

  const handleChangePasswordSubmit = async (values: any) => {
    try {
      await changePassword.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      })
      
      message.success('Password changed successfully')
      setChangePasswordVisible(false)
      passwordForm.resetFields()
    } catch (error: any) {
      console.error("Error changing password:", error)
      message.error(error.response?.data?.message || 'Failed to change password')
    }
  }

  // Render loading state
  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-sm border border-gray-200 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
          <div className="flex-shrink-0">
            <Avatar 
              size={100} 
              icon={<UserOutlined />} 
              className="bg-blue-500"
            />
          </div>
          
          <div className="flex-grow">
            <Title level={3} className="mb-1">
              {profile?.name} {profile?.lastname}
            </Title>
            <Text className="text-gray-500 text-lg">@{profile?.username}</Text>
          </div>
          
          {!editing && (
            <Button 
              disabled
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEditProfile}
              className="bg-blue-500 hover:bg-blue-600 md:self-start"
            >
              Edit Profile
            </Button>
          )}
        </div>

        {editing ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-4"
          >
            <Form.Item
              name="name"
              label="First Name"
              rules={[{ required: true, message: 'Please enter your first name' }]}
            >
              <Input placeholder="First Name" />
            </Form.Item>

            <Form.Item
              name="lastname"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter your last name' }]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
            
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Please enter your username' }]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            
            <Form.Item className="mb-0 flex justify-end">
              <Button 
                onClick={handleCancelEdit}
                icon={<CloseOutlined />}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<SaveOutlined />}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <>
            <Descriptions
              bordered
              column={{ xs: 1, sm: 2 }}
              className="bg-white rounded-lg"
              styles={{ label: { fontWeight: '600' } }}
            >
              <Descriptions.Item label="First Name">{profile?.name}</Descriptions.Item>
              <Descriptions.Item label="Last Name">{profile?.lastname}</Descriptions.Item>
              <Descriptions.Item label="Username">{profile?.username}</Descriptions.Item>
              <Descriptions.Item label="Email">{profile?.email}</Descriptions.Item>
              <Descriptions.Item label="User Code">{profile?.user_code}</Descriptions.Item>
              <Descriptions.Item label="ID">{profile?.id}</Descriptions.Item>
              <Descriptions.Item label="UUID" span={2}>{profile?.uuid}</Descriptions.Item>
            </Descriptions>
            
            <div className="mt-6 flex justify-end">
              <Button 
                disabled
                type="default" 
                icon={<LockOutlined />} 
                onClick={handleChangePasswordClick}
              >
                Change Password
              </Button>
            </div>
          </>
        )}
      </Card>

      {/* Password Change Modal */}
      <Modal
        title="Change Password"
        open={changePasswordVisible}
        onCancel={handleChangePasswordCancel}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePasswordSubmit}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password placeholder="Enter current password" />
          </Form.Item>
          
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter your new password' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('The two passwords do not match'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>
          
          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={handleChangePasswordCancel}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={changePassword.isPending}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Change Password
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProfileComponent
