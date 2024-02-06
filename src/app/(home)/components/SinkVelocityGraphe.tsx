"use client";

import { data } from "@/lib/constants";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function SinkVelocityGraphe({
  powerRequiredArray,
  maxTakeOffWeight,
}: {
  powerRequiredArray: number[];
  maxTakeOffWeight: number;
}) {
  let grapheData = [];
  for (let i = 0; i < data.velocityArray.length; i++) {
    grapheData.push({
      V: data.velocityArray[i],
      PR: powerRequiredArray[i],
      Vv: powerRequiredArray[i] / maxTakeOffWeight,
    });
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={grapheData}
        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="V" />
        <YAxis
          tickFormatter={(value) => {
            if (value >= 1e6) return (value / 1e6).toFixed(1) + "M";
            else if (value >= 1e3) return (value / 1e3).toFixed(1) + "K";
            else return value;
          }}
        />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Vv" stroke="#5f9ed6" />
      </LineChart>
    </ResponsiveContainer>
  );
}
