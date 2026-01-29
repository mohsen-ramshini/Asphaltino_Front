"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import { useEffect } from "react";

export type HeatPoint = [number, number, number];

function HeatLayer({ points }: { points: HeatPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    const heatLayer = (L as any).heatLayer(points, {
      radius: 80,
      blur: 50,
      minOpacity: 0.4,
      maxZoom: 18,
      gradient: {
        0.2: "#0000ff",
        0.4: "#00ffff",
        0.6: "#00ff00",
        0.8: "#ffff00",
        1.0: "#ff0000",
      },
    });

    heatLayer.addTo(map);

    const bounds = L.latLngBounds(points.map(p => [p[0], p[1]]));
    map.fitBounds(bounds, { padding: [40, 40] });

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

export default function HeatMapLeafletInner({
  points,
  center,
  zoom,
}: {
  points: HeatPoint[];
  center: [number, number];
  zoom: number;
}) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full rounded-xl"
      scrollWheelZoom
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <HeatLayer points={points} />
    </MapContainer>
  );
}
