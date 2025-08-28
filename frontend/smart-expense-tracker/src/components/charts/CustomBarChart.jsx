import React from "react";
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const CustomBarChart = ({ data }) => {
  const getBarColor = (index) => {
    return index % 2 === 0 ? "#875cf5" : "#cfbefb";
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-xs font-semibold text-purple-800 mb-1">
            {payload[0].payload.category}
          </p>
          <p className="text-sm text-gray-600">
            Amount:{" "}
            <span className="text-sm font-medium text-gray-900">
              {payload[0].payload.amount}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white mt-6 rounded-xl shadow-sm p-4">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} barSize={30}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#555" }}
            stroke="none"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#555" }}
            stroke="none"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="amount"
            radius={[8, 8, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
