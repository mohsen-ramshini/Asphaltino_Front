"use client";

import dynamic from "next/dynamic";
import { HeatPoint } from "./HeatMapLeafletInner";

const HeatMapLeafletInner = dynamic(
  () => import("./HeatMapLeafletInner"),
  { ssr: false }
);

export default function HeatMapLeaflet({
  points,
  center = [38.2498, 48.2933],
  zoom = 14,
}: {
  points: HeatPoint[];
  center?: [number, number];
  zoom?: number;
}) {
  return <HeatMapLeafletInner points={points} center={center} zoom={zoom} />;
}
