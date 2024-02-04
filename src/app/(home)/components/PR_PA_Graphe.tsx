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

export default function PR_PA_Graphe({
  powerRequiredArray,
  powerAvailableArray,
}: {
  powerRequiredArray: number[];
  powerAvailableArray: number[];
}) {
  let grapheData = [];
  for (let i = 0; i < data.velocityArray.length; i++) {
    grapheData.push({
      V: data.velocityArray[i],
      PR: powerRequiredArray[i],
      PA: powerAvailableArray[i],
    });
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={grapheData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
        <Line type="monotone" dataKey="PR" stroke="#5f9ed6" />
        <Line type="monotone" dataKey="PA" stroke="#f09252" />
      </LineChart>
    </ResponsiveContainer>
  );
}
