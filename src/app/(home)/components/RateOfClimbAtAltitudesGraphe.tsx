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

export default function RateOfClimbAtAltitudesGraphe({
  RateOfClimbAtAltitudesArray,
}: {
  RateOfClimbAtAltitudesArray: { h: number; maxRateOfClimb: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={RateOfClimbAtAltitudesArray}
        margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="maxRateOfClimb"
          tickFormatter={(value) => value.toFixed(2)}
        />
        <YAxis
          tickFormatter={(value) => {
            if (value >= 1e6) return (value / 1e6).toFixed(1) + "M";
            else if (value >= 1e3) return (value / 1e3).toFixed(1) + "K";
            else return value;
          }}
        />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="h" stroke="#5f9ed6" />
      </LineChart>
    </ResponsiveContainer>
  );
}
