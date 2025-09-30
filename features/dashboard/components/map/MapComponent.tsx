'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl, { GeoJSONFeature } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Tag, Skeleton, Spin, Badge } from 'antd';
import { WifiOutlined, DisconnectOutlined, WarningOutlined, EditOutlined } from '@ant-design/icons';
import DeviceDetailsSidebar from './DeviceDetailsSidebar';
import {mockDeviceData} from "@/lib/mockDevice";
import type { FeatureCollection, Feature, Point, GeoJsonProperties } from 'geojson';

mapboxgl.accessToken =
  'pk.eyJ1IjoicmFtZXNoMjAiLCJhIjoiY21kcHBud3pqMGQ0cTJpcXdtaXl5dHNjMyJ9.3Q_HBMLCLjoLGFiA03fIcQ';

// Mock device data - same as in DeviceComponent


export default function MapWithSidebar() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const animationRef = useRef<number | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isCameraLocked, setIsCameraLocked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<GeoJsonProperties | null>(null);
  const [detailsSidebarOpen, setDetailsSidebarOpen] = useState(false);
  const [selectedDeviceInSidebar, setSelectedDeviceInSidebar] = useState(null);
  
  // Use mock device data instead of API
  const devices = mockDeviceData;
  const isLoadingDevices = false;
  // Convert devices to GeoJSON format

  const getDevicesGeoJson = (): FeatureCollection<Point, GeoJsonProperties> | null => {
    if (!devices || !devices.length) return null;
    if (!devices || !devices.length) return null;

    return {
      type: "FeatureCollection",
      features: devices.map(device => ({
        type: "Feature",
        properties: { 
          id: device.uuid || device.id?.toString(),
          title: device.name || 'Unnamed Device',
          address: device.location?.address || 'Unknown Location',
          status: device.status || 'offline'
        },
        geometry: {
          type: "Point",
          coordinates: [
            device.location?.longitude || 48.2964,
            device.location?.latitude || 38.2498
          ]
        }
      })) as Feature<Point, GeoJsonProperties>[]
    };
  };

  useEffect(() => {
    if (typeof window === 'undefined' || map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [48.2964, 38.2498], // Tehran, Iran
      zoom: 12,
      pitch: 60,
      bearing: -20,
      antialias: true,
    });

    map.current.on('load', () => {
      setMapLoaded(true);

      // Hide POI and Transit layers
      if (map.current) {
        const layers = map.current.getStyle().layers;
        if (layers) {
          layers.forEach((layer) => {
            if (
              layer.type === 'symbol' &&
              (layer.id.includes('poi') || layer.id.includes('transit'))
            ) {
              map.current!.setLayoutProperty(layer.id, 'visibility', 'none');
            }
          });
        }
      }

      // Add 3D buildings layer
      if (map.current) {
        map.current.addLayer({
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.6,
          },
        });
      }

      startOrbitAnimation();

      // Apply padding for sidebar
      if (map.current) {
        map.current.easeTo({ 
          padding: { 
            left: sidebarOpen ? 300 : 0,
            right: detailsSidebarOpen ? 350 : 0
          }, 
          duration: 0 
        });
      }
    });

    return () => {
      if (map.current) map.current.remove();
      if (animationRef.current !== null) {
        if (animationRef.current !== null) {
          cancelAnimationFrame(animationRef.current);
        }
      }
    };
  }, []);

  // Close left sidebar when details sidebar is opened
  useEffect(() => {
    if (detailsSidebarOpen && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [detailsSidebarOpen]);

  // Update map padding when sidebars state changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    map.current.easeTo({
      padding: { 
        left: sidebarOpen ? 300 : 0,
        right: detailsSidebarOpen ? 350 : 0
      },
      duration: 1000,
    });
  }, [sidebarOpen, detailsSidebarOpen, mapLoaded]);

  // Add devices to map when devices data changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !devices) return;

    // If source already exists, update it
    if (map.current.getSource('devices')) {
      const geojsonData = getDevicesGeoJson();
      if (geojsonData) {
        const source = map.current.getSource('devices');
        if (source && 'setData' in source && typeof source.setData === 'function') {
          source.setData(geojsonData);
        }
      }
      return;
    }

    // Otherwise, create new source and layers
    const geojsonData = getDevicesGeoJson();
    if (!geojsonData) return;

    map.current.addSource('devices', {
      type: 'geojson',
      data: geojsonData,
    });

    // Add circle layer for devices
    map.current.addLayer({
      id: 'devices-circle',
      type: 'circle',
      source: 'devices',
      paint: {
        'circle-radius': 8,
        'circle-color': [
          'match',
          ['get', 'status'],
          'online', '#10b981', // green for online
          'warning', '#f59e0b', // orange for warning
          'maintenance', '#3b82f6', // blue for maintenance
          '#ef4444' // red default for offline
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      },
    });

    // Add device label layer
    map.current.addLayer({
      id: 'devices-label',
      type: 'symbol',
      source: 'devices',
      layout: {
        'text-field': ['get', 'title'],
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 1.5],
        'text-anchor': 'top',
        'text-size': 12
      },
      paint: {
        'text-color': '#1f2937',
        'text-halo-color': '#ffffff',
        'text-halo-width': 2
      }
    });

    // Add click event for devices
    map.current.on('click', 'devices-circle', (e) => {
      if (!e.features || !e.features.length) return;
      
      const feature = e.features[0];
      flyToLocation(feature);
    });

    // Change cursor when hovering over a device
    map.current.on('mouseenter', 'devices-circle', () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = 'pointer';
      }
    });

    map.current.on('mouseleave', 'devices-circle', () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = '';
      }
    });

  }, [devices, mapLoaded]);

  // Effect to handle selected device in sidebar
  useEffect(() => {
    if (!mapLoaded || !map.current || !selectedDeviceInSidebar) return;
    
    // Find the selected device in the GeoJSON
    const geojsonData = getDevicesGeoJson();
    if (!geojsonData) return;
    
    const selectedFeature = geojsonData.features.find(
      feature => feature.properties && feature.properties.id === selectedDeviceInSidebar
    );
    
    if (selectedFeature) {
      flyToLocation(selectedFeature);
    }
  }, [selectedDeviceInSidebar, mapLoaded]);

  const startOrbitAnimation = () => {
    let bearing = -20;
    const animate = () => {
      if (map.current && !isCameraLocked) {
        bearing += 0.2;
        map.current.setBearing(bearing);
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  const flyToLocation = (feature: Feature<Point, GeoJsonProperties> | GeoJSONFeature) => {
    if (!map.current || !mapLoaded) return;

    setIsCameraLocked(true);
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }
    
    let coords: [number, number];
    if (feature.geometry.type === 'Point') {
      const rawCoords = (feature.geometry as Point).coordinates;
      coords = [rawCoords[0] ?? 51.3890, rawCoords[1] ?? 35.6892];
    } else {
      // Fallback to Tehran coordinates if not a Point
      coords = [51.3890, 35.6892];
    }
    const title = feature.properties?.title ?? '';

    // First fly to the location
    map.current.flyTo({
      center: coords,
      zoom: 15,
      pitch: 60,
      bearing: -20,
      essential: true,
    });

    // Add popup
    new mapboxgl.Popup()
      .setLngLat(coords)
      .setHTML(`
        <div class="p-2">
          <h4 class="font-semibold text-gray-900">${title}</h4>
          <p class="text-sm text-gray-600">${feature.properties?.address || 'No address'}</p>
        </div>
      `)
      .addTo(map.current);
      
    // Set selected device after map animation starts
    setSelectedDevice(feature.properties);
    
    // Delay opening the details sidebar for 10 seconds
    setTimeout(() => {
      // Close the left sidebar
      setSidebarOpen(false);
      // Open the details sidebar
      setDetailsSidebarOpen(true);
    }, 5000); // 10 second delay
  };

  const toggleSidebar = () => {
    // If details sidebar is open, close it when opening the left sidebar
    if (detailsSidebarOpen && !sidebarOpen) {
      setDetailsSidebarOpen(false);
    }
    setSidebarOpen(!sidebarOpen);
  };

  // Reset the camera and unlock it
  const resetCamera = () => {
    if (!map.current) return;
    
    setIsCameraLocked(false);
    setSelectedDevice(null);
    setSelectedDeviceInSidebar(null);
    setDetailsSidebarOpen(false);
    
    map.current.flyTo({
      center: [48.2964, 38.2498], // اردبیل
      zoom: 12,
      pitch: 60,
      bearing: -20,
      essential: true,
    });
    
    startOrbitAnimation();
  };

  // Close the details sidebar
  const handleCloseDetailsSidebar = () => {
    setDetailsSidebarOpen(false);
    // Optionally re-open the left sidebar when details are closed
    setSidebarOpen(true);
  };

  // Handle device selection in the sidebar
  const handleDeviceSelect = (deviceId: React.SetStateAction<null>) => {
    // Set the selected device ID
    setSelectedDeviceInSidebar(deviceId);
    
    // Find the device in the GeoJSON data
    const geojsonData = getDevicesGeoJson();
    if (!geojsonData) return;
    
    const selectedFeature = geojsonData.features.find(
      feature => feature.properties && feature.properties.id === deviceId
    );
    
    if (selectedFeature) {
      // Use the same flyToLocation function for consistency
      flyToLocation(selectedFeature);
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: any) => {
    switch (status) {
      case 'online': return <WifiOutlined />;
      case 'offline': return <DisconnectOutlined />;
      case 'warning': return <WarningOutlined />;
      case 'maintenance': return <EditOutlined />;
      default: return <DisconnectOutlined />;
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: any) => {
    switch (status) {
      case 'online': return 'success';
      case 'offline': return 'error';
      case 'warning': return 'warning';
      case 'maintenance': return 'processing';
      default: return 'default';
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Left Sidebar - Devices List */}
      <div
        className={`absolute top-0 left-0 bottom-0 w-72 bg-white shadow-2xl rounded-r-xl z-10 transition-transform duration-1000 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-72'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h3 className="text-gray-800 text-lg font-semibold mb-1">Device Locations</h3>
          <p className="text-sm text-gray-600">
            {isLoadingDevices 
              ? 'Loading devices...' 
              : devices?.length 
                ? `${devices.length} devices found` 
                : 'No devices available'}
          </p>
        </div>
        
        {/* Devices List */}
        <div className="flex-grow overflow-y-auto p-4">
          {isLoadingDevices ? (
            <div className="space-y-4">
              <Skeleton active avatar paragraph={{ rows: 1 }} />
              <Skeleton active avatar paragraph={{ rows: 1 }} />
              <Skeleton active avatar paragraph={{ rows: 1 }} />
            </div>
          ) : !devices?.length ? (
            <div className="text-center py-8 text-gray-500">
              <p>No devices found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getDevicesGeoJson()?.features.map((feature, i) => (
                <div
                  key={i}
                  className={`cursor-pointer p-3 rounded-lg transition-all border ${
                    (feature.properties && (selectedDevice?.id === feature.properties.id || selectedDeviceInSidebar === feature.properties.id))
                      ? 'bg-blue-50 border-blue-200 shadow-md'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => feature.properties && handleDeviceSelect(feature.properties.id)}
                >
                  <div className="flex items-center">
                    <Badge
                      status={getStatusColor(feature.properties?.status)}
                      className="mr-2"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{feature.properties?.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{feature.properties?.address}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={resetCamera}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Reset View
          </button>
        </div>

        {/* Sidebar Toggle Button */}
        <div
          onClick={toggleSidebar}
          className="cursor-pointer absolute top-4 -right-6 w-6 h-10 bg-white rounded-r-lg shadow-md flex items-center justify-center font-bold text-blue-500 hover:bg-gray-50 transition-colors"
        >
          {sidebarOpen ? '←' : '→'}
        </div>
      </div>

      {/* Right Sidebar - Device Details */}
      <div
        className={`absolute top-0 right-0 bottom-0 w-[350px] bg-white shadow-2xl rounded-l-xl z-10 transition-transform duration-1000 ${
          detailsSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <DeviceDetailsSidebar 
          deviceId={selectedDevice?.id || selectedDeviceInSidebar}
          deviceInfo={selectedDevice}
          onClose={handleCloseDetailsSidebar}
        />
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-20">
          <Spin size="large" />
          <div className="mt-4 text-gray-600 font-medium">Loading map...</div>
        </div>
      )}
    </div>
  );
}
