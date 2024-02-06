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

export default function RateOfClimbGraphe({
  RateOfClimbArray,
}: {
  RateOfClimbArray: number[];
}) {
  let grapheData = [];
  for (let i = 0; i < data.velocityArray.length; i++) {
    grapheData.push({
      V: data.velocityArray[i],
      RateOfClimb: RateOfClimbArray[i],
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
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="RateOfClimb" stroke="#5f9ed6" />
      </LineChart>
    </ResponsiveContainer>
  );
}
